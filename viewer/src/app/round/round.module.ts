import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoundRoutingModule } from './round-routing.module';
import { SharedModule } from '../shared/shared.module';

// containers
import { CountdownComponent } from './containers/countdown/countdown.component';
import { StartComponent, SafePipe } from './containers/start/start.component';
import { VotingComponent } from './containers/voting/voting.component';
import { ResultsComponent, SlicePipe } from './containers/results/results.component';

// components
import { PreviewComponent } from './components/preview/preview.component';
import { TimesupComponent } from './components/timesup/timesup.component';

@NgModule({
  declarations: [
    CountdownComponent,
    StartComponent,
    TimesupComponent,
    VotingComponent,
    ResultsComponent,
    PreviewComponent,
    SafePipe,
    SlicePipe
  ],
  imports: [
    CommonModule,
    RoundRoutingModule,
    SharedModule
  ]
})
export class RoundModule {}
