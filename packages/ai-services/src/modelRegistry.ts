import { openaiModels } from './modelRegistry/openai'

export enum Feature {
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

export const ModelRegistry: ModelInfo[] = [...openaiModels]
