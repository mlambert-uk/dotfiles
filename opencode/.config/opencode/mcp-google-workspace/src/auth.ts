#!/usr/bin/env node

import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { parse as parseUrl } from "url";
import open from "open";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/calendar.readonly",
];

const TOKEN_PATH = path.join(process.env.HOME || "", ".mcp-google-token.json");
const CREDENTIALS_PATH = path.join(
  process.env.HOME || "",
  ".mcp-google-credentials.json"
);

async function authenticate() {
  try {
    const credentials = JSON.parse(
      await fs.readFile(CREDENTIALS_PATH, "utf-8")
    );
    const { client_secret, client_id, redirect_uris } =
      credentials.installed || credentials.web;

    // Use http://localhost:3000 as the redirect URI
    const oauth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      "http://localhost:3000"
    );

    // Check if we already have a token
    try {
      const token = JSON.parse(await fs.readFile(TOKEN_PATH, "utf-8"));
      oauth2Client.setCredentials(token);
      console.log("✓ Authentication token found and loaded");
      return;
    } catch (err) {
      console.log("No existing token found, starting OAuth flow...");
    }

    // Generate auth URL
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });

    console.log("\nOpening browser for authentication...");
    console.log("If the browser doesn't open, visit this URL:");
    console.log(authUrl);

    // Create a local server to receive the callback
    const server = http.createServer(async (req, res) => {
      try {
        if (req.url && req.url.indexOf("code=") > -1) {
          const qs = new URL(req.url, "http://localhost").searchParams;
          const code = qs.get("code");

          if (!code) {
            res.end("Error: No authorization code received");
            return;
          }

          res.end(
            "Authentication successful! You can close this window and return to the terminal."
          );

          const { tokens } = await oauth2Client.getToken(code);
          oauth2Client.setCredentials(tokens);

          await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens));
          console.log("\n✓ Token saved to", TOKEN_PATH);

          server.close();
        }
      } catch (e) {
        console.error("Error during OAuth callback:", e);
        res.end("Error during authentication");
      }
    });

    server.listen(3000, () => {
      console.log("Local server listening on port 3000...");
      open(authUrl);
    });
  } catch (error) {
    console.error("Error during authentication:", error);
    console.error("\nPlease ensure you have:");
    console.error(
      "1. Downloaded OAuth credentials from Google Cloud Console"
    );
    console.error(`2. Saved them to: ${CREDENTIALS_PATH}`);
    process.exit(1);
  }
}

authenticate();
