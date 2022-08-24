import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// components
import { CountdownComponent } from './containers/countdown/countdown.component';
import { StartComponent } from './containers/start/start.component';
import { VotingComponent } from './containers/voting/voting.component';
import { ResultsComponent } from './containers/results/results.component';
import { TimesupComponent } from './components/timesup/timesup.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'countdown',
        component: CountdownComponent
      },
      {
        path: 'start',
        component: StartComponent
      },
      {
        path: 'receive-layouts',
        component: TimesupComponent
      },
      {
        path: 'voting',
        component: VotingComponent
      },
      {
        path: 'results',
        component: ResultsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoundRoutingModule {}
