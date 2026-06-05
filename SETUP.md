# Slack Quote Tracker — Setup Guide

This guide will walk you through setting up the Slack Quote Tracker from scratch.
No programming experience required — follow each step carefully.

---

## What this bot does

When anyone in your Slack channel types a message like:

```
Please quote 00111000
```

The bot automatically creates a tracking card that looks like this:

```
🚨 QUOTE REQUEST
Client ID: 00111000
Requested by: @Username
Progress: 0 / 4 completed

Required:
☐ @Leander
☐ @James
☐ @Kunikka
☐ @Lore

Optional:
☐ Carrier

[Quote Done]  [Optional Quote Done]
```

Each of the four required team members clicks **Quote Done** when they finish their quote.
The card automatically updates. When all four are done, the header changes to 🏆 REQUIRED QUOTES COMPLETE.

---

## Step 1 — Create a Slack App

1. Go to https://api.slack.com/apps
2. Click **Create New App**
3. Choose **From scratch**
4. Give it a name (e.g., `Quote Tracker`) and select your workspace
5. Click **Create App**

---

## Step 2 — Enable Socket Mode

Socket Mode lets the bot connect to Slack without needing a public URL.
This is the easiest way to run the bot, especially on Replit.

1. In the left sidebar, click **Socket Mode**
2. Toggle **Enable Socket Mode** to ON
3. Under "App-Level Tokens", click **Generate a token**
4. Name it anything (e.g., `socket-token`)
5. Click **Add Scope** and choose `connections:write`
6. Click **Generate**
7. Copy the token that starts with `xapp-` — you will need it later

---

## Step 3 — Set OAuth Scopes (Permissions)

1. In the left sidebar, click **OAuth & Permissions**
2. Scroll down to **Bot Token Scopes**
3. Click **Add an OAuth Scope** and add each of the following:

| Scope | Purpose |
|-------|---------|
| `channels:history` | Read messages in public channels |
| `groups:history` | Read messages in private channels |
| `chat:write` | Post and update messages |
| `chat:write.public` | Post in channels the bot hasn't joined |

4. Scroll back to the top and click **Install to Workspace**
5. Click **Allow**
6. Copy the **Bot User OAuth Token** — it starts with `xoxb-`

---

## Step 4 — Enable Event Subscriptions

1. In the left sidebar, click **Event Subscriptions**
2. Toggle **Enable Events** to ON
3. Since you are using Socket Mode, you do NOT need to enter a Request URL
4. Under **Subscribe to bot events**, click **Add Bot User Event** and add:
   - `message.channels` (messages in public channels)
   - `message.groups` (messages in private channels)
5. Click **Save Changes**

---

## Step 5 — Enable Interactivity

This allows the **Quote Done** and **Optional Quote Done** buttons to work.

1. In the left sidebar, click **Interactivity & Shortcuts**
2. Toggle **Interactivity** to ON
3. Since you are using Socket Mode, you do NOT need to enter a Request URL
4. Click **Save Changes**

---

## Step 6 — Get Your Signing Secret

1. In the left sidebar, click **Basic Information**
2. Scroll to **App Credentials**
3. Click **Show** next to **Signing Secret** and copy it

---

## Step 7 — Find Your Team Members' Slack User IDs

You need the unique ID for Leander, James, Kunikka, and Lore.

1. Open Slack
2. Click on the team member's name to open their profile
3. Click the three dots (**...**) menu
4. Click **Copy member ID**
5. Repeat for all four team members

The ID looks like: `U0123ABC456`

---

## Step 8 — Deploy on Replit

1. Go to https://replit.com and sign in (create a free account if needed)
2. Click **Create Repl**
3. Choose **Import from GitHub** (or upload the project files)
4. Once the project is open, click the **Secrets** lock icon (or go to **Tools → Secrets**)
5. Add each secret below (do NOT include quotes):

| Secret Name | Value |
|-------------|-------|
| `SLACK_BOT_TOKEN` | Your `xoxb-...` token from Step 3 |
| `SLACK_SIGNING_SECRET` | Your signing secret from Step 6 |
| `SLACK_SOCKET_MODE` | `true` |
| `SLACK_APP_TOKEN` | Your `xapp-...` token from Step 2 |
| `SLACK_USER_LEANDER` | Leander's Slack user ID |
| `SLACK_USER_JAMES` | James's Slack user ID |
| `SLACK_USER_KUNIKKA` | Kunikka's Slack user ID |
| `SLACK_USER_LORE` | Lore's Slack user ID |
| `SUPABASE_URL` | Your Supabase project URL (already set by Bolt) |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key (already set by Bolt) |

6. In the Replit Shell, run:
   ```
   npm install
   ```
7. Click the **Run** button

You should see:
```
Quote Tracker bot is running on port 3000
Mode: Socket Mode (no public URL required)
```

---

## Step 9 — Add the Bot to Your Channel

1. Open the Slack channel where quote requests are posted
2. Type `/invite @Quote Tracker` and press Enter
3. The bot is now monitoring that channel

---

## Step 10 — Test It

In your channel, type:

```
Please quote 12345678
```

The bot should immediately create a quote tracking card.

- **Leander, James, Kunikka, or Lore** click **Quote Done** to mark their quote complete
- **Anyone** can click **Optional Quote Done** to mark the carrier quote complete
- Clicking the same button twice shows a polite message — it won't count twice

---

## Troubleshooting

**Bot doesn't respond to messages**
- Make sure the bot is invited to the channel (`/invite @BotName`)
- Check that Event Subscriptions are saved with `message.channels` enabled
- Make sure Socket Mode is enabled and the `SLACK_APP_TOKEN` is correct

**Buttons don't work**
- Make sure Interactivity is enabled in Step 5
- Make sure the app is running (not sleeping on free Replit tier)

**"Only Leander, James, Kunikka, or Lore can mark..." message**
- The wrong person clicked **Quote Done** — only the four required team members can use that button
- Make sure the correct Slack user IDs are set in the Secrets

**Bot posts the tracker but it disappears after editing**
- This is normal Slack behavior — the message is updated in place, not reposted

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `SLACK_BOT_TOKEN` | Yes | Bot OAuth token (`xoxb-...`) |
| `SLACK_SIGNING_SECRET` | Yes | App signing secret |
| `SLACK_SOCKET_MODE` | Yes | Set to `true` for Socket Mode |
| `SLACK_APP_TOKEN` | Socket Mode only | App-level token (`xapp-...`) |
| `SLACK_USER_LEANDER` | Yes | Leander's Slack user ID |
| `SLACK_USER_JAMES` | Yes | James's Slack user ID |
| `SLACK_USER_KUNIKKA` | Yes | Kunikka's Slack user ID |
| `SLACK_USER_LORE` | Yes | Lore's Slack user ID |
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key |
| `PORT` | No | HTTP port (default: 3000) |
