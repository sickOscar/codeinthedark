import type { NextPage } from "next";
import { useAuthenticated } from "../customhook/useAuthenticated";

const Home: NextPage = () => {
  useAuthenticated();

  return (
    <div className="text-center h-screen p-2 bg-content-image bg-top bg-80%">
      <h1 className="text-xl text-cyan-400 uppercase mt-10">who made who</h1>
      <h1 className="text-xl text-cyan-400 uppercase">who are you?</h1>
    </div>
  );
};

export default Home;
