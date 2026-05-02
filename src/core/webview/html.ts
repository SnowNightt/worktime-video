import * as fs from "node:fs";
import * as path from "node:path";
import * as vscode from "vscode";

function createNonce(): string {
  return Math.random().toString(36).slice(2, 12);
}

interface ManifestEntry {
  file: string;
  css?: string[];
  assets?: string[];
}

type ViteManifest = Record<string, ManifestEntry>;

interface WebviewHtmlOptions {
  extensionMode: vscode.ExtensionMode;
}

interface DevServerInfo {
  baseUrl: string;
}

const DEFAULT_DEV_SERVER_URL = "http://127.0.0.1:5173";
const LOCAL_API_SOURCES = "http://localhost:3000 http://127.0.0.1:3000";

function readManifest(extensionUri: vscode.Uri): ViteManifest | undefined {
  const manifestPath = vscode.Uri.joinPath(
    extensionUri,
    "webview",
    "dist",
    ".vite",
    "manifest.json",
  );

  try {
    const content = fs.readFileSync(manifestPath.fsPath, "utf8");
    return JSON.parse(content) as ViteManifest;
  } catch {
    return undefined;
  }
}

function getAssetUri(
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  assetPath: string,
): string {
  return webview
    .asWebviewUri(
      vscode.Uri.joinPath(
        extensionUri,
        "webview",
        "dist",
        ...assetPath.split("/"),
      ),
    )
    .toString();
}

function getFallbackBody(message: string): string {
  return `
		<section class="fallback">
			<h1>Worktime Video</h1>
			<p>${message}</p>
			<p>111</p>
		</section>
	`;
}

function getDevServerBaseUrl(): string {
  return (
    process.env.WORKTIME_VIDEO_WEBVIEW_DEV_SERVER_URL ?? DEFAULT_DEV_SERVER_URL
  );
}

function getDevServerConnectSources(baseUrl: string): string {
  const { host, protocol } = new URL(baseUrl);
  const websocketProtocol = protocol === "https:" ? "wss:" : "ws:";

  return `${baseUrl} ${websocketProtocol}//${host}`;
}

async function tryGetDevServer(
  extensionMode: vscode.ExtensionMode,
): Promise<DevServerInfo | undefined> {
  if (extensionMode !== vscode.ExtensionMode.Development) {
    return undefined;
  }

  const baseUrl = getDevServerBaseUrl().replace(/\/$/, "");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 300);

  try {
    const response = await fetch(`${baseUrl}/src/main.ts`, {
      signal: controller.signal,
    });

    if (!response.ok) {
      return undefined;
    }

    return { baseUrl };
  } catch {
    return undefined;
  } finally {
    clearTimeout(timeout);
  }
}

function getDevServerHtml(
  webview: vscode.Webview,
  initialState: string,
  devServer: DevServerInfo,
): string {
  const nonce = createNonce();
  const animeBackgroundUrl = `${devServer.baseUrl}/src/assets/anime-login-bg.png`;

  return `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta
			http-equiv="Content-Security-Policy"
			content="default-src 'none'; img-src ${webview.cspSource} ${devServer.baseUrl} https: data:; style-src ${webview.cspSource} 'unsafe-inline' ${devServer.baseUrl}; script-src 'nonce-${nonce}' ${devServer.baseUrl}; connect-src ${getDevServerConnectSources(devServer.baseUrl)} ${LOCAL_API_SOURCES}; font-src ${webview.cspSource} ${devServer.baseUrl};"
		/>
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Worktime Video</title>
		<style nonce="${nonce}">
			:root {
				--anime-login-bg-url: url("${animeBackgroundUrl}");
			}
		</style>
	</head>
	<body data-initial-state='${initialState}'>
		<div id="app"></div>
		<script type="module" nonce="${nonce}" src="${devServer.baseUrl}/@vite/client"></script>
		<script type="module" nonce="${nonce}" src="${devServer.baseUrl}/src/main.ts"></script>
	</body>
</html>`;
}

export async function getWebviewHtml(
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  initialState: string,
  options: WebviewHtmlOptions,
): Promise<string> {
  const devServer = await tryGetDevServer(options.extensionMode);
  if (devServer) {
    return getDevServerHtml(webview, initialState, devServer);
  }

  const manifest = readManifest(extensionUri);
  const entry = manifest?.["index.html"];
  const nonce = createNonce();

  const scriptTag = entry
    ? `<script type="module" nonce="${nonce}" src="${getAssetUri(webview, extensionUri, entry.file)}"></script>`
    : "";
  const styleTags =
    entry?.css
      ?.map(
        (cssFile) =>
          `<link rel="stylesheet" href="${getAssetUri(webview, extensionUri, cssFile)}" />`,
      )
      .join("\n") ?? "";
  const animeBackgroundAsset = entry?.assets?.find((asset) =>
    asset.includes("anime-login-bg"),
  );
  const animeBackgroundStyle = animeBackgroundAsset
    ? `<style nonce="${nonce}">
			:root {
				--anime-login-bg-url: url("${getAssetUri(webview, extensionUri, animeBackgroundAsset)}");
			}
		</style>`
    : "";
  const body = entry
    ? '<div id="app"></div>'
    : getFallbackBody(
        `No built webview assets were found in ${path.join("webview", "dist")}.`,
      );

  return `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta
			http-equiv="Content-Security-Policy"
			content="default-src 'none'; img-src ${webview.cspSource} https: data:; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; connect-src ${LOCAL_API_SOURCES}; font-src ${webview.cspSource};"
		/>
		
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Worktime Video</title>
		${animeBackgroundStyle}
		${styleTags}
	</head>
	<body data-initial-state='${initialState}'>
		${body}
		${scriptTag}
	</body>
</html>`;
}
