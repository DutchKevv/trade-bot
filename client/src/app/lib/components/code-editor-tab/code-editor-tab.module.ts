import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatIconModule, MatTreeModule } from '@angular/material';
import { VfModalModule } from '@vf/angular';
import { TreeModule } from 'angular-tree-component';
import { CodeEditorTabComponent } from './code-editor-tab.component';

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
    VfModalModule
  ],
  declarations: [CodeEditorTabComponent],
  exports: [CodeEditorTabComponent]
})
export class CodeEditorTabModule { }
