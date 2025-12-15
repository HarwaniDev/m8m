"use client"

import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogDescription } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { generateGoogleFormScript } from "./apps-script";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export const GoogleFormTriggerDialog = ({ open, onOpenChange }: Props) => {
    const params = useParams();
    const workflowId = params.workflowId as string;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const webhookUrl = `${baseUrl}/api/webhooks/google-form?workflowId=${workflowId}`;

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(webhookUrl);
            toast.success("Webhook URL copied to clipboard!");
        } catch (error) {
            toast.error("Failed to copy URL")
        }
    }
    const copyAppsScript = async () => {
        try {
            await navigator.clipboard.writeText(generateGoogleFormScript(webhookUrl));
            toast.success("Script copied to clipboard!");
        } catch (error) {
            toast.error("Failed to copy script")
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
                        Use this webhook URL in your Google Form's apps script to trigger this workflow when a form is submitted.
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
                        TODO: add steps
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                onClick={copyAppsScript}
                                className="border-gray-400 rounded-lg cursor-pointer"
                            >
                                Copy Apps Script
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}