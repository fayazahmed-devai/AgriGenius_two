import { generateAgroAdvisory } from './gemini.service.js';
import { buildSoilAnalysisPrompt } from '../prompts/agricultural.prompts.js';
import { soilAnalysisResponseSchema } from '../schemas/agronomy.schema.js';

export async function analyzeSoilData(userId, inputData, supabaseClient) {
  const prompt = buildSoilAnalysisPrompt(inputData, inputData.language || 'en');
  const aiOutput = await generateAgroAdvisory(prompt, soilAnalysisResponseSchema);

  let savedRecord = null;
  try {
    const { data, error } = await supabaseClient
      .from('soil_reports')
      .insert({
        user_id: userId,
        farm_id: inputData.farmId || null,
        soil_data: inputData,
        analysis: aiOutput,
      })
      .select()
      .single();

    if (error) {
      console.warn('Could not persist soil report to Supabase:', error.message);
    } else {
      savedRecord = data;
    }
  } catch (err) {
    console.warn('Database error persisting soil report:', err.message);
  }

  return {
    id: savedRecord?.id || 'demo-soil-' + Date.now(),
    createdAt: savedRecord?.created_at || new Date().toISOString(),
    soilData: inputData,
    analysis: aiOutput,
  };
}

export async function getUserSoilReports(userId, supabaseClient) {
  const { data, error } = await supabaseClient
    .from('soil_reports')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Database error fetching soil reports:', error.message);
    return [];
  }
  return data || [];
}

export async function getSoilReportById(id, userId, supabaseClient) {
  const { data, error } = await supabaseClient
    .from('soil_reports')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) throw new Error('Soil report not found or access denied.');
  return data;
}

export async function deleteSoilReport(id, userId, supabaseClient) {
  const { error } = await supabaseClient
    .from('soil_reports')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw new Error('Failed to delete soil report.');
  return true;
}

