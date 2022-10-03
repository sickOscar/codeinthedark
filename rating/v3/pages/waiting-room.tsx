import { NextPage } from "next";
import { useEffect } from "react";
import { useNotAuthenticated } from "../customhook/useAuthenticated";
import useHandleSocket from "../customhook/useHandleSocket";
import LogoFooter from "../components/logo-footer";


const WaitingRoom: NextPage = () => {

  const feedback = useHandleSocket();
  useNotAuthenticated();

  useEffect(() => {
    localStorage.setItem("voted", JSON.stringify(false));
  }, []);

  const parseFeedback = () => {
    const showCounter = !!feedback.match(/^.{2}\:.{2}$/);
    let feedbackElement = <div className="mt-8"><h4 className="text-xl text-white" dangerouslySetInnerHTML={{ __html: feedback }}></h4></div>
    if (showCounter) {
      feedbackElement = <h1 className="text-[5rem] text-white mt-12">{feedback}</h1>;
    }

    return feedbackElement;
  }

  return (
    <div className="relative text-center h-full p-2 bg-content-image bg-top bg-cover" >
      <h4 className="text-xl text-cyan-400 uppercase mt-10">I am a patient human being</h4>
      <h4 className="text-xl text-cyan-400 uppercase">waiting waiting waiting </h4>
      {parseFeedback()}
      <LogoFooter></LogoFooter>
    </div >
  );
};


export default WaitingRoom;