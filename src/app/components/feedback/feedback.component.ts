import { Component } from '@angular/core';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent {
  selectedFeedback: number = 0;
  opinion: string = '';

  setFeedback(rating: number) {
    this.selectedFeedback = rating;
  }

  submitFeedback() {
    if (this.selectedFeedback === 0 || this.opinion.trim() === '') {
      alert('Por favor, selecione uma avaliação e escreva sua opinião.');
      return;
    }

    // Lógica para salvar o feedback
    console.log('Feedback:', this.selectedFeedback);
    console.log('Opinião:', this.opinion);

    alert('Feedback enviado com sucesso!');
    // Limpar campos após o envio
    this.selectedFeedback = 0;
    this.opinion = '';
  }
}
