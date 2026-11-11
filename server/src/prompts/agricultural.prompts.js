/**
 * AgroAI Core System Instruction and Domain-Specific Prompt Builders
 */

export const AGRO_SYSTEM_PROMPT = `
You are AgroAI, an intelligent agricultural advisory assistant designed to provide practical, understandable, and responsible agricultural guidance to farmers.
Your primary objective is to help farmers make better agricultural decisions using the information they provide.

You possess deep knowledge of:
- Crop selection & agro-ecological zoning
- Soil science, nutrient stoichiometry, and soil health management
- Crop nutrition & balanced fertilizer application (NPK, secondary & micronutrients)
- Water management, evapotranspiration, and precision irrigation
- Plant pathology, foliar and soil-borne diseases, bacterial/viral/fungal agents
- Agricultural entomology & Integrated Pest Management (IPM)
- Crop cultivation schedules from land preparation to harvest
- Sustainable, regenerative, and organic farming techniques
- Agricultural risk mitigation

CORE RULES:
1. Always analyze the provided information before making recommendations.
2. Never invent missing soil measurements or local weather conditions. If data is missing, state it clearly.
3. Clearly distinguish measured/verified information from estimates.
4. Explain recommendations in simple, farmer-friendly language.
5. Provide responses in the farmer's selected language (e.g., Kannada, Hindi, English).
6. Prioritize regionally appropriate agricultural practices (especially for Indian states/districts, Kharif/Rabi/Zaid seasons).
7. Always explain WHY a crop or agricultural practice is recommended.
8. Never guarantee crop yield, financial returns, or 100% cure.
9. Never claim an uncertain disease diagnosis is confirmed from an unclear photo or brief description.
10. Never recommend unsafe pesticide combinations or fabricate chemical dosages. Emphasize organic and IPM practices first.
11. Recommend official soil testing laboratories and local Krishi Vigyan Kendra (KVK) / agricultural extension officers for critical issues.
12. Use metric units (acres/hectares, kg, litres, °C, mm).
13. Output valid, raw JSON conforming strictly to the requested schema. No surrounding markdown backticks or conversational filler outside the JSON.
`;

export function buildCropRecommendationPrompt(data, language = 'en') {
  return `
Analyze the following agricultural input data and provide crop recommendations:
- State: ${data.state}
- District: ${data.district}
- Soil Type: ${data.soilType}
- Current Season: ${data.season}
- Land Area: ${data.landArea} ${data.landUnit}
- Irrigation Available: ${data.irrigationAvailable ? 'Yes' : 'No'}
- Soil pH: ${data.soilPH ?? 'Not provided'}
- Available Nitrogen (N): ${data.nitrogen ? data.nitrogen + ' kg/ha' : 'Not provided'}
- Available Phosphorus (P): ${data.phosphorus ? data.phosphorus + ' kg/ha' : 'Not provided'}
- Available Potassium (K): ${data.potassium ? data.potassium + ' kg/ha' : 'Not provided'}
- Organic Carbon: ${data.organicCarbon ? data.organicCarbon + '%' : 'Not provided'}
- Temperature: ${data.temperature ? data.temperature + '°C' : 'Not provided'}
- Humidity: ${data.humidity ? data.humidity + '%' : 'Not provided'}
- Rainfall: ${data.rainfall ? data.rainfall + ' mm' : 'Not provided'}
- Preferred Category: ${data.preferredCategory ?? 'Any'}
- Previous Crop: ${data.previousCrop ?? 'None'}
- Target Response Language: ${language}

Generate a comprehensive recommendation report strictly adhering to this JSON structure:
{
  "summary": "Overall agricultural suitability summary in ${language}",
  "dataLimitations": ["List missing variables that would improve accuracy"],
  "recommendations": [
    {
      "cropName": "Crop name",
      "suitabilityScore": 85,
      "suitabilityLevel": "high", // "high", "medium", "low", or "unsuitable"
      "reason": "Detailed explanation why this crop fits this soil, season, and district",
      "soilCompatibility": "Compatibility explanation",
      "climateCompatibility": "Climate explanation",
      "waterRequirement": "Water need explanation",
      "estimatedDurationDays": 120,
      "sowingPeriod": "Recommended sowing window for this region",
      "risks": ["Risk factors like pest vulnerability or frost"],
      "nextSteps": ["Immediate action items for the farmer"]
    }
  ],
  "warnings": ["Agricultural caveats, soil testing advice"],
  "expertConsultationRequired": false
}
Provide at least 3 viable crop options ranked by suitability.
`;
}

