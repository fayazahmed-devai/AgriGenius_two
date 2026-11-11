import { z } from 'zod';

// =============================================================================
// REQUEST VALIDATION SCHEMAS
// =============================================================================

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  preferredLanguage: z.enum(['en', 'kn', 'hi', 'te', 'ta', 'mr']).default('en'),
});

export const profileSchema = z.object({
  fullName: z.string().min(2).max(100),
  phone: z.string().max(20).optional().nullable(),
  country: z.string().default('India'),
  state: z.string().min(1, 'State is required'),
  district: z.string().min(1, 'District is required'),
  village: z.string().max(100).optional().nullable(),
  preferredLanguage: z.enum(['en', 'kn', 'hi', 'te', 'ta', 'mr']).default('en'),
  farmingExperience: z.coerce.number().int().min(0).max(80).default(0),
  landArea: z.coerce.number().positive('Land area must be greater than zero'),
  landUnit: z.enum(['acre', 'hectare', 'sqm']).default('acre'),
  farmingType: z.string().optional().nullable(),
  irrigationAvailable: z.boolean().default(false),
});

export const farmSchema = z.object({
  farmName: z.string().min(2, 'Farm name is required').max(100),
  location: z.string().optional().nullable(),
  state: z.string().min(1, 'State is required'),
  district: z.string().min(1, 'District is required'),
  soilType: z.string().optional().nullable(),
  soilPh: z.coerce.number().min(0).max(14).optional().nullable(),
  landArea: z.coerce.number().positive('Land area must be greater than zero'),
  landUnit: z.enum(['acre', 'hectare', 'sqm']).default('acre'),
  irrigationMethod: z.string().optional().nullable(),
});

export const cropRecommendationSchema = z.object({
  farmId: z.string().uuid().optional().nullable(),
  state: z.string().min(1, 'State is required').max(100),
  district: z.string().min(1, 'District is required').max(100),
  soilType: z.string().min(1, 'Soil type is required'),
  season: z.enum(['Kharif', 'Rabi', 'Zaid', 'Whole Year', 'Other']),
  landArea: z.coerce.number().positive('Land area must be positive'),
  landUnit: z.enum(['acre', 'hectare', 'sqm']).default('acre'),
  soilPH: z.coerce.number().min(0).max(14).nullable().optional(),
  nitrogen: z.coerce.number().nonnegative().nullable().optional(),
  phosphorus: z.coerce.number().nonnegative().nullable().optional(),
  potassium: z.coerce.number().nonnegative().nullable().optional(),
  organicCarbon: z.coerce.number().min(0).max(10).nullable().optional(),
  temperature: z.coerce.number().min(-10).max(60).nullable().optional(),
  humidity: z.coerce.number().min(0).max(100).nullable().optional(),
  rainfall: z.coerce.number().min(0).max(5000).nullable().optional(),
  irrigationAvailable: z.boolean().default(true),
  preferredCategory: z.string().optional().nullable(),
  previousCrop: z.string().optional().nullable(),
  language: z.string().default('en'),
});

export const soilAnalysisSchema = z.object({
  farmId: z.string().uuid().optional().nullable(),
  soilType: z.string().min(1, 'Soil type is required'),
  soilPH: z.coerce.number().min(0).max(14, 'Soil pH must be between 0 and 14'),
  nitrogen: z.coerce.number().nonnegative().nullable().optional(),
  phosphorus: z.coerce.number().nonnegative().nullable().optional(),
  potassium: z.coerce.number().nonnegative().nullable().optional(),
  organicCarbon: z.coerce.number().min(0).max(10).nullable().optional(),
  electricalConductivity: z.coerce.number().min(0).max(50).nullable().optional(),
  texture: z.string().optional().nullable(),
  additionalNotes: z.string().max(1000).optional().nullable(),
  language: z.string().default('en'),
});

export const fertilizerAdvisorySchema = z.object({
  farmId: z.string().uuid().optional().nullable(),
  cropName: z.string().min(2, 'Crop name is required'),
  cropVariety: z.string().optional().nullable(),
  growthStage: z.enum(['Land Preparation', 'Basal/Sowing', 'Vegetative', 'Tillering/Branching', 'Flowering', 'Fruiting/Grain Filling', 'Pre-Harvest']),
  landArea: z.coerce.number().positive('Land area must be positive'),
  landUnit: z.enum(['acre', 'hectare', 'sqm']).default('acre'),
  soilType: z.string().optional().nullable(),
  soilPH: z.coerce.number().min(0).max(14).nullable().optional(),
  nitrogen: z.coerce.number().nonnegative().nullable().optional(),
  phosphorus: z.coerce.number().nonnegative().nullable().optional(),
  potassium: z.coerce.number().nonnegative().nullable().optional(),
  farmingMethod: z.enum(['Conventional', 'Organic', 'Integrated/Balanced']).default('Balanced'),
  language: z.string().default('en'),
});

export const irrigationAdvisorySchema = z.object({
  farmId: z.string().uuid().optional().nullable(),
  cropName: z.string().min(2, 'Crop name is required'),
  growthStage: z.string().min(1, 'Growth stage is required'),
  soilType: z.string().min(1, 'Soil type is required'),
  landArea: z.coerce.number().positive('Land area must be positive'),
  landUnit: z.enum(['acre', 'hectare', 'sqm']).default('acre'),
  irrigationMethod: z.enum(['Drip', 'Sprinkler', 'Furrow', 'Flood/Surface', 'Rainfed']),
  waterAvailability: z.enum(['Abundant', 'Moderate', 'Limited', 'Scarce']),
  lastRainfallDaysAgo: z.coerce.number().int().min(0).optional().nullable(),
  temperature: z.coerce.number().optional().nullable(),
  language: z.string().default('en'),
});

