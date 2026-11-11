import { generateAgroAdvisory } from './gemini.service.js';
import { buildChatbotPrompt } from '../prompts/agricultural.prompts.js';
import { chatbotResponseSchema } from '../schemas/agronomy.schema.js';

export async function handleChatMessage(userId, conversationId, message, language = 'en', supabaseClient) {
  let activeConversationId = conversationId;

  // 1. If no conversationId provided, create a new conversation
  if (!activeConversationId) {
    try {
      const titleSnippet = message.slice(0, 40) + (message.length > 40 ? '...' : '');
      const { data, error } = await supabaseClient
        .from('chat_conversations')
        .insert({
          user_id: userId,
          title: titleSnippet,
          language,
        })
        .select()
        .single();

      if (!error && data) {
        activeConversationId = data.id;
      }
    } catch (err) {
      console.warn('Could not create conversation in database:', err.message);
    }
  }

  // Fallback memory ID if database write didn't happen
  activeConversationId = activeConversationId || 'demo-conv-' + Date.now();

  // 2. Fetch last 6 messages for context
  let history = [];
  try {
    const { data: messages } = await supabaseClient
      .from('chat_messages')
      .select('role, content')
      .eq('conversation_id', activeConversationId)
      .order('created_at', { ascending: true })
      .limit(6);

    if (messages && messages.length > 0) {
      history = messages;
    }
  } catch (err) {
    console.warn('Could not fetch message history:', err.message);
  }

  // 3. Save incoming user message
  try {
    await supabaseClient.from('chat_messages').insert({
      conversation_id: activeConversationId,
      user_id: userId,
      role: 'user',
      content: message,
    });
  } catch (err) {
    console.warn('Could not persist user message:', err.message);
  }

  // 4. Generate AI advisory response
  const prompt = buildChatbotPrompt(history, message, language);
  const aiOutput = await generateAgroAdvisory(prompt, chatbotResponseSchema);

  // 5. Save assistant response
  try {
    await supabaseClient.from('chat_messages').insert({
      conversation_id: activeConversationId,
      user_id: userId,
      role: 'assistant',
      content: aiOutput.answer,
    });
  } catch (err) {
    console.warn('Could not persist assistant message:', err.message);
  }

  return {
    conversationId: activeConversationId,
    answer: aiOutput.answer,
    language: aiOutput.language,
    relatedTopics: aiOutput.relatedTopics,
    warnings: aiOutput.warnings,
    requiresExpertConsultation: aiOutput.requiresExpertConsultation,
  };
}

export async function getUserConversations(userId, supabaseClient) {
  const { data, error } = await supabaseClient
    .from('chat_conversations')
    .select('*, chat_messages(count)')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.warn('Database error fetching conversations:', error.message);
    return [];
  }
  return data || [];
}

export async function getConversationMessages(conversationId, userId, supabaseClient) {
  const { data, error } = await supabaseClient
    .from('chat_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw new Error('Could not fetch conversation messages: ' + error.message);
  return data || [];
}

export async function deleteConversation(conversationId, userId, supabaseClient) {
  const { error } = await supabaseClient
    .from('chat_conversations')
    .delete()
    .eq('id', conversationId)
    .eq('user_id', userId);

  if (error) throw new Error('Failed to delete conversation.');
  return true;
}

