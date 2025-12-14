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

const formSchema = z.object({
    variableName: z.string().min(1, { message: "Variable name is required" }).regex(/^[A-Za-z_$][A_Za-z0-9_$]*$/, {
        message: "Variable name must start with a letter or underscore and should contain only letters, numbers and underscores"
    }),
    endpoint: z.string().url({ message: "Please entera valid url" }),
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
};

export const HTTPRequestDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultVariableName = "",
    defaultEndpoint = "",
    defaultMethod = "GET",
    defaultBody = ""
}: Props) => {

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
                                            <SelectTrigger className="w-full cursor-pointer">
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
            </DialogContent>
        </Dialog>
    )
}