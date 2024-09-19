import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FeedbackService } from '../../services/feedback.service'; 
import { Depoimento } from '../../models/depoimento'; 

@Component({
  selector: 'app-listafeedback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listafeedback.component.html',
  styleUrls: ['./listafeedback.component.css']
})
export class ListafeedbackComponent implements OnInit {
  depoimentos: Depoimento[] = [];
  isLoading = true;

  constructor(private feedbackService: FeedbackService) { }

  ngOnInit(): void {
    this.carregarDepoimentos();
  }

  carregarDepoimentos(): void {
    this.feedbackService.getAllDepoimentos().subscribe(
      (data: Depoimento[]) => {
        this.depoimentos = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Erro ao carregar depoimentos:', error);
        this.isLoading = false;
      }
    );
  }

  getEmojiForStatus(status: number): string {
    const emojis = ['😡', '😕', '😐', '😊', '😍'];
    return emojis[status] ?? '❓'; // Retorna '?' caso o status seja inválido
  }
}
