import { useEffect, useState } from "react";
import { RecomendacionesAPI } from "../api/recomendaciones";

export default function Recomendaciones() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  async function cargar() {
    setLoading(true);
    setMsg("");
    try {
      const data = await RecomendacionesAPI.listar();
      // si el backend devuelve array, ok; si devuelve objeto, lo dejamos vacío y mostramos mensaje
      setItems((Array.isArray(data) ? data : []).slice(0, 3));
      if (!Array.isArray(data)) setMsg("Respuesta inesperada del backend (no es un listado).");
    } catch (e) {
      // Si token expiró, tu interceptor ya redirige a /login
      const backendMsg = e?.response?.data?.message || e?.response?.data?.error;
      setMsg(backendMsg || "No se pudieron cargar las recomendaciones.");
    } finally {
      setLoading(false);
    }
  }

  async function generar() {
    setMsg("");
    try {
      await RecomendacionesAPI.generar();
      await cargar();
      setMsg("Recomendaciones generadas ✅");
    } catch (e) {
      const backendMsg = e?.response?.data?.message || e?.response?.data?.error;
      setMsg(backendMsg || "No se pudieron generar las recomendaciones.");
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  return (
    <div style={{ marginTop: 20, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
      <h3 style={{ marginTop: 0 }}>Recomendaciones</h3>

      <button onClick={generar} style={{ marginBottom: 10 }}>
        Generar recomendaciones
      </button>

      {msg && <p>{msg}</p>}

      {loading ? (
        <p>Cargando...</p>
      ) : items.length === 0 ? (
        <p>No hay recomendaciones todavía.</p>
      ) : (
        <ul>
          {items.map((r, idx) => (
            <li key={r.id ?? r._id ?? idx} style={{ marginBottom: 6 }}>
              {r.mensaje ?? r.texto ?? JSON.stringify(r)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
