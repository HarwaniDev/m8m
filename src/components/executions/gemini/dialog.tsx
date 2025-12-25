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
};

export const GeminiDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultVariableName = "",
    defaultCredentialId = "",
    defaultSystemPrompt = "",
    defaultUserPrompt = ""
}: Props) => {
    const { data: credentials, isLoading } = useCredentialsByType(CredentialType.GEMINI);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variableName: defaultVariableName,
            credentialId: defaultCredentialId,
            systemPrompt: defaultSystemPrompt,
            userPrompt: defaultUserPrompt
        }
    });
    const watchVariableName = form.watch("variableName") || "myGemini";

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values);
        onOpenChange(false);
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-lg border-black shadow-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        Gemini Configuration
                    </DialogTitle>
                    <DialogDescription>
                        Configure settings for the Gemini node. <br />
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
                                                        <Image src={"/gemini.svg"} alt={option.name} height={16} width={16} />
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
                                placeholder="gemini-2.5-flash"
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
            </DialogContent>
        </Dialog>
    )
}