export function buildSoilAnalysisPrompt(data, language = 'en') {
  return `
Analyze this soil health information and generate a fertility report:
- Soil Type: ${data.soilType}
- Soil pH: ${data.soilPH}
- Available Nitrogen: ${data.nitrogen !== undefined && data.nitrogen !== null ? data.nitrogen + ' kg/ha or ppm' : 'Not measured'}
- Available Phosphorus: ${data.phosphorus !== undefined && data.phosphorus !== null ? data.phosphorus + ' kg/ha or ppm' : 'Not measured'}
- Available Potassium: ${data.potassium !== undefined && data.potassium !== null ? data.potassium + ' kg/ha or ppm' : 'Not measured'}
- Organic Carbon: ${data.organicCarbon !== undefined && data.organicCarbon !== null ? data.organicCarbon + '%' : 'Not measured'}
- Electrical Conductivity: ${data.electricalConductivity !== undefined && data.electricalConductivity !== null ? data.electricalConductivity + ' dS/m' : 'Not measured'}
- Soil Texture: ${data.texture ?? 'Not specified'}
- Additional Observations: ${data.additionalNotes ?? 'None'}
- Target Language: ${language}

Return strictly this JSON schema:
{
  "overallAssessment": "Thorough assessment of soil condition in ${language}",
  "soilPHStatus": "Acidic / Neutral / Alkaline with implications",
  "nutrientAssessment": {
    "nitrogen": "Deficient / Medium / Sufficient / Not measured",
    "phosphorus": "Deficient / Medium / Sufficient / Not measured",
    "potassium": "Deficient / Medium / Sufficient / Not measured",
    "organicCarbon": "Low / Medium / High / Not measured"
  },
  "potentialDeficiencies": ["Specific deficiencies identified"],
  "potentialExcesses": ["Specific nutrient excesses or salinity risks"],
  "suitableCrops": ["Crops naturally compatible with this soil state"],
  "improvementPractices": ["Step-by-step soil conditioning, liming/gypsum, organic compost, green manuring"],
  "additionalTestingRequired": ["Recommended lab tests (e.g., micronutrients Zinc, Boron)"],
  "warnings": ["Agricultural soil warnings"]
}
`;
}

export function buildFertilizerAdvisoryPrompt(data, language = 'en') {
  return `
Generate balanced fertilizer and crop nutrition recommendations:
- Crop: ${data.cropName}
- Variety: ${data.cropVariety ?? 'Standard variety'}
- Growth Stage: ${data.growthStage}
- Land Area: ${data.landArea} ${data.landUnit}
- Soil Type: ${data.soilType ?? 'Not specified'}
- Soil pH: ${data.soilPH ?? 'Not tested'}
- Nitrogen (N): ${data.nitrogen ?? 'Not tested'}
- Phosphorus (P): ${data.phosphorus ?? 'Not tested'}
- Potassium (K): ${data.potassium ?? 'Not tested'}
- Preferred Farming Method: ${data.farmingMethod}
- Language: ${language}

Return strictly this JSON schema:
{
  "cropName": "${data.cropName}",
  "growthStage": "${data.growthStage}",
  "nutrientAssessment": ["Nutritional demand for this specific phenological stage"],
  "recommendations": [
    {
      "fertilizerCategory": "e.g., Organic / Bio-fertilizer / Primary Macro (NPK) / Micronutrient",
      "purpose": "Specific physiological role (e.g., root development, tillering, panicle initiation)",
      "applicationTiming": "Exact stage timing (e.g., Basal application at sowing, or 25-30 DAS)",
      "applicationMethod": "Broadcasting / Foliar spray / Fertigation / Band placement",
      "quantity": "Estimated quantity or null if data is insufficient",
      "quantityUnit": "kg or litres or null",
      "reason": "Why this fertilizer is prescribed"
    }
  ],
  "safetyPrecautions": ["Safe handling, dilution guidelines, PPE requirements"],
  "dataLimitations": ["Missing soil parameters that could refine the dosage"],
  "warnings": ["Do not mix incompatible chemicals, avoid excessive nitrogen"]
}
`;
}

