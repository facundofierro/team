import { db } from './db'
import * as schema from './db/schema'

export enum Feature {
  Audio = 'audio',
  Image = 'image',
  Llm = 'llm',
  Multimodal = 'multimodal',
  Ocr = 'ocr',
  Text = 'text',
  Translation = 'translation',
  Video = 'video',
}

export enum Subfeature {
  AiDetection = 'ai_detection',
  Anonymization = 'anonymization',
  AnonymizationAsync = 'anonymization_async',
  AutomlClassification = 'automl_classification',
  AutomaticTranslation = 'automatic_translation',
  BackgroundRemoval = 'background_removal',
  BankCheckParsing = 'bank_check_parsing',
  Chat = 'chat',
  CodeGeneration = 'code_generation',
  CustomClassification = 'custom_classification',
  CustomDocumentParsingAsync = 'custom_document_parsing_async',
  CustomNamedEntityRecognition = 'custom_named_entity_recognition',
  DataExtraction = 'data_extraction',
  DeepfakeDetection = 'deepfake_detection',
  DeepfakeDetectionAsync = 'deepfake_detection_async',
  DocumentTranslation = 'document_translation',
  Embeddings = 'embeddings',
  EmotionDetection = 'emotion_detection',
  EntitySentiment = 'entity_sentiment',
  ExplicitContent = 'explicit_content',
  ExplicitContentDetectionAsync = 'explicit_content_detection_async',
  FaceCompare = 'face_compare',
  FaceDetection = 'face_detection',
  FaceDetectionAsync = 'face_detection_async',
  FaceRecognition = 'face_recognition',
  FinancialParser = 'financial_parser',
  Generation = 'generation',
  GenerationAsync = 'generation_async',
  IdentityParser = 'identity_parser',
  InvoiceParser = 'invoice_parser',
  InvoiceSplitterAsync = 'invoice_splitter_async',
  KeywordExtraction = 'keyword_extraction',
  LabelDetectionAsync = 'label_detection_async',
  LandmarkDetection = 'landmark_detection',
  LanguageDetection = 'language_detection',
  LogoDetection = 'logo_detection',
  LogoDetectionAsync = 'logo_detection_async',
  Moderation = 'moderation',
  NamedEntityRecognition = 'named_entity_recognition',
  ObjectDetection = 'object_detection',
  ObjectTrackingAsync = 'object_tracking_async',
  Ocr = 'ocr',
  OcrAsync = 'ocr_async',
  OcrTablesAsync = 'ocr_tables_async',
  PersonTrackingAsync = 'person_tracking_async',
  PlagiaDetection = 'plagia_detection',
  PromptOptimization = 'prompt_optimization',
  QuestionAnswer = 'question_answer',
  QuestionAnswerAsync = 'question_answer_async',
  ReceiptParser = 'receipt_parser',
  ResumeParser = 'resume_parser',
  Search = 'search',
  SentimentAnalysis = 'sentiment_analysis',
  ShotChangeDetectionAsync = 'shot_change_detection_async',
  SpeechToTextAsync = 'speech_to_text_async',
  SpellCheck = 'spell_check',
  Summarize = 'summarize',
  SyntaxAnalysis = 'syntax_analysis',
  TextDetectionAsync = 'text_detection_async',
  TextToSpeech = 'text_to_speech',
  TextToSpeechAsync = 'text_to_speech_async',
  TopicExtraction = 'topic_extraction',
}

export interface Pricing {
  model_name?: string | null
  price: string
  price_unit_quantity: number
  min_price_quantity: number
  price_unit_type: string
  detail_type?: string | null
  detail_value?: string | null
}

export interface Language {
  language_code: string
  language_name: string
}

export interface FeatureOptions {
  default_model?: string | null
  version?: string
  pricings?: Pricing[]
  llm_details?: Record<string, any>
  constraints?: Record<string, any>
  languages?: Language[]
  description_title?: string | null
  description_content?: string
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
