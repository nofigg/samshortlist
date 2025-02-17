# Project Prompt Sheet

Last Updated: February 17, 2025

## Changelog
| Date | Change Description |
|------|-------------------|
| 2025-02-17 | Initial prompt sheet creation with core sections |
| 2025-02-17 | Added evolution guidelines and changelog tracking |
| 2025-02-17 | Added USAspending.gov integration guidelines |
| 2025-02-17 | Added navigation and UI guidelines |

## Project Overview
This document serves as a living guide for our project's development, containing rules, guidelines, and best practices that evolve as our project grows.

## Core Principles
- Maintain consistency in code style and documentation
- Keep the codebase clean and maintainable
- Document important decisions and their rationales
- Regular updates to reflect new learnings and requirements

## Code Guidelines

### Style Guide
- Use clear, descriptive variable and function names
- Include docstrings for functions and classes
- Keep functions focused and single-purpose
- Comment complex logic or business rules

### Project Structure
- Organize code logically by feature/functionality
- Keep related files together
- Use appropriate file naming conventions
- Maintain a clear separation of concerns

### Version Control
- Write meaningful commit messages
- Keep commits focused and atomic
- Use feature branches for new development
- Regular merges to maintain code synchronization

## Documentation
- Update documentation alongside code changes
- Document API endpoints and their usage
- Keep README up to date
- Document environment setup requirements

## Testing
- Write tests for new features
- Maintain test coverage
- Test edge cases
- Document test scenarios

## Development Workflow
1. Review requirements
2. Plan implementation
3. Write tests
4. Implement features
5. Review and refactor
6. Document changes
7. Update this prompt sheet as needed

## Project-Specific Guidelines

### Navigation and User Interface (Added 2025-02-17)
1. Navigation Structure
   - Use consistent navigation patterns across all pages
   - Implement dropdown menus for grouped functionality
   - Include search functionality in the navigation bar
   - Support keyboard navigation (⌘K for search)
   - Ensure mobile responsiveness

2. Animation Guidelines
   - Use subtle animations for state changes
   - Keep animations under 200ms for responsiveness
   - Provide visual feedback for user interactions
   - Use spring animations for natural feel
   - Ensure animations can be disabled for accessibility

3. Component Organization
   - Keep components focused and single-purpose
   - Use composition for complex UI elements
   - Implement proper error boundaries
   - Handle loading and error states consistently
   - Follow atomic design principles

4. Accessibility
   - Include proper ARIA labels
   - Support keyboard navigation
   - Maintain color contrast ratios
   - Provide text alternatives for icons
   - Test with screen readers

### USAspending.gov Integration (Added 2025-02-17)
1. API Endpoints
   - Base URL: https://api.usaspending.gov/api/v2
   - Use POST for search endpoints
   - Include comprehensive filter parameters

2. Data Handling
   - Always handle pagination properly
   - Use appropriate field mappings
   - Format currency values with proper localization
   - Handle date fields consistently

3. Search Parameters
   - Support all relevant USAspending.gov filters:
     - Award types (A, B, C, D for different contract types)
     - Date ranges (performance period)
     - Amount ranges
     - Agency filters
     - Location data
   - Implement sorting options:
     - Award amount (total_obligation)
     - Dates (period_of_performance)
     - Recipient information

4. UI/UX Guidelines
   - Display both awarding and funding agency information
   - Show complete location data
   - Include performance period dates
   - Format large dollar amounts for readability
   - Provide clear filter labels and descriptions

---
Note: This is a living document. Update it regularly with new guidelines, lessons learned, and best practices as they emerge during development.

## Evolution Guidelines
After each significant development session or code change:
1. Assess if new patterns or practices have emerged that should be documented
2. Evaluate if any challenges encountered could be prevented with new guidelines
3. Document technical decisions that impact future development
4. Update relevant sections with:
   - New rules or guidelines
   - Clarifications to existing rules
   - Lessons learned
   - Best practices discovered
5. Add changelog entry with date and description of updates

This ensures our prompt sheet grows organically and remains a valuable reference for maintaining project consistency and efficiency.
