import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import Main from "../page/Main";
import CreateGoal from "../components/goal/CreateGoal";

const PrivateRoutes: React.FC = () => {
  return (
    <PrivateRoute>
      <Routes>
        <Route path="/create/goal" element={<CreateGoal />}></Route>
        <Route path="/main" element={<Main />} />
      </Routes>
    </PrivateRoute>
  );
};

export default PrivateRoutes;
