# Fitness Tracker Application

A full-stack fitness tracking application that helps users monitor their workout progress, set goals, and maintain their fitness journey.

## Tech Stack

### Frontend (Client)
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: React Context/Hooks
- **Code Quality**: ESLint, TypeScript

### Backend (Server)
- **Runtime**: Node.js
- **Language**: TypeScript
- **Database**: MongoDB (with Mongoose)
- **API Style**: RESTful

## Project Structure

```
fitness-tracker/
├── client/              # Frontend React application
├── server/              # Backend Node.js application
├── .vscode/             # VS Code configuration
└── crm.html            # CRM interface
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or Atlas connection)

## Getting Started

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`

4. Start the development server:
   ```bash
   npm run dev
   ```

## Configuration Files

### Frontend
- `vite.config.ts` - Vite configuration
- `tailwind.config.cjs` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint rules

### Backend
- `.env` - Environment variables
- `tsconfig.json` - TypeScript configuration

## Development Guidelines

1. Follow TypeScript best practices
2. Write clean, documented code
3. Follow the established project structure
4. Use meaningful commit messages

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Backend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT 