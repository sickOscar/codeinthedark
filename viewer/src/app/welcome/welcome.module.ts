import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

// containers
import { WelcomeComponent } from './containers/welcome.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent
  }
];

@NgModule({
  declarations: [
    WelcomeComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class WelcomeModule {}
