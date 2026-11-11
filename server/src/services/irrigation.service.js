import { generateAgroAdvisory } from './gemini.service.js';
import { buildIrrigationAdvisoryPrompt } from '../prompts/agricultural.prompts.js';
import { irrigationResponseSchema } from '../schemas/agronomy.schema.js';

export async function generateIrrigationAdvisory(userId, inputData, supabaseClient) {
  const prompt = buildIrrigationAdvisoryPrompt(inputData, inputData.language || 'en');
  const aiOutput = await generateAgroAdvisory(prompt, irrigationResponseSchema);

  let savedRecord = null;
  try {
    const { data, error } = await supabaseClient
      .from('irrigation_advisories')
      .insert({
        user_id: userId,
        farm_id: inputData.farmId || null,
        crop_name: inputData.cropName,
        input_data: inputData,
        advisory: aiOutput,
      })
      .select()
      .single();

    if (error) {
      console.warn('Could not persist irrigation advisory to Supabase:', error.message);
    } else {
      savedRecord = data;
    }
  } catch (err) {
    console.warn('Database error persisting irrigation advisory:', err.message);
  }

  return {
    id: savedRecord?.id || 'demo-irrig-' + Date.now(),
    createdAt: savedRecord?.created_at || new Date().toISOString(),
    cropName: inputData.cropName,
    inputData,
    advisory: aiOutput,
  };
}

export async function getUserIrrigationAdvisories(userId, supabaseClient) {
  const { data, error } = await supabaseClient
    .from('irrigation_advisories')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Database error fetching irrigation advisories:', error.message);
    return [];
  }
  return data || [];
}

export async function getIrrigationAdvisoryById(id, userId, supabaseClient) {
  const { data, error } = await supabaseClient
    .from('irrigation_advisories')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) throw new Error('Irrigation advisory not found or access denied.');
  return data;
}

