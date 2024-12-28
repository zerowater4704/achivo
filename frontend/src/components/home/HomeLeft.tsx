import React, { useEffect, useState } from "react";
import Login from "../../page/Login";
import Signup from "../../page/SignUp";
import { useAppDispatch } from "../../hooks/hooks";
import { resetError } from "../../store/features/user/userSlice";
import { FaGooglePlusG } from "react-icons/fa6";

const HomeLeft: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    // URLからアクセストークンを取得
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("accessToken");
    if (token) {
      // ローカルストレージに保存
      localStorage.setItem("token", token);

      // 必要に応じてリダイレクト
      window.location.replace("/main");
    }
  }, []);

  const handelLoginClick = () => {
    dispatch(resetError());
    setIsLogin(true);
  };

  const handelSignupClick = () => {
    dispatch(resetError());
    setIsLogin(false);
  };

  const handleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <section className=" flex flex-col mx-5">
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
      <section className="w-[400px] md:w-[200px] mx-auto">
        {isLogin ? (
          <>
            <div className="border-double border-b-2 border-yellow-500 mb-6 pb-6">
              <button
                onClick={handleLogin}
                className="bg-amber-800 text-white w-full py-2 rounded-md flex justify-center items-center font-bold"
              >
                <span className=" text-xl pr-2">
                  <FaGooglePlusG />
                </span>
                Google Login
              </button>
            </div>
            <Login />
          </>
        ) : (
          <>
            <div className="border-double border-b-2 border-yellow-500 mb-6 pb-6">
              <button
                onClick={handleLogin}
                className="bg-amber-800 text-white w-full py-2 rounded-md flex justify-center items-center font-bold"
              >
                <span className=" text-xl pr-2">
                  <FaGooglePlusG />
                </span>
                Google SignUp
              </button>
            </div>
            <Signup />
          </>
        )}
      </section>
    </section>
  );
};

export default HomeLeft;
