import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-preview',
  styleUrls: ['./preview.component.css'],
  template: `
    <div class="preview">
      <h5>{{ playerName }}</h5>
      <div class="preview__box">
        <img [src]="layoutUrl || 'assets/images/layout-not-found.png'"
             [alt]="playerName"
             width="100%">
      </div>
    </div>
  `
})
export class PreviewComponent {
  @Input() playerName: string;
  @Input() layoutUrl: string;
}
