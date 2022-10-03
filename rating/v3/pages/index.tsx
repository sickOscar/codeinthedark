import type { NextPage } from "next";
import { useAuthenticated } from "../customhook/useAuthenticated";

const Home: NextPage = () => {
  useAuthenticated();

  return (
    <div className="text-center h-screen flex flex-col justify-center">
      <h1 className="text-3xl">who made who</h1>
    </div>
  );
};

export default Home;
