import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('src/app/welcome/welcome.module').then(m => m.WelcomeModule)
  },
  {
    path: 'round',
    loadChildren: () => import('src/app/round/round.module').then(m => m.RoundModule)
  },
  {
    path: 'winners',
    loadChildren: () => import('src/app/winners/winners.module').then(m => m.WinnersModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
