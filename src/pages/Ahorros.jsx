import { useEffect, useState } from "react";
import api from "../api/client";

export default function Ahorros() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [lista, setLista] = useState([]);

  // Form crear
  const [nuevo, setNuevo] = useState({ tipo: "APV", monto: "" });

  // Editar
  const [editId, setEditId] = useState(null);
  const [editMonto, setEditMonto] = useState("");

  const cargar = async () => {
    setMsg("");
    setLoading(true);
    try {
      const { data } = await api.get("/ahorros");
      setLista(Array.isArray(data) ? data : []);
    } catch (err) {
      setMsg(err?.response?.data?.message || "Error al cargar ahorros");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const crear = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      await api.post("/ahorros", {
        tipo: nuevo.tipo,
        monto: Number(nuevo.monto),
      });
      setNuevo({ tipo: "APV", monto: "" });
      setMsg("✅ Ahorro creado");
      await cargar();
    } catch (err) {
      setMsg(err?.response?.data?.message || "Error al crear ahorro");
    } finally {
      setLoading(false);
    }
  };

  const iniciarEdicion = (item) => {
    setEditId(item.id);
    setEditMonto(String(item.monto));
    setMsg("");
  };

  const cancelarEdicion = () => {
    setEditId(null);
    setEditMonto("");
    setMsg("");
  };

  const guardarEdicion = async (id) => {
    setMsg("");
    setLoading(true);
    try {
      await api.put(`/ahorros/${id}`, { monto: Number(editMonto) });
      setMsg("✅ Ahorro actualizado");
      cancelarEdicion();
      await cargar();
    } catch (err) {
      setMsg(err?.response?.data?.message || "Error al actualizar ahorro");
    } finally {
      setLoading(false);
    }
  };

  const eliminar = async (id) => {
    const ok = confirm("¿Eliminar este ahorro?");
    if (!ok) return;

    setMsg("");
    setLoading(true);
    try {
      await api.delete(`/ahorros/${id}`);
      setMsg("✅ Ahorro eliminado");
      await cargar();
    } catch (err) {
      setMsg(err?.response?.data?.message || "Error al eliminar ahorro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, marginTop: 20 }}>
      <h3>Ahorros</h3>

      <form onSubmit={crear} style={{ display: "flex", gap: 10, marginBottom: 15 }}>
        <select
          value={nuevo.tipo}
          onChange={(e) => setNuevo((p) => ({ ...p, tipo: e.target.value }))}
        >
          <option value="APV">APV</option>
          <option value="Cuenta2">Cuenta 2</option>
          <option value="DepositoConvenido">Depósito Convenido</option>
        </select>

        <input
          placeholder="Monto"
          value={nuevo.monto}
          onChange={(e) => setNuevo((p) => ({ ...p, monto: e.target.value }))}
        />

        <button disabled={loading || !nuevo.monto}>Agregar</button>

        <button type="button" onClick={cargar} disabled={loading}>
          Recargar
        </button>
      </form>

      {msg && <p>{msg}</p>}
      {loading && <p>Cargando...</p>}

      <table width="100%" border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tipo</th>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {lista.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.tipo}</td>

              <td>
                {editId === a.id ? (
                  <input value={editMonto} onChange={(e) => setEditMonto(e.target.value)} />
                ) : (
                  a.monto
                )}
              </td>

              <td>{a.fecha ? new Date(a.fecha).toLocaleString() : "-"}</td>

              <td>
                {editId === a.id ? (
                  <>
                    <button onClick={() => guardarEdicion(a.id)} disabled={loading}>
                      Guardar
                    </button>
                    <button onClick={cancelarEdicion} disabled={loading} style={{ marginLeft: 6 }}>
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => iniciarEdicion(a)} disabled={loading}>
                      Editar
                    </button>
                    <button
                      onClick={() => eliminar(a.id)}
                      disabled={loading}
                      style={{ marginLeft: 6 }}
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}

          {lista.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                Sin ahorros aún.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
