import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TaskEntityService } from '../../services/task-entity/task-entity.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { TaskEntity } from '../../../core/models/task-entity/task-entity.model';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let taskEntityServiceMock: jasmine.SpyObj<TaskEntityService>;
  let toastrServiceMock: jasmine.SpyObj<ToastrService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {

    taskEntityServiceMock = jasmine.createSpyObj('TaskEntityService', ['getAllTasks', 'deleteTaskById']);
    toastrServiceMock = jasmine.createSpyObj('ToastrService', ['info']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent, HttpClientTestingModule, RouterTestingModule], 
      providers: [
        { provide: TaskEntityService, useValue: taskEntityServiceMock },
        { provide: ToastrService, useValue: toastrServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAllTasks and assign the result to tasks on ngOnInit', () => {
    // Arrange
    const mockTasks: TaskEntity[] = [
      { id: '593a3b80-c0d7-4b90-9112-1244e014c8a9', title: 'Task 1', description: 'Description 1', completed: false },
      { id: '84bf7e5e-8a4f-421d-9742-e45519a041d8', title: 'Task 2', description: 'Description 2', completed: true }
    ];

    // Act
    taskEntityServiceMock.getAllTasks.and.returnValue(of(mockTasks));
    fixture.detectChanges();

    // Expect
    expect(taskEntityServiceMock.getAllTasks).toHaveBeenCalled();
    expect(component.tasks).toEqual(mockTasks);
  });

  it('should navigate to edit page when goEditPage is called', () => {
    // Arrange
    const taskId = '593a3b80-c0d7-4b90-9112-1244e014c8a9';

    // Act
    component.goEditPage(taskId);

    // Expect
    expect(routerMock.navigate).toHaveBeenCalledWith([`/task/edit/${taskId}`]);
  });


  it('should delete a task and update the task list', () => {
    // Arrange: Crear lista inicial de tareas en el componente
    component.tasks = [
      { id: '593a3b80-c0d7-4b90-9112-1244e014c8a9', title: 'Task 1', description: 'Description 1', completed: false },
      { id: '606a8f04-bb12-4726-bc60-945033461389', title: 'Task 2', description: 'Description 2', completed: true }
    ];
    
    const taskId = '593a3b80-c0d7-4b90-9112-1244e014c8a9';
    const event = new MouseEvent('click');
  
    // Simular la respuesta del servicio de eliminación
    taskEntityServiceMock.deleteTaskById.and.returnValue(of({ taskId }));
    // Simular la respuesta de obtener todas las tareas después de la eliminación
    taskEntityServiceMock.getAllTasks.and.returnValue(of([
      { id: '606a8f04-bb12-4726-bc60-945033461389', title: 'Task 2', description: 'Description 2', completed: true }
    ]));
  
    // Act: Eliminar tarea
    component.deleteTask(taskId, event);
  
    // Expect
    expect(taskEntityServiceMock.deleteTaskById).toHaveBeenCalledWith(taskId);
    expect(toastrServiceMock.info).toHaveBeenCalledWith('Deleted', 'Tasks');
    expect(taskEntityServiceMock.getAllTasks).toHaveBeenCalled();
    expect(component.tasks.some(task => task.id === taskId)).toBeFalse();
  });
  
});
