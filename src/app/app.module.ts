import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';


import { MaterialModule } from '@angular/material';
import { MD_PLACEHOLDER_GLOBAL_OPTIONS } from '@angular/material'
// import { MdButtonModule } from '@angular2-material/button';
// import { MdCardModule } from '@angular2-material/card';
// import { MdListModule } from '@angular2-material/list';
// import { MdIconModule } from '@angular2-material/icon';
import { FlexLayoutModule } from "@angular/flex-layout";

import { MdIconRegistry } from '@angular2-material/icon';
import 'hammerjs';



@NgModule({
  declarations: [ AppComponent ],
  imports: [ BrowserModule,
             FormsModule,
             HttpClientModule,
             MaterialModule,
             NoopAnimationsModule,
             FlexLayoutModule
            ],
  providers: [ {provide: MD_PLACEHOLDER_GLOBAL_OPTIONS, 
                useValue: { float: 'always' }},
                MdIconRegistry],
  bootstrap: [AppComponent]
})
export class AppModule { }
