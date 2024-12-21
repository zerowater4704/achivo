import React from "react";
import HomeRight from "../components/home/HomeRight";
import HomeLeft from "../components/home/HomeLeft";

const Home: React.FC = () => {
  return (
    <main className="w-[1000px] flex justify-center py-[50px] m-auto">
      <HomeRight />
      <HomeLeft />
    </main>
  );
};

export default Home;
