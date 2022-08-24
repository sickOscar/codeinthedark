import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// services
import { ViewerService } from './core/viewer.service';
import { WebsocketService } from './core/websocket.service';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
  constructor(
    private viewerService: ViewerService,
    private wsService: WebsocketService,
    private router: Router
  ) {
    this.wsService.connect();
  }

  ngOnInit() {
    this.viewerService.state.subscribe((data: any) => {
      switch (data.type) {
        case 'ROUND_COUNTDOWN':
          this.router.navigate(['round/countdown']);
          break;
        case 'ROUND_END_COUNTDOWN':
        this.router.navigate(['round/start']);
          break;
        case 'RECEIVING_RESULTS':
          this.router.navigate(['round/receive-layouts']);
          break;
        case 'VOTE_COUNTDOWN':
          this.router.navigate(['round/voting']);
          break;
        case 'SHOWING_RESULTS':
          this.router.navigate(['round/results']);
          break;
        default:
          this.router.navigate(['/']);
      }
    });
  }
}
