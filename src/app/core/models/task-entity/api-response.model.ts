export interface ApiResponse {
  taskId?: string;
  Succeeded?: boolean;
  Message?: string;
  Errors?: string[];
  Data?: any[]; 
}
