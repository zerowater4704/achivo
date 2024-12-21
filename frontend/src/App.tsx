import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import PrivateRoutes from "./routes/PrivateRoutes";
import PublicRoutes from "./routes/PublicRoutes";

const App: React.FC = () => {
  return (
    <Router>
      <PublicRoutes />
      <PrivateRoutes />
    </Router>
  );
};

export default App;
