import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { AuthService, AppGlobals } from 'angular2-google-login';
// import { YoutubePlayerModule } from 'ng2-youtube-player';
//material
import { MaterialModule,MD_PLACEHOLDER_GLOBAL_OPTIONS } from '@angular/material';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MdIconRegistry } from '@angular/material';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';
import 'hammerjs';

//Components
import { AppComponent, GoogleSigninComponent } from './app.component';

//Services
import { YoutubeApiService } from './shared/services/youtube-api.service';
import { YoutubePlayerService } from './shared/services/youtube-player.service';


@NgModule({
  declarations: [ AppComponent,GoogleSigninComponent ],
  imports: [ BrowserModule,
             BrowserAnimationsModule,
             HttpModule,
             FlexLayoutModule,
             MaterialModule,
             FormsModule,
             HttpClientModule,
             Ng2FilterPipeModule
            ],
  providers: [MdIconRegistry,YoutubeApiService,YoutubePlayerService,
              {provide: MD_PLACEHOLDER_GLOBAL_OPTIONS, useValue: {float: 'never'}}],
  bootstrap: [AppComponent]
})
export class AppModule { }
