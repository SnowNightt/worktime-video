import * as vscode from "vscode";

import {
  BridgeRequestMessage,
  type ExtensionToWebviewMessage,
  type WebviewToExtensionMessage,
  type WorktimeWebviewState,
} from "../../../shared/protocol";
import { getWebviewHtml } from "./html";
import { BridgeHttpClient } from "../request/bridgeHttpClient";

const DEFAULT_STATE: WorktimeWebviewState = {
  title: "Worktime Video",
  description: "Vue webview for worktime media.",
  features: [
    {
      id: "music",
      title: "Music",
      description: "Music playback inside the webview.",
    },
    {
      id: "bilibili",
      title: "Bilibili",
      description: "Bilibili content inside the webview.",
    },
    {
      id: "test",
      title: "Test",
      description: "Test area inside the webview.",
    },
  ],
};

export const WORKTIME_SIDEBAR_VIEW_ID = "worktime-video.sidebarView";

function escapeInitialState(state: WorktimeWebviewState): string {
  return JSON.stringify(state)
    .replaceAll("&", "&amp;")
    .replaceAll("'", "&#39;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export class WorktimeWebviewPanel implements vscode.WebviewViewProvider {
  private readonly state: WorktimeWebviewState;
  private view: vscode.WebviewView | undefined;
  private bridgeRequest: BridgeHttpClient;
  public constructor(private readonly context: vscode.ExtensionContext) {
    this.state = DEFAULT_STATE;
    this.bridgeRequest = new BridgeHttpClient(context.secrets);
  }

  public async resolveWebviewView(webviewView: vscode.WebviewView): Promise<void> {
    this.view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.context.extensionUri, "webview", "dist"),
        vscode.Uri.joinPath(this.context.extensionUri, "webview", "src", "assets"),
      ],
    };
    webviewView.webview.html = await getWebviewHtml(
      webviewView.webview,
      this.context.extensionUri,
      escapeInitialState(this.state),
      {
        extensionMode: this.context.extensionMode,
      }
    );

    webviewView.onDidDispose(() => {
      if (this.view === webviewView) {
        this.view = undefined;
      }
    });

    webviewView.webview.onDidReceiveMessage((message: WebviewToExtensionMessage) => {
      void this.handleMessage(message);
    });
  }

  public async postMessage(message: ExtensionToWebviewMessage): Promise<boolean> {
    return this.view?.webview.postMessage(message) ?? false;
  }
  private async handleBridgeRequest(message: BridgeRequestMessage) {
    try {
      const bridgeRes = await this.bridgeRequest.request(message.payload);
      this.postMessage({
        type: "response/api",
        reqId: message.reqId,
        payload: {
          ok: true,
          status: 200,
          data: bridgeRes,
        },
      });
    } catch (error) {
      await this.postMessage({
        type: "response/api",
        reqId: message.reqId,
        payload: {
          ok: false,
          message: error instanceof Error ? error.message : String(error),
        },
      });
    }
  }
  private async handleMessage(message: WebviewToExtensionMessage): Promise<void> {
    if (message.type === "ui/ready") {
      await this.postMessage({
        type: "host/init-state",
        payload: this.state,
      });
      return;
    }
    if (message.type === "request/api") {
      this.handleBridgeRequest(message);
    }
  }
}
