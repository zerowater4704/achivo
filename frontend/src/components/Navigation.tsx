import React, { useEffect } from "react";
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
  }, [navigate, token]);

  return (
    <header className="w-full bg-orange-300 text-white font-zen font-bold leading-[34px] text-xl shadow-sm px-3">
      <div className="">
        <ul className="flex justify-between py-2">
          <li className=" flex space-x-1 items-center">
            <img src="/マウンテンアイコン.png" className=" h-6 w-6" />
            <NavLink to="/">Achivo</NavLink>
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
      {/* <nav>
        <ul className="flex justify-end space-x-4 mr-4 py-2">
          {token && (
            <>
              <li className=" ">
                <NavLink to="/">Active</NavLink>
              </li>
              <li>
                <NavLink to="/completed">Completed</NavLink>
              </li>
              <li>
                <NavLink to="/">Failed</NavLink>
              </li>
            </>
          )}
        </ul>
      </nav> */}
    </header>
  );
};

export default Navigation;
