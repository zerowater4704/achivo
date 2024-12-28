import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthGuard from "./components/AuthGuard";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./page/Home";
import Signup from "./page/SignUp";
import Welcome from "./page/Welcome";
import Login from "./page/Login";
import Main from "./page/Main";
import CreateGoal from "./components/goal/CreateGoal";
import Completed from "./components/completed/Completed";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <AuthGuard>
              <Home />
            </AuthGuard>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthGuard>
              <Signup />
            </AuthGuard>
          }
        />
        <Route
          path="/welcome"
          element={
            <AuthGuard>
              <Welcome />
            </AuthGuard>
          }
        />
        <Route
          path="/login"
          element={
            <AuthGuard>
              <Login />
            </AuthGuard>
          }
        />

        <Route
          path="/main"
          element={
            <PrivateRoute>
              <Main />
            </PrivateRoute>
          }
        />
        <Route
          path="/create/goal"
          element={
            <PrivateRoute>
              <CreateGoal />
            </PrivateRoute>
          }
        />
        <Route
          path="/completed"
          element={
            <PrivateRoute>
              <Completed />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
