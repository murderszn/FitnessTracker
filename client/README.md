# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

# SimpleCRM Design Reference

## Overview
SimpleCRM is a minimalist, black-and-white focused CRM system that prioritizes clean design and consistent user experience. The application follows a strict design system to maintain visual harmony across all pages and components.

## Design Philosophy

### Colors & Theme
- Primary palette is monochromatic (black and white)
- Minimal use of color, reserved only for status indicators and critical actions
- Background: Clean white (`#ffffff`)
- Surface elements: Light gray (`#f8fafc`)
- Text: Dark gray (`#1e293b`)
- Borders: Subtle gray (`#e2e8f0`)

### Typography
- Font Family: Inter
- Base size: 14px (0.875rem)
- Headers: 
  - Page titles: 24px (1.5rem)
  - Section headers: 20px (1.25rem)
  - Card titles: 16px (1rem)
- Font weights:
  - Regular: 400
  - Medium: 500
  - Semibold: 600

### Icons & Visual Elements
- Icon size: 16px (1rem) - consistently small and proportional
- Icon color: Muted gray (`#64748b`)
- Icon placement: Always aligned with text, consistent spacing
- Button icons: Same size as text (16px)
- Spacing between icon and text: 0.5rem (8px)

### Layout & Spacing
- Consistent padding across components:
  - Page padding: 2rem (32px)
  - Card padding: 1.5rem (24px)
  - Button padding: 0.75rem 1.5rem (12px 24px)
- Grid system:
  - Sidebar width: 250px
  - Responsive breakpoints: 768px, 1024px, 1280px

### Components

#### Buttons
- Height: 38px (consistent across all buttons)
- Primary: Black background, white text
- Secondary: White background, black border
- Icon buttons: 32px square, centered icon

#### Cards
- Consistent border radius: 8px
- Subtle border: 1px solid
- Hover effect: Slight elevation (2px shadow)
- Internal spacing: 1.5rem padding

#### Modals
- Width: Maximum 600px
- Centered on screen
- Consistent header height
- Standard padding: 2rem
- Backdrop: Semi-transparent black

#### Tables
- Header: Slightly darker than content area
- Row height: 48px
- Cell padding: 1rem
- Hover effect: Subtle background change

### Page-Specific Guidelines

#### Dashboard
- Stat cards: Equal height and width
- Grid layout: Responsive 4-column grid
- Chart sizes: Consistent height per row

#### Contacts/Companies
- List view: Consistent row height
- Action buttons: Aligned right
- Status indicators: Small, subtle pills

#### Deals
- Kanban columns: Equal width
- Card size: Consistent across stages
- Progress indicators: Subtle and minimal

## Interaction Patterns
- Hover effects: Subtle and consistent
- Click animations: Quick and minimal
- Page transitions: Fade in/out
- Loading states: Minimal spinners

## Best Practices
1. Maintain consistent spacing between elements
2. Keep icons small and proportional to text
3. Use color sparingly and purposefully
4. Ensure all interactive elements have hover states
5. Maintain alignment across similar components
6. Keep modals and dialogs consistent in size and style
7. Use standard button sizes across all pages

## Accessibility
- Sufficient color contrast
- Clear focus indicators
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly text alternatives

This reference should be consulted when making any design decisions or adding new features to maintain consistency throughout the application.

# Fitness Tracker Frontend

The frontend application for the Fitness Tracker, built with React, TypeScript, and Vite.

## Tech Stack Details

- **React**: Frontend library for building user interfaces
- **TypeScript**: For type-safe code
- **Vite**: Build tool and development server
- **TailwindCSS**: Utility-first CSS framework
- **ESLint**: Code linting and style enforcement
- **PostCSS**: CSS processing

## Directory Structure

```
client/
├── src/                 # Source code
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript type definitions
│   ├── assets/         # Static assets
│   ├── styles/         # Global styles
│   └── App.tsx         # Root component
├── public/             # Public assets
├── index.html          # HTML entry point
└── vite.config.ts      # Vite configuration
```

## Configuration Details

### TypeScript Configuration
- `tsconfig.json`: Base TypeScript configuration
- `tsconfig.node.json`: Node-specific TypeScript settings
- `tsconfig.app.json`: Application-specific TypeScript settings

### Vite Configuration
The `vite.config.ts` file includes:
- React plugin configuration
- Development server settings
- Build optimization settings

### TailwindCSS Configuration
`tailwind.config.cjs` includes:
- Custom theme settings
- Plugin configurations
- Content paths for purging

### ESLint Configuration
`eslint.config.js` enforces:
- React best practices
- TypeScript rules
- Code style consistency

## Development Rules

1. **Component Structure**
   - Use functional components with hooks
   - Implement proper TypeScript interfaces
   - Follow component composition patterns

2. **State Management**
   - Use React Context for global state
   - Implement hooks for shared logic
   - Keep component state minimal

3. **Styling Guidelines**
   - Use TailwindCSS utility classes
   - Follow mobile-first approach
   - Maintain consistent spacing

4. **Code Quality**
   - Write unit tests for components
   - Document complex logic
   - Follow ESLint rules

## Environment Variables

Create a `.env` file with the following variables:
```
VITE_API_URL=http://localhost:3000
VITE_APP_ENV=development
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint
- `npm run type-check`: Run TypeScript checks

## Best Practices

1. **Component Organization**
   - One component per file
   - Use index files for exports
   - Group related components

2. **Performance**
   - Implement React.memo where needed
   - Use proper key props in lists
   - Optimize re-renders

3. **Accessibility**
   - Use semantic HTML
   - Include ARIA labels
   - Ensure keyboard navigation

4. **Error Handling**
   - Implement error boundaries
   - Handle API errors gracefully
   - Show user-friendly messages
