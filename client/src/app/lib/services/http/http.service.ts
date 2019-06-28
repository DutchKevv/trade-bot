import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpHeaders, HttpClient, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { catchError, mergeMap, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface IHttpError {
  status: number;
  message: string;
  body: any;
  code?: string;
}

export interface IHttpSapError extends HttpErrorResponse {
  error: {
    error: {
      message?: {
        value: string;
      },
      code?: string;
    };
  };
}

export interface IHttpSapBody {
  d: {
    [key: string]: any;
  };
}

export interface ICSRFToken {
  time: number;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class CustomHttp implements HttpInterceptor {

  static readonly CSRF_TIMEOUT: number = 1000 * 60 * 10; // 10 minutes
  static readonly API_VERSION: string = '0.0.1';

  public CSRF: ICSRFToken = { time: 0, token: null };

  constructor(private _httpClient: HttpClient) { }

  /**
   * POST, PUT, DELETE requires CSRF token
   */
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<IHttpSapBody | IHttpError>> {
    let modifiedReq: Observable<HttpEvent<any>>;

    if (!window.navigator.onLine) {
      return throwError(new HttpErrorResponse({
        statusText: 'No internet connection',
        error: 'No internet connection'
      }));
    }

    // if (req.method === 'GET') {
    modifiedReq = next.handle(req.clone({
      url: this.normalizeUrl(req.url),
      setHeaders: {
        'Client-Version': CustomHttp.API_VERSION
      }
    }));
    // } else {
    //   modifiedReq = this
    //     ._getCSRFToken()
    //     .pipe(mergeMap(token =>
    //       next.handle(req.clone({
    //         url: this.normalizeUrl(req.url),
    //         setHeaders: {
    //           'X-CSRF-Token': token,
    //           'Client-Version': CustomHttp.API_VERSION
    //         }
    //       }))
    //     ));
    // }

    return modifiedReq.pipe(catchError(err => this._handleError(err)));
  }

  /**
   * load CSRF token
   */
  private _getCSRFToken(): Observable<string> {
    const now: number = Date.now();
    const maxAge: number = now - CustomHttp.CSRF_TIMEOUT;

    if (this.CSRF.time > maxAge) {
      return of(this.CSRF.token);
    }

    return this._httpClient.get('', { headers: new HttpHeaders({ 'X-CSRF-Token': 'Fetch' }), observe: 'response' })
      .pipe(
        map((response: HttpResponse<any>) => response.headers.get('x-csrf-token') || ''),
        tap((token: string) => this.CSRF = { time: now, token })
      );
  }

  /**
   * Generic error handling that sets a default message for known errors
   */
  private _handleError(response: IHttpSapError): Observable<HttpEvent<IHttpError>> {
    const body = response.error && response.error.error ? response.error.error : {};
    const errorObj: IHttpError = {
      status: response.status,
      message: body.message ? body.message.value : undefined,
      body,
      code: body.code
    };

    if (!errorObj.message) {
      switch (response.status) {
        case 401:
        case 403:
          errorObj.message = 'Unauthorized';
          break;
        case 404:
          errorObj.message = 'Not found';
          break;
        case 405:
          errorObj.message = 'Not implemented';
          break;
        case 500:
          errorObj.message = 'Server error';
          break;
        default:
          console.error(errorObj);
          errorObj.message = response.statusText || 'Unknown error';
      }
    }

    return throwError(errorObj);
  }

  /**
   * prefix url and normalize (remove double slashes etc)
   */
  public normalizeUrl(url: string): string {
    if (!url.startsWith('/assets/') && !url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith(environment.servers.sap.path)) {
      url = environment.servers.sap.path + url;
    }

    return url.replace(/([^:]\/)\/+/g, '$1');
  }
}
