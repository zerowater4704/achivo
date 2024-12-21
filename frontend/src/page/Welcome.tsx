import React from "react";
import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";

const Welcome: React.FC = () => {
  return (
    <div>
      <Navigation></Navigation>
      <h1>会員登録に成功しました！</h1>
      <Link to="/login">
        <button>ログイン</button>
      </Link>
    </div>
  );
};

export default Welcome;
