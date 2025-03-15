# Custom Hooks

This directory contains all custom React hooks used throughout the application.

## Hook Guidelines

1. **Naming Conventions**
   - Prefix all hooks with 'use'
   - Use camelCase naming
   - Be descriptive in naming
   - Include type in name when applicable

2. **File Structure**
   ```
   hooks/
   ├── auth/              # Authentication related hooks
   ├── form/             # Form handling hooks
   ├── data/             # Data fetching hooks
   └── ui/               # UI related hooks
   ```

## Implementation Rules

1. **Hook Design**
   - Follow React Hooks rules
   - Keep hooks focused and reusable
   - Implement proper cleanup
   - Handle all necessary dependencies

2. **Type Safety**
   - Use TypeScript for all hooks
   - Define proper return types
   - Document parameters
   - Handle edge cases

## Common Hooks

### Data Fetching
```typescript
// Example data fetching hook
export const useWorkouts = (userId: string) => {
  const [data, setData] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Implementation
  }, [userId]);

  return { data, loading, error };
};
```

### Form Handling
```typescript
// Example form hook
export const useForm = <T extends object>(initialValues: T) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<T>>({});

  // Implementation

  return { values, errors, handleChange, handleSubmit };
};
```

## Best Practices

1. **State Management**
   - Use appropriate state initialization
   - Handle side effects properly
   - Implement proper cleanup
   - Optimize re-renders

2. **Error Handling**
   - Handle async errors
   - Provide error state
   - Clean up on unmount
   - Log errors appropriately

3. **Performance**
   - Memoize callbacks
   - Use proper dependencies
   - Avoid unnecessary renders
   - Handle cleanup properly

## Testing

1. **Unit Tests**
   - Test hook behavior
   - Test error cases
   - Test cleanup
   - Test edge cases

2. **Integration Tests**
   - Test with components
   - Test state updates
   - Test side effects
   - Test error handling

## Documentation

Each hook should include:
- Purpose and usage
- Parameter types
- Return value types
- Example usage
- Edge cases
- Dependencies

Example:
```typescript
/**
 * Hook for managing pagination state
 * @param {number} initialPage - Initial page number
 * @param {number} pageSize - Items per page
 * @returns {Object} Pagination state and handlers
 */
export const usePagination = (
  initialPage: number = 1,
  pageSize: number = 10
) => {
  // Implementation
};
```

## Error Handling

1. **Async Operations**
   - Handle promise rejections
   - Provide error state
   - Clean up pending operations
   - Show error feedback

2. **State Updates**
   - Handle race conditions
   - Validate state updates
   - Handle edge cases
   - Maintain consistency

## Dependencies

- Minimize external dependencies
- Document required peer dependencies
- Handle version compatibility
- Manage hook dependencies properly 