import { IHttpError } from '../../services/http/http.service';
import { Component, ViewChild, TemplateRef, Output, EventEmitter, OnDestroy, AfterViewInit, ChangeDetectionStrategy, ElementRef } from '@angular/core';
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
  @ViewChild('modalHeader', { static: true }) public modalHeaderRef: ElementRef;
  @ViewChild('modalFooter', { read: TemplateRef, static: true }) footerTmpl: TemplateRef<any>;

  @Output() error$: Subject<string> = new Subject();
  @Output() busy$: EventEmitter<boolean> = new EventEmitter();

  public activeForm = 'login';

  public loginForm: FormGroup = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  public createAccountForm: FormGroup = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
    username: ['', Validators.required]
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
      // headerTemplate: this.modalHeaderRef,
      width: '500px',
      hasBackdrop: false
    });

    this._queryParamsSub = this._activatedRoute.queryParams.subscribe((queryParams: Params) => {
      if (queryParams.accountId) {
        this.loginForm.controls.AccountId.setValue(queryParams.accountId);
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
    this.loginForm.disable();

    this.busy$.next(true);
    this.error$.next(null);

    this.accountService.loadAndSet(this.loginForm.value.email, this.loginForm.value.password).subscribe(() => {
      if (this._dialogRef) {
        this._dialogRef.close();
      }
    }, (error: IHttpError) => {
      this.loginForm.enable();
      this.busy$.next(false);
      this.error$.next(error.message);
    });
  }

  public createAccount() {
    const registerValues = this.createAccountForm.getRawValue();

    this.accountService.create(registerValues).subscribe((user: any) => {
      console.log(user);
    }, (error) => {
      console.log(error);
    });
  }

  public showSignUp() {

  }
}
