import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { mergeMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

// services
import { ViewerService } from '../../../core/viewer.service';

@Component({
  selector: 'app-round-voting',
  styleUrls: ['./voting.component.css'],
  templateUrl: './voting.component.html'
})
export class VotingComponent implements OnInit, OnDestroy {
  data: any = {};
  isLoading: Boolean = true;

  private viewerServiceSub: Subscription = new Subscription();

  constructor(
    private viewerService: ViewerService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.viewerServiceSub = this.viewerService.state.pipe(
      mergeMap((resp: any) => {
        this.data.missing = resp.data.missing;
        return this.http.get(`${environment.ws_url}/round/${resp.data.round}`);
      })
    ).subscribe((round: any) => {
      this.data.players = round.players;
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.viewerServiceSub.unsubscribe();
  }
}
