import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ViewerService {
  videoPlaylist: string[] = [
    'rioe3YISiQs',
    'DQIyh29Q2z4',
    'G0fFLvwjr0g',
    'LEhzTL5V7Xw',
    'Aba7VD4h6G4'
  ];
  state: Subject<object> = new Subject<object>();
  videoQueue = 0;
}
