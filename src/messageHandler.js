const supabase = require('./supabase');
const { buildQuoteBlocks } = require('./blocks');

async function handleMessage({ message, say, context }) {
  const match = context.matches;
  if (!match || !match[1]) return;

  // Ignore bot/app messages to prevent feedback loops
  if (message.subtype === 'bot_message' || message.bot_id) return;

  const clientId = match[1];
  const requestedBy = message.user;
  const channelId = message.channel;

  const { data: quote, error } = await supabase
    .from('quotes')
    .insert({ client_id: clientId, channel_id: channelId, requested_by: requestedBy })
    .select()
    .single();

  if (error) {
    console.error('Error creating quote:', error);
    return;
  }

  const result = await say({
    blocks: buildQuoteBlocks(quote),
    text: `Quote request for client ${clientId}`,
  });

  if (!result.ok) {
    console.error('Error posting tracker message:', result.error);
    return;
  }

  const { error: updateError } = await supabase
    .from('quotes')
    .update({ message_ts: result.ts })
    .eq('id', quote.id);

  if (updateError) {
    console.error('Error updating message_ts:', updateError);
  }
}

module.exports = { handleMessage };
