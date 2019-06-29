import { Component, OnInit, Host, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { VfModalComponent, IVfModalComponent } from '@vf/angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { EditorService } from 'src/app/shared/services/editor/editor.service';

@Component({
  selector: 'app-add-workspace-modal',
  templateUrl: './add-workspace-modal.component.html',
  styleUrls: ['./add-workspace-modal.component.scss']
})
export class AddWorkspaceModalComponent implements OnInit, IVfModalComponent {

  @ViewChild('modalFooter', { static: true }) public modalFooterRef: ElementRef;

  @Output() public busy$: EventEmitter<boolean> = new EventEmitter();
  @Output() public error$: Subject<string> = new Subject();

  public form: FormGroup = this._formBuilder.group({
    name: ['', [Validators.required]]
  });

  public modalOptions = {
    width: '1200px',
    title: 'Add workspace'
  };

  constructor(
    private _editorService: EditorService,
    private _formBuilder: FormBuilder,
    @Host() private _modalRef: VfModalComponent
  ) { }

  ngOnInit() {
  }

  public save(): Subscription {
    const values = this.form.getRawValue();

    return this._editorService.createWorkspace(values.name).subscribe(() => {

    }, (error) => {
      console.error(error);
    });
  }
}
