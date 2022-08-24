import { Component, OnInit, OnDestroy, PipeTransform, Pipe } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { mergeMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

// services
import { ViewerService } from '../../../core/viewer.service';

@Pipe({ name: 'slice' })
export class SlicePipe implements PipeTransform {
  transform(value: object[], number: number) {
    return value.splice(number);
  }
}

@Component({
  selector: 'app-round-results',
  styleUrls: ['./results.component.css'],
  templateUrl: './results.component.html'
})
export class ResultsComponent implements OnInit, OnDestroy {
  players: any[] = [];
  isLoading: Boolean = true;
  isLast: Boolean = false;

  private viewerServiceSub: Subscription;

  constructor(
    private viewerService: ViewerService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.viewerServiceSub = this.viewerService.state.pipe(
      mergeMap((resp: any) => {
        return forkJoin([
          this.http.get(`${environment.ws_url}/round/${resp.data.round}`),
          this.http.get(`${environment.ws_url}/vote/${resp.data.round}`)
        ]);
      })
    ).subscribe((results: any) => {
      this.isLast = results[0].last;
      this.players = results[1];
      console.log(`this.players`, this.players)
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.viewerServiceSub.unsubscribe();
  }
}
