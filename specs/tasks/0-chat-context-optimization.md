# Chat Context Optimization

**Status**: Planned
**Priority**: High
**Estimated Effort**: 2-3 weeks
**Dependencies**: None (leverages existing memory system and summarization)

## Description

Optimize chat context sent to AI models by implementing intelligent message limiting and leveraging conversation summarization. Currently, ALL previous messages in a conversation are sent to the AI on every request, leading to exponentially growing context size and costs. This task implements a smart context window with summarization fallback.

## Problem Analysis

### Current Issues

1. **Unbounded Context Growth**: Every chat request sends ALL previous messages to the AI
2. **Exponential Cost Increase**: Long conversations become increasingly expensive
3. **Performance Degradation**: Large context windows slow down response times
4. **Token Limit Risk**: Very long conversations may hit model token limits
5. **Inefficient Information Transfer**: Most context may not be relevant to current query

### Example Impact

- Conversation with 100 messages → 100 messages sent every time
- Each new message increases cost and latency for ALL subsequent messages
- No intelligent filtering based on relevance or recency

## Proposed Solution Strategy

### 1. **Context Window Implementation**

- **Recent Messages**: Send last 15-20 messages as immediate context
- **Conversation Summary**: Include AI-generated summary for older messages
- **Dynamic Adjustment**: Adjust window size based on message length and importance

### 2. **Leveraging Existing Infrastructure**

- **Conversation Summarization**: Already exists (`generateConversationBrief`)
- **Memory Search Tool**: Already available for specific information retrieval
- **Conversation Processing**: Already integrated in completion workflow

### 3. **Smart Context Strategy**

```
Recent Context (15-20 messages) + Conversation Summary + Memory Search = Optimal Context
```

## Technical Implementation

### Phase 1: Context Window (Week 1)

#### 1.1 Modify Request Preparation

**File**: `apps/teamhub/src/components/agents/agentDetails/ChatCard.tsx`

- Modify `experimental_prepareRequestBody` (line 251-268)
- Implement message filtering logic
- Add summary inclusion logic

```typescript
experimental_prepareRequestBody: ({ messages }) => {
  const contextWindow = buildOptimizedContext(messages, currentConversation)
  return {
    messages: contextWindow.messages,
    summary: contextWindow.summary,
    agentId: selectedAgent?.id,
    // ... rest of current implementation
  }
}
```

#### 1.2 Create Context Builder Function

**New File**: `apps/teamhub/src/lib/utils/contextOptimizer.ts`

- Implement `buildOptimizedContext` function
- Handle message window sizing
- Integrate conversation summaries
- Fallback strategies for edge cases

#### 1.3 Update Chat API

**File**: `apps/teamhub/src/app/api/chat/route.ts`

- Accept new `summary` parameter
- Pass summary to `sendChat` function

#### 1.4 Update sendChat Function

**File**: `packages/teamhub-ai/src/functions/sendChat.ts`

- Accept summary parameter
- Pass to `generateStreamText`

### Phase 2: Summary Integration (Week 2)

#### 2.1 Enhance generateStreamText

**File**: `packages/teamhub-ai/src/ai/vercel/generateStreamText.ts`

- Accept conversation summary parameter
- Include summary in system prompt context
- Format summary as background context

#### 2.2 Summary Message Formatting

Create structured context combining:

```typescript
interface OptimizedContext {
  summaryMessage?: {
    role: 'system'
    content: `Previous conversation summary: ${summary}`
  }
  recentMessages: Message[]
  totalTokenEstimate: number
}
```

#### 2.3 Conversation Summary Access

**File**: `apps/teamhub/src/lib/actions/conversation.ts`

- Add function to retrieve conversation summary
- Handle cases where summary doesn't exist yet
- Fallback to older messages if needed

### Phase 3: Dynamic Optimization (Week 3)

#### 3.1 Smart Window Sizing

- **Message Length Analysis**: Longer messages = smaller window
- **Token Estimation**: Keep total context under optimal size
- **Importance Weighting**: Prioritize messages with tool calls or key information

#### 3.2 Memory Search Integration

- **Automatic Relevance Search**: When context is truncated, search for relevant memories
- **User-Triggered Search**: Allow manual memory search for specific topics
- **Context Augmentation**: Add relevant memories to context when helpful

#### 3.3 Performance Monitoring

- **Context Size Tracking**: Monitor token usage and response times
- **Summary Quality**: Track when memory search is needed due to missing context
- **Cost Analysis**: Measure context optimization savings

## Configuration Parameters

### Context Window Settings

```typescript
interface ContextConfig {
  maxRecentMessages: number // Default: 20
  maxTokensPerRequest: number // Default: 8000
  summaryTokenBudget: number // Default: 500
  enableMemoryAugmentation: boolean // Default: true
  forceFullContext: boolean // Default: false (for debugging)
}
```

### Per-Agent Customization

- Different agents may need different context strategies
- Research agents might need larger context
- Task-focused agents might need smaller, focused context

## Database Schema Changes

**No schema changes required** - leverages existing conversation and memory tables.

### Potential Enhancement

```sql
-- Optional: Add context optimization metadata
ALTER TABLE conversation_memories
ADD COLUMN last_summary_at TIMESTAMP,
ADD COLUMN context_strategy VARCHAR(50) DEFAULT 'auto';
```

