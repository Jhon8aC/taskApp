import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appsettings } from '../../../core/settings/task-entity/appsettings';
import { TaskEntity } from '../../../core/models/task-entity/task-entity.model';
import { ApiResponse } from '../../../core/models/task-entity/api-response.model';
import {toSignal} from '@angular/core/rxjs-interop'
@Injectable({
  providedIn: 'root'
})
export class TaskEntityService {
  private http = inject(HttpClient);
  private apiUrl:string = appsettings.apiUrl;

  constructor() { }

  tasks = toSignal(this.http.get<TaskEntity[]>(this.apiUrl), { initialValue: [] });

  getTaskById(id:number){
    return this.http.get<TaskEntity>(`${this.apiUrl}/${id}`);
  }
  createTask(taskentity:TaskEntity){
    return this.http.post<ApiResponse<TaskEntity>>(this.apiUrl,taskentity);
  }
  updateTaskById(id:string, taskentity:TaskEntity){
    return this.http.put<ApiResponse<TaskEntity>>(`${this.apiUrl}/${id}`,taskentity);
  }
  deleteTaskById(id:string){
    return this.http.delete<ApiResponse<TaskEntity>>(`${this.apiUrl}/${id}`);
  }

}
