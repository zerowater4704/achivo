import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { useForm, SubmitHandler } from "react-hook-form";
import { loginUser } from "../store/features/user/userSlice";
import { useNavigate } from "react-router-dom";
import InputForm from "../components/InputForm";
import { CiLogin } from "react-icons/ci";

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
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
        {...register("email", { required: "必須項目です。" })}
      />
      {errors.email && <p>{errors.email.message}</p>}
      <InputForm
        label="Password"
        type="password"
        {...register("password", { required: "必須項目です。" })}
      />
      {errors.password && <p>{errors.password.message}</p>}
      {errors && <p>{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="text-white py-2 px-3 mt-3 bg-amber-600 rounded-lg w-full font-bold flex justify-center items-center"
      >
        {loading ? "Login..." : "Login"}
        <span className=" pl-2 text-lg">
          <CiLogin />
        </span>
      </button>
    </form>
  );
};

export default Login;
