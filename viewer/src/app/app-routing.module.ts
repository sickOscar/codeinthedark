import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: 'src/app/welcome/welcome.module#WelcomeModule'
  },
  {
    path: 'round',
    loadChildren: 'src/app/round/round.module#RoundModule'
  },
  {
    path: 'winners',
    loadChildren: 'src/app/winners/winners.module#WinnersModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
