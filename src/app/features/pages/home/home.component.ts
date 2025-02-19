import { Component, inject, OnInit } from '@angular/core';
import { TaskEntityService } from '../../services/task-entity/task-entity.service';
import { CommonModule } from '@angular/common';  
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { TaskEntity } from '../../../core/models/task-entity/task-entity.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ToastrModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit{
  private taskEntityService = inject(TaskEntityService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  public tasks!:TaskEntity[];

  // Get all tasks on component initialization to display them
  ngOnInit(): void {
    this.taskEntityService.getAllTasks().subscribe({
      next: (data:TaskEntity[])=>{
        this.tasks = data;
      }
    });
  };

  // Redirect to edit page with the id of the card
  goEditPage(id:string){
     this.router.navigate([`/task/edit/${id}`]);
  };
  
  // Delete the task with the id of the card
  deleteTask(id:string, event:MouseEvent): void {
    event.stopPropagation();
    this.taskEntityService.deleteTaskById(id).subscribe({
      next: ()=>{
        this.toastr.info("Deleted", "Tasks");
        this.taskEntityService.getAllTasks().subscribe({
          next: (data:TaskEntity[])=>{
            this.tasks = data;
          }
        });
      }
    });
  };
};
