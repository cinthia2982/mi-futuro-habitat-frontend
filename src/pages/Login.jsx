import { useState } from "react";
import api from "../api/client";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      onLogin();
    } catch (err) {
      setMsg(err?.response?.data?.message || "Credenciales incorrectas");
    }
  };

  return (
  <div className="login-container">
    <div className="login-card">
      <h2>Mi Futuro Hábitat</h2>

      <form onSubmit={submit}>
        <div className="form-group">
          <label>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="testauth@correo.cl"
          />
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="123456"
          />
        </div>

        <button type="submit">Ingresar</button>
      </form>

      {msg && <p className="error-msg">{msg}</p>}
    </div>
  </div>
);
}
