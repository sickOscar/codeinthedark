import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// services
import { ViewerService } from './viewer.service';

@Injectable()
export class WebsocketService {
  private socket;

  constructor(private viewerService: ViewerService) {}

  connect() {
    this.socket = io(environment.ws_url);

    this.socket.on('message', data => {
      this.viewerService.state.next(data);
    });
  }

  disconnect() {
    this.socket.disconnect();
  }
}
