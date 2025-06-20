import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EventService } from './event.service';
import { Event, EventStatus, CreateEventRequest, UpdateEventRequest, UpdateStatusRequest, ApiResponse, ApiResponseSimple, DeleteResponse, StatusUpdateResponse } from '../models/event';

describe('EventService', () => {
  let service: EventService;
  let httpMock: HttpTestingController;

  const mockEvents: Event[] = [
    {
      id: 1,
      title: 'Test Conference',
      dateTime: '2024-01-15T10:00:00.000Z',
      location: 'Test Location',
      description: 'Test Description',
      status: EventStatus.Upcoming,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: null
    },
    {
      id: 2,
      title: 'Another Event',
      dateTime: '2024-01-20T14:00:00.000Z',
      location: 'Another Location',
      description: 'Another Description',
      status: EventStatus.Attending,
      createdAt: '2024-01-02T00:00:00.000Z',
      updatedAt: null
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EventService]
    });
    service = TestBed.inject(EventService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getEvents', () => {
    it('should retrieve events without filters', () => {
      service.getEvents().subscribe(events => {
        expect(events).toEqual(mockEvents);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockEvents);
    });

    it('should retrieve events with title filter', () => {
      const filters = { title: 'Conference' };
      service.getEvents(filters).subscribe(events => {
        expect(events).toEqual(mockEvents);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}?title=Conference`);
      expect(req.request.method).toBe('GET');
      req.flush(mockEvents);
    });

    it('should retrieve events with multiple filters', () => {
      const filters = { 
        title: 'Conference', 
        location: 'Test', 
        dateFrom: '2024-01-01',
        dateTo: '2024-01-31'
      };
      service.getEvents(filters).subscribe(events => {
        expect(events).toEqual(mockEvents);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}?title=Conference&location=Test&dateFrom=2024-01-01&dateTo=2024-01-31`);
      expect(req.request.method).toBe('GET');
      req.flush(mockEvents);
    });

    it('should handle error response', () => {
      service.getEvents().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(`${service['apiUrl']}`);
      req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getEvent', () => {
    it('should retrieve a single event by id', () => {
      const mockEvent = mockEvents[0];

      service.getEvent(1).subscribe(event => {
        expect(event).toEqual(mockEvent);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockEvent);
    });

    it('should handle event not found', () => {
      service.getEvent(999).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/999`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createEvent', () => {
    it('should create a new event', () => {
      const newEvent: CreateEventRequest = {
        title: 'New Event',
        dateTime: '2024-02-01T10:00:00.000Z',
        location: 'New Location',
        description: 'New Description',
        status: EventStatus.Upcoming
      };

      const createdEvent: Event = {
        id: 3,
        title: 'New Event',
        dateTime: '2024-02-01T10:00:00.000Z',
        location: 'New Location',
        description: 'New Description',
        status: EventStatus.Upcoming,
        createdAt: new Date().toISOString(),
        updatedAt: null
      };

      const mockResponse: ApiResponse<Event> = {
        success: true,
        message: 'Event created successfully',
        data: createdEvent,
        statusCode: 201,
        timestamp: new Date().toISOString()
      };

      service.createEvent(newEvent).subscribe(response => {
        expect(response.data).toEqual(createdEvent);
        expect(response.success).toBe(true);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newEvent);
      req.flush(mockResponse);
    });

    it('should handle validation errors', () => {
      const invalidEvent: CreateEventRequest = {
        title: '', // Invalid: empty title
        dateTime: '2024-02-01T10:00:00.000Z',
        location: 'New Location',
        description: 'New Description',
        status: EventStatus.Upcoming
      };

      const errorResponse: ApiResponse<Event> = {
        success: false,
        message: 'Validation failed',
        data: null,
        statusCode: 400,
        timestamp: new Date().toISOString()
      };

      service.createEvent(invalidEvent).subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.data).toBeNull();
      });

      const req = httpMock.expectOne(`${service['apiUrl']}`);
      req.flush(errorResponse);
    });
  });

  describe('updateEvent', () => {
    it('should update an existing event', () => {
      const updatedEvent: UpdateEventRequest = {
        id: 1,
        title: 'Updated Event',
        dateTime: '2024-01-15T10:00:00.000Z',
        location: 'Updated Location',
        description: 'Updated Description',
        status: EventStatus.Attending
      };

      const mockResponse: ApiResponseSimple = {
        success: true,
        message: 'Event updated successfully',
        statusCode: 200,
        timestamp: new Date().toISOString()
      };

      service.updateEvent(1, updatedEvent).subscribe(response => {
        expect(response.success).toBe(true);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedEvent);
      req.flush(mockResponse);
    });
  });

  describe('updateEventStatus', () => {
    it('should update event status', () => {
      const statusUpdate: UpdateStatusRequest = { status: EventStatus.Maybe };
      const mockResponse: StatusUpdateResponse = {
        success: true,
        message: 'Event status updated successfully',
        eventId: 1,
        previousStatus: EventStatus.Upcoming,
        newStatus: EventStatus.Maybe,
        statusCode: 200,
        timestamp: new Date().toISOString()
      };

      service.updateEventStatus(1, statusUpdate).subscribe(response => {
        expect(response.newStatus).toBe(EventStatus.Maybe);
        expect(response.success).toBe(true);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/1/status`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(statusUpdate);
      req.flush(mockResponse);
    });
  });

  describe('deleteEvent', () => {
    it('should delete an event', () => {
      const mockResponse: DeleteResponse = {
        success: true,
        message: 'Event deleted successfully',
        deletedId: 1,
        statusCode: 200,
        timestamp: new Date().toISOString()
      };

      service.deleteEvent(1).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.deletedId).toBe(1);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });

  describe('generateDescription', () => {
    it('should generate description from topic', () => {
      const topic = 'Technology Conference';
      const generatedDescription = 'An exciting technology conference featuring the latest innovations...';
      const mockResponse: ApiResponse<string> = {
        success: true,
        message: 'Description generated successfully',
        data: generatedDescription,
        statusCode: 200,
        timestamp: new Date().toISOString()
      };

      service.generateDescription({ topic }).subscribe(response => {
        expect(response.data).toBe(generatedDescription);
        expect(response.success).toBe(true);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/generate-description`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ topic });
      req.flush(mockResponse);
    });
  });

  describe('getStatusName', () => {
    it('should return correct status name for each status code', () => {
      expect(service.getStatusName(EventStatus.Upcoming)).toBe('Upcoming');
      expect(service.getStatusName(EventStatus.Attending)).toBe('Attending');
      expect(service.getStatusName(EventStatus.Maybe)).toBe('Maybe');
      expect(service.getStatusName(EventStatus.Declined)).toBe('Declined');
      expect(service.getStatusName(999)).toBe('Unknown');
    });
  });

  describe('getStatusClass', () => {
    it('should return correct CSS class for each status', () => {
      expect(service.getStatusClass(EventStatus.Upcoming)).toBe('status-upcoming');
      expect(service.getStatusClass(EventStatus.Attending)).toBe('status-attending');
      expect(service.getStatusClass(EventStatus.Maybe)).toBe('status-maybe');
      expect(service.getStatusClass(EventStatus.Declined)).toBe('status-declined');
      expect(service.getStatusClass(999)).toBe('status-unknown');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const dateString = '2024-01-15T10:00:00.000Z';
      const formatted = service.formatDate(dateString);
      expect(formatted).toContain('15');
      expect(formatted).toContain('2024');
    });
  });
});
