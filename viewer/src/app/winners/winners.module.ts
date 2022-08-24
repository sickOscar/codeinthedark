import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// containers
import { WinnersComponent } from './containers/winners.component';

const routes: Routes = [
  {
    path: '',
    component: WinnersComponent
  }
];

@NgModule({
  declarations: [
    WinnersComponent
  ],
  imports: [RouterModule.forChild(routes)]
})
export class WinnersModule {}
