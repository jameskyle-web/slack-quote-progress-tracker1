require('dotenv').config();

const { App } = require('@slack/bolt');
const { handleMessage } = require('./src/messageHandler');
const { handleQuoteDone, handleOptionalQuoteDone } = require('./src/actionHandler');

const required = ['SLACK_BOT_TOKEN', 'SLACK_SIGNING_SECRET'];
const missing = required.filter((k) => !process.env[k]);

if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  console.error('The bot cannot start without Slack credentials.');
  console.error('See SETUP.md for configuration instructions.');
  process.exit(1);
}

const useSocketMode = process.env.SLACK_SOCKET_MODE === 'true';

if (useSocketMode && !process.env.SLACK_APP_TOKEN) {
  console.error('SLACK_APP_TOKEN is required when SLACK_SOCKET_MODE=true');
  process.exit(1);
}

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  ...(useSocketMode && {
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
  }),
});

// Detect messages like "Please quote 00111000"
app.message(/please quote (\d+)/i, handleMessage);

app.action('quote_done', handleQuoteDone);
app.action('optional_quote_done', handleOptionalQuoteDone);

(async () => {
  const port = process.env.PORT || 3000;
  await app.start(port);
  console.log(`Quote Tracker bot is running on port ${port}`);
  if (useSocketMode) {
    console.log('Mode: Socket Mode (no public URL required)');
  } else {
    console.log('Mode: HTTP — make sure your Request URL is set in Slack App settings');
  }
})();
