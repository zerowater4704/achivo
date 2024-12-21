import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { useForm, SubmitHandler } from "react-hook-form";
import { signupUser } from "../store/features/user/userSlice";
import { useNavigate } from "react-router-dom";
import InputForm from "../components/InputForm";

interface SignUpFromInputs {
  email: string;
  password: string;
  name: string;
}

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
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

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   dispatch(signupUser({ email, password, name }));
  // };

  useEffect(() => {
    if (userInfo) {
      navigate("/welcome");
    }
  }, [userInfo, navigate]);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputForm
        label="Name"
        type="text"
        {...(register("name"), { required: "" })}
      />
      <InputForm
        label="Email"
        type="email"
        {...(register("email"), { required: "" })}
      />
      <InputForm
        label="Password"
        type="password"
        {...(register("password"), { required: "" })}
      />
      {error && <p>{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className=" py-2 px-3 mt-3 bg-yellow-500 rounded-lg w-full"
      >
        {loading ? "Sign Up..." : "Sign Up"}
      </button>
    </form>
  );
};

export default Signup;
