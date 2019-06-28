import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CustomHttp } from './lib/services/http/http.service';
import { ChartComponent } from './lib/components/chart/chart.component';
import { BacktestTabComponent } from './lib/components/backtest-tab/backtest-tab.component';
import { AuthGuard } from './lib/guards/auth.guard';
import { MatSnackBarModule, MatIconModule } from '@angular/material';
import { CodeEditorTabModule } from './lib/components/code-editor-tab/code-editor-tab.module';

@NgModule({
  declarations: [
    AppComponent,
    BacktestTabComponent,
    ChartComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MatSnackBarModule,
    CodeEditorTabModule,
    MatIconModule
  ],
  providers: [
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: CustomHttp, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
