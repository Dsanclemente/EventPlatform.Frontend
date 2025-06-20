export interface Event {
  id: number;
  title: string;
  dateTime: string;
  location: string;
  description: string;
  status: EventStatus;
  createdAt: string;
  updatedAt: string | null;
}

export enum EventStatus {
  Upcoming = 0,
  Attending = 1,
  Maybe = 2,
  Declined = 3
}

export interface CreateEventRequest {
  title: string;
  dateTime: string;
  location: string;
  description: string;
  status: EventStatus;
}

export interface UpdateEventRequest {
  id: number;
  title: string;
  dateTime: string;
  location: string;
  description: string;
  status: EventStatus;
}

export interface UpdateStatusRequest {
  status: EventStatus;
}

export interface GenerateDescriptionRequest {
  topic: string;
}

export interface GenerateDescriptionResponse {
  description: string;
}

// Respuestas estandarizadas de la API
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  statusCode: number;
  timestamp: string;
}

export interface ApiResponseSimple {
  success: boolean;
  message: string;
  statusCode: number;
  timestamp: string;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
  deletedId: number;
  statusCode: number;
  timestamp: string;
}

export interface StatusUpdateResponse {
  success: boolean;
  message: string;
  eventId: number;
  previousStatus: EventStatus;
  newStatus: EventStatus;
  statusCode: number;
  timestamp: string;
}
