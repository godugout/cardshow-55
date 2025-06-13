
# Viewer Component Refactoring Guidelines

## Event Handling Architecture

### Single Source of Truth
- `useViewerInteractions` hook handles ALL mouse/drag logic
- `ViewerContainer` manages state only  
- `ViewerCardDisplay` renders UI only
- No competing event systems allowed

### Event Flow Chain
```
ViewerInteractionLayer (captures events) 
  → useViewerInteractions (processes logic)
  → ViewerContainer (updates state)
  → ViewerCardDisplay (renders with new state)
```

### Required Practices

1. **Never Override Event Handlers with Empty Functions**
   ```tsx
   // ❌ Bad - breaks event chain
   onMouseDown={() => {}}
   
   // ✅ Good - pass through or handle properly
   onMouseDown={handleMouseDown}
   ```

2. **Make Event Handlers Required**
   ```tsx
   interface Props {
     onMouseDown: (e: React.MouseEvent) => void; // Required, not optional
   }
   ```

3. **Use TypeScript Strict Mode**
   - Prevents empty function assignments
   - Catches event handler type mismatches

4. **Test Interactions After Refactoring**
   - Click and drag rotation
   - Double-click to flip
   - 3D thickness visibility
   - Glow effects boundaries

### Refactoring Checklist

Before refactoring interaction-related components:

- [ ] Identify the current event flow
- [ ] Plan the new architecture on paper first
- [ ] Keep event handlers required in interfaces
- [ ] Test all interactions work after changes
- [ ] Remove duplicate/competing event systems
- [ ] Clean up leftover code
- [ ] Add console.log for debugging during development
- [ ] Document any architectural changes

### Common Pitfalls

1. **Multiple Event Systems**: Creating competing event handlers in different components
2. **Empty Function Overrides**: Breaking the event chain with `() => {}`
3. **Missing Cleanup**: Leaving old event handlers in place
4. **Type Safety**: Making required handlers optional
5. **Testing**: Not verifying interactions work after refactoring

### Architecture Principles

1. **Single Responsibility**: Each component has one clear purpose
2. **Unidirectional Data Flow**: State flows down, events flow up
3. **Explicit Dependencies**: No hidden event handler dependencies
4. **Fail Fast**: Use TypeScript to catch issues at compile time
