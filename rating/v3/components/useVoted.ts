import { Dispatch, SetStateAction, useEffect, useState } from "react";


const getVotedValue = (initValue?: boolean): boolean | undefined => {
    if (typeof window !== 'undefined') {
        const localValue = localStorage ? localStorage.getItem("voted") : initValue?.toString();
        console.log("localValue", localValue);

        return localValue ? JSON.parse(localValue) : initValue;
    }

    return initValue;
}

export default function useVoted(voteValue: boolean | undefined) {
    const [voted, setVoted] = useState<boolean | undefined>(() => {
        return getVotedValue(voteValue);
    });

    useEffect(() => {
        localStorage.setItem("voted", JSON.stringify(voted));
    }, [voted]);

    return [voted, setVoted];
} 