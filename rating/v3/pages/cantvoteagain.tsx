import { NextPage } from "next";
import { useNotAuthenticated } from "../components/useAuthenticated";
import useRouterByMessage from "../components/useHandleSocket";


const CantVoteAgain: NextPage = () => {
    const feedback = useRouterByMessage();
    useNotAuthenticated();

    return (
        <div className="text-center h-screen flex flex-col justify-center p-2">
            <h1 className="text-3xl">No no no no</h1>
            <h1 className="text-3xl">Can&apos;t double vote</h1>
            <h1 className="text-3xl mb-3">Can&apos;t love me anymore</h1>
            <img
                alt="no way icon"
                src="/noway.webp"
                className="w-20 self-center"
            />
        </div>
    );
};

export default CantVoteAgain;
