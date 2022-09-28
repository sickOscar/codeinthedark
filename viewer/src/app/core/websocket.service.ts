import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { environment } from '../../environments/environment';

// services
import { ViewerService } from './viewer.service';

@Injectable()
export class WebsocketService {
  private socket:any;

  constructor(private viewerService: ViewerService) {}

  connect() {
    this.socket = io(environment.ws_url);

    this.socket.on('message', (data:any) => {
      this.viewerService.state.next(data);
    });
  }

  disconnect() {
    this.socket.disconnect();
  }
}
