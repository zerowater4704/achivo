import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { useForm, SubmitHandler } from "react-hook-form";
import { loginUser } from "../store/features/user/userSlice";
import { useNavigate } from "react-router-dom";
import InputForm from "../components/InputForm";

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { userInfo, loading, error } = useAppSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    dispatch(loginUser(data));
  };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   dispatch(loginUser({ email, password }));
  // };

  useEffect(() => {
    if (userInfo) {
      navigate("/main");
    }
  }, [userInfo, navigate]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputForm
        label="Email"
        type="email"
        {...register("email", { required: "" })}
      />
      <InputForm
        label="Password"
        type="password"
        {...register("password", { required: "" })}
      />
      {error && <p>{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className=" py-2 px-3 mt-3 bg-yellow-500 rounded-lg w-full"
      >
        {loading ? "Login..." : "Login"}
      </button>
    </form>
  );
};

export default Login;
