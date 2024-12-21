import React from "react";
import Navigation from "../components/Navigation";
import CreateGoal from "../components/goal/CreateGoal";
import { useAppSelector } from "../hooks/hooks";
import CreatePlan from "../components/plan/CreatePlan";
import CreateTask from "../components/task/CreateTask";

const Main: React.FC = () => {
  return (
    <>
      <Navigation />
      <main className="h-full flex bg-slate-50">
        <section className="w-1/3 p-3 ">
          <CreateGoal />
        </section>
        <section className="w-1/3 p-3">
          <CreatePlan />
        </section>
        <section className="w-1/3 p-3">
          <CreateTask />
        </section>
      </main>
    </>
  );
};

export default Main;
