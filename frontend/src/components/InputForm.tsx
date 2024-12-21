import React from "react";

interface InputFormProps {
  label: string;
  type: string;
}

const InputForm = React.forwardRef<HTMLInputElement, InputFormProps>(
  ({ label, type, ...rest }, ref) => {
    return (
      <div>
        <label className="block py-2 px-3">
          {label} <span className=" text-red-600 text-sm pl-1">*必須</span>
        </label>
        <input
          type={type}
          ref={ref}
          {...rest}
          className="bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2"
        />
      </div>
    );
  }
);
export default InputForm;
