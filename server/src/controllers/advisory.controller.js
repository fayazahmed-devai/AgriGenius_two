import * as cropService from '../services/crop.service.js';
import * as soilService from '../services/soil.service.js';
import * as fertilizerService from '../services/fertilizer.service.js';
import * as irrigationService from '../services/irrigation.service.js';
import * as diseaseService from '../services/disease.service.js';
import * as calendarService from '../services/calendar.service.js';
import * as chatService from '../services/chat.service.js';

// -----------------------------------------------------------------------------
// Crop Recommendation Handlers
// -----------------------------------------------------------------------------
export async function recommendCrop(req, res, next) {
  try {
    const result = await cropService.generateCropRecommendations(req.user.id, req.body, req.supabase);
    res.json({
      success: true,
      message: 'Crop recommendations generated successfully',
      data: result,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

export async function getCropRecommendations(req, res, next) {
  try {
    const data = await cropService.getUserCropRecommendations(req.user.id, req.supabase);
    res.json({
      success: true,
      message: 'Crop recommendations retrieved',
      data,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

export async function getCropRecommendationById(req, res, next) {
  try {
    const data = await cropService.getCropRecommendationById(req.params.id, req.user.id, req.supabase);
    res.json({
      success: true,
      message: 'Crop recommendation retrieved',
      data,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteCropRecommendation(req, res, next) {
  try {
    await cropService.deleteCropRecommendation(req.params.id, req.user.id, req.supabase);
    res.json({
      success: true,
      message: 'Crop recommendation deleted successfully',
      data: null,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

// -----------------------------------------------------------------------------
// Soil Analysis Handlers
// -----------------------------------------------------------------------------
export async function analyzeSoil(req, res, next) {
  try {
    const result = await soilService.analyzeSoilData(req.user.id, req.body, req.supabase);
    res.json({
      success: true,
      message: 'Soil analysis completed successfully',
      data: result,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

export async function getSoilReports(req, res, next) {
  try {
    const data = await soilService.getUserSoilReports(req.user.id, req.supabase);
    res.json({
      success: true,
      message: 'Soil reports retrieved',
      data,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

export async function getSoilReportById(req, res, next) {
  try {
    const data = await soilService.getSoilReportById(req.params.id, req.user.id, req.supabase);
    res.json({
      success: true,
      message: 'Soil report retrieved',
      data,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteSoilReport(req, res, next) {
  try {
    await soilService.deleteSoilReport(req.params.id, req.user.id, req.supabase);
    res.json({
      success: true,
      message: 'Soil report deleted successfully',
      data: null,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

// -----------------------------------------------------------------------------
// Fertilizer Advisory Handlers
// -----------------------------------------------------------------------------
export async function recommendFertilizer(req, res, next) {
  try {
    const result = await fertilizerService.generateFertilizerAdvisory(req.user.id, req.body, req.supabase);
    res.json({
      success: true,
      message: 'Fertilizer advisory generated successfully',
      data: result,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

export async function getFertilizerAdvisories(req, res, next) {
  try {
    const data = await fertilizerService.getUserFertilizerAdvisories(req.user.id, req.supabase);
    res.json({
      success: true,
      message: 'Fertilizer advisories retrieved',
      data,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

export async function getFertilizerAdvisoryById(req, res, next) {
  try {
    const data = await fertilizerService.getFertilizerAdvisoryById(req.params.id, req.user.id, req.supabase);
    res.json({
      success: true,
      message: 'Fertilizer advisory retrieved',
      data,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

// -----------------------------------------------------------------------------
// Irrigation Advisory Handlers
// -----------------------------------------------------------------------------
export async function recommendIrrigation(req, res, next) {
  try {
    const result = await irrigationService.generateIrrigationAdvisory(req.user.id, req.body, req.supabase);
    res.json({
      success: true,
      message: 'Irrigation advisory generated successfully',
      data: result,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

export async function getIrrigationAdvisories(req, res, next) {
  try {
    const data = await irrigationService.getUserIrrigationAdvisories(req.user.id, req.supabase);
    res.json({
      success: true,
      message: 'Irrigation advisories retrieved',
      data,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

export async function getIrrigationAdvisoryById(req, res, next) {
  try {
    const data = await irrigationService.getIrrigationAdvisoryById(req.params.id, req.user.id, req.supabase);
    res.json({
      success: true,
      message: 'Irrigation advisory retrieved',
      data,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

// -----------------------------------------------------------------------------
// Disease Detection Handlers
// -----------------------------------------------------------------------------
export async function analyzeDisease(req, res, next) {
  try {
    // req.file is populated by multer uploadCropImage.single('image')
    const result = await diseaseService.analyzeCropDisease(req.user.id, req.body, req.file, req.supabase);
    res.json({
      success: true,
      message: 'Crop disease analysis completed successfully',
      data: result,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

export async function getDiseaseReports(req, res, next) {
  try {
    const data = await diseaseService.getUserDiseaseReports(req.user.id, req.supabase);
    res.json({
      success: true,
      message: 'Disease reports retrieved',
      data,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

export async function getDiseaseReportById(req, res, next) {
  try {
    const data = await diseaseService.getDiseaseReportById(req.params.id, req.user.id, req.supabase);
    let signedImageUrl = null;
    if (data.image_path) {
      signedImageUrl = await diseaseService.getSignedImageUrl(data.image_path, req.supabase);
    }
    res.json({
      success: true,
      message: 'Disease report retrieved',
      data: { ...data, signedImageUrl },
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

// -----------------------------------------------------------------------------
// Cultivation Calendar Handlers
// -----------------------------------------------------------------------------
export async function generateCalendar(req, res, next) {
  try {
    const result = await calendarService.generateCultivationCalendar(req.user.id, req.body, req.supabase);
    res.json({
      success: true,
      message: 'Cultivation calendar generated successfully',
      data: result,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

export async function getCalendars(req, res, next) {
  try {
    const data = await calendarService.getUserCalendars(req.user.id, req.supabase);
    res.json({
      success: true,
      message: 'Cultivation calendars retrieved',
      data,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

export async function getCalendarById(req, res, next) {
  try {
    const data = await calendarService.getCalendarById(req.params.id, req.user.id, req.supabase);
    res.json({
      success: true,
      message: 'Cultivation calendar retrieved',
      data,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateCalendar(req, res, next) {
  try {
    const { activityIndex, completed } = req.body;
    const data = await calendarService.updateCalendarActivity(
      req.params.id,
      req.user.id,
      activityIndex,
      completed,
      req.supabase
    );
    res.json({
      success: true,
      message: 'Calendar activity updated',
      data,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteCalendar(req, res, next) {
  try {
    await calendarService.deleteCalendar(req.params.id, req.user.id, req.supabase);
    res.json({
      success: true,
      message: 'Calendar deleted successfully',
      data: null,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

// -----------------------------------------------------------------------------
// AI Chat Handlers
// -----------------------------------------------------------------------------
export async function sendChatMessage(req, res, next) {
  try {
    const { conversationId, message, language } = req.body;
    const result = await chatService.handleChatMessage(
      req.user.id,
      conversationId,
      message,
      language || 'en',
      req.supabase
    );
    res.json({
      success: true,
      message: 'AI Agronomist response generated',
      data: result,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

export async function getConversations(req, res, next) {
  try {
    const data = await chatService.getUserConversations(req.user.id, req.supabase);
    res.json({
      success: true,
      message: 'Conversations retrieved',
      data,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

export async function getConversationMessages(req, res, next) {
  try {
    const data = await chatService.getConversationMessages(req.params.id, req.user.id, req.supabase);
    res.json({
      success: true,
      message: 'Messages retrieved',
      data,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteConversation(req, res, next) {
  try {
    await chatService.deleteConversation(req.params.id, req.user.id, req.supabase);
    res.json({
      success: true,
      message: 'Conversation deleted',
      data: null,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

