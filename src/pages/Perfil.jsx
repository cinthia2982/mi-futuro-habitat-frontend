import { useEffect, useState } from "react";
import api from "../api/client";

export default function Perfil() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    edad: "",
    saldoActual: "",
    cotizacion: "",
  });

  const cargarPerfil = async () => {
    setMsg("");
    setLoading(true);
    try {
      const { data } = await api.get("/perfil/me");
      console.log("GET /perfil/me =>", data);

      if (!data) {
        setMsg("⚠️ No existe perfil aún.");
        return;
      }

      setForm({
        edad: String(data.edad ?? ""),
        saldoActual: String(data.saldoActual ?? ""),
        cotizacion: String(data.cotizacion ?? ""),
      });
    } catch (err) {
      console.log("ERROR GET /perfil/me:", err?.response?.status, err?.response?.data);
      setMsg(err?.response?.data?.message || "Error al cargar perfil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPerfil();
  }, []);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const guardar = async () => {
    setMsg("");
    setLoading(true);
    try {
      const payload = {
        edad: Number(form.edad),
        saldoActual: Number(form.saldoActual),
        cotizacion: Number(form.cotizacion),
      };

      const { data } = await api.put("/perfil/me", payload);
      console.log("PUT /perfil/me =>", data);

      setMsg("✅ Perfil actualizado");

      // re-cargar desde backend para ver lo real guardado
      await cargarPerfil();
    } catch (err) {
      console.log("ERROR PUT /perfil/me:", err?.response?.status, err?.response?.data);
      setMsg(err?.response?.data?.message || "Error al guardar perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 520 }}>
      <h3>Perfil previsional</h3>

      <div style={{ marginBottom: 10 }}>
        <label>Edad</label>
        <input
          name="edad"
          value={form.edad}
          onChange={onChange}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Saldo actual</label>
        <input
          name="saldoActual"
          value={form.saldoActual}
          onChange={onChange}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Cotización mensual</label>
        <input
          name="cotizacion"
          value={form.cotizacion}
          onChange={onChange}
          style={{ width: "100%" }}
        />
      </div>

      <button onClick={guardar} disabled={loading}>
        {loading ? "Guardando..." : "Guardar"}
      </button>

      <button onClick={cargarPerfil} disabled={loading} style={{ marginLeft: 10 }}>
        {loading ? "Cargando..." : "Recargar"}
      </button>

      {msg && <p style={{ marginTop: 10 }}>{msg}</p>}
    </div>
  );
}
