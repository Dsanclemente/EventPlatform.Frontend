import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Event, 
  CreateEventRequest, 
  UpdateEventRequest, 
  UpdateStatusRequest,
  GenerateDescriptionRequest,
  GenerateDescriptionResponse,
  ApiResponse,
  ApiResponseSimple,
  DeleteResponse,
  StatusUpdateResponse
} from '../models/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:5130/api/events';

  constructor(private http: HttpClient) { }

  // Get all events with optional filters
  getEvents(filters?: {
    title?: string;
    location?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Observable<Event[]> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.title) params = params.set('title', filters.title);
      if (filters.location) params = params.set('location', filters.location);
      if (filters.dateFrom) params = params.set('dateFrom', filters.dateFrom);
      if (filters.dateTo) params = params.set('dateTo', filters.dateTo);
    }

    return this.http.get<Event[]>(this.apiUrl, { params });
  }

  // Get a specific event by ID
  getEvent(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  // Create a new event
  createEvent(event: CreateEventRequest): Observable<ApiResponse<Event>> {
    return this.http.post<ApiResponse<Event>>(this.apiUrl, event);
  }

  // Update an existing event
  updateEvent(id: number, event: UpdateEventRequest): Observable<ApiResponseSimple> {
    return this.http.put<ApiResponseSimple>(`${this.apiUrl}/${id}`, event);
  }

  // Update only the status of an event
  updateEventStatus(id: number, status: UpdateStatusRequest): Observable<StatusUpdateResponse> {
    return this.http.patch<StatusUpdateResponse>(`${this.apiUrl}/${id}/status`, status);
  }

  // Delete an event
  deleteEvent(id: number): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/${id}`);
  }

  // Generate automatic description
  generateDescription(request: GenerateDescriptionRequest): Observable<ApiResponse<GenerateDescriptionResponse>> {
    return this.http.post<ApiResponse<GenerateDescriptionResponse>>(`${this.apiUrl}/generate-description`, request);
  }

  // Helper method to get status name
  getStatusName(status: number): string {
    switch (status) {
      case 0: return 'Upcoming';
      case 1: return 'Attending';
      case 2: return 'Maybe';
      case 3: return 'Declined';
      default: return 'Unknown';
    }
  }

  // Helper method to get CSS class for status
  getStatusClass(status: number): string {
    switch (status) {
      case 0: return 'status-upcoming';
      case 1: return 'status-attending';
      case 2: return 'status-maybe';
      case 3: return 'status-declined';
      default: return 'status-unknown';
    }
  }

  // Helper method to format date
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
