export const FEATURE_IDS = ["music", "bilibili", "test"] as const;

export type FeatureId = (typeof FEATURE_IDS)[number];

export interface FeatureDescriptor {
  id: FeatureId;
  title: string;
  description: string;
}

export interface WorktimeWebviewState {
  title: string;
  description: string;
  features: FeatureDescriptor[];
}

export interface WebviewReadyMessage {
  type: "ui/ready";
}

export interface InitStateMessage {
  type: "host/init-state";
  payload: WorktimeWebviewState;
}

export interface HostErrorMessage {
  type: "host/error";
  message: string;
}
export interface BridgeRequestPayload {
  url: string;
  method: "GET" | "POST";
  params?: object;
  data?: object;
  isTimestamp?: boolean;
}
// 发送网络请求通信
export interface BridgeRequestMessage {
  type: "request/api";
  reqId: string;
  payload: BridgeRequestPayload;
}
export interface BridgeResponseMessage {
  type: "response/api";
  reqId: string;
  payload:
    | {
        ok: true;
        status: number;
        data: unknown;
        headers?: Record<string, string>;
      }
    | {
        ok: false;
        status?: number;
        message: string;
        data?: unknown;
      };
}
// webview向拓展侧通信传递数据的类型
export type WebviewToExtensionMessage = WebviewReadyMessage | BridgeRequestMessage;
// 拓展侧向webview通信传递数据的类型
export type ExtensionToWebviewMessage = InitStateMessage | HostErrorMessage | BridgeResponseMessage;
