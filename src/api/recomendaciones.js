import api from "./client";

export const RecomendacionesAPI = {
  listar: async () => {
    const res = await api.get("/recomendaciones");
    return res.data;
  },

  generar: async () => {
    const res = await api.post("/recomendaciones/generar");
    return res.data;
  },
};
