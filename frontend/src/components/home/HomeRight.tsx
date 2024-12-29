import React from "react";

const HomeRight: React.FC = () => {
  return (
    <section className=" w-full sm:w-[400px] md:w-[600px]">
      <h1 className="border-double border-b-4 border-yellow-500 text-xl md:text-3xl text-center pt-2 font-semibold md:leading-loose leading-loose">
        シンプルで使いやすい目標管理アプリ
      </h1>
      <div className="py-5 items-center">
        <img src="/Home.png" className=" m-auto " />
        <p className=" text-center md:text-xl md:leading-loose leading-loose text-sm sm:text-md">
          日々の進捗を効率的に管理し、目標達成をサポートします。
          <br />
          目標を設定し、それを計画とタスクに分解して実行できます。
        </p>
      </div>
    </section>
  );
};

export default HomeRight;
