import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';

import { FooterComponent } from './components/footer/footer.component';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  declarations: [
    FooterComponent,
    LoaderComponent
  ],
  imports: [
    FontAwesomeModule,
    HttpClientModule
  ],
  exports: [
    CommonModule,
    FooterComponent,
    LoaderComponent,
    FontAwesomeModule,
    HttpClientModule
  ]
})
export class SharedModule {}
