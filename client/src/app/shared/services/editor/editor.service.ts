import { NotificationComponent } from '../../components/notification/notification.component';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface INotificationOptions {
  message: string;
  type?: string;
  action?: any;
  duration?: number;
  panelClass?: Array<string>;
  showClose?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  public save(workspaceId: string, directory: any[]): Observable<any> {
    console.log(directory);
    return this._httpClient.put(`editor/${workspaceId}`, { workspace: directory }).pipe(map((result: any) => result));
  }

  public backtest(projectId: string): Observable<any> {
    return this._httpClient.put('backtest', { projectId }).pipe(map((result: any) => result));
  }
}
