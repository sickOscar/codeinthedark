import { NextPage } from "next";
import { useEffect } from "react";
import { useNotAuthenticated } from "../components/useAuthenticated";
import useHandleSocket from "../components/useHandleSocket";
import useVoted from "../components/useVoted";


const WaitingRoom: NextPage = () => {

  const feedback = useHandleSocket();
  useNotAuthenticated();
  const [voted, setVoted] = useVoted(false);

  useEffect(() => {
    localStorage.setItem("voted", JSON.stringify(false));
  }, []);

  return (
    <div className="text-center h-screen flex flex-col justify-center p-2">
      <h1 className="text-3xl">I am a patient boy</h1>
      <h1 className="text-3xl">I wait</h1>
      <h1 className="text-3xl">I wait</h1>
      <h1 className="text-3xl">I wait</h1>
      <h1 className="text-3xl text-red-600">{feedback}</h1>
    </div>
  );
};

export default WaitingRoom;
