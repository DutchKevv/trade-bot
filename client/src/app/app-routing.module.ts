import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './lib/guards/auth.guard';
import { BacktestTabComponent } from './lib/components/backtest-tab/backtest-tab.component';
import { CodeEditorTabComponent } from './lib/components/code-editor-tab/code-editor-tab.component';

const routes: Routes = [
  { path: '', redirectTo: 'editor', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./lib/components/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'backtest',
    // canActivate: [AuthGuard],
    component: BacktestTabComponent
  },
  {
    path: 'editor',
    // canActivate: [AuthGuard],
    component: CodeEditorTabComponent
  },
  { path: '**', redirectTo: 'editor', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