export function buildIrrigationAdvisoryPrompt(data, language = 'en') {
  return `
Generate practical irrigation and water management guidance:
- Crop: ${data.cropName}
- Growth Stage: ${data.growthStage}
- Soil Type: ${data.soilType}
- Land Area: ${data.landArea} ${data.landUnit}
- Irrigation Method: ${data.irrigationMethod}
- Water Availability: ${data.waterAvailability}
- Last Rainfall: ${data.lastRainfallDaysAgo !== null && data.lastRainfallDaysAgo !== undefined ? data.lastRainfallDaysAgo + ' days ago' : 'Unknown'}
- Ambient Temperature: ${data.temperature ? data.temperature + '°C' : 'Normal for season'}
- Language: ${language}

Return strictly this JSON schema:
{
  "cropName": "${data.cropName}",
  "growthStage": "${data.growthStage}",
  "waterRequirement": "High / Medium / Moderate with explanation",
  "irrigationRecommendations": [
    {
      "timing": "Recommended watering time (e.g., early morning / late evening)",
      "method": "Specific irrigation advice for ${data.irrigationMethod}",
      "reason": "Explanation connecting stage demand and soil moisture retention"
    }
  ],
  "waterConservationMethods": ["Mulching, drip scheduling, furrow management"],
  "waterStressIndicators": ["Symptoms of drought or over-saturation on this crop"],
  "drainageAdvice": ["Drainage precautions to prevent root rot or fungal wilt"],
  "dataLimitations": ["Notice that real-time evapotranspiration requires local sensor data"],
  "warnings": ["Warning regarding waterlogging or salinization"]
}
`;
}

export function buildDiseaseDetectionPrompt(data, hasImage = false, language = 'en') {
  return `
Analyze the observed plant symptoms ${hasImage ? 'and the attached crop photo' : ''} to provide an agronomic disease & pest advisory:
- Crop: ${data.cropName}
- Affected Plant Part: ${data.affectedPart}
- Symptoms Described: ${data.symptoms}
- Duration of Problem: ${data.durationDays} days
- Visible Damage / Insects: ${data.visibleDamage ?? 'None specified'}
- Image Provided: ${hasImage ? 'Yes (attached)' : 'No'}
- Language: ${language}

Return strictly this JSON schema:
{
  "cropName": "${data.cropName}",
  "possibleConditions": [
    {
      "name": "Disease or pest name with scientific pathogen if known",
      "confidenceLevel": "low", // "low", "medium", "high", or "unconfirmed"
      "supportingSymptoms": ["Matched symptoms from farmer's report/photo"],
      "alternativeCauses": ["Other potential diagnoses (e.g., nutrient deficiency or abiotic scorch)"],
      "recommendedInspection": ["Specific visual clues to check with a hand lens or field inspection"]
    }
  ],
  "preventiveMeasures": ["Cultural sanitation, infected leaf pruning, crop spacing"],
  "integratedPestManagement": ["Biological control agents (e.g., Neem oil, Trichoderma, Beauveria bassiana)"],
  "treatmentGuidance": ["Safe remedy guidelines without unregistered or dangerous chemical mixtures"],
  "safetyWarnings": ["Safety precautions, toxicity to bees, protective gloves and mask notice"],
  "expertConsultationRequired": true
}
`;
}

