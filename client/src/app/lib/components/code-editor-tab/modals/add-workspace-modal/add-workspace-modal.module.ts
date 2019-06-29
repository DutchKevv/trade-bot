import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatProgressSpinnerModule } from '@angular/material';
import { VfModalModule } from '@vf/angular';
import { AddWorkspaceModalComponent } from './add-workspace-modal.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    VfModalModule
  ],
  declarations: [AddWorkspaceModalComponent],
  exports: [AddWorkspaceModalComponent]
})
export class AddWorkspaceModalModule { }
