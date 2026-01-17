"use client"

import z from "zod";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "~/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "~/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { cn } from "~/lib/utils";

const formSchema = z.object({
    variableName: z.string().min(1, { message: "Variable name is required" }).regex(/^[A-Za-z_$][A_Za-z0-9_$]*$/, {
        message: "Variable name must start with a letter or underscore and should contain only letters, numbers and underscores"
    }),
    endpoint: z.string().min(1, { message: "Please enter a valid url" }), // TODO: make the url accept variables as well
    method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
    body: z.string().optional()
})

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: z.infer<typeof formSchema>) => void;
    defaultEndpoint?: string;
    defaultMethod?: "GET" | "PUT" | "POST" | "DELETE" | "PATCH";
    defaultBody?: string;
    defaultVariableName?: string;
    result?: unknown;
};

export const HTTPRequestDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultVariableName = "",
    defaultEndpoint = "",
    defaultMethod = "GET",
    defaultBody = "",
    result
}: Props) => {
    const [activeTab, setActiveTab] = useState<"configuration" | "result">("configuration");
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variableName: defaultVariableName,
            endpoint: defaultEndpoint,
            body: defaultBody,
            method: defaultMethod
        }
    });
    const watchVariableName = form.watch("variableName") || "MyApiCall";
    const watchMethod = form.watch("method");
    const showBody = ["POST", "PUT", "PATCH"].includes(watchMethod);

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
                        HTTP Request
                    </DialogTitle>
                    <DialogDescription>
                        Configure settings for the HTTP request node. <br />
                        TODO:- update the scrollbar, request body placeholder and body description
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
                                        Use this name to reference the result in other nodes: {`{{${watchVariableName}.httpResponse.data}}`} 
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        >
                        </FormField>
                        <FormField
                            control={form.control}
                            name="method"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Method</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full cursor-pointer border-2 data-[state=open]:border-blue-600">
                                                <SelectValue placeholder={"Select a method"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white rounded-lg">
                                            <SelectItem value="GET" className="cursor-pointer">GET</SelectItem>
                                            <SelectItem value="POST" className="cursor-pointer">POST</SelectItem>
                                            <SelectItem value="PUT" className="cursor-pointer">PUT</SelectItem>
                                            <SelectItem value="DELETE" className="cursor-pointer">DELETE</SelectItem>
                                            <SelectItem value="PATCH" className="cursor-pointer">PATCH</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription className="text-muted-foreground">
                                        The method to use for this request
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        >
                        </FormField>
                        <FormField
                            control={form.control}
                            name="endpoint"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Endpoint URL</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="https://api.example.com/{{previousNodeData}}"
                                            className="focus:border-blue-600 border-3" />
                                    </FormControl>
                                    <FormDescription className="text-muted-foreground">
                                        Static URL or use {"{{variables}}"} for simple values
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        >
                        </FormField>
                        {showBody &&
                            <FormField
                                control={form.control}
                                name="body"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Request Body</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder=""
                                                className="min-h-[120px] font-mono text-sm" />
                                        </FormControl>
                                        <FormDescription className="text-muted-foreground">
                                            TODO:- Update description
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            >
                            </FormField>
                        }
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