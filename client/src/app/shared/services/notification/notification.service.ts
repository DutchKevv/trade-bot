import { NotificationComponent } from '../../components/notification/notification.component';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

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
export class NotificationService {

    static readonly TYPE_UNKNOWN: string = 'unkown';
    static readonly TYPE_SUCCESS: string = 'success';
    static readonly TYPE_ERROR: string = 'error';
    static readonly TYPE_WARNING: string = 'warning';
    static readonly TYPE_INFO: string = 'info';

    static readonly DEFAULT_OPTIONS: INotificationOptions = {
        message: null,
        duration: 5000,
        type: NotificationService.TYPE_UNKNOWN,
        showClose: false
    };

    constructor(private _snackBar: MatSnackBar) { }

    /**
     * show notification
     *
     * @param options
     */
    public open(options: INotificationOptions): void {
        if (!options.message) {
            throw new Error('message field is required');
        }

        if (options.type === NotificationService.TYPE_ERROR) {
            options.duration = 0;
        }

        options = Object.assign({}, NotificationService.DEFAULT_OPTIONS, options);
        const config: MatSnackBarConfig = { data: options, duration: options.duration, verticalPosition: 'bottom', horizontalPosition: 'right' };
        this._snackBar.openFromComponent(NotificationComponent, config);
    }
}
