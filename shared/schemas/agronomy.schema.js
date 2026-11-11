import { z } from 'zod';

export const CropSeverityEnum = z.enum(['MILD', 'MODERATE', 'SEVERE', 'CRITICAL', 'NONE']);
export const PathogenTypeEnum = z.enum([
  'Fungal',
  'Bacterial',
  'Viral',
  'Pest',
  'Nutritional Deficiency',
  'Physiological Disorder',
  'Healthy'
]);
export const IrrigationTypeEnum = z.enum(['DRIP', 'SPRINKLER', 'FLOOD', 'RAINFED', 'FURROW']);
export const SoilTextureEnum = z.enum(['SANDY', 'LOAMY', 'CLAY_LOAM', 'HEAVY_CLAY', 'SILT']);

// Diagnosis Request
export const DiagnosisRequestSchema = z.object({
  cropName: z.string().min(2, 'Crop name must be at least 2 characters').max(100),
  plotId: z.string().uuid('Invalid plot ID format').optional().nullable(),
  symptoms: z.string().max(1000).optional().default(''),
});

// Soil Test Input
export const SoilTestInputSchema = z.object({
  plotId: z.string().uuid().optional().nullable(),
  targetCrop: z.string().min(2, 'Target crop is required'),
  targetYieldTonnes: z.coerce.number().positive('Target yield must be positive'),
  soilPh: z.coerce.number().min(3.0, 'pH cannot be below 3.0').max(10.5, 'pH cannot exceed 10.5'),
  nitrogen: z.coerce.number().nonnegative('Nitrogen cannot be negative'),
  phosphorus: z.coerce.number().nonnegative('Phosphorus cannot be negative'),
  potassium: z.coerce.number().nonnegative('Potassium cannot be negative'),
  organicCarbon: z.coerce.number().min(0).max(10).optional().default(0.5),
  electricalConductivity: z.coerce.number().min(0).max(30).optional().default(0.5),
  soilTexture: SoilTextureEnum.default('LOAMY'),
});

// Farm Creation
export const FarmCreationSchema = z.object({
  name: z.string().min(2, 'Farm name required').max(120),
  locationName: z.string().min(2, 'Location name required'),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  totalAreaHectares: z.coerce.number().positive('Total area must be greater than 0'),
});

// Plot Creation
export const PlotCreationSchema = z.object({
  farmId: z.string().uuid('Valid Farm ID required'),
  name: z.string().min(1, 'Plot identifier required'),
  areaHectares: z.coerce.number().positive('Plot area must be positive'),
  currentCrop: z.string().min(2, 'Crop name required'),
  cropVariety: z.string().optional().default(''),
  sowingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format must be YYYY-MM-DD').optional(),
  irrigationType: IrrigationTypeEnum.default('DRIP'),
  soilTexture: SoilTextureEnum.default('LOAMY'),
});

// Chat Message Input
export const ChatMessageInputSchema = z.object({
  conversationId: z.string().uuid().optional(),
  plotId: z.string().uuid().optional().nullable(),
  message: z.string().min(1, 'Message cannot be empty').max(3000),
});

// AI Structured Output Schemas (for Gemini response validation)
export const DiagnosisOutputSchema = z.object({
  crop_detected: z.string(),
  is_plant_image: z.boolean(),
  confidence_score: z.number().min(0).max(1),
  diagnosis_title: z.string(),
  pathogen_type: PathogenTypeEnum,
  scientific_name: z.string().optional().default('N/A'),
  severity: CropSeverityEnum,
  affected_parts: z.array(z.string()).default([]),
  symptoms_identified: z.array(z.string()).default([]),
  triage_immediate_steps: z.array(z.string()).default([]),
  organic_biological_treatments: z.array(
    z.object({
      treatment_name: z.string(),
      preparation_and_dosage: z.string(),
      frequency_of_application: z.string()
    })
  ).default([]),
  chemical_treatments: z.array(
    z.object({
      active_ingredient: z.string(),
      commercial_formulation_example: z.string().optional().default('Standard formulated product'),
      dosage_per_liter: z.string(),
      dosage_per_hectare: z.string().optional().default('Refer to product label'),
      pre_harvest_interval_days: z.number().int().nonnegative().default(7),
      application_method: z.string().optional().default('Foliar spray')
    })
  ).default([]),
  preventive_cultural_practices: z.array(z.string()).default([]),
  safety_precautions: z.object({
    ppe_required: z.array(z.string()).default(['Gloves', 'Face Mask']),
    pollinator_warning: z.string().default('Apply in early morning or late evening when pollinators are not active.'),
    aquatic_toxicity_warning: z.string().optional().default('Avoid contamination of adjacent water bodies.')
  })
});

export const SoilAdvisoryOutputSchema = z.object({
  soil_status_summary: z.object({
    ph_rating: z.string(),
    nitrogen_status: z.string(),
    phosphorus_status: z.string(),
    potassium_status: z.string(),
    organic_carbon_rating: z.string().optional().default('Medium')
  }),
  soil_amendments: z.array(
    z.object({
      amendment_type: z.string(),
      quantity_kg_per_ha: z.number(),
      reason_and_method: z.string()
    })
  ).default([]),
  macronutrient_recommendation_kg_per_ha: z.object({
    total_pure_n: z.number(),
    total_pure_p2o5: z.number(),
    total_pure_k2o: z.number()
  }),
  fertilizer_schedule: z.array(
    z.object({
      growth_stage: z.string(),
      timing_days_after_sowing: z.number().int(),
      fertilizer_quantities: z.array(
        z.object({
          fertilizer_name: z.string(),
          amount_kg_per_ha: z.number()
        })
      ),
      application_instructions: z.string()
    })
  ),
  organic_manure_plan: z.object({
    recommended_manure_type: z.string(),
    quantity_tonnes_per_ha: z.number(),
    biofertilizer_recommendations: z.array(z.string()).default([])
  })
});

