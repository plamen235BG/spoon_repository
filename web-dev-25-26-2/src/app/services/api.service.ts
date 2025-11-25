import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

const API_URL = 'http://localhost:3000/api';

export interface Student {
  id?: number;
  facultyNumber: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  universityId?: number;
  university?: {
    id: number;
    name: string;
    location: string;
  };
  subjects?: AppSubject[];  
}

export interface University {
  id: number;
  name: string;
  location: string;
}

// TODO: Add Subject interface
 export interface AppSubject {
   id?: number;
   name: string;
   code: string;
   credits: number;
   students?: Student[]; // Optional, for when relation is loaded
 }

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  // Student endpoints
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${API_URL}/students`);
  }

  getStudent(id: number): Observable<Student> {
    return this.http.get<Student>(`${API_URL}/students/${id}`);
  }

  createStudent(student: Omit<Student, 'id'>): Observable<Student> {
    return this.http.post<Student>(`${API_URL}/students`, student);
  }

  updateStudent(id: number, student: Partial<Student>): Observable<Student> {
    return this.http.put<Student>(`${API_URL}/students/${id}`, student);
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/students/${id}`);
  }

  // University endpoints
  getUniversities(): Observable<University[]> {
    return this.http.get<University[]>(`${API_URL}/universities`);
  }

  getUniversity(id: number): Observable<University> {
    return this.http.get<University>(`${API_URL}/universities/${id}`);
  }

  createUniversity(university: Omit<University, 'id'>): Observable<University> {
    return this.http.post<University>(`${API_URL}/universities`, university);
  }

  updateUniversity(id: number, university: Partial<University>): Observable<University> {
    return this.http.put<University>(`${API_URL}/universities/${id}`, university);
  }

  deleteUniversity(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/universities/${id}`);
  }

  // TODO: Implement Subject endpoints
  // Follow the same pattern as Student and University methods above
  getSubjects(): Observable<AppSubject[]>{
    return this.http.get<AppSubject[]>(`${API_URL}/subjects`);
  }
  // getSubject(id: number): Observable<Subject>
  // createSubject(subject: Omit<Subject, 'id'>): Observable<Subject>
  // updateSubject(id: number, subject: Partial<Subject>): Observable<Subject>
  // deleteSubject(id: number): Observable<void>
  getSubject(id: number): Observable<AppSubject> {
    return this.http.get<AppSubject>(`${API_URL}/subjects/${id}`);
  }

  createSubject(AppSubject: Omit<AppSubject, 'id'>): Observable<AppSubject> {
    return this.http.post<AppSubject>(`${API_URL}/subjects`,AppSubject);
  }

  updateSubject(id: number, AppSubject: Partial<AppSubject>): Observable<AppSubject> {
    return this.http.put<AppSubject>(`${API_URL}/subjects/${id}`, AppSubject);
  }

  deleteSubject(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/subjects/${id}`);
  }
}

