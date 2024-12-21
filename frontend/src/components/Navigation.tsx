import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { logoutUser } from "../store/features/user/userSlice";
import { NavLink, Link, useNavigate } from "react-router-dom";

const Navigation: React.FC = () => {
  const { accessToken } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || accessToken;
  const handelLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate("/");
    });
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <header className=" bg-slate-800 shadow-sm leading-[34px] text-lg text-white">
      <div>
        <ul className="flex justify-between bg-zinc-800 py-2">
          <li className=" mx-4">
            <NavLink to="/">Logo</NavLink>
          </li>
          {token && (
            <li className="mr-4">
              <Link to="/">
                <button onClick={handelLogout}>ログアウト</button>
              </Link>
            </li>
          )}
        </ul>
      </div>
      <nav>
        <ul className="flex justify-end space-x-4 mr-4 py-2">
          <li className=" space-x-4">
            <NavLink to="/">Active</NavLink>
            <NavLink to="/">Completed</NavLink>
            <NavLink to="/">Failed</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navigation;
