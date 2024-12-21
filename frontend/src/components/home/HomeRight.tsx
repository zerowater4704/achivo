import React from "react";

const HomeRight: React.FC = () => {
  return (
    <section className="w-[640px] h-[540px] mr-[30px]">
      <h1 className="border-double border-b-4 border-yellow-500 text-2xl text-center pt-2">
        あなたの目標を達成
      </h1>
      <div className="py-5 items-center">
        <img src="/Home.png" className=" m-auto w-[450px]" />
        <p className=" text-center text-xl">---で目標を設計しよう！</p>
      </div>
    </section>
  );
};

export default HomeRight;
