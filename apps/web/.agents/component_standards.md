Component Standards Guide
To keep our codebase healthy, maintainable, and scalable, we follow these standards for creating new components. This guide focuses on keeping files small (aiming for under 150-200 lines) and logic separated from presentation.

1. File Size & Responsibility
Goal: Keep component files under 150-200 lines.
Single Responsibility Principle (SRP): A component should do one thing. If a modal is managing basic info, images, skills, and social links, it's doing too much.
Rule of Thumb: If you have more than 3 distinct "sections" in your JSX, consider extracting them into sub-components.
2. Logic vs. Presentation (Hooks)
Business Logic: Mutations, complex state management, and file processing should live in custom hooks.
Container/Presenter Pattern: Or simply, use hooks for "how it works" and components for "how it looks".
Naming: Use the use[ComponentName] pattern (e.g., useEditProfile).
3. Atomic Structure
Break down large components into:

Core Component: The main entry point (orchestrates sub-components and hooks).
Sub-sections: Focused components for specific parts of the UI (e.g., SkillsSection).
UI primitives: Small, reusable building blocks (e.g., Button, Input).
4. Standard Directory Structure
For complex features, use a directory instead of a single file:

text
components/[FeatureName]/
├── index.tsx           # Entry point
├── SubComponentA.tsx
├── SubComponentB.tsx
├── types.ts            # Local interface definitions
└── styles.css          # (If not using tailwind)
5. Implementation Example
Instead of one giant file:

tsx
// ❌ AVOID
export function BigComponent() {
  const [data, setData] = useState(...)
  // ... 100 lines of logic
  return (
    <div>
      <Section1 />
      <Section2 />
      {/* ... 300 lines of JSX */}
    </div>
  )
}
// ✅ PREFERRED
export function BigComponent() {
  const { state, actions } = useBigComponentLogic(); // Logic extracted
  return (
    <div>
      <Section1 data={state.s1} onAction={actions.a1} />
      <Section2 data={state.s2} onAction={actions.a2} />
    </div>
  )
}
6. Type Safety
Always define interfaces for Props.
Avoid any.
Keep shared types in a central types.ts if they are used by multiple components