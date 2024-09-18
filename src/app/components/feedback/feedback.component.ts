import { Component, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importação do FormsModule
import Keyboard from 'simple-keyboard';
import 'simple-keyboard/build/css/index.css';
import { FeedbackService } from '../../services/feedback.service';// Importe o serviço de feedback
import { Depoimento } from '../../models/depoimento';// Importe o modelo de Depoimento


@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
  standalone: true,
  imports: [FormsModule]  // Certifique-se de que o FormsModule foi importado aqui
})
export class FeedbackComponent implements AfterViewInit {
  selectedFeedback: number = 2; // Feedback escolhido (de 0 a 4)
  opinion: string = ''; // Texto do textarea
  keyboard!: Keyboard; // Instância do teclado virtual
  depoimento: Depoimento = { id: null, status: 0, descricao: '' }; // Inicializa o objeto Depoimento

  constructor(private feedbackService: FeedbackService) {}

  // Define o feedback ao clicar nos emojis
  setFeedback(rating: number) {
    this.selectedFeedback = rating;
    this.depoimento.status = rating; // Atualiza o status do depoimento
  }

  // Envia o depoimento
  submitFeedback() {
    if (this.selectedFeedback === null || this.opinion.trim() === '') {
      alert('Por favor, selecione uma avaliação e escreva sua opinião.');
      return;
    }

    // Atualiza a descrição do depoimento
    this.depoimento.descricao = this.opinion;

    // Chama o serviço de feedback para salvar o depoimento
    this.feedbackService.createDepoimento(this.depoimento).subscribe(
      response => {
        this.depoimento.id = response.id; // Atualiza o ID retornado pelo backend
        console.log(this.depoimento)
        this.resetFeedback();
      },
      error => {
        console.error('Erro ao enviar feedback:', error);
      }
    );
  }

  // Reseta os campos após o envio
  resetFeedback() {
    this.selectedFeedback = 0;
    this.opinion = '';
    this.keyboard.setInput(''); // Limpa o teclado virtual
    this.depoimento = { id: null, status: 0, descricao: '' }; // Reseta o objeto Depoimento
  }

  // Inicializa o teclado virtual
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
