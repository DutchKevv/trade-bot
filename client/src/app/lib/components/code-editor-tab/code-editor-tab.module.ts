import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatIconModule, MatTreeModule } from '@angular/material';
import { VfModalModule } from '@vf/angular';
import { TreeModule } from 'angular-tree-component';
import { CodeEditorTabComponent } from './code-editor-tab.component';
import { AddWorkspaceModalComponent } from './modals/add-workspace-modal/add-workspace-modal.component';
import { AddWorkspaceModalModule } from './modals/add-workspace-modal/add-workspace-modal.module';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTreeModule,
    TreeModule.forRoot(),
    VfModalModule,
    AddWorkspaceModalModule
  ],
  entryComponents: [AddWorkspaceModalComponent],
  declarations: [CodeEditorTabComponent],
  exports: [CodeEditorTabComponent]
})
export class CodeEditorTabModule { }
