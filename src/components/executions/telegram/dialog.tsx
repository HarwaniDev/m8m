"use client"

import z from "zod";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "~/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { useCredentialsByType } from "~/app/hooks/use-credentials";
import { CredentialType } from "generated/prisma";
import Image from "next/image";

const formSchema = z.object({
    variableName: z.string().min(1, { message: "Variable name is required" }).regex(/^[A-Za-z_$][A_Za-z0-9_$]*$/, {
        message: "Variable name must start with a letter or underscore and should contain only letters, numbers and underscores"
    }),
    chatId: z.string().min(1, "Chat ID is required"),
    content: z.string().min(1, "Content is required"),
    credentialId: z.string().min(1, "Credential is required")
})

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: z.infer<typeof formSchema>) => void;
    defaultVariableName?: string;
    defaultChatId?: string;
    defaultContent?: string;
    defaultCredentialId?: string;
};

export const TelegramDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultVariableName = "",
    defaultContent = "",
    defaultChatId = "",
    defaultCredentialId = ""
}: Props) => {
    const { data: credentials, isLoading } = useCredentialsByType(CredentialType.TELEGRAM);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variableName: defaultVariableName,
            chatId: defaultChatId,
            content: defaultContent,
            credentialId: defaultCredentialId
        }
    });
    const watchVariableName = form.watch("variableName") || "myTelegram";

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values);
        onOpenChange(false);
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-lg border-black shadow-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        Telegram Configuration
                    </DialogTitle>
                    <DialogDescription>
                        Configure settings for the Telegram node. <br />
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
                            name="credentialId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    disabled={isLoading || !credentials?.length}
                                    >
                                        <FormControl>
                                            <SelectTrigger className=" border-2 cursor-pointer data-[state=open]:border-blue-600">
                                                <SelectValue placeholder={"Select a credential"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white rounded-lg">
                                            {credentials?.map((option) => (
                                                <SelectItem
                                                    key={option.id}
                                                    value={option.id}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Image src={"/telegram.svg"} alt={option.name} height={16} width={16} />
                                                        {option.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        >
                        </FormField>
                        <FormField
                            control={form.control}
                            name="chatId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Chat ID</FormLabel>
                                    <Input
                                        {...field}
                                        placeholder="-1xx..."
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