import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Event, EventStatus } from '../../../models/event';
import { EventService } from '../../../services/event.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.scss'
})
export class EventDetailComponent implements OnInit {
  event: Event | null = null;
  loading = false;
  error = '';
  eventId: number = 0;

  // Available statuses
  statusOptions = [
    { value: EventStatus.Upcoming, label: 'Upcoming' },
    { value: EventStatus.Attending, label: 'Attending' },
    { value: EventStatus.Maybe, label: 'Maybe' },
    { value: EventStatus.Declined, label: 'Declined' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.eventId = +params['id'];
      if (this.eventId) {
        this.loadEvent();
      }
    });
  }

  loadEvent(): void {
    this.loading = true;
    this.error = '';

    this.eventService.getEvent(this.eventId).subscribe({
      next: (event) => {
        this.event = event;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading event: ' + error.message;
        this.loading = false;
      }
    });
  }

  updateEventStatus(newStatus: EventStatus): void {
    if (!this.event) return;

    this.eventService.updateEventStatus(this.eventId, { status: newStatus }).subscribe({
      next: (response) => {
        if (response.success && this.event) {
          this.event.status = newStatus;
          this.event.updatedAt = new Date().toISOString();
          console.log('Status updated:', response.message);
        }
      },
      error: (error) => {
        console.error('Error updating status:', error);
      }
    });
  }

  deleteEvent(): void {
    if (!this.event) return;

    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(this.eventId).subscribe({
        next: (response) => {
          if (response.success) {
            console.log('Event deleted:', response.message);
            this.router.navigate(['/events']);
          }
        },
        error: (error) => {
          console.error('Error deleting event:', error);
        }
      });
    }
  }

  editEvent(): void {
    this.router.navigate(['/events', this.eventId, 'edit']);
  }

  goBack(): void {
    this.router.navigate(['/events']);
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
}
