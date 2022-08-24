import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { HttpClientModule } from '@angular/common/http';

import { FooterComponent } from './components/footer/footer.component';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  declarations: [
    FooterComponent,
    LoaderComponent
  ],
  imports: [
    AngularFontAwesomeModule,
    HttpClientModule
  ],
  exports: [
    CommonModule,
    FooterComponent,
    LoaderComponent,
    AngularFontAwesomeModule,
    HttpClientModule
  ]
})
export class SharedModule {}