## Involved Files

### Primary Files (Must Modify)

1. **`apps/teamhub/src/components/agents/agentDetails/ChatCard.tsx`**

   - Lines 251-268: `experimental_prepareRequestBody`
   - Add context optimization logic

2. **`apps/teamhub/src/app/api/chat/route.ts`**

   - Lines 29-30: Request parameter handling
   - Add summary parameter support

3. **`packages/teamhub-ai/src/functions/sendChat.ts`**

   - Lines 18-26: Function parameters
   - Lines 50-56: `generateStreamText` call
   - Add summary passing

4. **`packages/teamhub-ai/src/ai/vercel/generateStreamText.ts`**
   - Lines 28-35: Function parameters
   - Lines 84-129: Message preparation
   - Add summary integration

### New Files to Create

5. **`apps/teamhub/src/lib/utils/contextOptimizer.ts`**

   - Core context optimization logic
   - Message window management
   - Summary integration

6. **`apps/teamhub/src/lib/utils/tokenEstimator.ts`**
   - Token counting utilities
   - Context size estimation
   - Performance monitoring

### Supporting Files (Context)

7. **`packages/teamhub-ai/src/functions/generateConversationBrief.ts`**

   - Lines 278-447: `generateConversationBrief` function
   - Already exists - leverage for summaries

8. **`packages/teamhub-ai/src/tools/memorySearch.ts`**

   - Lines 47-414: Memory search implementation
   - Already exists - leverage for context augmentation

9. **`apps/teamhub/src/lib/actions/conversation.ts`**
   - Lines 141-189: `completeConversation` function
   - May need to trigger summary generation more proactively

## Acceptance Criteria

### Functional Requirements

- [ ] **Context Limiting**: Maximum 20 recent messages sent to AI by default
- [ ] **Summary Integration**: Conversation summaries included when available
- [ ] **Backward Compatibility**: System works for conversations without summaries
- [ ] **Memory Fallback**: Memory search tool remains available for specific queries
- [ ] **Performance**: No degradation in chat response quality
- [ ] **Cost Reduction**: Measurable reduction in token usage for long conversations

### Technical Requirements

- [ ] **Configurable**: Context window size configurable per agent/organization
- [ ] **Monitoring**: Context size and optimization metrics logged
- [ ] **Error Handling**: Graceful fallback when optimization fails
- [ ] **Testing**: Unit tests for context optimization logic
- [ ] **Documentation**: Clear documentation of optimization strategy

### Quality Assurance

- [ ] **A/B Testing**: Compare optimized vs full context for quality
- [ ] **Edge Cases**: Handle very short conversations gracefully
- [ ] **Memory Integration**: Verify memory search still works effectively
- [ ] **Summary Quality**: Ensure summaries provide adequate context

## Expected Benefits

### Performance Improvements

- **40-60% Reduction** in context size for conversations >30 messages
- **Faster Response Times** due to smaller context processing
- **Cost Savings** proportional to context reduction
- **Scalability** for very long conversations

### User Experience

- **Consistent Performance** regardless of conversation length
- **Maintained Quality** through intelligent summarization
- **Better Memory Utilization** through integrated search
- **No Breaking Changes** for existing workflows

## Risk Mitigation

### Context Quality Risks

- **A/B Testing**: Compare response quality before/after optimization
- **Gradual Rollout**: Start with longer conversations first
- **Fallback Option**: Allow full context for critical conversations
- **Memory Search**: Leverage existing memory tools when context is insufficient

### Technical Risks

- **Summary Dependencies**: Ensure conversation completion reliably generates summaries
- **Token Estimation**: Account for model-specific token counting differences
- **Edge Cases**: Handle conversations without summaries gracefully

## Future Enhancements

### Phase 4: Advanced Optimization (Future)

- **Semantic Relevance**: Use embeddings to select most relevant messages
- **Dynamic Context**: Adjust context based on query type and complexity
- **Multi-Agent Context**: Optimize context for agent-to-agent communications
- **Conversation Clustering**: Group related conversation topics for better summarization

### Integration Opportunities

- **Analytics**: Track context optimization effectiveness
- **User Controls**: Allow users to adjust context preferences
- **Agent Profiles**: Different context strategies per agent type
- **Organization Policies**: Context optimization rules per organization

## Testing Strategy

### Unit Tests

- Context optimization logic
- Token estimation accuracy
- Summary integration
- Edge case handling

### Integration Tests

- Full chat flow with optimization
- Memory search integration
- Summary generation timing
- Error recovery scenarios

### Performance Tests

- Context size impact on response times
- Token usage reduction measurements
- Memory search effectiveness
- Long conversation handling

## Success Metrics

### Quantitative

- **Context Size Reduction**: Target 50% reduction for conversations >30 messages
- **Response Time**: Maintain or improve current response times
- **Cost Reduction**: Measurable reduction in AI API costs
- **Memory Search Usage**: Stable or increased usage indicating good fallback

### Qualitative

- **Response Quality**: No degradation in chat quality
- **User Satisfaction**: Maintained user experience
- **Developer Experience**: Clean, maintainable implementation
- **System Reliability**: Robust error handling and fallbacks

---

**Last Updated**: December 2024
**Assigned**: Development Team
**Next Review**: January 2025
