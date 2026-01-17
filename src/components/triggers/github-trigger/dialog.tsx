"use client"

import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogDescription } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export const GithubTriggerDialog = ({ open, onOpenChange }: Props) => {
    const params = useParams();
    const workflowId = params.workflowId as string;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const webhookUrl = `${baseUrl}/api/webhooks/github?workflowId=${workflowId}`;

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(webhookUrl);
            toast.success("Webhook URL copied to clipboard!");
        } catch (error) {
            toast.error("Failed to copy URL")
        }
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-lg border-black shadow-xl">
                <DialogHeader>
                    <DialogTitle>
                        Google Form Trigger Configuration
                    </DialogTitle>
                    <DialogDescription>
                        Add this webhook URL to your github repository to trigger this workflow whenever a change is made.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="webhook-url">
                            Webhook URL
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                id="webhook-url"
                                value={webhookUrl}
                                readOnly
                                className="font-mono text-sm"
                            >
                            </Input>
                            <Button
                                type="button"
                                size="icon"
                                onClick={copyToClipboard}
                                className="border-gray-400 rounded-lg cursor-pointer"
                            >
                                <CopyIcon className="size-4" />
                            </Button>
                        </div>
                        
                        <div className="gap-2 bg-gray-100 p-2 rounded-lg">
                            <h4 className="text-sm font-semibold">
                                Setup instructions
                            </h4>
                            <ol className="list-decimal list-inside text-sm">
                                <li>
                                    Go to Github → Your repository settings → webhooks → Add webhook
                                </li>
                                <li>
                                    In payload URL → Paste the webhook URL provided above
                                </li>
                                <li>
                                    Set Content type to application/json
                                </li>
                                <li>
                                    Select the events for which you want to trigger the webhook
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}