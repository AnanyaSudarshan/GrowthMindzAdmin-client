# GrowthMindz Admin Portal

A React-based admin portal application for GrowthMindz with role-based authentication and navigation.

## Features

- ✅ Login page with email, password, and role selection
- ✅ Form validation and error handling
- ✅ Role-based navigation (Admin/Staff)
- ✅ Responsive design with Bootstrap 5
- ✅ Modern UI with gradient backgrounds and animations

## Tech Stack

- **React 19** - UI Library
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Bootstrap 5** - CSS framework for styling

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Navigate to the project directory
cd GrowthMindzAdmin-client

# Install dependencies
npm install
```

### Running the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Building for Production

```bash
npm run build
```

The production build will be created in the `dist` directory.

## Project Structure

```
GrowthMindzAdmin-client/
├── src/
│   ├── pages/
│   │   ├── Login.jsx          # Login page component
│   │   ├── AdminHome.jsx      # Admin home page
│   │   └── StaffHome.jsx      # Staff home page
│   ├── App.jsx                # Main app component with routing
│   ├── main.jsx               # Entry point
│   ├── App.css                # Custom styles
│   └── index.css              # Global styles
├── public/                    # Static assets
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## Usage

### Login Page

The login page (`/` or `/login`) contains:
- **Email field** (required)
- **Password field** (required)
- **Role dropdown** (required) - Select Admin or Staff
- **Login button**

### Navigation Flow

1. User enters credentials and selects a role
2. If validation fails, an error message is displayed
3. If validation passes:
   - **Admin role** → Navigates to `/admin-home`
   - **Staff role** → Navigates to `/staff-home`

### Validation Rules

- All fields are required
- Email must be in valid format
- Password field must not be empty
- Role must be selected

## Routes

- `/` - Login page (redirects to same as `/login`)
- `/login` - Login page
- `/admin-home` - Admin dashboard (displays "Welcome, Admin!")
- `/staff-home` - Staff dashboard (displays "Welcome, Staff!")

## Customization

### Styling

- Custom styles are in `src/App.css`
- Bootstrap 5 is imported in `src/main.jsx`
- Global styles are in `src/index.css`

### Adding New Pages

1. Create a new component in `src/pages/`
2. Import it in `src/App.jsx`
3. Add a route in the `<Routes>` component

Example:
```jsx
import NewPage from './pages/NewPage';

// In the Routes:
<Route path="/new-page" element={<NewPage />} />
```

## Development Notes

- The application uses functional components with React Hooks
- Form validation is handled client-side
- No actual authentication backend is implemented (this is a frontend-only demo)

## License

This project is created for GrowthMindz Admin Portal.
