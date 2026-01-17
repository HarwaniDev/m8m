"use client"

import z from "zod";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "~/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { useCredentialsByType } from "~/app/hooks/use-credentials";
import { CredentialType } from "generated/prisma";
import { Select } from "@radix-ui/react-select";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import Image from "next/image";
import { useState } from "react";
import { cn } from "~/lib/utils";

const formSchema = z.object({
    variableName: z.string().min(1, { message: "Variable name is required" }).regex(/^[A-Za-z_$][A_Za-z0-9_$]*$/, {
        message: "Variable name must start with a letter or underscore and should contain only letters, numbers and underscores"
    }),
    credentialId: z.string().min(1, "Credential is required"),
    systemPrompt: z.string().optional(),
    userPrompt: z.string().min(1, { message: "User prompt can't be empty" })
})

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: z.infer<typeof formSchema>) => void;
    defaultSystemPrompt?: string;
    defaultCredentialId?: string;
    defaultUserPrompt?: string;
    defaultVariableName?: string;
    result?: unknown;
};

export const OpenAIDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultVariableName = "",
    defaultCredentialId = "",
    defaultSystemPrompt = "",
    defaultUserPrompt = "",
    result
}: Props) => {
    const { data: credentials, isLoading } = useCredentialsByType(CredentialType.OPENAI);
    const [activeTab, setActiveTab] = useState<"configuration" | "result">("configuration");
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variableName: defaultVariableName,
            credentialId: defaultCredentialId,
            systemPrompt: defaultSystemPrompt,
            userPrompt: defaultUserPrompt
        }
    });
    const watchVariableName = form.watch("variableName") || "myOpenAI";

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values);
        onOpenChange(false);
    }

    const formatResult = (result: unknown): string => {
        if (result === null || result === undefined) {
            return "";
        }
        if (typeof result === "string") {
            return result;
        }
        if (typeof result === "object") {
            try {
                return JSON.stringify(result, null, 2);
            } catch {
                return String(result);
            }
        }
        return String(result);
    };

    const resultText = result ? formatResult(result) : "";
    const hasResult = result !== null && result !== undefined;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-lg border-black shadow-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        OpenAI Configuration
                    </DialogTitle>
                    <DialogDescription>
                        Configure settings for the OpenAI node. <br />
                    </DialogDescription>
                </DialogHeader>
                
                {/* Tab Header */}
                <div className="flex border-b mt-4">
                    <button
                        type="button"
                        onClick={() => setActiveTab("configuration")}
                        className={cn(
                            "flex-1 px-4 py-2 text-sm font-medium transition-colors",
                            "border-b-2 border-transparent",
                            activeTab === "configuration"
                                ? "border-blue-600 text-blue-600 bg-blue-50"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Configuration
                    </button>
                    {hasResult && (
                        <button
                            type="button"
                            onClick={() => setActiveTab("result")}
                            className={cn(
                                "flex-1 px-4 py-2 text-sm font-medium transition-colors",
                                "border-b-2 border-transparent",
                                activeTab === "result"
                                    ? "border-blue-600 text-blue-600 bg-blue-50"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Result
                        </button>
                    )}
                </div>

                {/* Tab Content */}
                {activeTab === "configuration" && (
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
                                                        <Image src={"/openai.svg"} alt={option.name} height={16} width={16} />
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
                        <FormItem>
                            <Input
                                placeholder="gpt-4o"
                                className="font-mono"
                                readOnly
                            />
                            <FormDescription className="text-muted-foreground">
                                Support for more models will be added soon.
                            </FormDescription>
                        </FormItem>
                        <FormField
                            control={form.control}
                            name="systemPrompt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>System Prompt (optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder={"You are a helpful assistant..."}
                                            className="focus:border-blue-600 border-3 font-mono" />
                                    </FormControl>
                                    <FormDescription className="text-muted-foreground">
                                        Sets the behaviour of the assistant.
                                        Use {"{{variables}}"} for simple values or {"{{json variable}}"} to stringify objects.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        >
                        </FormField>
                        <FormField
                            control={form.control}
                            name="userPrompt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>User Prompt</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder={"Summarize this text: {{json httpResponse.data}}"}
                                            className="focus:border-blue-600 border-3 font-mono" />
                                    </FormControl>
                                    <FormDescription>
                                        The prompt to send to AI.
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
                )}

                {activeTab === "result" && hasResult && (
                    <div className="mt-4 space-y-4">
                        <div className="text-sm font-semibold text-muted-foreground">Execution Result:</div>
                        <div className="bg-muted rounded border p-4 max-h-96 overflow-y-auto">
                            <pre className="text-xs font-mono whitespace-pre-wrap break-words">
                                {resultText}
                            </pre>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
