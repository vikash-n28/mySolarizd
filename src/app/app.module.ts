import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { dataService } from './app.service'

import { MaterialModule } from '@angular/material';
import { MD_PLACEHOLDER_GLOBAL_OPTIONS } from '@angular/material'
import { FlexLayoutModule } from "@angular/flex-layout";
import { MdIconRegistry } from '@angular/material';
import 'hammerjs';

@NgModule({
  declarations: [ AppComponent ],
  imports: [ BrowserModule,
             BrowserAnimationsModule,
             FlexLayoutModule,
             MaterialModule,
             FormsModule,
             HttpClientModule,
             HttpModule

            ],
  providers: [ {provide: MD_PLACEHOLDER_GLOBAL_OPTIONS, 
                useValue: { float: 'always' }},
                MdIconRegistry,
                dataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
