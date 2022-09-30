import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import { Message, MessageTypes } from "../utils/messages";
import { SocketContext } from "./context/app.context";

export default function useRouterByMessage(): string {

    const [feedback, setFeedback] = useState<string>("");
    const router = useRouter();
    const socket = useContext(SocketContext);

    const handlerMessage = useCallback((message: Message) => {
        console.log(message);

        switch (message.type) {
            case MessageTypes.WAITING:
            case MessageTypes.EVENT_COUNTDOWN:
            case MessageTypes.ROUND_COUNTDOWN:
                setFeedback(message.data?.missing || "no data...");
                break;
            case MessageTypes.ROUND_END_COUNTDOWN:
                setFeedback("This is the end my only friend");
                break;
            case MessageTypes.SHOWING_RESULTS:
                setFeedback("Stop, no more votes");
                break;
            case MessageTypes.RECEIVING_RESULTS:
                const roundId = message.data?.round;
                if (roundId) {
                    router.push(`/round-voting/${roundId}`);
                }
                break;

            default:
                break;
        }
    }, [router]);


    useEffect(() => {
        socket?.on("message", handlerMessage);
        return () => {
            socket?.off("message", handlerMessage);
        }
    }, [socket, handlerMessage]);

    return feedback
}


