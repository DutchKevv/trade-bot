import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatIconModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { loginRouting } from './login.routing';
import { VfModalModule, VfModalComponent, VfModalService } from '@vf/angular';
import { LoginComponent } from './login.component';

@NgModule({
  imports: [
    loginRouting,
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    VfModalModule
  ],
  // entryComponents: [VfModalComponent],
  declarations: [LoginComponent],
  exports: [LoginComponent],
  // providers: [VfModalService]
})
export class LoginModule { }
