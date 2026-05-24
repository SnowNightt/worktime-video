import { BridgeRequestPayload } from "@shared/protocol";
import { postMessage } from "./vscode";

interface PendingRequest {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}
let reqSeq = 0;
const createRequestId = () => {
  reqSeq += 1;
  return `bridge-${new Date().getTime()}-${reqSeq}`;
};
window.addEventListener("message", (event: MessageEvent) => {
  const data = event.data;
  if (data.type !== "bridge/response") {
    return;
  }
  const reqId = data.reqId;
  const res = pendingRequest.get(reqId);
  pendingRequest.delete(reqId);
  if (data.payload.ok) {
    res?.resolve(data.payload);
  } else {
    res?.reject(new Error(data.payload.message));
  }
});
const pendingRequest = new Map<string, PendingRequest>();
export const bridgeRequest = (config: BridgeRequestPayload) => {
  return new Promise((resolve, reject) => {
    const reqId = createRequestId();
    pendingRequest.set(reqId, {
      resolve,
      reject,
    });
    postMessage({
      type: "request/api",
      reqId,
      payload: config,
    });
  });
};
