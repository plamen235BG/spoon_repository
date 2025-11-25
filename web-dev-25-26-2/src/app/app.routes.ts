import { Routes } from '@angular/router';
import { UniversityComponent } from './university/university.component';
import { StudentsComponent } from './students/students.component';
import { SubjectComponent } from './subjects/subjects.component';

export const routes: Routes = [
  {
    path: '',
    component: StudentsComponent
  },
  {
    path: 'university',
    component: UniversityComponent
  },
  {
    path: 'subjects',
    component: SubjectComponent
  }
];
