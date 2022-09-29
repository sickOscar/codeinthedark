import { NextPage } from "next";
import { useNotAuthenticated } from "../components/useAuthenticated";


const Thanks: NextPage = () => {

    useNotAuthenticated();

    return (
        <div className="text-center h-screen flex flex-col justify-center">
            <h1 className="text-3xl mb-3">Thank UUU</h1>
            <img
                alt="voted icon"
                src="/voted.png"
                className="w-16 h-16 self-center"
            />
        </div>
    );
};

export default Thanks;
