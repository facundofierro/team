# AI Gateway

The AI Gateway provides a unified interface to interact with various AI models from different providers. It abstracts away the provider-specific details, allowing you to call any model using a single, consistent API endpoint.

## API Endpoint

### `POST /api/generate`

This is the primary endpoint for all AI model interactions. It routes requests to the appropriate downstream AI service based on the `provider` specified in the request body.

## Request Body

The request body should be a JSON object with the following parameters:

- `provider` (string, required): The service provider to use. This can be a direct provider like `openai` or an aggregator like `eden`.
- `model` (string, required): The specific model or capability you want to use. The format of this field depends on the `provider`.
- `feature` (string, required): The general capability of the model (e.g., `llm`, `image`, `audio`).
- `subfeature` (string, required): The specific task to perform (e.g., `chat`, `generation`, `text_to_speech`).
- `featureOptions` (object, optional): Provider-specific options, such as `streaming` or `json` mode.
- `input` (object, required): The input payload for the model, which varies depending on the feature. For example, for a chat model, this would contain the `messages` array.

---

## How it Works

The gateway uses a `provider` parameter to determine where to send the request.

### 1. Direct Provider Example (OpenAI)

When you want to use a provider directly, you specify them as the `provider` and pass one of their specific model names.

**Example**: Using `gpt-4o` directly through OpenAI.

```bash
curl -X POST http://localhost:3000/api/generate \\
-H "Content-Type: application/json" \\
-d '{
  "provider": "openai",
  "model": "gpt-4o",
  "feature": "llm",
  "subfeature": "chat",
  "input": {
    "messages": [
      { "role": "user", "content": "Explain the importance of fasting" }
    ]
  }
}'
```

### 2. Aggregator Provider Example (Eden AI)

When using an aggregator like Eden AI, you set `provider: "eden"`. The `model` parameter is then used to specify which of Eden AI's underlying providers and subfeatures you want to access. The format is typically `{underlying_provider}/{subfeature}`.

This allows you to access, for example, OpenAI's models _through_ Eden AI's service.

**Example**: Using OpenAI's chat feature via Eden AI.

```bash
curl -X POST http://localhost:3000/api/generate \\
-H "Content-Type: application/json" \\
-d '{
  "provider": "eden",
  "model": "openai/chat",
  "feature": "llm",
  "subfeature": "chat",
  "input": {
    "messages": [
      { "role": "user", "content": "Explain the importance of fasting" }
    ]
  }
}'
```

This approach provides the flexibility to switch between direct access and aggregated access without changing the core API interaction.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
