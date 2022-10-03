import { NextPage } from "next";
import { useState } from "react";
import { useNotAuthenticated } from "../customhook/useAuthenticated";
import useRouterByMessage from "../customhook/useHandleSocket";

const gifs = [
    "https://giphy.com/embed/L7zmmuaEo50MCt1Y7o",
    "https://giphy.com/embed/l0He8XWUYnXlbzleg",
    "https://giphy.com/embed/fIkT0LdGUc4GushZ2Q",
    "https://giphy.com/embed/wYyTHMm50f4Dm",
    "https://giphy.com/embed/ToMjGpx9F5ktZw8qPUQ",
    "https://giphy.com/embed/Sd3cd0SrUKZEyWmAlM",
    "https://giphy.com/embed/Yycc82XEuWDaLLi2GV",
    "https://giphy.com/embed/3ov9jLsBqPh6rjuHuM",
    "https://giphy.com/embed/d2Z4NRCUxsxZBvag",
];

const CantVoteAgain: NextPage = () => {
    useRouterByMessage();
    useNotAuthenticated();
    const [anigif, setAniGif] = useState(gifs[Math.round(Math.random() * gifs.length - 1)]);


    return (
        <div className="text-center h-screen flex flex-col justify-center p-2">
            <h1 className="text-3xl">No no no no</h1>
            <h1 className="text-3xl">You can&apos;t double vote</h1>
            <iframe className="self-center mt-6" src={anigif} width="300" height="200" frameBorder="0"></iframe>
        </div>
    );
};

export default CantVoteAgain;
