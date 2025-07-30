# LLM Selection in Chat via AI Gateway

**Status**: Planned
**Priority**: Medium
**Estimated Effort**: 2-3 weeks
**Dependencies**: None

## Description

Allow users to choose which Large Language Model (LLM) to use during chat conversations with agents by integrating with the existing ai-gateway deployed at Vercel instead of direct LLM calls from the teamhub application.

## Current Architecture

- TeamHub app calls `/api/chat` → `sendChat` → `generateStreamText` (direct provider calls)
- AI Gateway deployed at Vercel with `/api/generate` endpoint supporting multiple providers
- Available providers: OpenAI, DeepSeek, Fal, Eden AI
- Model registry stored in database with pricing and capability information

## Requirements

### Frontend Components

- **LLM Selector Component**: Dropdown/select component in chat interface using shadcn/ui
- **Model Information Display**: Show model capabilities, context length, pricing per token
- **Per-Conversation Model**: Ability to switch LLMs mid-conversation
- **Model Status Indicators**: Show model availability, response time estimates
- **Default Model Configuration**: Organization and agent-level default LLM settings

### Backend Integration

- **AI Gateway Integration**: Replace direct LLM calls with ai-gateway API calls
- **Streaming Support**: Maintain streaming responses through ai-gateway
- **Model Registry API**: Expose available models from database
- **User Preferences**: Store user/organization LLM preferences
- **Cost Tracking**: Track LLM usage and costs per model/organization

### Database Schema Updates

- **User LLM Preferences**: Table to store preferred models per user/organization
- **Conversation Model Tracking**: Track which model was used for each conversation
- **Usage Analytics**: Log model usage for billing and analytics

## Technical Implementation

### Phase 1: AI Gateway Integration (Week 1)

```typescript
// Update sendChat function to use ai-gateway
const response = await fetch(`${AI_GATEWAY_URL}/api/generate`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${AI_GATEWAY_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    provider: selectedProvider, // 'openai', 'deepseek', 'fal', 'eden'
    model: selectedModel,
    feature: 'llm',
    subfeature: 'chat',
    featureOptions: {
      streaming: true,
      json: false,
    },
    input: {
      messages: messages,
      systemPrompt: agent.systemPrompt,
      tools: tools,
    },
  }),
})
```

### Phase 2: Frontend LLM Selector (Week 1-2)

```typescript
// New component: ModelSelector
interface ModelSelectorProps {
  selectedModel: string
  onModelChange: (model: string, provider: string) => void
  availableModels: ModelInfo[]
}

// Integration in ChatCard
const [selectedModel, setSelectedModel] = useState<{
  provider: string
  model: string
  displayName: string
}>()
```

### Phase 3: Configuration & Preferences (Week 2-3)

- Database migrations for user preferences
- Organization-level model restrictions
- Cost tracking and billing integration
- Analytics dashboard for model usage

## API Changes

### New Endpoints

- `GET /api/models` - Get available models from registry
- `GET /api/users/preferences/llm` - Get user LLM preferences
- `POST /api/users/preferences/llm` - Update user LLM preferences
- `GET /api/organizations/[id]/models` - Get org-allowed models

### Modified Endpoints

- `POST /api/chat` - Accept additional `provider` and `model` parameters
- Update conversation storage to include model information

## Database Schema

```sql
-- User LLM preferences
CREATE TABLE user_llm_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL,
  organization_id VARCHAR NOT NULL,
  preferred_provider VARCHAR NOT NULL,
  preferred_model VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Conversation model tracking
ALTER TABLE conversation_memories
ADD COLUMN model_provider VARCHAR,
ADD COLUMN model_name VARCHAR,
ADD COLUMN estimated_cost DECIMAL(10,6);

-- Model usage analytics
CREATE TABLE model_usage_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id VARCHAR NOT NULL,
  user_id VARCHAR NOT NULL,
  provider VARCHAR NOT NULL,
  model VARCHAR NOT NULL,
  tokens_used INTEGER NOT NULL,
  estimated_cost DECIMAL(10,6),
  conversation_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Component Design

### ModelSelector Component

```typescript
<Select value={selectedModel} onValueChange={handleModelChange}>
  <SelectTrigger className="w-[280px]">
    <SelectValue placeholder="Select LLM model..." />
  </SelectTrigger>
  <SelectContent>
    {availableModels.map((model) => (
      <SelectItem key={model.id} value={model.id}>
        <div className="flex items-center justify-between w-full">
          <div>
            <span className="font-medium">{model.displayName}</span>
            <Badge variant="outline" className="ml-2">
              {model.provider}
            </Badge>
          </div>
          <span className="text-sm text-muted-foreground">
            ${model.pricing?.price}/{model.pricing?.price_unit_type}
          </span>
        </div>
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

## Acceptance Criteria

- [ ] AI Gateway integration replaces direct LLM calls
- [ ] LLM selector component in chat interface
- [ ] Streaming responses work through AI Gateway
- [ ] Model information display (pricing, capabilities)
- [ ] User preferences for default models
- [ ] Organization-level model restrictions
- [ ] Conversation tracking includes model used
- [ ] Cost estimation and usage analytics
- [ ] Dynamic model switching during conversations
- [ ] Error handling for unavailable models
- [ ] Loading states during model switching

## Testing Requirements

- [ ] Unit tests for AI Gateway integration
- [ ] E2E tests for model selection flow
- [ ] Performance tests for streaming through gateway
- [ ] Cost calculation accuracy tests
- [ ] Error handling tests for gateway failures

## Security Considerations

- **API Key Management**: Secure storage of AI Gateway API key
- **Rate Limiting**: Implement per-organization rate limits
- **Model Access Control**: Enforce organization model restrictions
- **Cost Monitoring**: Prevent excessive usage and billing

## Deployment Notes

- **Environment Variables**: `AI_GATEWAY_URL`, `AI_GATEWAY_API_KEY`
- **Database Migrations**: Run schema updates before deployment
- **Feature Flags**: Consider gradual rollout with feature flags
- **Monitoring**: Add metrics for gateway response times and error rates

## Future Enhancements

- **Custom Models**: Support for organization-specific fine-tuned models
- **Model Routing**: Intelligent routing based on query complexity
- **A/B Testing**: Compare model performance for specific use cases
- **Cost Optimization**: Automatic model selection based on budget constraints
