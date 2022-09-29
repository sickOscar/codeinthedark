import { NextPage } from "next";
import { useNotAuthenticated } from "../components/useAuthenticated";
import useHandleSocket from "../components/useHandleSocket";


const WaitingRoom: NextPage = () => {

  const feedback = useHandleSocket();
  useNotAuthenticated();

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
