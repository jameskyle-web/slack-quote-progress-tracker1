/**
 * Builds Slack Block Kit blocks for a quote tracker message.
 * @param {object} quote - Row from the quotes table.
 * @returns {Array} Slack blocks array.
 */
function buildQuoteBlocks(quote) {
  const { client_id, requested_by, leander_done, james_done, kunikka_done, lore_done, carrier_done } = quote;

  const requiredCount = [leander_done, james_done, kunikka_done, lore_done].filter(Boolean).length;
  const allRequiredDone = requiredCount === 4;

  const header = allRequiredDone ? '🏆 REQUIRED QUOTES COMPLETE' : '🚨 QUOTE REQUEST';
  const chk = (done) => done ? '✅' : '☐';

  const leanderId = process.env.SLACK_USER_LEANDER;
  const jamesId = process.env.SLACK_USER_JAMES;
  const kunikkaId = process.env.SLACK_USER_KUNIKKA;
  const loreId = process.env.SLACK_USER_LORE;

  const leaderLabel = leanderId ? `<@${leanderId}>` : 'Leander';
  const jamesLabel = jamesId ? `<@${jamesId}>` : 'James';
  const kunikkaLabel = kunikkaId ? `<@${kunikkaId}>` : 'Kunikka';
  const loreLabel = loreId ? `<@${loreId}>` : 'Lore';

  return [
    {
      type: 'header',
      text: { type: 'plain_text', text: header, emoji: true },
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*Client ID:*\n${client_id}` },
        { type: 'mrkdwn', text: `*Requested by:*\n<@${requested_by}>` },
      ],
    },
    {
      type: 'section',
      text: { type: 'mrkdwn', text: `*Progress:* ${requiredCount} / 4 completed` },
    },
    { type: 'divider' },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: [
          '*Required:*',
          `${chk(leander_done)} ${leaderLabel}`,
          `${chk(james_done)} ${jamesLabel}`,
          `${chk(kunikka_done)} ${kunikkaLabel}`,
          `${chk(lore_done)} ${loreLabel}`,
        ].join('\n'),
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Optional:*\n${chk(carrier_done)} Carrier`,
      },
    },
    { type: 'divider' },
    {
      type: 'actions',
      block_id: `quote_actions_${quote.id}`,
      elements: [
        {
          type: 'button',
          text: { type: 'plain_text', text: 'Quote Done', emoji: true },
          action_id: 'quote_done',
          value: quote.id,
          style: allRequiredDone ? undefined : 'primary',
        },
        {
          type: 'button',
          text: { type: 'plain_text', text: 'Optional Quote Done', emoji: true },
          action_id: 'optional_quote_done',
          value: quote.id,
        },
      ],
    },
  ];
}

module.exports = { buildQuoteBlocks };
