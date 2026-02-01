import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; 

export default function PasswordInput({ value, onChange }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={value}
        onChange={onChange}
        required
        style={{
          width: "100%",
          padding: "1rem 3rem 1rem 1rem",
          borderRadius: "1rem",
          border: "2px solid #8c7153",
          outline: "none",
        }}
      />
      <span
        onClick={() => setShowPassword(!showPassword)}
        style={{
          position: "absolute",
          right: "1rem",
          top: "37%",
          transform: "translateY(-50%)",
          cursor: "pointer",
          color: "#4b3621",
        }}
      >
        {showPassword ? <EyeOff size={30} /> : <Eye size={30} />}
      </span>
    </div>
  );
}