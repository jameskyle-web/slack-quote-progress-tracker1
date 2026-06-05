const supabase = require('./supabase');
const { buildQuoteBlocks } = require('./blocks');

// Returns a map of Slack user ID -> DB column name for the four required users.
// Called as a function so env vars are read after dotenv is initialised.
function getRequiredUsersMap() {
  const map = {};
  if (process.env.SLACK_USER_LEANDER) map[process.env.SLACK_USER_LEANDER] = 'leander_done';
  if (process.env.SLACK_USER_JAMES) map[process.env.SLACK_USER_JAMES] = 'james_done';
  if (process.env.SLACK_USER_KUNIKKA) map[process.env.SLACK_USER_KUNIKKA] = 'kunikka_done';
  if (process.env.SLACK_USER_LORE) map[process.env.SLACK_USER_LORE] = 'lore_done';
  return map;
}

async function handleQuoteDone({ body, ack, client, respond }) {
  await ack();

  const quoteId = body.actions[0].value;
  const clickingUserId = body.user.id;
  const requiredUsers = getRequiredUsersMap();
  const field = requiredUsers[clickingUserId];

  if (!field) {
    await respond({
      text: 'Only Leander, James, Kunikka, or Lore can mark a required quote as done.',
      response_type: 'ephemeral',
      replace_original: false,
    });
    return;
  }

  const { data: quote, error: fetchError } = await supabase
    .from('quotes')
    .select('*')
    .eq('id', quoteId)
    .single();

  if (fetchError || !quote) {
    console.error('Error fetching quote:', fetchError);
    return;
  }

  if (quote[field]) {
    await respond({
      text: "You've already submitted your quote for this request.",
      response_type: 'ephemeral',
      replace_original: false,
    });
    return;
  }

  const { data: updated, error: updateError } = await supabase
    .from('quotes')
    .update({ [field]: true })
    .eq('id', quoteId)
    .select()
    .single();

  if (updateError || !updated) {
    console.error('Error updating quote:', updateError);
    return;
  }

  await client.chat.update({
    channel: quote.channel_id,
    ts: quote.message_ts,
    blocks: buildQuoteBlocks(updated),
    text: `Quote tracker for client ${updated.client_id}`,
  });
}

async function handleOptionalQuoteDone({ body, ack, client, respond }) {
  await ack();

  const quoteId = body.actions[0].value;

  const { data: quote, error: fetchError } = await supabase
    .from('quotes')
    .select('*')
    .eq('id', quoteId)
    .single();

  if (fetchError || !quote) {
    console.error('Error fetching quote:', fetchError);
    return;
  }

  if (quote.carrier_done) {
    await respond({
      text: 'The optional carrier quote has already been marked as done.',
      response_type: 'ephemeral',
      replace_original: false,
    });
    return;
  }

  const { data: updated, error: updateError } = await supabase
    .from('quotes')
    .update({ carrier_done: true })
    .eq('id', quoteId)
    .select()
    .single();

  if (updateError || !updated) {
    console.error('Error updating optional quote:', updateError);
    return;
  }

  await client.chat.update({
    channel: quote.channel_id,
    ts: quote.message_ts,
    blocks: buildQuoteBlocks(updated),
    text: `Quote tracker for client ${updated.client_id}`,
  });
}

module.exports = { handleQuoteDone, handleOptionalQuoteDone };
