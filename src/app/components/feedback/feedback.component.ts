import { Component, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Keyboard from 'simple-keyboard';
import 'simple-keyboard/build/css/index.css';
import { FeedbackService } from '../../services/feedback.service';
import { Depoimento } from '../../models/depoimento';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
  standalone: true,
  imports: [FormsModule]
})
export class FeedbackComponent implements AfterViewInit {
  selectedFeedback: number = 2;
  opinion: string = '';
  keyboard!: Keyboard;
  depoimento: Depoimento = { id: null, status: 0, descricao: '', dataRegistro: '' };

  constructor(
    private feedbackService: FeedbackService,
    private snackBar: MatSnackBar
  ) {}

  setFeedback(rating: number) {
    this.selectedFeedback = rating;
    this.depoimento.status = rating;
  }

  submitFeedback() {
    if (this.selectedFeedback === null || this.opinion.trim() === '') {
      this.snackBar.open('Por favor, selecione uma avaliação e escreva sua opinião.', 'Fechar', {
        duration: 3000,
      });
      return;
    }

    // Atualiza a descrição e a data no formato esperado pelo backend
    this.depoimento.descricao = this.opinion;
    this.depoimento.dataRegistro = this.formatDate(new Date()); // Formata a data para o padrão esperado

    this.feedbackService.createDepoimento(this.depoimento).subscribe(
      response => {
        this.depoimento.id = response.id;
        this.resetFeedback();
        this.snackBar.open('Mensagem enviada com sucesso!', 'Fechar', {
          duration: 3000,
        });
      },
      error => {
        console.error('Erro ao enviar feedback:', error);
        this.snackBar.open('Erro ao enviar feedback. Tente novamente.', 'Fechar', {
          duration: 3000,
        });
      }
    );
  }

  resetFeedback() {
    this.selectedFeedback = 0;
    this.opinion = '';
    this.keyboard.setInput('');
    this.depoimento = { id: null, status: 0, descricao: '', dataRegistro: '' }; // Reseta o objeto Depoimento
  }

  ngAfterViewInit() {
    const keyboardElement = document.getElementById('keyboard');
    if (keyboardElement) {
      this.keyboard = new Keyboard(keyboardElement, {
        onChange: input => this.onInputChange(input),
        onKeyPress: button => this.onKeyPress(button),
        inputPattern: '[\\w\\s]',
      });
    } else {
      console.error('Contêiner de teclado não encontrado!');
    }
  }

  onInputChange(input: string) {
    this.opinion = input;
  }

  openVirtualKeyboard() {
    const keyboardElement = document.getElementById('keyboard');
    if (keyboardElement) {
      keyboardElement.style.display = 'block';
      this.keyboard.setInput(this.opinion);
    }
  }

  onKeyPress(button: string) {
    if (button === "{enter}") {
      console.log("Enter key pressed");
    }
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
}
