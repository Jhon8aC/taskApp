import { Routes } from '@angular/router';
import { HomeComponent } from './features/pages/home/home.component';
import { TaskFormComponent } from './shared/components/task-form/task-form.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

export const routes: Routes = [
    {path:"",component:HomeComponent},
    { path: 'task/new', component: TaskFormComponent  }, 
    { path: 'task/edit/:id', component: TaskFormComponent },
    {path : "**", component: PageNotFoundComponent }
];
