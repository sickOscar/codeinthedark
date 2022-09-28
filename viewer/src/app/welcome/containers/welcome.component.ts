import { Component, OnInit, OnDestroy } from '@angular/core';
import { ViewerService } from '../../core/viewer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-welcome',
  styleUrls: ['./welcome.component.css'],
  templateUrl: './welcome.component.html'
})
export class WelcomeComponent implements OnInit, OnDestroy {
  missing: string = '0';
  isLoading: Boolean = true;

  private viewerServiceSub: Subscription = new Subscription();

  constructor(private viewerService: ViewerService) {
  }

  ngOnInit() {
    this.viewerServiceSub = this.viewerService.state.subscribe((state: any) => {
      this.missing = state.data.missing;
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.viewerServiceSub.unsubscribe();
  }
}
