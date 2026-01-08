# Add a Feature

Implement a new feature with full quality pipeline: implementation, tests, types, size check, and docs.

**Arguments**: $ARGUMENTS

## Usage

```
/feature <package> <description>
```

### Examples
- `/feature prayer-times add Turkish Diyanet calculation method`
- `/feature qibla add rhumb line bearing calculation`
- `/feature quran add search by revelation order`

## Arguments

The argument should contain:
1. **Package name**: `qibla`, `prayer-times`, or `quran`
2. **Feature description**: What to implement

If no argument provided, show this help message.

## Workflow

Execute the following agent pipeline in order:

### Step 1: Implementation (Domain Expert)

Select the appropriate domain expert based on package:

| Package | Agent | Scope |
|---------|-------|-------|
| prayer-times | `prayer-times-domain` | Calculation methods, high latitude, formatting |
| qibla | `qibla-domain-expert` | Direction calculations, distance, coordinates |
| quran | `quran-data-api` | Data access, search, API design |

The domain expert will:
1. Understand the feature requirements
2. Design the implementation approach
3. Write the code following package patterns
4. Maintain zero-dependency constraint
5. Support both functional and class-based APIs

### Step 2: Test Creation (testing-validator)

Use the `testing-validator` agent to:
1. Design comprehensive test cases
2. Cover normal cases and edge cases
3. Include mathematical accuracy tests (where applicable)
4. Verify all tests pass

### Step 3: Type Safety (typescript-standards)

Use the `typescript-standards` agent to:
1. Review type definitions
2. Ensure proper exports
3. Check .d.ts output quality
4. Verify no type regressions

### Step 4: Bundle Size Check (bundle-optimizer)

Use the `bundle-optimizer` agent to:
1. Build the package
2. Check size against limits:
   - qibla: 1KB
   - prayer-times: 5KB
   - quran: 2KB
3. Suggest optimizations if needed

### Step 5: Documentation (docs-architect)

Use the `docs-architect` agent to:
1. Add API documentation for new feature
2. Create usage examples
3. Update relevant MDX files in apps/docs/

## Key Constraints

1. **Zero Dependencies** - No new runtime dependencies
2. **Universal Compatibility** - Works in Node.js, Browser, React Native, Edge
3. **Dual API** - Provide both functional and class-based access
4. **Bundle Budget** - Must fit within package size limit
5. **Full Coverage** - Tests for all new functionality

## Output

Provide:
1. Feature implementation summary
2. New files created/modified
3. Test results
4. Bundle size impact
5. Documentation updates

### Completion Checklist
```
## Feature: [Description]

### Implementation
- [ ] Feature code written
- [ ] Zero dependencies maintained
- [ ] Dual API pattern followed

### Quality
- [ ] Tests pass (X new tests added)
- [ ] Type safety verified
- [ ] Bundle size within limit

### Documentation
- [ ] API docs updated
- [ ] Examples added
```
