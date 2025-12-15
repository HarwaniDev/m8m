"use client"

import { CirclePlus, FileBraces } from "lucide-react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoaderThree } from "~/components/ui/loader";

export default function Page() {
  const router = useRouter();
  const session = useSession();
  const utils = api.useUtils()

  const createWorkflow = api.workflow.create.useMutation({
    onMutate: () => {
      const id = toast.loading("Creating workflow!")
      return { toastId: id };
    },

    onSuccess: (_data, _vars, res) => {
      toast.success("Workflow created!", {
        id: res.toastId
      });
      utils.workflow.getMany.invalidate();
    },

    onError: (error, _vars, res) => {
      toast.error("Failed to create workflow! Please try again.", {
        id: res?.toastId
      });
    }
  })
  if (session.status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderThree />
      </div>
    )
  }
  return (
    <>
      <div className="flex flex-col justify-center items-center gap-48 p-4 m-4 pt-0">
        <span className="font-bold text-4xl">
          Welcome {session?.data?.user.name ? session.data.user.name.split(" ")[0] : "to m8m"}! 👋
        </span>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
          <Button className="border-2 flex-col font-semibold cursor-pointer border-black border-dotted rounded-lg flex items-center justify-center shadow-lg min-w-[180px] min-h-[120px] sm:min-w-48 sm:min-h-48 w-full max-w-xs sm:w-auto text-center"
            onClick={() => createWorkflow.mutate()}>
            <CirclePlus />
            <span className="mt-2">Create a new workflow</span>
          </Button>
          <Button className="border-2 flex-col font-semibold cursor-pointer border-black border-dotted rounded-lg flex items-center justify-center shadow-lg min-w-[180px] min-h-[120px] sm:min-w-48 sm:min-h-48 w-full max-w-xs sm:w-auto text-center"
            onClick={() => router.push("/workflows")}>
            <FileBraces />
            <span className="mt-2">Your workflows</span>
          </Button>
        </div>
      </div>
    </>
  )
}
