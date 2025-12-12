import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "~/components/triggers/types";
import axios from "axios";

type httpRequestData = {
    endpoint?: string;
    method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
    body?: string;
};

export const httpRequestExecutor: NodeExecutor<httpRequestData> = async ({
    data,
    nodeId,
    context,
    step
}) => {
    if (!data.endpoint) {
        throw new NonRetriableError("HTTP request node: no endpoint configured");
    }
    const result = await step.run("http-request", async () => {
        const endpoint = data.endpoint;
        const method = data.method || "GET";
        let body;
        if (["POST", "PUT", "PATCH"].includes(method)) {
            body = data.body;
        }

        const response = await axios.request({
            url: endpoint,
            method: method,
            data: body
        });

        return {
            ...context,
            httpResponse: {
                status: response.status,
                statusText: response.statusText,
                data: response.data
            }
        }
    })
    return result;
};