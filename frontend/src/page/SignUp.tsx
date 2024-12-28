import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { useForm, SubmitHandler } from "react-hook-form";
import { signupUser } from "../store/features/user/userSlice";
import { useNavigate } from "react-router-dom";
import InputForm from "../components/InputForm";
import { RiAccountCircleLine } from "react-icons/ri";

interface SignUpFromInputs {
  email: string;
  password: string;
  name: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userInfo, loading, error } = useAppSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFromInputs>({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit: SubmitHandler<SignUpFromInputs> = (data) => {
    dispatch(signupUser(data));
  };

  useEffect(() => {
    if (userInfo) {
      // setIsModalOpen(true);
      navigate("/main");
    }
  }, [userInfo, navigate]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputForm
          label="Name"
          type="text"
          {...register("name", {
            required: "必須項目です。",
            maxLength: { value: 30, message: "最大30文字です。" },
          })}
        />
        {errors.name?.type === "required" && <p>{errors.name.message}</p>}
        {errors.name?.type === "maxLength" && <p>{errors.name.message}</p>}
        <InputForm
          label="Email"
          type="email"
          {...register("email", { required: "必須項目です。" })}
        />
        {errors.email && <p>{errors.email.message}</p>}
        <InputForm
          label="Password"
          type="password"
          {...register("password", {
            required: "必須項目です。",
            minLength: {
              value: 8,
              message: "パスワードは8文字以上入力してください。",
            },
          })}
        />
        {errors.password?.type === "required" && (
          <p>{errors.password.message}</p>
        )}
        {errors.password?.type === "minLength" && (
          <p>{errors.password.message}</p>
        )}

        {errors && <p>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="text-white py-2 px-3 mt-3 bg-amber-600 rounded-lg w-full font-bold flex justify-center items-center"
        >
          {loading ? "Sign Up..." : "Sign Up"}
          <span className=" pl-2 text-lg">
            <RiAccountCircleLine />
          </span>
        </button>
      </form>
    </>
  );
};

export default Signup;
