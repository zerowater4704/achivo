import React, { useState } from "react";
import Login from "../../page/Login";
import Signup from "../../page/SignUp";

const HomeLeft: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handelLoginClick = () => {
    setIsLogin(true);
  };

  const handelSignupClick = () => {
    setIsLogin(false);
  };
  return (
    <section className="w-[380px] p-4 flex flex-col ">
      <div className="mb-4 text-lg text-center">
        <button
          onClick={handelLoginClick}
          className={`px-4 py-2  ${
            isLogin
              ? "border-yellow-500 text-yellow-700 border-b-2"
              : " text-gray-500"
          }`}
        >
          ログイン
        </button>
        <button
          onClick={handelSignupClick}
          className={`px-4 py-2 ${
            !isLogin
              ? "border-yellow-500 text-yellow-700 border-b-2"
              : " text-gray-500"
          }`}
        >
          会員登録
        </button>
      </div>
      <section className="w-[200px] mx-auto">
        {isLogin ? (
          <>
            <div className="border-double border-b-2 border-yellow-500 mb-6 pb-6">
              GOOGLE LOGIN
            </div>
            <Login />
          </>
        ) : (
          <>
            <div className="border-double border-b-2 mb-6 pb-6 border-yellow-500">
              GOOGLE LOGIN
            </div>
            <Signup />
          </>
        )}
      </section>
    </section>
  );
};

export default HomeLeft;
