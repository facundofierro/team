import { db } from './db'
import * as schema from './db/schema'

export enum Feature {
  Unknown = 'unknown',
  Embeddings = 'embeddings',
  SpeechToText = 'speech-to-text',
  TextToSpeech = 'text-to-speech',
  FaceDetection = 'face-detection',
  LogoDetection = 'logo-detection',
  ObjectDetection = 'object-detection',
  EntitySentimentAnalysis = 'entity-sentiment-analysis',
  NamedEntityRecognition = 'named-entity-recognition',
  TopicExtraction = 'topic-extraction',
  Translation = 'translation',
  ExplicitContentDetection = 'explicit-content-detection',
  LabelDetection = 'label-detection',
  ObjectTracking = 'object-tracking',
  LandmarkDetection = 'landmark-detection',
  GeneralOCR = 'general-ocr',
  TableParser = 'table-parser',
  IntelligentChatbot = 'intelligent-chatbot',
  CodeGeneration = 'code-generation',
  TextGeneration = 'text-generation',
  DocumentTranslation = 'document-translation',
  LanguageDetection = 'language-detection',
  PeopleTracking = 'people-tracking',
  TextDetection = 'text-detection',
  TextModeration = 'text-moderation',
  VisualQuestionAnswering = 'visual-question-answering',
  FinancialDocuments = 'financial-documents',
  TextToImage = 'text-to-image',
  ChatAPI = 'chat-api',
  VideoGeneration = 'video-generation',
}

export interface FeatureOptions {
  streaming?: boolean
  json?: boolean
}

export interface ModelInfo {
  id: string
  features: Feature[]
  displayName: string
  provider: string
  model: string
  featureOptions?: Partial<Record<Feature, FeatureOptions>>
}

export async function getModelRegistry(): Promise<ModelInfo[]> {
  const modelsFromDb = await db.select().from(schema.models)

  // The database stores a single feature, so we wrap it in an array.
  // We can enhance this later if a model can have multiple features.
  return modelsFromDb.map((model) => ({
    id: model.id,
    displayName: model.displayName,
    provider: model.provider,
    model: model.model,
    features: [model.feature as Feature],
    // featureOptions are not stored in the new schema, default to empty
    featureOptions: {},
  }))
}