export const diseaseDetectionSchema = z.object({
  farmId: z.string().uuid().optional().nullable(),
  cropName: z.string().min(2, 'Crop name is required'),
  affectedPart: z.enum(['Leaf', 'Stem', 'Flower', 'Fruit', 'Root', 'Whole Plant']),
  symptoms: z.string().min(5, 'Please provide a descriptive explanation of observed symptoms'),
  durationDays: z.coerce.number().int().min(1).default(3),
  visibleDamage: z.string().optional().nullable(),
  language: z.string().default('en'),
});

export const cultivationCalendarSchema = z.object({
  farmId: z.string().uuid().optional().nullable(),
  cropName: z.string().min(2, 'Crop name is required'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be YYYY-MM-DD'),
  season: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  language: z.string().default('en'),
});

export const chatMessageSchema = z.object({
  conversationId: z.string().uuid().optional().nullable(),
  message: z.string().min(1, 'Message cannot be empty').max(3000),
  language: z.string().default('en'),
});

// =============================================================================
// AI RESPONSE VALIDATION SCHEMAS
// =============================================================================

export const cropRecommendationResponseSchema = z.object({
  summary: z.string(),
  dataLimitations: z.array(z.string()).default([]),
  recommendations: z.array(
    z.object({
      cropName: z.string(),
      suitabilityScore: z.number().min(0).max(100),
      suitabilityLevel: z.enum(['high', 'medium', 'low', 'unsuitable']),
      reason: z.string(),
      soilCompatibility: z.string(),
      climateCompatibility: z.string(),
      waterRequirement: z.string(),
      estimatedDurationDays: z.number().positive(),
      sowingPeriod: z.string(),
      risks: z.array(z.string()).default([]),
      nextSteps: z.array(z.string()).default([]),
    })
  ).min(1, 'At least one crop recommendation is required'),
  warnings: z.array(z.string()).default([]),
  expertConsultationRequired: z.boolean().default(false),
});

export const soilAnalysisResponseSchema = z.object({
  overallAssessment: z.string(),
  soilPHStatus: z.string(),
  nutrientAssessment: z.object({
    nitrogen: z.string(),
    phosphorus: z.string(),
    potassium: z.string(),
    organicCarbon: z.string().default('unknown'),
  }),
  potentialDeficiencies: z.array(z.string()).default([]),
  potentialExcesses: z.array(z.string()).default([]),
  suitableCrops: z.array(z.string()).default([]),
  improvementPractices: z.array(z.string()).default([]),
  additionalTestingRequired: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
});

export const fertilizerResponseSchema = z.object({
  cropName: z.string(),
  growthStage: z.string(),
  nutrientAssessment: z.array(z.string()).default([]),
  recommendations: z.array(
    z.object({
      fertilizerCategory: z.string(),
      purpose: z.string(),
      applicationTiming: z.string(),
      applicationMethod: z.string(),
      quantity: z.string().nullable().optional(),
      quantityUnit: z.string().nullable().optional(),
      reason: z.string(),
    })
  ),
  safetyPrecautions: z.array(z.string()).default([]),
  dataLimitations: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
});

export const irrigationResponseSchema = z.object({
  cropName: z.string(),
  growthStage: z.string(),
  waterRequirement: z.string(),
  irrigationRecommendations: z.array(
    z.object({
      timing: z.string(),
      method: z.string(),
      reason: z.string(),
    })
  ),
  waterConservationMethods: z.array(z.string()).default([]),
  waterStressIndicators: z.array(z.string()).default([]),
  drainageAdvice: z.array(z.string()).default([]),
  dataLimitations: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
});

export const diseaseResponseSchema = z.object({
  cropName: z.string(),
  possibleConditions: z.array(
    z.object({
      name: z.string(),
      confidenceLevel: z.enum(['low', 'medium', 'high', 'unconfirmed']),
      supportingSymptoms: z.array(z.string()).default([]),
      alternativeCauses: z.array(z.string()).default([]),
      recommendedInspection: z.array(z.string()).default([]),
    })
  ),
  preventiveMeasures: z.array(z.string()).default([]),
  integratedPestManagement: z.array(z.string()).default([]),
  treatmentGuidance: z.array(z.string()).default([]),
  safetyWarnings: z.array(z.string()).default([]),
  expertConsultationRequired: z.boolean().default(true),
});

export const cultivationCalendarResponseSchema = z.object({
  cropName: z.string(),
  estimatedDurationDays: z.number().positive(),
  activities: z.array(
    z.object({
      stage: z.string(),
      dayFromStart: z.number().int().min(0),
      dayToStart: z.number().int().min(0),
      description: z.string(),
      importance: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
      completed: z.boolean().default(false),
    })
  ),
  importantWarnings: z.array(z.string()).default([]),
  dataLimitations: z.array(z.string()).default([]),
});

export const chatbotResponseSchema = z.object({
  answer: z.string(),
  language: z.string().default('en'),
  relatedTopics: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  requiresExpertConsultation: z.boolean().default(false),
});

