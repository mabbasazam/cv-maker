import React from "react";

const InputField = ({ label, name, value, onChange, placeholder, type, disabled }) => {
  return (
    <div>
      <label className="block text-gray-700">{label}</label>
      <input
        type={type || "text"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full p-2 border rounded"
      />
    </div>
  );
};

export default InputField;