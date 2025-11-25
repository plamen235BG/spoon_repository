import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ApiService, AppSubject } from '../services/api.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-subject',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    ReactiveFormsModule,
  ],
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.scss',
})
export class SubjectComponent implements OnInit {
  subjectForm: FormGroup;
  subjects: AppSubject[] = [];
  loading = false;
  error: string | null = null;
  editingSubject: AppSubject | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.subjectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      code: ['', [Validators.required, Validators.minLength(1)]],
      credits: [null, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    this.loadSubjects();
  }

  loadSubjects() {
    this.loading = true;
    this.error = null;
    this.apiService.getSubjects().subscribe({
      next: (subjects) => {
        this.subjects = subjects;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load subjects: ' + (err.error?.error || err.message);
        this.loading = false;
        console.error('Error loading subjects:', err);
      }
    });
  }

  onSubmit() {
    if (this.subjectForm.valid) {
      this.loading = true;
      this.error = null;
      const formValue = this.subjectForm.value;
      const subjectData = {
        name:     formValue.name,
        code:     formValue.code,
        credits:  formValue.credits
      };

      if (this.editingSubject?.id) {
        // Update existing subject
        this.apiService.updateSubject(this.editingSubject.id, subjectData).subscribe({
          next: (updatedSubject) => {
            const index = this.subjects.findIndex(u => u.id === updatedSubject.id);
            if (index !== -1) {
              this.subjects[index] = updatedSubject;
            }
            this.cancelEdit();
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Failed to update Subject: ' + (err.error?.error || err.message);
            this.loading = false;
            console.error('Error updating Subject:', err);
          }
        });
      } else {
        // Create new subject
        this.apiService.createSubject(subjectData).subscribe({
          next: (subject) => {
            this.subjects.push(subject);
            this.subjectForm.reset();
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Failed to create subject: ' + (err.error?.error || err.message);
            this.loading = false;
            console.error('Error creating subject:', err);
          }
        });
      }
    } else {
      this.subjectForm.markAllAsTouched();
    }
  }

  editSubject(subject: AppSubject) {
    this.editingSubject = subject;
    this.subjectForm.patchValue({
      name    :     subject.name,
      code    :     subject.code,
      credits :  subject.credits
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.editingSubject = null;
    this.subjectForm.reset();
  }

  deleteSubject(subject: AppSubject) {
    if (!subject.id) return;
    
    if (confirm(`Are you sure you want to delete ${subject.name}?`)) {
      this.loading = true;
      this.error = null;
      this.apiService.deleteSubject(subject.id).subscribe({
        next: () => {
          this.subjects = this.subjects.filter(u => u.id !== subject.id);
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to delete subject: ' + (err.error?.error || err.message);
          this.loading = false;
          console.error('Error deleting subject:', err);
        }
      });
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.subjectForm.get(fieldName);
    if (field?.touched && field?.invalid) {
      if (field.errors?.['required']) {
        return 'This field is required';
      }
      if (field.errors?.['minlength']) {
        return 'Minimum length is 2 characters';
      }
    }
    return '';
  }
}

