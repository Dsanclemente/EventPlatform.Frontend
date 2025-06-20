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

  // Obtener todos los eventos con filtros opcionales
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

  // Obtener un evento específico por ID
  getEvent(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo evento
  createEvent(event: CreateEventRequest): Observable<ApiResponse<Event>> {
    return this.http.post<ApiResponse<Event>>(this.apiUrl, event);
  }

  // Actualizar un evento existente
  updateEvent(id: number, event: UpdateEventRequest): Observable<ApiResponseSimple> {
    return this.http.put<ApiResponseSimple>(`${this.apiUrl}/${id}`, event);
  }

  // Actualizar solo el estado de un evento
  updateEventStatus(id: number, status: UpdateStatusRequest): Observable<StatusUpdateResponse> {
    return this.http.patch<StatusUpdateResponse>(`${this.apiUrl}/${id}/status`, status);
  }

  // Eliminar un evento
  deleteEvent(id: number): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/${id}`);
  }

  // Generar descripción automática
  generateDescription(request: GenerateDescriptionRequest): Observable<ApiResponse<GenerateDescriptionResponse>> {
    return this.http.post<ApiResponse<GenerateDescriptionResponse>>(`${this.apiUrl}/generate-description`, request);
  }

  // Método helper para obtener el nombre del estado
  getStatusName(status: number): string {
    switch (status) {
      case 0: return 'Próximo';
      case 1: return 'Asistiendo';
      case 2: return 'Tal vez';
      case 3: return 'Rechazado';
      default: return 'Desconocido';
    }
  }

  // Método helper para obtener la clase CSS del estado
  getStatusClass(status: number): string {
    switch (status) {
      case 0: return 'status-upcoming';
      case 1: return 'status-attending';
      case 2: return 'status-maybe';
      case 3: return 'status-declined';
      default: return 'status-unknown';
    }
  }

  // Método helper para formatear fecha
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
