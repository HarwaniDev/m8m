import type { Realtime } from "@inngest/realtime";
import { useEffect, useState } from "react";
import { useInngestSubscription } from "@inngest/realtime/hooks"

interface UseNodeResultOptions {
    nodeId: string;
    channel: string;
    topic: string;
    refreshToken: () => Promise<Realtime.Subscribe.Token>;
};

export function useNodeResult({
    nodeId,
    channel,
    topic,
    refreshToken
}: UseNodeResultOptions) {
    const [result, setResult] = useState<unknown>(null);

    const { data } = useInngestSubscription({
        refreshToken,
        enabled: true
    });

    useEffect(() => {
        if (!data.length) {
            return;
        }
        const latestMessage = data.filter((msg) => msg.kind === "data" && msg.channel === channel && msg.topic === topic && msg.data.nodeId === nodeId)
            .sort((a, b) => {
                if (a.kind === "data" && b.kind === "data") {
                    return (
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );
                }
                return 0;
            })[0];
        if (latestMessage?.kind === "data") {
            setResult(latestMessage.data.result);
        }
    }, [data, nodeId, channel, topic])
    return result;
}
