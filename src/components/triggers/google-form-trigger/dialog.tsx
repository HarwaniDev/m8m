"use client"

import { Copy, CopyIcon } from "lucide-react";
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
                        <div className="mt-4 bg-gray-100 rounded-lg ">
                            <span className="text-sm font-semibold mx-4 ">
                                Setup instructions:
                            </span>
                            <ol className="text-sm text-black/50 mx-4 p-2 list-decimal list-inside">
                                <li> Open your google form </li>
                                <li> Click three dot menu → Script editor </li>
                                <li> Copy and paste the script below </li>
                                <li> Replace WEBHOOK_URL with your webhook URL above </li>
                                <li> Save and click "Triggers" → Add trigger </li>
                                <li> Choose: From form → On form submit → Save </li>
                            </ol>
                        </div>
                        <div className="mt-4 bg-gray-100 rounded-lg ">
                            <span className="text-sm font-semibold mx-4 ">
                                Available variables:
                            </span>
                            <p className="text-sm text-black/50 mx-4 p-2">
                                {"{{googleForm.respondentEmail}}"} → Respondent's email <br />
                                {"{{googleForm.responses[`Question Name`]}}"} → Specific answer <br />
                                {"{{json googleForm.responses}}"} → All responses as JSON <br />
                            </p>
                        </div>
                        <Button
                            type="button"
                            onClick={copyAppsScript}
                            className="border-gray-400 bg-white mt-4 rounded-lg cursor-pointer"
                        >
                            <Copy className="size-5" />Copy Google Apps Script
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}