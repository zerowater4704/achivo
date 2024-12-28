import React from "react";
import Navigation from "../components/Navigation";
import CreateGoal from "../components/goal/CreateGoal";
import CreatePlan from "../components/plan/CreatePlan";
import CreateTask from "../components/task/CreateTask";

const Main: React.FC = () => {
  return (
    <>
      <Navigation />
      <main className="md:flex md:w-full block mx-auto w-[500px]">
        <section className="md:w-1/3 p-3 my-3 md:mr-4 font-zen">
          <CreateGoal />
        </section>
        <section className="md:w-1/3 p-3 my-3 md:mr-4 font-zen">
          <CreatePlan />
        </section>
        <section className="md:w-1/3 p-3 my-3 font-zen">
          <CreateTask />
        </section>
      </main>
    </>
  );
};

export default Main;
