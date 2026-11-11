# AgroAI RESTful API Specification (v1)

Base URL: `/api/v1`

All protected endpoints require an `Authorization: Bearer <SUPABASE_JWT_ACCESS_TOKEN>` header.

---

## 1. System Health
### `GET /health` or `GET /api/v1/health`
- **Response:**
```json
{
  "success": true,
  "message": "AgroAI Agricultural Intelligence API is active and operational.",
  "data": {
    "status": "UP",
    "timestamp": "2026-11-06T12:00:00.000Z",
    "uptimeSeconds": 124
  },
  "error": null
}
```

---

## 2. Farmer Profile & Farms
### `GET /api/v1/profile`
Fetches authenticated farmer's demographics.

### `PUT /api/v1/profile`
Updates farmer demographics.
- **Request Body:**
```json
{
  "fullName": "Ramesh Patil",
  "phone": "+91 9876543210",
  "country": "India",
  "state": "Karnataka",
  "district": "Dharwad",
  "village": "Navalgund",
  "preferredLanguage": "kn",
  "farmingExperience": 12,
  "landArea": 5.0,
  "landUnit": "acre",
  "farmingType": "Diversified Cash & Pulses",
  "irrigationAvailable": true
}
```

### `GET /api/v1/farms` & `POST /api/v1/farms`
Create and manage multiple farm parcels.

---

## 3. Crop Recommendation Engine
### `POST /api/v1/crop/recommend`
Generates grounded crop suitability rankings using Gemini.
- **Request Body:**
```json
{
  "state": "Karnataka",
  "district": "Dharwad",
  "soilType": "Black Soil (Vertisols)",
  "season": "Kharif",
  "landArea": 3.0,
  "landUnit": "acre",
  "soilPH": 7.2,
  "nitrogen": 210,
  "phosphorus": 45,
  "potassium": 190,
  "organicCarbon": 0.55,
  "temperature": 29,
  "humidity": 68,
  "rainfall": 820,
  "irrigationAvailable": true,
  "language": "en"
}
```
- **Response `data.recommendations`:**
```json
{
  "summary": "Overall agricultural suitability summary",
  "recommendations": [
    {
      "cropName": "Soybean",
      "suitabilityScore": 88,
      "suitabilityLevel": "high",
      "reason": "Deep black soils with high clay content provide excellent moisture retention for Soybean vegetative phase...",
      "soilCompatibility": "High",
      "climateCompatibility": "Optimal Kharif monsoon temperature",
      "waterRequirement": "Moderate (450 - 650 mm)",
      "estimatedDurationDays": 95,
      "sowingPeriod": "June 15 - July 10",
      "risks": ["Susceptibility to Stem Fly and Yellow Mosaic Virus"],
      "nextSteps": ["Seed treatment with Rhizobium culture and Trichoderma"]
    }
  ],
  "warnings": ["Ensure adequate surface drainage to prevent water stagnation."],
  "expertConsultationRequired": false
}
```

---

## 4. Soil Health Analysis
### `POST /api/v1/soil/analyze`
- **Request Body:**
```json
{
  "soilType": "Black Clay",
  "soilPH": 7.8,
  "nitrogen": 180,
  "phosphorus": 25,
  "potassium": 240,
  "organicCarbon": 0.4,
  "electricalConductivity": 0.8,
  "texture": "Clay Loam",
  "additionalNotes": "Slow water percolation",
  "language": "en"
}
```

---

## 5. Fertilizer Advisory
### `POST /api/v1/fertilizer/recommend`
- **Request Body:**
```json
{
  "cropName": "Cotton",
  "cropVariety": "Bt Hybrid",
  "growthStage": "Vegetative",
  "landArea": 2.0,
  "landUnit": "acre",
  "soilPH": 7.5,
  "nitrogen": 200,
  "phosphorus": 35,
  "potassium": 190,
  "farmingMethod": "Integrated/Balanced",
  "language": "en"
}
```

---

## 6. Crop Disease & Pest Scanner
### `POST /api/v1/disease/analyze`
Content-Type: `multipart/form-data`
- `cropName`: string
- `affectedPart`: 'Leaf' | 'Stem' | 'Flower' | 'Fruit' | 'Root' | 'Whole Plant'
- `symptoms`: string
- `durationDays`: number
- `visibleDamage`: string
- `language`: 'en' | 'kn' | 'hi'
- `image`: Binary file (JPEG/PNG/WebP, max 5MB, optional)

---

## 7. Cultivation Calendar
### `POST /api/v1/calendar/generate`
- **Request Body:**
```json
{
  "cropName": "Paddy",
  "startDate": "2026-06-15",
  "season": "Kharif",
  "state": "Karnataka",
  "district": "Belagavi",
  "language": "en"
}
```
### `PUT /api/v1/calendar/:id`
Updates activity completion status. Body: `{ "activityIndex": 2, "completed": true }`.

---

## 8. AI Agronomist Chat
### `POST /api/v1/chat/conversations`
- **Request Body:**
```json
{
  "conversationId": "optional-uuid",
  "message": "What is the best organic spray to control early whiteflies on tomato?",
  "language": "en"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "AI Agronomist response generated",
  "data": {
    "conversationId": "uuid-here",
    "answer": "For early whitefly control in tomatoes, spray 5% Neem Seed Kernel Extract (NSKE) or Neem oil at 5ml/litre water...",
    "language": "en",
    "relatedTopics": ["Yellow sticky traps setup", "Beauveria bassiana bio-pesticide", "Tomato leaf curl prevention"],
    "warnings": ["Spray during early morning or evening hours to avoid leaf scorch."],
    "requiresExpertConsultation": false
  }
}
```

