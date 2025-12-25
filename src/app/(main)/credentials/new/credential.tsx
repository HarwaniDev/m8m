"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { CredentialType } from "generated/prisma";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";
import { useCreateCredential, useSuspenseCredential, useUpdateCredential } from "~/app/hooks/use-credentials";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from "~/components/ui/select";

const formSchema = z.object({
    name: z.string().min(1, "name is required"),
    type: z.nativeEnum(CredentialType),
    value: z.string().min(1, "API key is required")
});

type FormValues = z.infer<typeof formSchema>;

interface CredentialFormProps {
    initialData?: {
        id?: string;
        name: string;
        type: CredentialType;
        value: string;
    };
};

const credentialsTypeOptions = [
    {
        value: CredentialType.GEMINI,
        label: "GEMINI",
        logo: "/gemini.svg"
    },
    // TODO: complete below
    {
        value: CredentialType.TELEGRAM,
        label: "TELEGRAM",
        logo: "/telegram.svg"
    }
    // {
    //     value: CredentialType.ANTHROPIC,
    //     label: "Anthropic",
    //     logo: "/Anthropic.svg"
    // }
]
export const CredentialForm = ({ initialData }: CredentialFormProps) => {
    const router = useRouter();
    const createCredential = useCreateCredential();
    const updateCredential = useUpdateCredential();

    const isEdit = initialData?.id;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            type: CredentialType.GEMINI,
            value: ""
        }
    })
    const onSubmit = async (values: FormValues) => {
        if (isEdit && initialData.id) {
            await updateCredential.mutateAsync({
                id: initialData.id,
                ...values
            }, {
                onSuccess: () => {
                    router.push(`/credentials`);
                }
            });
        } else {
            createCredential.mutateAsync(values, {
                onSuccess: () => {
                    router.push(`/credentials`);
                }
            });
        }
    }
    return (
        <Card className="shadow-none rounded-lg">
            <CardHeader>
                <CardTitle>
                    {isEdit ? "Edit credential" : "Create credential"}
                </CardTitle>
                <CardDescription>
                    {isEdit ? "Update your API key, credential details or bot token here" : "Add a new API key, credential or bot token"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input className="focus:border-blue-600 border-3" placeholder="My API key" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        >
                        </FormField>
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="mt-4">Type</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className=" border-2 data-[state=open]:border-blue-600">
                                                <SelectValue placeholder={"Select a type"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white rounded-lg">
                                            {credentialsTypeOptions.map((option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Image
                                                            src={option.logo}
                                                            alt={option.label}
                                                            width={16}
                                                            height={16}
                                                        />
                                                        {option.label}
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
                            name="value"
                            render={({ field }) => (
                                <FormItem className="mt-4">
                                    <FormLabel>Value</FormLabel>
                                    <FormControl>
                                        <Input className="focus:border-blue-600 border-3" type="password" placeholder="gk-..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        >
                        </FormField>
                        <div className="flex gap-4 items-center justify-center mt-4">
                            <Button
                                type="submit"
                                disabled={createCredential.isPending || updateCredential.isPending}
                                className="border-black rounded-lg bg-blue-600 text-white font-semibold cursor-pointer"
                            >
                                {isEdit ? "Update" : "Create"}
                            </Button>
                            <Button
                                type="button"
                                asChild
                                className="border-black rounded-lg text-black font-semibold"
                            >
                                <Link href={"/credentials"} prefetch>
                                    Cancel
                                </Link>
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
};

export const CredentialView = ({ credentialId }: { credentialId: string }) => {
    const credential = useSuspenseCredential(credentialId);
    return <CredentialForm initialData={credential[0]} />
}
