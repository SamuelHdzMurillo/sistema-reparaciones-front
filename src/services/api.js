const API_URL = import.meta.env.VITE_API_URL;

export const api = {
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  getReparaciones: async () => {
    const response = await fetch(`${API_URL}/reparaciones`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.json();
  },

  getReparacion: async (id) => {
    const response = await fetch(`${API_URL}/reparaciones/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.json();
  },

  getActualizaciones: async (id) => {
    const response = await fetch(`${API_URL}/reparaciones/${id}/actualizaciones`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.json();
  },

  crearReparacion: async (datos) => {
    const response = await fetch(`${API_URL}/reparaciones`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(datos),
    });
    return response.json();
  },

  getPlanteles: async () => {
    const response = await fetch(`${API_URL}/planteles`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.json();
  },

  getEntidades: async () => {
    const response = await fetch(`${API_URL}/entidades`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.json();
  },

  getBienes: async () => {
    const response = await fetch(`${API_URL}/bienes`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.json();
  },

  getClientes: async () => {
    const response = await fetch(`${API_URL}/clientes`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.json();
  },
};

export const getToken = () => localStorage.getItem("token");
export const setToken = (token) => localStorage.setItem("token", token);
export const removeToken = () => localStorage.removeItem("token");
