import { NextPage } from "next";
import { useState } from "react";
import { useNotAuthenticated } from "../customhook/useAuthenticated";
import useRouterByMessage from "../customhook/useHandleSocket";
import LogoFooter from "../components/logo-footer";

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
    const [anigif, setAniGif] = useState(gifs[Math.floor(Math.random() * (gifs.length - 1))]);


    return (
        <div className="relative text-center h-full p-2" >
            <h4 className="text-xl text-cyan-400 uppercase mt-10">no no no no</h4>
            <h1 className="text-xl text-cyan-400 uppercase">You can&apos;t double vote</h1>
            <iframe className="mt-6 m-auto" src={anigif} width="300" height="200" frameBorder="0"></iframe>
            <LogoFooter></LogoFooter>
        </div>
    );
};

export default CantVoteAgain;