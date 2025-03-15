# Components

This directory contains all reusable React components used throughout the application.

## Component Guidelines

1. **Component Structure**
   - Each component should be in its own directory
   - Include associated styles and tests in the component directory
   - Use index.ts files for exports

2. **Naming Conventions**
   - Use PascalCase for component files and directories
   - Use .tsx extension for component files
   - Use .test.tsx for test files

## Directory Structure

```
components/
├── common/           # Shared components like buttons, inputs
├── layout/          # Layout components like header, footer
├── forms/           # Form-related components
└── features/        # Feature-specific components
```

## Component Documentation

Each component should include:
- PropTypes or TypeScript interfaces
- JSDoc comments for complex logic
- Usage examples in comments
- Storybook stories (if applicable)

## Best Practices

1. **Component Design**
   - Keep components focused and single-responsibility
   - Use composition over inheritance
   - Implement proper prop validation
   - Handle loading and error states

2. **Performance**
   - Use React.memo for expensive renders
   - Implement proper key props
   - Avoid inline styles
   - Minimize re-renders

3. **Accessibility**
   - Use semantic HTML
   - Include ARIA labels
   - Support keyboard navigation
   - Maintain proper contrast ratios

4. **Testing**
   - Write unit tests for logic
   - Test component rendering
   - Test user interactions
   - Test error states

## State Management

- Use local state for UI-only state
- Use Context for shared state
- Document state dependencies
- Handle side effects properly

## Styling

- Use TailwindCSS classes
- Follow mobile-first approach
- Maintain consistent spacing
- Use CSS modules when needed

## Error Handling

- Implement error boundaries
- Show user-friendly error messages
- Handle edge cases
- Log errors appropriately 