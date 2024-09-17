import { Component, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importação do FormsModule para standalone components
import Keyboard from 'simple-keyboard';
import 'simple-keyboard/build/css/index.css';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
  standalone: true,
  imports: [FormsModule]  // Certifique-se de que o FormsModule foi importado aqui
})
export class FeedbackComponent implements AfterViewInit {
  selectedFeedback: number = 0;
  opinion: string = ''; // Controla o valor do textarea
  keyboard!: Keyboard; // Instância do teclado

  setFeedback(rating: number) {
    this.selectedFeedback = rating;
  }

  submitFeedback() {
    if (this.selectedFeedback === 0 || this.opinion.trim() === '') {
      alert('Por favor, selecione uma avaliação e escreva sua opinião.');
      return;
    }

    console.log('Feedback:', this.selectedFeedback);
    console.log('Opinião:', this.opinion);

    alert('Feedback enviado com sucesso!');
    this.selectedFeedback = 0;
    this.opinion = '';
    this.keyboard.setInput(''); // Limpa o teclado após enviar o feedback
  }

  ngAfterViewInit() {
    const keyboardElement = document.getElementById('keyboard');
    
    if (keyboardElement) {
      // Inicializa o teclado virtual
      this.keyboard = new Keyboard(keyboardElement, {
        onChange: input => this.onInputChange(input), // Atualiza o textarea com a entrada do teclado
        onKeyPress: button => this.onKeyPress(button),
        inputPattern: '[\\w\\s]', // Opcional: restringe a entrada a palavras e espaços
      });
    } else {
      console.error('Contêiner de teclado não encontrado!');
    }
  }

  // Atualiza a opinião com a entrada do teclado
  onInputChange(input: string) {
    this.opinion = input;
  }

  // Abre o teclado virtual
  openVirtualKeyboard() {
    const keyboardElement = document.getElementById('keyboard');
    if (keyboardElement) {
      keyboardElement.style.display = 'block';
      this.keyboard.setInput(this.opinion); // Preenche o teclado com o valor atual do textarea
    }
  }
  // Tratar teclas especiais, como Enter
  onKeyPress(button: string) {
    if (button === "{enter}") {
      console.log("Enter key pressed");
    }
  }
}
