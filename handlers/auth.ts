import type { Context } from "hono";
import { chromium, type Browser, type Page } from "playwright";
import { join } from "node:path";
import { HTTPException } from "hono/http-exception";

const CDP_PORT = 9222;
const CDP_URL = `http://127.0.0.1:${CDP_PORT}`;
const USER_DATA_DIR = join(import.meta.dirname, "..", "auth", "chrome-profile");
const cdpCheckTimeoutMs = 15 * 1000;
const cdpCheckIntervalMs = 200;
const cdpConnectRetries = 5;

let chrome: ReturnType<typeof Bun.spawn> | null = null;
let browser: Browser | null = null;
let page: Page | null = null;

export async function startBrowserWithSessionHandler(c: Context) {
  if (page) {
    return c.json({ message: "Browser already started" }, 200);
  }

  if (!chrome || chrome.exitCode !== null) {
    try {
      chrome = Bun.spawn([
        "google-chrome-stable",
        `--remote-debugging-port=${CDP_PORT}`,
        `--remote-debugging-address=127.0.0.1`,
        `--user-data-dir=${USER_DATA_DIR}`,
        "--profile-directory=Profile 3",
        "--no-first-run",
        "--no-default-browser-check",
      ], {
        stdout: "ignore",
        stderr: "ignore",
      });
    } catch (error) {
      throw new Error("Failed to start chrome", { cause: error });
    }
  }

  await waitForCdpConnection();

  if (chrome.exitCode !== null) {
    chrome = null;
    throw new HTTPException(500, {
      message: "Chrome exited before CDP connection was ready",
    });
  }

  browser = await connectOverCdpWithRetry();
  const context = browser.contexts()[0];
  if (!context) {
    throw new HTTPException(500, { message: "No browser context from CDP" });
  }

  page = context.pages()[0] ?? await context.newPage();
  c.set("page", page);

  return c.json({ message: "Browser started with session" }, 200);
}

async function waitForCdpConnection() {
  const deadline = Date.now() + cdpCheckTimeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${CDP_URL}/json/version`);
      if (response.ok) {
        return;
      }
    } catch {
      // Chrome not listening yet
    }
    await Bun.sleep(cdpCheckIntervalMs);
  }

  throw new HTTPException(504, { message: "CDP connection timed out" });
}

async function connectOverCdpWithRetry() {
  let lastError: unknown;
  for (let attempt = 0; attempt < cdpConnectRetries; attempt++) {
    try {
      return await chromium.connectOverCDP(CDP_URL);
    } catch (error) {
      lastError = error;
      await Bun.sleep(300 * (attempt + 1));
    }
  }

  throw new Error("Failed to connect over CDP", { cause: lastError });
}