import { generateAgroAdvisory } from './gemini.service.js';
import { buildDiseaseDetectionPrompt } from '../prompts/agricultural.prompts.js';
import { diseaseResponseSchema } from '../schemas/agronomy.schema.js';
import { verifyImageMagicBytes } from '../middleware/upload.middleware.js';

export async function analyzeCropDisease(userId, inputData, file, supabaseClient) {
  let imagePath = null;
  let fileAttachment = null;

  if (file) {
    // Verify magic bytes
    if (!verifyImageMagicBytes(file.buffer)) {
      throw new Error('Security check failed: Uploaded file is corrupted or not a valid image format.');
    }

    fileAttachment = {
      buffer: file.buffer,
      mimeType: file.mimetype,
    };

    // Attempt to upload to Supabase Storage bucket 'crop-images'
    try {
      const fileExt = file.originalname.split('.').pop() || 'jpg';
      const storageKey = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data, error } = await supabaseClient.storage
        .from('crop-images')
        .upload(storageKey, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (!error && data) {
        imagePath = data.path;
      }
    } catch (storageErr) {
      console.warn('Supabase storage upload skipped or failed:', storageErr.message);
    }
  }

  const prompt = buildDiseaseDetectionPrompt(inputData, !!fileAttachment, inputData.language || 'en');
  const aiOutput = await generateAgroAdvisory(prompt, diseaseResponseSchema, fileAttachment);

  let savedRecord = null;
  try {
    const { data, error } = await supabaseClient
      .from('disease_reports')
      .insert({
        user_id: userId,
        farm_id: inputData.farmId || null,
        crop_name: inputData.cropName,
        symptoms: inputData.symptoms,
        image_path: imagePath,
        analysis: aiOutput,
      })
      .select()
      .single();

    if (error) {
      console.warn('Could not persist disease report to Supabase:', error.message);
    } else {
      savedRecord = data;
    }
  } catch (err) {
    console.warn('Database error persisting disease report:', err.message);
  }

  return {
    id: savedRecord?.id || 'demo-dis-' + Date.now(),
    createdAt: savedRecord?.created_at || new Date().toISOString(),
    cropName: inputData.cropName,
    symptoms: inputData.symptoms,
    imagePath,
    analysis: aiOutput,
  };
}

export async function getUserDiseaseReports(userId, supabaseClient) {
  const { data, error } = await supabaseClient
    .from('disease_reports')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Database error fetching disease reports:', error.message);
    return [];
  }
  return data || [];
}

export async function getDiseaseReportById(id, userId, supabaseClient) {
  const { data, error } = await supabaseClient
    .from('disease_reports')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) throw new Error('Disease report not found or access denied.');
  return data;
}

/**
 * Generates a temporary signed URL for viewing the private uploaded crop image
 */
export async function getSignedImageUrl(imagePath, supabaseClient) {
  if (!imagePath) return null;
  try {
    const { data, error } = await supabaseClient.storage
      .from('crop-images')
      .createSignedUrl(imagePath, 3600); // 1 hour validity

    if (error) return null;
    return data?.signedUrl || null;
  } catch {
    return null;
  }
}

