"use client"

import z from "zod";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "~/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";

const formSchema = z.object({
    variableName: z.string().min(1, { message: "Variable name is required" }).regex(/^[A-Za-z_$][A_Za-z0-9_$]*$/, {
        message: "Variable name must start with a letter or underscore and should contain only letters, numbers and underscores"
    }),
    webhookUrl: z.string().min(1, "Webhook url is required"),
    content: z.string().min(1, "Content is required"),
    username: z.string().optional()
})

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: z.infer<typeof formSchema>) => void;
    defaultVariableName?: string;
    defaultWebhookURL?: string;
    defaultContent?: string;
    defaultUsername?: string;
};

export const DiscordDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultVariableName = "",
    defaultContent = "",
    defaultUsername = "",
    defaultWebhookURL = ""
}: Props) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variableName: defaultVariableName,
            webhookUrl: defaultWebhookURL,
            content: defaultContent,
            username: defaultUsername
        }
    });
    const watchVariableName = form.watch("variableName") || "myDiscord";

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values);
        onOpenChange(false);
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-lg border-black shadow-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        Discord Configuration
                    </DialogTitle>
                    <DialogDescription>
                        Configure settings for the Discord node. <br />
                        TODO:- update the scrollbar, request body placeholder and body description
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-8 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="variableName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Variable Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder={watchVariableName}
                                            className="focus:border-blue-600 border-3" />
                                    </FormControl>
                                    <FormDescription className="text-muted-foreground">
                                        Use this name to reference the result in other nodes: {`{{${watchVariableName}.text}}`}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        >
                        </FormField>
                        <FormField
                            control={form.control}
                            name="webhookUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Webhook URL</FormLabel>
                                    <Input
                                        {...field}
                                        placeholder="https://discord.com/api/webhooks/..."
                                        className="focus:border-blue-600 border-3"
                                    >
                                    </Input>
                                    <FormMessage />
                                </FormItem>
                            )}
                        >
                        </FormField>
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Message Content</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder={"Summary: {{myGemini.text}}"}
                                            className="focus:border-blue-600 border-3 font-mono" />
                                    </FormControl>
                                    <FormDescription className="text-muted-foreground">
                                        The message to send.
                                        Use {"{{variables}}"} for simple values or {"{{json variable}}"} to stringify objects.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        >
                        </FormField>
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bot Username (optional)</FormLabel>
                                    <Input
                                        {...field}
                                        placeholder="Workflow bot"
                                        className="focus:border-blue-600 border-3"
                                    >
                                    </Input>
                                    <FormMessage />
                                </FormItem>
                            )}
                        >
                        </FormField>
                        <DialogFooter className="mt-4">
                            <Button type="submit" className="border-black text-white bg-blue-600 rounded-lg font-semibold cursor-pointer">
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}