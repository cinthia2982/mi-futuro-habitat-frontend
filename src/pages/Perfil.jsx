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
      const status = err?.response?.status;
      const backendMsg = err?.response?.data?.message;

      console.log("ERROR GET /perfil/me:", status, err?.response?.data);

      // Si no existe perfil, lo informamos como aviso (no error)
      if (status === 404) {
        setMsg("⚠️ Perfil no encontrado. Completa los datos y presiona Guardar para crearlo.");
      } else {
        setMsg(backendMsg || "Error al cargar perfil");
      }
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

    // Validaciones simples para evitar NaN
    if (!form.edad || !form.saldoActual || !form.cotizacion) {
      setLoading(false);
      setMsg("⚠️ Completa Edad, Saldo actual y Cotización mensual antes de guardar.");
      return;
    }

    const payload = {
      edad: Number(form.edad),
      saldoActual: Number(form.saldoActual),
      cotizacion: Number(form.cotizacion),
    };

    try {
      // 1) Intentar actualizar (si ya existe)
      const { data } = await api.put("/perfil/me", payload);
      console.log("PUT /perfil/me =>", data);
      setMsg("✅ Perfil actualizado");

      await cargarPerfil();
    } catch (err) {
      const status = err?.response?.status;
      const backendMsg = err?.response?.data?.message;

      console.log("ERROR PUT /perfil/me:", status, err?.response?.data);

      // 2) Si no existe perfil, lo creamos
      if (status === 404) {
        try {
          const { data } = await api.post("/perfil/me", payload);
          console.log("POST /perfil/me =>", data);
          setMsg("✅ Perfil creado");

          await cargarPerfil();
        } catch (err2) {
          const status2 = err2?.response?.status;
          const backendMsg2 = err2?.response?.data?.message;
          console.log("ERROR POST /perfil/me:", status2, err2?.response?.data);
          setMsg(backendMsg2 || "Error al crear perfil");
        }
      } else {
        setMsg(backendMsg || "Error al guardar perfil");
      }
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
