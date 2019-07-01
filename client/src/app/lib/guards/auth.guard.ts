import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AccountService } from '../services/account/account.service';
import { filter, first } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private _router: Router,
    private _accountService: AccountService
  ) { }

  async canActivate(): Promise<boolean> {
    const accountModel = this._accountService.account$.value;

    if (this._accountService.busy$.value) {
      return this._accountService.busy$
        .pipe(filter((busy: boolean) => !busy))
        .pipe(first())
        .toPromise();
    }

    // this._router.navigate(['/login'], {
    //   // queryParams: {
    //   //   return: state.url
    //   // }
    // });
    return false;

    return !!(accountModel && accountModel._id);
  }
}
