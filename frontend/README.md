# Kanban Board Frontend

This is the frontend for the Kanban Board application, built using **React**, **TypeScript**, and **Material UI** with **dnd-kit** for drag-and-drop functionality.

## Features
- 🏗 **Drag & Drop** - Move tasks between columns using `dnd-kit`
- 🎨 **Responsive Design** - Optimized for different screen sizes
- ✨ **Optimistic UI Updates** - Instant feedback while waiting for API calls
- 🚀 **Task Management** - Create, edit, and delete tasks seamlessly
- 🔄 **State Management** - Uses React hooks for efficient state updates

## Installation & Setup

### Prerequisites
Ensure you have:
- Node.js (>= 16.x)
- pnpm, yarn or npm installed

### Steps to Install
```sh
pnpm install | npm install | yarn install 
```

### Run the Development Server
```sh
pnpm dev | npm run dev | yarn dev 
```

### Run the tests
```sh
pnpm test | npm run test | yarn test
```

## Folder Structure
```
/src
  ├── api/             # API request handlers
  ├── components/      # UI components like TaskCard, Columns
  ├── hooks/           # Custom hooks (e.g., useHandleTasks)
  ├── types/           # TypeScript types
  ├── styles/          # Global styles (if needed)
  ├── App.tsx          # Main entry point
```

## Technologies Used
- **React** - UI Library
- **TypeScript** - Strongly typed development
- **Material UI** - UI Components
- **dnd-kit** - Drag & drop handling
- **Vite** - Fast development server
- **React Router** - Routing library
- **Jest** - Testing framework

## Known Issues & Improvements

### Optimizations
- Implement **caching** for faster data retrieval
- Improve performance of large task lists
- Better handling of error states and retries
- Add more unit tests
- Add integration tests and component tests
### UI/UX Improvements
- Enhance **dark mode support**
- Improve mobile responsiveness further
- Add animations/transitions for smoother interactions

### Feature Enhancements
- **Task Tags** - Allow users to add labels to tasks
- **Email Integration** - Notifications for task updates
- **Task history** or activity logs

## License
MIT License

