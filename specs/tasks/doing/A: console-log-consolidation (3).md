# Console.log Consolidation & Logging System

**Status**: Doing
**Priority**: A (Critical)
**Estimated Effort**: 3 story points (1-2 weeks)
**Dependencies**: None

## Description

The centralized logging package `@repo/logger` already exists in `packages/logger/` and provides a unified, configurable logging system. This task focuses on implementing this logger across all applications and packages in the monorepo to replace scattered console.log statements with structured logging.

## Business Value

- **Debugging Efficiency**: Centralized log management for faster issue resolution
- **Production Monitoring**: Structured logs for production debugging and monitoring
- **Development Experience**: Consistent logging patterns across the entire codebase
- **Maintenance**: Easier log filtering, formatting, and management
- **Compliance**: Structured logging for audit trails and compliance requirements

## Requirements

### Logging System Features

- **Log Levels**: Error, Warn, Info, Debug, Trace with configurable verbosity
- **Structured Logging**: JSON-formatted logs with metadata and context
- **Log Categories**: Application, module, and feature-based log categorization
- **Environment Awareness**: Different log levels and formats for dev/staging/prod
- **Performance**: Minimal overhead with async logging capabilities
- **Integration**: Easy integration with existing console.log statements

### Package Structure

- **Core Logger**: Main logging interface with level-based filtering
- **Formatters**: Multiple output formats (JSON, human-readable, structured)
- **Transporters**: Console, file, and remote logging capabilities
- **Middleware**: Request/response logging, performance monitoring
- **Utilities**: Log parsing, filtering, and analysis tools

### Technical Requirements

- **TypeScript**: Full type safety and IntelliSense support
- **Monorepo Integration**: Proper package configuration for all applications
- **Performance**: Minimal impact on application performance
- **Flexibility**: Easy to configure and extend for different use cases
- **Backward Compatibility**: Gradual migration from console.log

## Technical Implementation

### Existing Package Structure

The logger package already exists at `packages/logger/` with the following structure:

```
packages/logger/
├── src/
│   ├── types.ts            # Type definitions
│   ├── config.ts           # Configuration and log levels
│   ├── logic.ts            # Implementation logic
│   ├── utils.ts            # Utility functions
│   └── index.ts            # Clean exports
├── dist/                   # Built output
├── __tests__/              # Test files
├── package.json
└── README.md
```

### Core Logger Implementation

- **Logger Class**: Main interface with level-based methods
- **Context Management**: Request ID, user ID, organization ID tracking
- **Performance Monitoring**: Execution time and resource usage logging
- **Error Handling**: Graceful fallbacks and error recovery
- **Configuration**: Environment-based settings and customization

### Migration Strategy

- **Phase 1**: Create logging package and basic functionality
- **Phase 2**: Implement in one application as proof of concept
- **Phase 3**: Gradual migration across all applications
- **Phase 4**: Remove console.log statements and enforce logging standards

## Implementation Checklist

### Applications

- [x] **teamhub** - Main Next.js application (Started - Core files updated)
- [ ] **ai-gateway** - AI provider abstraction service
- [ ] **browser-service** - Automated browser control service

### Packages

- [ ] **drizzle-reactive** - Reactive database library
- [ ] **ai-services** - Multi-provider AI service abstractions
- [ ] **teamhub-db** - Database schemas and ORM functions
- [x] **teamhub-ai** - AI functions, tools, and agent communication (Started - Core functions updated)

### Implementation Tasks

- [x] Add logger dependency to each package.json (teamhub completed)
- [x] Replace console.log statements with structured logging (teamhub core files completed)
- [x] Configure appropriate log levels for each component (added WARN level support)
- [x] Add user context and request tracking where applicable (teamhub API routes completed)
- [ ] Test logging functionality in each application/package
- [x] Update documentation with logging examples (README updated)
- [ ] Performance testing to ensure minimal overhead

## Acceptance Criteria

- [ ] Logger package already exists and is functional ✅
- [ ] All applications and packages have logger dependency added
- [ ] Console.log statements replaced with structured logging
- [ ] Appropriate log levels configured for each component
- [ ] User context and request tracking implemented
- [ ] Integration tested across all applications and packages
- [ ] Performance impact verified to be minimal
- [ ] Documentation updated with logging examples

## Success Metrics

- **Code Coverage**: 100% of console.log statements replaced
- **Performance Impact**: <5ms overhead for typical logging operations
- **Developer Adoption**: Easy integration and consistent usage patterns
- **Log Quality**: Structured, searchable logs for production debugging
- **Maintenance**: Reduced time spent on log-related issues

## Implementation Plan

### Week 1: Foundation & First Implementation

- [x] Logger package already exists and is functional
- [ ] Add logger dependency to all package.json files
- [ ] Start with one application (teamhub) as proof of concept
- [ ] Identify and categorize console.log statements

### Week 2: Core Applications Implementation

- [ ] Complete teamhub application logging implementation
- [ ] Implement logging in ai-gateway application
- [ ] Add user context and request tracking
- [ ] Test logging functionality and performance

### Week 3: Packages & Final Integration

- [ ] Implement logging in all packages
- [ ] Configure appropriate log levels for each component
- [ ] Performance testing and optimization
- [ ] Update documentation and create migration guide

## Notes

- Consider integration with existing monitoring tools (Sentry, etc.)
- Ensure logging doesn't expose sensitive information
- Plan for log retention and storage policies
- Consider real-time log streaming for development
