import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material';
import { NotificationComponent } from './notification.component';

@NgModule({
    imports: [
        CommonModule,
        MatIconModule
    ],
    declarations: [NotificationComponent],
    exports: [NotificationComponent],
})
export class NotificationModule { }
