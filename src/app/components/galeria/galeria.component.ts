import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [MatGridListModule, CommonModule],
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.css']
})
export class GaleriaComponent {
  isPopupOpen = false;
  selectedImageSrc: string | null = null;

  openImagePopup(imageSrc: string): void {
    this.selectedImageSrc = imageSrc;
    this.isPopupOpen = true;
  }

  closeImagePopup(): void {
    this.isPopupOpen = false;
    this.selectedImageSrc = null;
  }
}
