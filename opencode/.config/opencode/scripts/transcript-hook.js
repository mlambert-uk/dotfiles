#!/usr/bin/env node

/**
 * OpenCode Session Hook: Auto-capture transcripts
 *
 * This script hooks into OpenCode session lifecycle events to automatically
 * capture transcripts when sessions end or at configurable intervals.
 *
 * Wired via: SessionEnd or SessionTimer events
 */

import { createOpencode } from "@opencode-ai/sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TRANSCRIPTS_DIR = path.expand(
  "~/Documents/mlambert_uk/OpenCode/Transcripts",
);

// Ensure transcripts directory exists
if (!fs.existsSync(TRANSCRIPTS_DIR)) {
  fs.mkdirSync(TRANSCRIPTS_DIR, { recursive: true });
}

/**
 * Format timestamp
 */
function formatTimestamp(date = new Date()) {
  return date.toISOString().split("T")[1].split(".")[0];
}

/**
 * Format part content
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
    default:
      return `[${part.type}]`;
  }
}

/**
 * Create markdown transcript from messages
 */
function createTranscript(messages) {
  const today = new Date().toISOString().split("T")[0];
  let content = `# OpenCode Transcript — ${today}\n\n`;
  content += `**Date:** ${today}\n`;
  content += `**Created:** ${new Date().toLocaleString()}\n\n---\n\n`;

  messages.forEach((msg) => {
    const timestamp = msg.info?.timestamp
      ? new Date(msg.info.timestamp).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      : formatTimestamp();

    const role = msg.info?.role === "user" ? "👤 User" : "🤖 OpenCode";
    content += `**${timestamp}** ${role}\n\n`;

    if (msg.parts && msg.parts.length > 0) {
      content += msg.parts.map((p) => formatPart(p)).join("\n\n");
    }

    content += "\n\n---\n\n";
  });

  return content;
}

/**
 * Capture transcript for a session
 */
async function captureSessionTranscript(client, sessionId) {
  try {
    const messages = await client.session.messages({ path: { id: sessionId } });

    if (!messages || messages.length === 0) {
      return null;
    }

    const transcript = createTranscript(messages);
    const today = new Date().toISOString().split("T")[0];
    const filename = path.join(TRANSCRIPTS_DIR, `${today}.md`);

    fs.writeFileSync(filename, transcript, "utf-8");
    console.log(
      `✅ Transcript captured: ${filename} (${messages.length} msgs)`,
    );

    return filename;
  } catch (error) {
    console.error(
      `Error capturing transcript for session ${sessionId}:`,
      error,
    );
    return null;
  }
}

/**
 * Main: Initialize and watch for session events
 */
async function main() {
  const { client, server } = await createOpencode();

  console.log("📡 OpenCode Transcript Hook Started");
  console.log(`📂 Transcripts: ${TRANSCRIPTS_DIR}`);

  // Subscribe to events
  const eventStream = await client.event.subscribe();

  for await (const event of eventStream.stream) {
    // Capture on session end or periodically
    if (event.type === "session.ended" || event.type === "session.summarized") {
      const sessionId = event.properties?.sessionId;
      if (sessionId) {
        await captureSessionTranscript(client, sessionId);
      }
    }

    // Also capture periodically (every 5 minutes during active work)
    if (event.type === "message.created") {
      // Periodic capture on message creation
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();

      // Capture every 5 minutes (minutes: 0, 5, 10, 15, ...)
      if (minute % 5 === 0) {
        const sessionId = event.properties?.sessionId;
        if (sessionId) {
          await captureSessionTranscript(client, sessionId);
        }
      }
    }
  }

  server.close();
}

// Error handling
process.on("SIGINT", () => {
  console.log("\n👋 Transcript hook stopped");
  process.exit(0);
});

process.on("uncaughtException", (error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

main().catch(console.error);
