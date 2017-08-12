import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';


import { MdButtonModule } from '@angular2-material/button';
import { MdCardModule } from '@angular2-material/card';
import { MdListModule } from '@angular2-material/list';
import { MdIconModule } from '@angular2-material/icon';
import { FlexLayoutModule } from "@angular/flex-layout";

import { MdIconRegistry } from '@angular2-material/icon';



@NgModule({
  declarations: [ AppComponent ],
  imports: [ BrowserModule,
             MdButtonModule,
             MdCardModule,
             MdListModule,
             MdIconModule, 
             FlexLayoutModule
            ],
  providers: [ MdIconRegistry ],
  bootstrap: [AppComponent]
})
export class AppModule { }
