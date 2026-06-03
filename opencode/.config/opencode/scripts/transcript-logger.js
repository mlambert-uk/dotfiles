#!/usr/bin/env node

/**
 * OpenCode Transcript Logger
 *
 * Captures all messages from an OpenCode session and exports them to a markdown transcript.
 * Usage: node transcript-logger.js [session-id] [--watch] [--output path/to/file.md]
 *
 * This script:
 * 1. Connects to the OpenCode server
 * 2. Fetches all messages from the current or specified session
 * 3. Writes them to a transcript file in markdown format
 * 4. Optionally watches for new messages and appends them
 */

import { createOpencodeClient } from "@opencode-ai/sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SERVER_URL = process.env.OPENCODE_SERVER || "http://localhost:4096";
const TRANSCRIPTS_DIR = path.expand(
  "~/Documents/mlambert_uk/OpenCode/Transcripts",
);

// Ensure transcripts directory exists
if (!fs.existsSync(TRANSCRIPTS_DIR)) {
  fs.mkdirSync(TRANSCRIPTS_DIR, { recursive: true });
}

/**
 * Format timestamp for transcript
 */
function formatTimestamp(date = new Date()) {
  return date.toISOString().split("T")[1].split(".")[0]; // HH:MM:SS
}

/**
 * Format message part to string
 */
function formatPart(part) {
  if (!part) return "";

  switch (part.type) {
    case "text":
      return part.text || "";
    case "code":
      return `\`\`\`${part.language || ""}\n${part.text}\n\`\`\``;
    case "file":
      return `📄 ${part.path}`;
    case "json":
      return `\`\`\`json\n${JSON.stringify(part.value, null, 2)}\n\`\`\``;
    default:
      return `[${part.type}]`;
  }
}

/**
 * Format message for transcript
 */
function formatMessage(message, parts = []) {
  const timestamp = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : formatTimestamp();

  const role = message.role === "user" ? "👤 User" : "🤖 OpenCode";
  const header = `**${timestamp}** ${role}`;

  const content = parts.map((p) => formatPart(p)).join("\n\n");

  return `${header}\n\n${content}`;
}

/**
 * Fetch all messages from session
 */
async function fetchSessionMessages(client, sessionId) {
  try {
    const response = await client.session.messages({ path: { id: sessionId } });
    return response || [];
  } catch (error) {
    console.error(`Error fetching messages for session ${sessionId}:`, error);
    return [];
  }
}

/**
 * Create transcript markdown
 */
function createTranscriptMarkdown(messages) {
  const today = new Date().toISOString().split("T")[0];
  const header = `# OpenCode Transcript — ${today}\n\n`;
  const intro = `**Session Date:** ${today}\n**Format:** Timestamped conversation log\n**Created:** ${new Date().toLocaleString()}\n\n---\n\n`;

  const body = messages
    .map((msg) => formatMessage(msg.info, msg.parts || []))
    .join("\n\n---\n\n");

  return header + intro + body;
}

/**
 * Save transcript to file
 */
function saveTranscript(content, outputPath = null) {
  const today = new Date().toISOString().split("T")[0];
  const filename = outputPath || path.join(TRANSCRIPTS_DIR, `${today}.md`);

  try {
    fs.writeFileSync(filename, content, "utf-8");
    console.log(`✅ Transcript saved: ${filename}`);
    return filename;
  } catch (error) {
    console.error(`Error saving transcript:`, error);
    throw error;
  }
}

/**
 * Main function: capture and export transcript
 */
async function captureTranscript(sessionId = null, options = {}) {
  const client = createOpencodeClient({
    baseUrl: SERVER_URL,
  });

  try {
    // If no session ID provided, use the current session
    let targetSessionId = sessionId;
    if (!targetSessionId) {
      const sessions = await client.session.list();
      if (sessions.length === 0) {
        console.error(
          "No active sessions found. Start an OpenCode session first.",
        );
        process.exit(1);
      }
      // Use the most recent session
      targetSessionId = sessions[sessions.length - 1].id;
      console.log(`📌 Using current session: ${targetSessionId}`);
    }

    // Fetch all messages
    console.log(`📡 Fetching messages from session ${targetSessionId}...`);
    const messages = await fetchSessionMessages(client, targetSessionId);

    if (messages.length === 0) {
      console.log("No messages found in session.");
      return;
    }

    console.log(`📝 Found ${messages.length} messages`);

    // Create transcript
    const markdown = createTranscriptMarkdown(messages);

    // Save to file
    const filename = saveTranscript(markdown, options.output);

    // Return info
    return {
      sessionId: targetSessionId,
      messageCount: messages.length,
      filename,
    };
  } catch (error) {
    console.error("Error capturing transcript:", error);
    process.exit(1);
  }
}

/**
 * Watch mode: continuously update transcript
 */
async function watchSession(sessionId = null, options = {}) {
  console.log("👀 Watching session for new messages (Ctrl+C to stop)...");

  let lastMessageCount = 0;

  setInterval(async () => {
    try {
      const client = createOpencodeClient({
        baseUrl: SERVER_URL,
      });

      const sessions = await client.session.list();
      const targetSessionId = sessionId || sessions[sessions.length - 1]?.id;

      if (!targetSessionId) return;

      const messages = await fetchSessionMessages(client, targetSessionId);

      if (messages.length > lastMessageCount) {
        console.log(`\n📥 New messages: ${messages.length - lastMessageCount}`);
        const markdown = createTranscriptMarkdown(messages);
        saveTranscript(markdown, options.output);
        lastMessageCount = messages.length;
      }
    } catch (error) {
      // Silent fail in watch mode
    }
  }, 2000); // Poll every 2 seconds
}

// CLI
const args = process.argv.slice(2);
const watch = args.includes("--watch");
const outputIndex = args.indexOf("--output");
const output = outputIndex !== -1 ? args[outputIndex + 1] : null;
const sessionId = args.find((a) => !a.startsWith("--"));

if (watch) {
  watchSession(sessionId, { output });
} else {
  captureTranscript(sessionId, { output });
}
