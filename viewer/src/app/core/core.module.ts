import { NgModule } from '@angular/core';

// services
import { WebsocketService } from './websocket.service';
import { ViewerService } from './viewer.service';

@NgModule({
  providers: [
    WebsocketService,
    ViewerService
  ]
})
export class CoreModule {}
