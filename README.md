# EventPlatform Frontend

A modern Angular 18 application for event management with Server-Side Rendering (SSR) and responsive design.

## 🚀 Features

### 🎯 Core Features
- **Event Management**: Create, read, update, and delete events
- **Advanced Filtering**: Filter events by title, location, and date ranges
- **Real-time Status Updates**: Change event status with immediate UI feedback
- **AI-Powered Descriptions**: Generate event descriptions using AI
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

### 🎨 User Interface
- **Modern Design**: Clean, intuitive interface with smooth animations
- **Real-time Preview**: See event preview as you type in forms
- **Status Indicators**: Visual status badges with color coding
- **Loading States**: Professional loading spinners and error handling
- **Form Validation**: Real-time validation with helpful error messages

## 🛠️ Technology Stack

- **Framework**: Angular 18 with Server-Side Rendering (SSR)
- **Styling**: SCSS with modern CSS Grid and Flexbox
- **Forms**: Reactive Forms with custom validation
- **HTTP Client**: Angular HttpClient with interceptors
- **Routing**: Angular Router with lazy loading support
- **State Management**: Angular Services and Reactive Forms

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   └── events/
│   │       ├── event-list/
│   │       │   ├── event-list.component.ts
│   │       │   ├── event-list.component.html
│   │       │   └── event-list.component.scss
│   │       ├── event-detail/
│   │       │   ├── event-detail.component.ts
│   │       │   ├── event-detail.component.html
│   │       │   └── event-detail.component.scss
│   │       └── event-form/
│   │           ├── event-form.component.ts
│   │           ├── event-form.component.html
│   │           └── event-form.component.scss
│   ├── services/
│   │   └── event.service.ts
│   ├── models/
│   │   └── event.model.ts
│   ├── app.component.ts
│   ├── app.component.html
│   ├── app.component.scss
│   └── app.routes.ts
├── styles.scss
└── main.ts
```

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** and **npm**
- **Angular CLI** (install globally: `npm install -g @angular/cli`)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the development server**
   ```bash
   ng serve --port 4200
   ```

3. **Open your browser**
   Navigate to `http://localhost:4200`

### Build for Production

```bash
ng build --configuration production
```

## 🎨 Components

### EventListComponent

**Location**: `src/app/components/events/event-list/`

**Features**:
- Displays all events in a responsive grid layout
- Advanced filtering by title, location, and date ranges
- Real-time status updates with visual feedback
- CRUD operations with confirmation dialogs
- Loading states and error handling

**Key Methods**:
- `loadEvents()`: Load events from API
- `applyFilters()`: Apply search and date filters
- `updateEventStatus()`: Update event status
- `deleteEvent()`: Delete event with confirmation

### EventDetailComponent

**Location**: `src/app/components/events/event-detail/`

**Features**:
- Detailed view of individual events
- Inline status editing with dropdown
- Edit and delete actions
- Responsive design for all screen sizes
- Navigation back to list

**Key Methods**:
- `loadEvent()`: Load event details by ID
- `updateStatus()`: Update event status
- `editEvent()`: Navigate to edit form
- `deleteEvent()`: Delete event with confirmation

### EventFormComponent

**Location**: `src/app/components/events/event-form/`

**Features**:
- Create and edit events with reactive forms
- Real-time form validation
- AI-powered description generation
- Live preview of event data
- Auto-save functionality

**Key Methods**:
- `initializeForm()`: Set up reactive form
- `generateDescription()`: Generate AI description
- `saveEvent()`: Save event to API
- `previewEvent()`: Show live preview

## 🔧 Services

### EventService

**Location**: `src/app/services/event.service.ts`

**Features**:
- HTTP communication with backend API
- Data transformation and formatting
- Error handling and retry logic
- Status management utilities

**Key Methods**:
- `getEvents()`: Get all events with filters
- `getEvent()`: Get single event by ID
- `createEvent()`: Create new event
- `updateEvent()`: Update existing event
- `deleteEvent()`: Delete event
- `updateEventStatus()`: Update event status
- `generateDescription()`: Generate AI description

## 🎨 Styling

### SCSS Architecture

The application uses a modular SCSS architecture with:

- **Variables**: Colors, fonts, spacing, breakpoints
- **Mixins**: Common patterns and utilities
- **Components**: Component-specific styles
- **Global Styles**: Base styles and utilities

### Responsive Design

- **Mobile-first approach**: Base styles for mobile devices
- **Breakpoints**: 
  - Mobile: 0-767px
  - Tablet: 768px-1023px
  - Desktop: 1024px+
- **CSS Grid and Flexbox**: Modern layout techniques
- **Smooth animations**: CSS transitions and transforms

### Design System

- **Color Palette**: Primary, secondary, and accent colors
- **Typography**: Consistent font hierarchy
- **Spacing**: Standardized spacing scale
- **Components**: Reusable UI components

## 🔧 Configuration

### Environment Variables

```typescript
// src/app/services/event.service.ts
private apiUrl = 'http://localhost:5130/api/events';
```

### Angular Configuration

```json
// angular.json
{
  "projects": {
    "event-platform-frontend": {
      "architect": {
        "build": {
          "options": {
            "outputPath": "dist/event-platform-frontend",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "tsconfig.app.json",
            "assets": ["src/favicon.ico", "src/assets"],
            "styles": ["src/styles.scss"],
            "scripts": []
          }
        }
      }
    }
  }
}
```

## 🧪 Testing

### Unit Tests

```bash
ng test
```

### E2E Tests

```bash
ng e2e
```

### Code Coverage

```bash
ng test --code-coverage
```

## 📦 Deployment

### Build for Production

```bash
ng build --configuration production
```

### Deploy to Static Hosting

1. Build the application
2. Upload the `dist` folder to your hosting provider
3. Configure routing for SPA (Single Page Application)

### Deploy to Cloud Platforms

#### Vercel
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

## 🔍 Development

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Angular Style Guide**: Follow Angular best practices

### Git Workflow

1. Create feature branch
2. Make changes
3. Run tests
4. Create pull request
5. Code review
6. Merge to main

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
ng serve --port 4201
```

#### Build Errors
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

#### CORS Issues
Ensure the backend API has CORS configured properly.

## 📚 Resources

- [Angular Documentation](https://angular.dev/)
- [Angular Style Guide](https://angular.dev/style-guide)
- [Angular CLI](https://angular.dev/cli)
- [SCSS Documentation](https://sass-lang.com/documentation)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

---

**Built with ❤️ using Angular 18**
