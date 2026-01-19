import { useEffect, useState } from "react";
import api from "../api/client";

export default function Proyecciones() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [lista, setLista] = useState([]);

  const [form, setForm] = useState({
    tasaAnual: "0.05",
    anios: "30",
  });

  const cargar = async () => {
    setMsg("");
    setLoading(true);
    try {
      const { data } = await api.get("/proyecciones");
      setLista(Array.isArray(data) ? data : []);
    } catch (err) {
      setMsg(err?.response?.data?.message || "Error al cargar proyecciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const generar = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const payload = {
        tasaAnual: Number(form.tasaAnual),
        anios: Number(form.anios),
      };

      const { data } = await api.post("/proyecciones", payload);
      setMsg("✅ Proyección generada");
      await cargar();

      // opcional: mostrar rápido el resultado
      console.log("Proyección creada:", data);
    } catch (err) {
      setMsg(err?.response?.data?.message || "Error al generar proyección");
    } finally {
      setLoading(false);
    }
  };

  const eliminar = async (id) => {
    const ok = confirm("¿Eliminar esta proyección?");
    if (!ok) return;

    setMsg("");
    setLoading(true);
    try {
      await api.delete(`/proyecciones/${id}`);
      setMsg("🗑️ Proyección eliminada");
      await cargar();
    } catch (err) {
      setMsg(err?.response?.data?.message || "Error al eliminar proyección");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-section" style={{ maxWidth: 900, margin: "20px auto" }}>
      <h3>Proyecciones</h3>

      <form onSubmit={generar} className="form-grid" style={{ marginBottom: 12 }}>
        <div>
          <label>Tasa anual</label>
          <input
            name="tasaAnual"
            value={form.tasaAnual}
            onChange={onChange}
            placeholder="ej: 0.05"
          />
        </div>

        <div>
          <label>Años</label>
          <input
            name="anios"
            value={form.anios}
            onChange={onChange}
            placeholder="ej: 30"
          />
        </div>

        <div className="btn-group" style={{ alignItems: "end" }}>
          <button className="btn btn-primary" disabled={loading} type="submit">
            {loading ? "Procesando..." : "Generar"}
          </button>

          <button
            className="btn btn-secondary"
            type="button"
            onClick={cargar}
            disabled={loading}
          >
            Recargar
          </button>
        </div>
      </form>

      {msg && <p className="error-msg" style={{ color: msg.includes("✅") ? "green" : undefined }}>{msg}</p>}
      {loading && <p>Cargando...</p>}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Saldo futuro</th>
            <th>Pensión estimada</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {lista.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{Math.round(p.saldoFuturo).toLocaleString("es-CL")}</td>
              <td>{Math.round(p.pensionEstimada).toLocaleString("es-CL")}</td>
              <td>{p.fecha ? new Date(p.fecha).toLocaleString("es-CL") : "-"}</td>
              <td>
                <button
                  className="btn-table"
                  type="button"
                  onClick={() => eliminar(p.id)}
                  disabled={loading}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}

          {lista.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                Sin proyecciones aún.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
