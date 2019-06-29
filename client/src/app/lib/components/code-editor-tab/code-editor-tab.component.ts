import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { of, Subscription } from 'rxjs';
import { EditorService } from 'src/app/shared/services/editor/editor.service';
import { VfModalService } from '@vf/angular';
import { AddWorkspaceModalComponent } from './modals/add-workspace-modal/add-workspace-modal.component';

declare const window: any;
declare const monaco: any;

export interface TreeData {
  name: string;
  iconname?: string;
  children?: TreeData[];
}

export interface IFileTab {
  file?: string;
  content?: string;
}

@Component({
  selector: 'app-code-editor-tab',
  templateUrl: './code-editor-tab.component.html',
  styleUrls: ['./code-editor-tab.component.scss']
})
export class CodeEditorTabComponent implements OnInit, AfterViewInit {

  @Input() nestedDataSource: TreeData[] = [
    {
      name: 'Bot 1',
      iconname: 'folder',
      children: [
        { name: 'g', iconname: 'file_copy', },
        {
          name: 'b',
          iconname: 'folder',
          children: [
            { name: 'e', iconname: 'file_copy' },
            { name: 'f', iconname: 'file_copy' }
          ]
        },
        {
          name: 'c',
          iconname: 'folder',
          children: [
            { name: 'd', iconname: 'file_copy' }
          ]
        }
      ]
    },
  ];

  public options = {};
  public nestedTreeControl: NestedTreeControl<any>;
  public editor: any;
  public tabs: any[] = [];

  @ViewChild('editor', { static: false }) editorContent: ElementRef;

  constructor(
    private _modalService: VfModalService,
    private _editorService: EditorService
  ) { }

  ngOnInit() {
    this.nestedTreeControl = new NestedTreeControl(this.getChildren);
  }

  ngAfterViewInit() {
    this._initMonaco();
  }

  public saveWorkspace(): Subscription {
    return this._editorService.save('testid', this._getTabContents()).subscribe(() => {

    }, (error) => {
      console.error(error);
    });
  }

  public runBacktest(): Subscription {
    return this.saveWorkspace().add((result: any) => {
      return this._editorService.backtest(result.projectId).subscribe(() => {

      }, (error) => {
        console.error(error);
      });
    });
  }

  public addWorkspace(): void {
    const modal = this._modalService.open({
      component: AddWorkspaceModalComponent
    });
  }

  public getChildren = (node: TreeData) => of(node.children);

  public hasChild(_: number, node: TreeData) {
    return node.children != null && node.children.length > 0;
  }

  private _initMonaco() {
    const loaderScript = document.createElement('script');
    loaderScript.type = 'text/javascript';
    loaderScript.src = 'vs/loader.js';
    loaderScript.addEventListener('load', () => {

      (window).require(['vs/editor/editor.main'], () => {
        const myDiv: HTMLDivElement = this.editorContent.nativeElement;

        this.editor = monaco.editor.create(myDiv, {
          value: [
            'function x() {',
            '\tconsole.log(\'Hello world!\');',
            '}'
          ].join('\n'),
          language: 'typescript',
          theme: 'vs-dark'
        });

      });
    }, { once: true });

    document.body.appendChild(loaderScript);
  }

  private _getTabContents(): IFileTab[] {
    return this.tabs.map((tab: IFileTab) => {
      return {
        file: '/asdf',
        content: '232323'
      };
    });
  }
}
