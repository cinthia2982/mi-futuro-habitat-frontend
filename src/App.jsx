
import { useState } from "react";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import Ahorros from "./pages/Ahorros";
import Proyecciones from "./pages/Proyecciones";
import Recomendaciones from "./pages/Recomendaciones";

export default function App() {
  const [logged, setLogged] = useState(!!localStorage.getItem("token"));

  function handleExpired() {
    localStorage.clear();
    setLogged(false);
  }

  if (!logged) return <Login onLogin={() => setLogged(true)} />;

  return (
    <div style={{ maxWidth: 900, margin: "20px auto", fontFamily: "Arial" }}>
      <h2>Mi Futuro Hábitat</h2>

      <Perfil />
      <Ahorros />
      <Proyecciones />
      <Recomendaciones />
      <button
        style={{ marginTop: 20 }}
        onClick={() => {
          localStorage.clear();
          setLogged(false);
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}
