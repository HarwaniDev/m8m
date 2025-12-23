import type { CredentialType } from "generated/prisma";
import { toast } from "sonner";
import { api } from "~/trpc/react"


export const useSuspenseCredentials = () => {
    return api.credential.getMany.useSuspenseQuery();
};

export const useCreateCredential = () => {
    const utils = api.useUtils();

    return api.credential.create.useMutation({
        onMutate: () => {
            const id = toast.loading("Creating credential...");
            return { toastId: id };
        },
        onSuccess: (_data, _vars, res) => {
            toast.success("Credential created!", {
                id: res.toastId
            });
            utils.credential.getMany.invalidate();
        },
        onError: (error, _vars, res) => {
            toast.error("Failed to create credential. Please try again.", {
                id: res?.toastId
            });
        }
    });
};

export const useRemoveCredential = () => {
    const utils = api.useUtils();

    return api.credential.remove.useMutation({
        onMutate: () => {
            const id = toast.loading("Removing credential...");
            return { toastId: id };
        },
        onSuccess: (_data, _vars, res) => {
            toast.success("Credential removed!", {
                id: res.toastId
            });
            utils.credential.getMany.invalidate();
        },
        onError: (error, _vars, res) => {
            toast.error("Failed to remove credential. Please try again.", {
                id: res?.toastId
            });
        }
    });
};

export const useSuspenseCredential = (id: string) => {
    return api.credential.getOne.useSuspenseQuery({ id });
}

export const useUpdateCredential = () => {
    const utils = api.useUtils();

    return api.credential.update.useMutation({
        onMutate: () => {
            const id = toast.loading("Updating credential...");
            return { toastId: id };
        },
        onSuccess: (_data, _vars, res) => {
            toast.success("Credential updated!", {
                id: res.toastId
            });
            utils.credential.getMany.invalidate();
            if (_vars.id) {
                utils.credential.getOne.invalidate({ id: _vars.id });
            }
        },
        onError: (error, _vars, res) => {
            toast.error("Failed to update credential. Please try again.", {
                id: res?.toastId
            });
        }
    });
};

export const useCredentialsByType = (type: CredentialType) => {
    return api.credential.getbyType.useSuspenseQuery({ type });
};
