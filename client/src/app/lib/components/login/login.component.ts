import { IHttpError } from '../../services/http/http.service';
import { Component, ViewChild, TemplateRef, Output, EventEmitter, OnDestroy, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { AccountService } from 'src/app/lib/services/account/account.service';
import { Subject, Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { VfModalService, VfModalRef } from '@vf/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements AfterViewInit, OnDestroy {

  @ViewChild('dialog', { read: TemplateRef, static: true }) dialogTmpl: TemplateRef<any>;
  @ViewChild('modalFooter', { read: TemplateRef, static: true }) footerTmpl: TemplateRef<any>;

  @Output() error$: Subject<string> = new Subject();
  @Output() busy$: EventEmitter<boolean> = new EventEmitter();

  public form: FormGroup = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  private _dialogRef: VfModalRef<LoginComponent>;
  private _queryParamsSub: Subscription;

  constructor(
    public accountService: AccountService,
    private _formBuilder: FormBuilder,
    private _modalService: VfModalService,
    private _activatedRoute: ActivatedRoute
  ) { }

  ngAfterViewInit() {
    this._dialogRef = this._modalService.open({
      template: this.dialogTmpl,
      footerTemplate: this.footerTmpl,
      width: '500px',
      title: 'Login',
      hasBackdrop: false
    });

    this._queryParamsSub = this._activatedRoute.queryParams.subscribe((queryParams: Params) => {
      if (queryParams.accountId) {
        this.form.controls.AccountId.setValue(queryParams.accountId);
        this.login();
      }
    });
  }

  ngOnDestroy() {
    if (this._queryParamsSub) {
      this._queryParamsSub.unsubscribe();
    }

    if (this._dialogRef) {
      this._dialogRef.close();
    }
  }

  public login(): void {
    this.form.disable();

    this.busy$.next(true);
    this.error$.next(null);

    this.accountService.loadAndSet(this.form.value.email, this.form.value.password).subscribe(() => {
      if (this._dialogRef) {
        this._dialogRef.close();
      }
    }, (error: IHttpError) => {
      this.form.enable();
      this.busy$.next(false);
      this.error$.next(error.message);
    });
  }
}
