import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Event, EventStatus, CreateEventRequest, UpdateEventRequest } from '../../../models/event';
import { EventService } from '../../../services/event.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss'
})
export class EventFormComponent implements OnInit {
  eventForm!: FormGroup;
  isEditMode = false;
  eventId: number = 0;
  loading = false;
  saving = false;
  error = '';
  event: Event | null = null;

  // Estados disponibles
  statusOptions = [
    { value: EventStatus.Upcoming, label: 'Próximo' },
    { value: EventStatus.Attending, label: 'Asistiendo' },
    { value: EventStatus.Maybe, label: 'Tal vez' },
    { value: EventStatus.Declined, label: 'Rechazado' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id && id !== 'new') {
        this.isEditMode = true;
        this.eventId = +id;
        this.loadEvent();
      } else {
        this.isEditMode = false;
        this.setDefaultValues();
      }
    });
  }

  initForm(): void {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      dateTime: ['', [Validators.required]],
      location: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(1000)]],
      status: [EventStatus.Upcoming, [Validators.required]]
    });
  }

  setDefaultValues(): void {
    // Establecer fecha y hora por defecto (mañana a las 10:00 AM)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    
    const defaultDateTime = tomorrow.toISOString().slice(0, 16);
    
    this.eventForm.patchValue({
      dateTime: defaultDateTime,
      status: EventStatus.Upcoming
    });
  }

  loadEvent(): void {
    this.loading = true;
    this.error = '';

    this.eventService.getEvent(this.eventId).subscribe({
      next: (event) => {
        this.event = event;
        this.populateForm(event);
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar el evento: ' + error.message;
        this.loading = false;
      }
    });
  }

  populateForm(event: Event): void {
    // Convertir la fecha de la API al formato requerido por el input datetime-local
    const dateTime = new Date(event.dateTime);
    const formattedDateTime = dateTime.toISOString().slice(0, 16);

    this.eventForm.patchValue({
      title: event.title,
      dateTime: formattedDateTime,
      location: event.location,
      description: event.description,
      status: event.status
    });
  }

  onStatusChange(event: any): void {
    const statusValue = parseInt(event.target.value, 10);
    this.eventForm.patchValue({ status: statusValue });
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.saving = true;
    this.error = '';

    const formValue = this.eventForm.value;
    
    // Convertir la fecha del formulario al formato ISO
    const dateTime = new Date(formValue.dateTime);
    const isoDateTime = dateTime.toISOString();

    // Convertir status a número
    const statusNumber = parseInt(formValue.status, 10);

    if (this.isEditMode) {
      const updateRequest: UpdateEventRequest = {
        id: this.eventId,
        title: formValue.title,
        dateTime: isoDateTime,
        location: formValue.location,
        description: formValue.description,
        status: statusNumber
      };

      this.eventService.updateEvent(this.eventId, updateRequest).subscribe({
        next: (response) => {
          if (response.success) {
            console.log('Evento actualizado:', response.message);
            this.router.navigate(['/events', this.eventId]);
          }
        },
        error: (error) => {
          this.error = 'Error al actualizar el evento: ' + error.message;
          this.saving = false;
        }
      });
    } else {
      const createRequest: CreateEventRequest = {
        title: formValue.title,
        dateTime: isoDateTime,
        location: formValue.location,
        description: formValue.description,
        status: statusNumber
      };

      this.eventService.createEvent(createRequest).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            console.log('Evento creado:', response.message);
            this.router.navigate(['/events', response.data.id]);
          }
        },
        error: (error) => {
          this.error = 'Error al crear el evento: ' + error.message;
          this.saving = false;
        }
      });
    }
  }

  generateDescription(): void {
    const title = this.eventForm.get('title')?.value;
    if (!title) {
      alert('Por favor, ingresa un título primero para generar la descripción.');
      return;
    }

    this.eventService.generateDescription({ topic: title }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.eventForm.patchValue({
            description: response.data.description
          });
        }
      },
      error: (error) => {
        console.error('Error al generar descripción:', error);
        alert('Error al generar la descripción automática.');
      }
    });
  }

  cancel(): void {
    if (this.isEditMode) {
      this.router.navigate(['/events', this.eventId]);
    } else {
      this.router.navigate(['/events']);
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.eventForm.controls).forEach(key => {
      const control = this.eventForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.eventForm.get(fieldName);
    if (field?.invalid && field?.touched) {
      if (field.errors?.['required']) {
        return 'Este campo es requerido';
      }
      if (field.errors?.['minlength']) {
        return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors?.['maxlength']) {
        return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.eventForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  getStatusName(status: number): string {
    return this.eventService.getStatusName(status);
  }
}
