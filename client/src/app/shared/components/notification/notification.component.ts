import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material';
import { INotificationOptions } from 'src/app/shared/services/notification/notification.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

export const SHOW_ANIMATION = '225ms cubic-bezier(0.4,0.0,1,1)';
export const HIDE_ANIMATION = '195ms cubic-bezier(0.0,0.0,0.2,1)';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  animations: [
    trigger('dfg', [
      state('initial', style({ transform: 'translateY(-100%)' })),
      state('visible', style({ transform: 'translateY(0%)' })),
      state('complete', style({ transform: 'translateY(-100%)' })),
      transition('visible => complete', animate(HIDE_ANIMATION)),
      transition('initial => visible, void => visible', animate(SHOW_ANIMATION)),
    ])
  ],
  styles: [`
    :host{
        background: #C2272F;
        color: #ffffff;
        transform: translateY(-100%);
        height: auto;
        max-width: 640px;
    }
    cc-snackbar{
        position: relative;
        top: -2px;;
    }
`],
  // host: {
  //   'role': 'alestatert',
  //   '[@dfg]': 'animationState',
  //   '(@dfg.done)': 'onAnimationEnd($event)'
  // },
})
export class NotificationComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public options: INotificationOptions,
    @Inject(MatSnackBarRef) public snackBarRef: MatSnackBarRef<NotificationComponent>) { }
}
