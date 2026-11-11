import { generateAgroAdvisory } from './gemini.service.js';
import { buildCropRecommendationPrompt } from '../prompts/agricultural.prompts.js';
import { cropRecommendationResponseSchema } from '../schemas/agronomy.schema.js';
import { GEMINI_MODEL } from '../config/gemini.js';

export async function generateCropRecommendations(userId, inputData, supabaseClient) {
  const prompt = buildCropRecommendationPrompt(inputData, inputData.language || 'en');
  const aiOutput = await generateAgroAdvisory(prompt, cropRecommendationResponseSchema);

  // Save advisory record to Supabase
  let savedRecord = null;
  try {
    const { data, error } = await supabaseClient
      .from('crop_recommendations')
      .insert({
        user_id: userId,
        farm_id: inputData.farmId || null,
        input_data: inputData,
        recommendations: aiOutput,
        advisory_language: inputData.language || 'en',
        model_name: GEMINI_MODEL,
      })
      .select()
      .single();

    if (error) {
      console.warn('Could not persist crop recommendation to Supabase:', error.message);
    } else {
      savedRecord = data;
    }
  } catch (dbErr) {
    console.warn('Database error persisting crop recommendation:', dbErr.message);
  }

  return {
    id: savedRecord?.id || 'demo-' + Date.now(),
    createdAt: savedRecord?.created_at || new Date().toISOString(),
    inputData,
    recommendations: aiOutput,
  };
}

export async function getUserCropRecommendations(userId, supabaseClient) {
  const { data, error } = await supabaseClient
    .from('crop_recommendations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Database fetch error:', error.message);
    return [];
  }
  return data || [];
}

export async function getCropRecommendationById(id, userId, supabaseClient) {
  const { data, error } = await supabaseClient
    .from('crop_recommendations')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) throw new Error('Crop recommendation not found or access denied.');
  return data;
}

export async function deleteCropRecommendation(id, userId, supabaseClient) {
  const { error } = await supabaseClient
    .from('crop_recommendations')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw new Error('Failed to delete crop recommendation.');
  return true;
}

