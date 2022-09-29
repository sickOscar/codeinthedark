import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { UserContext } from "./context/app.context";

export function useNotAuthenticated() {
    const router = useRouter();
    const user = useContext(UserContext);

    useEffect(() => {
        if (!user?.isAuthenticated) {
            router.push("/");
        }
    }, [user?.isAuthenticated, router]);
}


export function useAuthenticated() {
    const router = useRouter();
    const user = useContext(UserContext);

    useEffect(() => {
        if (user?.isAuthenticated) {
            router.push("/waiting-room");
        }
    }, [user?.isAuthenticated, router]);
}


