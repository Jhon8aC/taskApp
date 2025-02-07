import { Component, inject } from '@angular/core';
import { TaskEntityService } from '../../services/task-entity/task-entity.service';
import { TaskEntity } from '../../../core/models/task-entity/task-entity.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  template: `<h1>Hola {{tasks()}}</h1>`,
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private taskEntityService = inject(TaskEntityService)
  public tasksList:TaskEntity[] = [];
  public displayedColumns: string[] = ['Title', 'Description', 'Completed', 'Actions']
  tasks = this.taskEntityService.tasks; 

  getAllTasks(){

  }
}
