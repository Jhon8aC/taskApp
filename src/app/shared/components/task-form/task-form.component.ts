import { Component, OnInit, inject, signal} from '@angular/core';
import { TaskEntityService } from '../../../features/services/task-entity/task-entity.service';
import { ReactiveFormsModule, FormGroup,FormBuilder,Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { TaskEntity } from '../../../core/models/task-entity/task-entity.model';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, PageNotFoundComponent,ToastrModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})

export class TaskFormComponent implements OnInit {
  private taskEntityService = inject(TaskEntityService);
  public notFound = signal(false);
  private route = inject(ActivatedRoute);
  paramsId = this.route.snapshot.paramMap.get('id');
  taskForm: FormGroup;
  
  constructor(private fb: FormBuilder, private toastr: ToastrService) {
    this.taskForm = this.fb.group({
      completed: [false], 
      title: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50)
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(200)
      ]]
    });
  };

  // Load the task by id if paramsId exists (form)
  ngOnInit(): void {
    if(this.paramsId){
      this.taskEntityService.getTaskById(this.paramsId).subscribe({
        next:(data)=>{
          this.taskForm.setValue({
            completed: data.completed,
            title: data.title,
            description: data.description
          });
        },
        error: ()=>{
          // Send signal to show not found page
          this.notFound.set(true);
        }
      });
    };
  };

  onSubmit(task: TaskEntity): void {
    // If paramsId exists handle update task service
    if(this.paramsId){
      this.taskEntityService.updateTaskById(this.paramsId, task).subscribe({
        next: ()=>{
          this.toastr.success("Edited", "Tasks");
        },
        error: ()=>{
          this.toastr.error("Something happened, try again", "Tasks");
        }
      });
    } 
    // If doesn't exists handle create task service
    else {
      this.taskEntityService.createTask(task).subscribe({
        next: ()=>{
          this.toastr.success("Added", "Tasks");
        } 
      });
    };
  };
}