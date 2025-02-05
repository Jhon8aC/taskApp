import { TestBed } from '@angular/core/testing';

import { TaskEntityService } from './task-entity.service';

describe('TaskEntityService', () => {
  let service: TaskEntityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskEntityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
