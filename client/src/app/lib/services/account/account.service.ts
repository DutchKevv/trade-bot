import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RoutesRecognized } from '@angular/router';
import { map, tap, catchError, first, filter } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { IHttpError } from '../http/http.service';

export interface IAccountModel {
  _id?: string;
  username?: string;
}

export interface ICreateAccountModel {
  mail: string;
  password: string;
  confirmPassword: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  public static readonly SAP_ACCOUNT_ID_LENGTH: number = 10;

  public busy$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public account$: BehaviorSubject<IAccountModel> = new BehaviorSubject({
    _id: '5d16bc3e174ff75102db651f',
    username: 'DutchKevv'
  });

  constructor(
    private _httpClient: HttpClient,
    private _router: Router,
    private _notificationService: NotificationService
  ) {
    this.init();
  }

  public init() {
    // this._router.events
    //   .pipe(filter(event => event instanceof RoutesRecognized))
    //   .pipe(first())
    //   .subscribe((event: RoutesRecognized) => {
    //     this.loadAndSet(event.state.root.queryParams.accountId, true, event.state.root.queryParams).toPromise().catch(console.error);
    //   });
  }

  public get(email: string, password: string): Observable<IAccountModel> {
    const url = `/login`;

    return this._httpClient.post(url, { data: { email, password } }).pipe(map((data: any) => data));
  }

  public create(createAccountModel: ICreateAccountModel) {
    const url = `/register`;

    return this._httpClient.post(url, createAccountModel).pipe(map((response: any) => response));
  }

  public update(model: IAccountModel, showSuccessNotification: boolean = true, showErrorNotification: boolean = true): Observable<IAccountModel> {
    model._id = this.account$.value._id;

    return this._httpClient
      .put(`AccountSet(AccountId='${model._id}')`, model)
      .pipe(map(() => {
        this.account$.next(Object.assign(this.account$.value, model));

        return this.account$.value;
      }))
      .pipe(catchError((error: IHttpError) => {
        if (showErrorNotification) {
          this._notificationService.open({
            type: NotificationService.TYPE_ERROR,
            message: error.message
          });
        }

        return throwError(error);
      }))
      .pipe(tap(() => {
        if (showSuccessNotification) {
          this._notificationService.open({
            type: NotificationService.TYPE_SUCCESS,
            message: `Account gewijzigd`
          });
        }
      }));
  }

  /**
   *
   * load and set,
   * optionally redirect to dashboard/login (depending on success/fail)
   */
  public loadAndSet(email: string, password: string, preserveQueryParams: boolean = true, queryParams: any = {}): Observable<IAccountModel> {
    let currentUrl = this._router.url.split('?')[0];

    if (!email || !password) {
      if (!currentUrl.startsWith('/login')) {
        this._router.navigate(['/login'], {
          queryParamsHandling: preserveQueryParams ? 'merge' : '',
          queryParams: { accountId: null }
        });

        this.account$.next(null);
      }

      this.busy$.next(false);

      return of(null);
    }

    this.busy$.next(true);

    return this.get(email, password)
      .pipe(tap((model: IAccountModel) => {

        if (!model || !model._id) {
          throw ({ message: 'Account not found' });
        }

        this.account$.next(model);
        this.busy$.next(false);

        if (preserveQueryParams) {
          if (currentUrl.startsWith('/') || currentUrl.startsWith('/login')) {
            currentUrl = '/dashboard';
          }

          this._router.navigate([currentUrl], {
            queryParams: { ...queryParams, email, password },
            queryParamsHandling: 'merge'
          });
        }
      }))
      .pipe(catchError((error => {
        console.error(error);

        this.busy$.next(false);

        if (preserveQueryParams && !currentUrl.startsWith('/login')) {
          this._router.navigate(['/login'], { queryParamsHandling: 'preserve' });
        }
        return throwError(error);
      })));
  }

  public logout(): Observable<IAccountModel> {
    return this.loadAndSet(null, null, false);
  }

  /**
   * make sure account number is 10 characters long (prepend zeros)
   */
  public normalizeAccountId(accountId: string): string {
    accountId = accountId.trim();

    if (accountId.length < AccountService.SAP_ACCOUNT_ID_LENGTH) {
      accountId = new Array(AccountService.SAP_ACCOUNT_ID_LENGTH - accountId.length).fill(0).join('') + accountId;
    }

    return accountId;
  }
}
