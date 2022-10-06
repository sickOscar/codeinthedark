import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { UserContext } from "../components/app-context-wrapper";

export function useNotAuthenticated(): void {
    const router = useRouter();
    const user = useContext(UserContext);

    useEffect(() => {
        if (!user?.isAuthenticated) {
            router.push("/");
        }
    }, [user?.isAuthenticated, router]);
}


export function useAuthenticated(): void {
    const router = useRouter();
    const user = useContext(UserContext);

    useEffect(() => {
        if (user?.isAuthenticated) {
            router.push("/waiting-room");
        }
    }, [user?.isAuthenticated, router]);
}


