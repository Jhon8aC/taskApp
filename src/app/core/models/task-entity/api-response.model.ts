export interface ApiResponse<T> {
    taskId?: string;
    Succeeded?: boolean;
    Message?: string;
    Errors?: string[];  
    Data?: T | null;
  }
  