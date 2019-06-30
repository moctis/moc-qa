import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FictionlogComponent } from './fictionlog.component';
import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { TestComponent } from './test.component';
import { AppRoutingModule } from './app.routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

@NgModule({
  imports:      [ BrowserModule, FormsModule, HttpClientModule, AppRoutingModule, NgbModule, Ng4LoadingSpinnerModule.forRoot() ],
  declarations: [ AppComponent, FictionlogComponent, HelloComponent, TestComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