export function buildCultivationCalendarPrompt(data, language = 'en') {
  return `
Generate a chronological crop cultivation schedule from land preparation to harvest:
- Crop: ${data.cropName}
- Sowing / Start Date: ${data.startDate}
- Season: ${data.season ?? 'Standard'}
- Region: ${data.district ? data.district + ', ' : ''}${data.state ?? 'India'}
- Language: ${language}

Return strictly this JSON schema:
{
  "cropName": "${data.cropName}",
  "estimatedDurationDays": 120,
  "activities": [
    {
      "stage": "Land Preparation",
      "dayFromStart": 0,
      "dayToStart": 7,
      "description": "Deep ploughing, adding well-rotted FYM/compost, levelling",
      "importance": "high", // "low", "medium", "high", or "critical"
      "completed": false
    },
    {
      "stage": "Seed Selection & Treatment",
      "dayFromStart": 8,
      "dayToStart": 10,
      "description": "Treat seeds with Trichoderma or bio-fungicide, verify germination rate",
      "importance": "high",
      "completed": false
    },
    {
      "stage": "Sowing / Transplanting",
      "dayFromStart": 11,
      "dayToStart": 14,
      "description": "Sow at recommended spacing and depth with basal fertilizer application",
      "importance": "critical",
      "completed": false
    },
    {
      "stage": "Weed & Irrigation Management",
      "dayFromStart": 25,
      "dayToStart": 30,
      "description": "First weeding / hoeing and critical vegetative irrigation",
      "importance": "high",
      "completed": false
    },
    {
      "stage": "Nutrient Top-Dressing",
      "dayFromStart": 45,
      "dayToStart": 50,
      "description": "Split nitrogen application at tillering/branching stage",
      "importance": "high",
      "completed": false
    },
    {
      "stage": "Pest & Disease Scouting",
      "dayFromStart": 60,
      "dayToStart": 75,
      "description": "Inspect under leaves for sucking pests or foliar spots, apply organic IPM",
      "importance": "medium",
      "completed": false
    },
    {
      "stage": "Flowering & Fruit Development",
      "dayFromStart": 80,
      "dayToStart": 95,
      "description": "Maintain optimum moisture, avoid water stress during anthesis",
      "importance": "critical",
      "completed": false
    },
    {
      "stage": "Pre-Harvest & Maturity Assessment",
      "dayFromStart": 105,
      "dayToStart": 115,
      "description": "Observe moisture drops in grains/pods, withhold irrigation",
      "importance": "high",
      "completed": false
    },
    {
      "stage": "Harvesting & Threshing",
      "dayFromStart": 115,
      "dayToStart": 125,
      "description": "Harvest during clear sunny weather, dry to safe storage moisture level (<12%)",
      "importance": "critical",
      "completed": false
    }
  ],
  "importantWarnings": ["Timelines are weather-dependent. Heavy rainfall or drought will shift stages."],
  "dataLimitations": ["Standard regional calendar. Adjust for specific cultivar/hybrid variations."]
}
`;
}

export function buildChatbotPrompt(history, newMessage, language = 'en') {
  return `
The user is a farmer or agronomist asking a question.
Conversation History:
${history.map(m => `${m.role === 'user' ? 'Farmer' : 'AgroAI'}: ${m.content}`).join('\n')}

New Question from Farmer: "${newMessage}"
Language Preference: ${language}

Provide a practical, grounded agricultural response in ${language}.
Return strictly this JSON schema:
{
  "answer": "Your comprehensive agricultural answer in ${language}",
  "language": "${language}",
  "relatedTopics": ["2 to 4 related agricultural topics for follow-up"],
  "warnings": ["Any necessary chemical safety or weather precaution"],
  "requiresExpertConsultation": false
}
`;
}

