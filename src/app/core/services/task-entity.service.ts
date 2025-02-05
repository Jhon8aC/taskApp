import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { TaskEntity } from '../models/task-entity.model';

@Injectable({
  providedIn: 'root'
})
export class TaskEntityService {
  private http = inject(HttpClient);
  private apiUrl:string = appsettings.apiUrl;

  constructor() { }

  lista(){
    return this.http.get<TaskEntity[]>(this.apiUrl);
  }
}
