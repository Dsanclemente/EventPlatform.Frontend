import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Event, EventStatus } from '../../../models/event';
import { EventService } from '../../../services/event.service';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss'
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  loading = false;
  error = '';
  
  // Filtros
  filters = {
    title: '',
    location: '',
    dateFrom: '',
    dateTo: ''
  };

  // Estados disponibles
  statusOptions = [
    { value: EventStatus.Upcoming, label: 'Próximo' },
    { value: EventStatus.Attending, label: 'Asistiendo' },
    { value: EventStatus.Maybe, label: 'Tal vez' },
    { value: EventStatus.Declined, label: 'Rechazado' }
  ];

  constructor(
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.error = '';

    this.eventService.getEvents(this.filters).subscribe({
      next: (events) => {
        this.events = events;
        this.filteredEvents = events;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los eventos: ' + error.message;
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.loadEvents();
  }

  clearFilters(): void {
    this.filters = {
      title: '',
      location: '',
      dateFrom: '',
      dateTo: ''
    };
    this.loadEvents();
  }

  updateEventStatus(eventId: number, newStatus: EventStatus): void {
    this.eventService.updateEventStatus(eventId, { status: newStatus }).subscribe({
      next: (response) => {
        if (response.success) {
          // Actualizar el evento en la lista
          const eventIndex = this.events.findIndex(e => e.id === eventId);
          if (eventIndex !== -1) {
            this.events[eventIndex].status = newStatus;
            this.events[eventIndex].updatedAt = new Date().toISOString();
          }
          console.log('Estado actualizado:', response.message);
        }
      },
      error: (error) => {
        console.error('Error al actualizar estado:', error);
      }
    });
  }

  deleteEvent(eventId: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      this.eventService.deleteEvent(eventId).subscribe({
        next: (response) => {
          if (response.success) {
            this.events = this.events.filter(e => e.id !== eventId);
            this.filteredEvents = this.filteredEvents.filter(e => e.id !== eventId);
            console.log('Evento eliminado:', response.message);
          }
        },
        error: (error) => {
          console.error('Error al eliminar evento:', error);
        }
      });
    }
  }

  editEvent(eventId: number): void {
    this.router.navigate(['/events', eventId, 'edit']);
  }

  viewEvent(eventId: number): void {
    this.router.navigate(['/events', eventId]);
  }

  createNewEvent(): void {
    this.router.navigate(['/events/new']);
  }

  getStatusName(status: number): string {
    return this.eventService.getStatusName(status);
  }

  getStatusClass(status: number): string {
    return this.eventService.getStatusClass(status);
  }

  formatDate(dateString: string): string {
    return this.eventService.formatDate(dateString);
  }

  getUpcomingCount(): number {
    return this.events.filter(e => e.status === EventStatus.Upcoming).length;
  }

  getAttendingCount(): number {
    return this.events.filter(e => e.status === EventStatus.Attending).length;
  }
}
