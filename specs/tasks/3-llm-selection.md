# LLM Selection in Chat

**Status**: Planned
**Priority**: Medium
**Estimated Effort**: 1-2 weeks
**Dependencies**: None

## Description

Allow users to choose which Large Language Model (LLM) to use during chat conversations with agents.

## Requirements

- **LLM Selection Interface**: Dropdown or selector in chat interface
- **Per-Conversation LLM**: Ability to switch LLMs mid-conversation
- **Available Models Display**: Show available models with capabilities and pricing
- **Default LLM Settings**: Organization and agent-level default LLM configuration
- **Model Capabilities**: Display model-specific features (context length, specializations)

## Technical Implementation

- Update chat interface with LLM selector
- Modify conversation handling to support dynamic LLM selection
- Integration with existing multi-provider AI services
- Configuration management for model availability

## Acceptance Criteria

- [ ] LLM selector in chat interface
- [ ] Dynamic model switching during conversations
- [ ] Model information display
- [ ] Default model configuration

## Notes

- Leverages existing multi-provider AI services infrastructure
- Should integrate with current shadcn/ui components
- Consider cost implications for organizations
