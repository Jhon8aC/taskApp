import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskEntityService } from './task-entity.service';
import { appsettings } from '../../../core/settings/task-entity/appsettings';
import { TaskEntity } from '../../../core/models/task-entity/task-entity.model';
import { ApiResponse } from '../../../core/models/task-entity/api-response.model';

describe('TaskEntityService', () => {
  let service: TaskEntityService;
  let httpMock: HttpTestingController;
  const apiUrl = appsettings.apiUrl;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers:[TaskEntityService]
    });

    service = TestBed.inject(TaskEntityService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all tasks', () => {
    // Arrange
    const dummyTasks: TaskEntity[] = [
      { id: '593a3b80-c0d7-4b90-9112-1244e014c8a9', 
        title: 'Task 1', 
        description: 'Desc 1', 
        completed: false },
      { id: '84bf7e5e-8a4f-421d-9742-e45519a041d8', 
        title: 'Task 2', 
        description: 'Desc 2', 
        completed: true }
    ];

    // Act
    service.getAllTasks().subscribe(tasks => {
      // Assert
      expect(tasks.length).toBe(2);
      expect(tasks).toEqual(dummyTasks);
    });

    // Assert
    const req = httpMock.expectOne(`${apiUrl}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTasks);
  });

  it('should fetch a single task by ID', () => {
    // Assert
    const taskId = "593a3b80-c0d7-4b90-9112-1244e014c8a9";
    const dummyTask: TaskEntity = { 
      id: "593a3b80-c0d7-4b90-9112-1244e014c8a9", 
      title: 'Task 1', 
      description: 'Desc 1', 
      completed: false };

    // Act
    service.getTaskById('593a3b80-c0d7-4b90-9112-1244e014c8a9').subscribe(task => {
      // Expect
      expect(task).toEqual(dummyTask);
      expect(task.id).toBe(taskId); 
    });

    // Expect
    const req = httpMock.expectOne(`${apiUrl}/593a3b80-c0d7-4b90-9112-1244e014c8a9`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTask);
  });

it('should create a new task', () => {
  // Arrange
  const newTask: TaskEntity = { 
    id: '84bf7e5e-8a4f-421d-9742-e45519a041d8', 
    title: 'New Task', 
    description: 'New Desc', 
    completed: false };
  const response = { taskId: "84bf7e5e-8a4f-421d-9742-e45519a041d8" };

  // Act
  service.createTask(newTask).subscribe(res => {
    // Expect
    expect(res.taskId).toBe(response.taskId); 
  });

  // Expect
  const req = httpMock.expectOne(`${apiUrl}`);
  expect(req.request.method).toBe('POST');
  expect(req.request.body).toEqual(newTask);
  req.flush(response); 
});

it('should update a task by id', () => {
  // Arrange
  const taskId = '84bf7e5e-8a4f-421d-9742-e45519a041d8';
  const updatedTask: TaskEntity = { 
    id: taskId, 
    title: 'Updated Task', 
    description: 'Updated Desc', 
    completed: true 
  };
  const response: ApiResponse = { taskId };

  // Act
  service.updateTaskById(taskId, updatedTask).subscribe(res => {
    // Expect
    expect(res.taskId).toBe(taskId); 
  });

  // Expect
  const req = httpMock.expectOne(`${apiUrl}/${taskId}`); 
  expect(req.request.method).toBe('PUT'); 
  expect(req.request.body).toEqual(updatedTask); 
  req.flush(response); 
});


it('should delete a task by id', () => {
  // Arrange
  const taskId = '84bf7e5e-8a4f-421d-9742-e45519a041d8';
  const response: ApiResponse = { taskId }; 

  // Act
  service.deleteTaskById(taskId).subscribe(res => {
    // Expect
    expect(res.taskId).toBe(taskId); 
  });

  // Expect
  const req = httpMock.expectOne(`${apiUrl}/${taskId}`);
  expect(req.request.method).toBe('DELETE'); 
  req.flush(response); 
});
});

