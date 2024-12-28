import React from "react";
import HomeRight from "../components/home/HomeRight";
import HomeLeft from "../components/home/HomeLeft";

const Home: React.FC = () => {
  return (
    <main className="font-zen">
      <div className="block justify-center py-[50px] m-auto md:flex ">
        <HomeRight />
        <HomeLeft />
      </div>
    </main>
  );
};

export default Home;
