import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "~/components/triggers/types";
import axios from "axios";
import Handlebars from "handlebars";
import { httpRequestChannel } from "~/inngest/channels/http-request";

type httpRequestData = {
    variableName?: string;
    endpoint?: string;
    method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
    body?: string;
};

Handlebars.registerHelper("json", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(jsonString);
    return safeString;
})

export const httpRequestExecutor: NodeExecutor<httpRequestData> = async ({
    data,
    nodeId,
    context,
    step,
    publish
}) => {

    await publish(httpRequestChannel().status({
        nodeId,
        status: "loading"
    }));

    if (!data.endpoint) {
        await publish(httpRequestChannel().status({
            nodeId,
            status: "error"
        }));
        throw new NonRetriableError("HTTP request node: no endpoint configured");
    }
    if (!data.variableName) {
        await publish(httpRequestChannel().status({
            nodeId,
            status: "error"
        }));
        throw new NonRetriableError("Variable name not configured");
    }
    try {
        const result = await step.run("http-request", async () => {
            // handlebars will help to populate the endpoint with context from previous nodes
            const endpoint = Handlebars.compile(data.endpoint)(context);
            const method = data.method || "GET";
            let body;
            let headers;
            if (["POST", "PUT", "PATCH"].includes(method)) {
                const resolvedBody = Handlebars.compile(data.body || "{}")(context);
                const jsonBody = JSON.parse(resolvedBody);
                body = jsonBody;
                headers = {
                    "Content-type": "application/json"
                }
            }
            const response = await axios.request({
                url: endpoint,
                method: method,
                data: body,
                // headers: headers
            });
            const responsePayload = {
                httpResponse: {
                    status: response.status,
                    statusText: response.statusText,
                    data: response.data
                }
            }
            if (data.variableName) {
                await publish(httpRequestChannel().status({
                    nodeId,
                    status: "success"
                }));
                return {
                    ...context,
                    [data.variableName]: responsePayload
                }
            };
            return {
                ...context,
                ...responsePayload
            };
        });
        return result;
    } catch (error) {
        await publish(httpRequestChannel().status({
            nodeId,
            status: "error"
        }));
        throw error;
    }
};