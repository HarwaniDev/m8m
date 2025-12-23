"use client"

import { Button } from "~/components/ui/button"
import { useSession, signIn, signOut } from "next-auth/react"
export default function signInComponent() {
    const user = useSession();
    return (
        <>
            {user.status === "loading" ?
                <Button variant={"default"} disabled className="text-white font-semibold bg-blue-600 hover:bg-blue-500 shadow-lg border-black rounded-lg">
                    Loading
                </Button>
                :
                <Button variant={"default"} className="text-white font-semibold bg-blue-600 cursor-pointer hover:bg-blue-500 shadow-lg border-black rounded-lg"
                    onClick={async () => user.status === "authenticated" ? await signOut({
                        redirect: false
                    }) : await signIn("google")}>
                    {user.status === "authenticated" ? <p>Sign out</p> : <p>Sign in</p>}
                </Button>}
        </>
    )
}