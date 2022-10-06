import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../components/app-context-wrapper";
import { Message, MessageTypes } from "../utils/messages";

export default function useRouterByMessage(): string {

    const [feedback, setFeedback] = useState<string>("");
    const router = useRouter();
    const socket = useContext(SocketContext);

    useEffect(() => {

        const voted = JSON.parse(localStorage.getItem("voted") || "false");

        const handlerMessage = (message: Message) => {
            switch (message.type) {
                case MessageTypes.WAITING:
                case MessageTypes.EVENT_COUNTDOWN:
                case MessageTypes.ROUND_COUNTDOWN:
                case MessageTypes.ROUND_END_COUNTDOWN:
                    router.push("/waiting-room");
                    setFeedback(message.data?.missing || "no data...");
                    break;
                case MessageTypes.RECEIVING_RESULTS:
                    router.push("/waiting-room");
                    setFeedback("receving layouts...");
                    break;
                case MessageTypes.VOTE_COUNTDOWN:
                    const roundId = message.data?.round;
                    if (roundId && !voted) {
                        router.push(`/round-voting/${roundId}`);
                    }
                    break;
                case MessageTypes.SHOWING_RESULTS:
                    router.push("/waiting-room");
                    setFeedback("voting is over!");
                    break;

                default:
                    break;
            }
        };

        socket?.on("message", handlerMessage);
        return () => {
            socket?.off("message", handlerMessage);
        }
    }, [socket, router]);

    return feedback
}


