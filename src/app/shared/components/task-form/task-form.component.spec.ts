import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskFormComponent } from './task-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TaskEntityService } from '../../../features/services/task-entity/task-entity.service';
import { of, throwError } from 'rxjs';
import { TaskEntity } from '../../../core/models/task-entity/task-entity.model';
import { ActivatedRoute } from '@angular/router';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let toastrServiceMock: jasmine.SpyObj<ToastrService>;
  let taskEntityServiceMock: jasmine.SpyObj<TaskEntityService>;

  beforeEach(async () => {
    toastrServiceMock = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    taskEntityServiceMock = jasmine.createSpyObj('TaskEntityService', ['getTaskById', 'updateTaskById', 'createTask']);

    const mockTask: TaskEntity = {
      id: '1',
      title: 'Test Task',
      description: 'This is a test description',
      completed: false
    };

    taskEntityServiceMock.getTaskById.and.returnValue(of(mockTask));

    await TestBed.configureTestingModule({
      imports: [
        TaskFormComponent,
        ReactiveFormsModule,
        ToastrModule.forRoot(), 
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: ToastrService, useValue: toastrServiceMock },
        { provide: TaskEntityService, useValue: taskEntityServiceMock },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map([['id', '593a3b80-c0d7-4b90-9112-1244e014c8a9']]) } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getTaskById if paramsId exists and update the form', () => {
    component.ngOnInit();

    expect(taskEntityServiceMock.getTaskById).toHaveBeenCalledWith('593a3b80-c0d7-4b90-9112-1244e014c8a9');

    expect(component.taskForm.value).toEqual({
      completed: false,
      title: 'Test Task',
      description: 'This is a test description'
    });
  });

  it('should set notFound to true if getTaskById fails', () => {

    taskEntityServiceMock.getTaskById.and.returnValue(throwError(() => new Error('Error al obtener la tarea')));

    component.ngOnInit();

    expect(component.notFound()).toBeTrue();
  });

  it('should call updateTaskById if paramsId exists', () => {
    component.paramsId = '593a3b80-c0d7-4b90-9112-1244e014c8a9'; 
    const mockTask: TaskEntity = {
      id: '593a3b80-c0d7-4b90-9112-1244e014c8a9',
      title: 'Updated Task',
      description: 'Updated description',
      completed: true
    };
  
    taskEntityServiceMock.updateTaskById.and.returnValue(of({ taskId: "593a3b80-c0d7-4b90-9112-1244e014c8a9" }));
  
    component.onSubmit(mockTask);
  
    expect(taskEntityServiceMock.updateTaskById).toHaveBeenCalledWith('593a3b80-c0d7-4b90-9112-1244e014c8a9', mockTask);
    expect(toastrServiceMock.success).toHaveBeenCalledWith("Edited", "Tasks");
  });
  
});
