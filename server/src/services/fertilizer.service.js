import { generateAgroAdvisory } from './gemini.service.js';
import { buildFertilizerAdvisoryPrompt } from '../prompts/agricultural.prompts.js';
import { fertilizerResponseSchema } from '../schemas/agronomy.schema.js';

export async function generateFertilizerAdvisory(userId, inputData, supabaseClient) {
  const prompt = buildFertilizerAdvisoryPrompt(inputData, inputData.language || 'en');
  const aiOutput = await generateAgroAdvisory(prompt, fertilizerResponseSchema);

  let savedRecord = null;
  try {
    const { data, error } = await supabaseClient
      .from('fertilizer_advisories')
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
      console.warn('Could not persist fertilizer advisory to Supabase:', error.message);
    } else {
      savedRecord = data;
    }
  } catch (err) {
    console.warn('Database error persisting fertilizer advisory:', err.message);
  }

  return {
    id: savedRecord?.id || 'demo-fert-' + Date.now(),
    createdAt: savedRecord?.created_at || new Date().toISOString(),
    cropName: inputData.cropName,
    inputData,
    advisory: aiOutput,
  };
}

export async function getUserFertilizerAdvisories(userId, supabaseClient) {
  const { data, error } = await supabaseClient
    .from('fertilizer_advisories')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Database error fetching fertilizer advisories:', error.message);
    return [];
  }
  return data || [];
}

export async function getFertilizerAdvisoryById(id, userId, supabaseClient) {
  const { data, error } = await supabaseClient
    .from('fertilizer_advisories')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) throw new Error('Fertilizer advisory not found or access denied.');
  return data;
}

