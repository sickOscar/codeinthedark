import { NextPage } from "next";
import { useState } from "react";
import { useNotAuthenticated } from "../customhook/useAuthenticated";
import useRouterByMessage from "../customhook/useHandleSocket";
import LogoFooter from "../components/logo-footer";


const gifs = [
    "https://giphy.com/embed/ZfK4cXKJTTay1Ava29",
    "https://giphy.com/embed/RipfZWzjUDH25euMpM",
    "https://giphy.com/embed/3o752n7MfQD6tyLFq8",
    "https://giphy.com/embed/bkGXLpEXC6Tsc",
    "https://giphy.com/embed/i5iC0BHktRLm3lLmWR",
    "https://giphy.com/embed/tHW1VNQiuVKcOsKHTv",
    "https://giphy.com/embed/l1J9L1hcY2xBCitFK",
    "https://giphy.com/embed/TGuRmwvXa0uCwbzMJZ",
    "https://giphy.com/embed/xT1R9LR8nuOYwZvLig",

]

const Thanks: NextPage = () => {
    useRouterByMessage();
    useNotAuthenticated();
    const [anigif, setAniGif] = useState(gifs[Math.round(Math.random() * gifs.length - 1)]);

    return (
        <div className="relative text-center h-full p-2" >
            <h4 className="text-xl text-cyan-400 uppercase mt-10">GR8, YOUR VOTE IS OUT THERE!</h4>
            <iframe className="mt-6 m-auto" src={anigif} width="300" height="200" frameBorder="0"></iframe>
            <LogoFooter></LogoFooter>
        </div>
    );
};

export default Thanks;
