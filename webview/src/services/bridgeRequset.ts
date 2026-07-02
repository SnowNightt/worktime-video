import type { BridgeRequestPayload, ExtensionToWebviewMessage } from "@shared/protocol";
import { postMessage } from "./vscode";
import { useLoading } from "@/features/cloude-music/hooks/useLoading";

const { startLoad, stopLoad } = useLoading();
interface PendingRequest {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}
let reqSeq = 0;
const createRequestId = () => {
  reqSeq += 1;
  return `bridge-${new Date().getTime()}-${reqSeq}`;
};
window.addEventListener("message", (event: MessageEvent<ExtensionToWebviewMessage>) => {
  const data = event.data;
  if (data.type !== "response/api") {
    return;
  }
  const reqId = data.reqId;
  const res = pendingRequest.get(reqId)!;
  pendingRequest.delete(reqId);
  console.log("[bridge:webview] response", {
    reqId,
    ok: data.payload.ok,
    status: data.payload.status,
  });
  if (data.payload.ok) {
    res.resolve(data.payload.data);
  } else {
    res.reject(new Error(data.payload.message));
  }

  stopLoad();
});
const pendingRequest = new Map<string, PendingRequest>();
export const bridgeRequest = <T = unknown>(config: BridgeRequestPayload): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const reqId = createRequestId();
    console.log("[bridge:webview] request", {
      reqId,
      method: config.method ?? "GET",
      url: config.url,
      hasData: config.data !== undefined,
      hasParams: config.params !== undefined,
    });
    pendingRequest.set(reqId, {
      resolve: value => resolve(value as T),
      reject,
    });
    postMessage({
      type: "request/api",
      reqId,
      payload: config,
    });
    if (config.showLoading) {
      startLoad();
    }
  });
};

export default {
  request: bridgeRequest,
};
