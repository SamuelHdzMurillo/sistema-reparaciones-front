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

  getBien: async (id) => {
    const response = await fetch(`${API_URL}/bienes/${id}`, {
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

  actualizarEstadoReparacion: async (id, datos) => {
    const response = await fetch(`${API_URL}/reparaciones/${id}/estado`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(datos),
    });
    return response.json();
  },

  crearActualizacion: async (reparacionId, datos) => {
    const response = await fetch(`${API_URL}/reparaciones/${reparacionId}/actualizaciones`, {
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

  crearBien: async (datos, imagenes = []) => {
    const formData = new FormData();
    
    console.log('📦 Preparando FormData para crear bien');
    console.log('Datos del bien:', datos);
    console.log('Imágenes recibidas:', imagenes.length);
    
    // Agregar campos de texto (según documentación del backend)
    Object.keys(datos).forEach(key => {
      if (datos[key] !== null && datos[key] !== undefined) {
        // Convertir números a string si es necesario
        const valor = typeof datos[key] === 'number' ? datos[key].toString() : datos[key];
        formData.append(key, valor);
        console.log(`  Campo ${key}:`, valor);
      }
    });
    
    // Agregar imágenes con el formato correcto: imagenes[] (según documentación)
    // El backend espera: $request->file('imagenes') que funciona con 'imagenes[]'
    if (imagenes && imagenes.length > 0) {
      let imagenesAgregadas = 0;
      imagenes.forEach((imagen, index) => {
        // Ant Design Upload guarda el archivo en originFileObj
        const archivo = imagen.originFileObj || imagen;
        
        if (archivo instanceof File) {
          // Usar 'imagenes[]' con corchetes - Laravel lo recibe como array
          // El backend usa: $request->file('imagenes') que funciona con este formato
          formData.append('imagenes[]', archivo);
          imagenesAgregadas++;
          console.log(`  ✓ Imagen ${index + 1} agregada al FormData:`, {
            nombre: archivo.name,
            tamaño: `${(archivo.size / 1024).toFixed(2)} KB`,
            tipo: archivo.type
          });
        } else {
          console.warn(`  ✗ Imagen ${index + 1} no es un File válido:`, {
            tieneOriginFileObj: !!imagen.originFileObj,
            esFile: imagen instanceof File,
            tipo: typeof imagen,
            objeto: imagen
          });
        }
      });
      
      // Verificar que se agregaron imágenes
      const imagenesEnFormData = formData.getAll('imagenes[]');
      console.log(`📊 Total de imágenes en FormData: ${imagenesEnFormData.length}`);
      
      if (imagenesEnFormData.length === 0) {
        console.error('❌ ERROR: No se agregaron imágenes al FormData');
        throw new Error('No se pudieron agregar las imágenes al formulario');
      }
    } else {
      console.log('ℹ️ No hay imágenes para agregar');
    }
    
    // Mostrar resumen del FormData
    console.log('📋 Resumen del FormData:');
    for (let pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(`  ${pair[0]}: [File] ${pair[1].name} (${(pair[1].size / 1024).toFixed(2)} KB)`);
      } else {
        console.log(`  ${pair[0]}: ${pair[1]}`);
      }
    }
    
    console.log('🚀 Enviando petición a:', `${API_URL}/bienes`);
    
    const response = await fetch(`${API_URL}/bienes`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${getToken()}`,
        // NO incluir Content-Type, el navegador lo establece automáticamente 
        // con el boundary para multipart/form-data
      },
      body: formData,
    });
    
    const result = await response.json();
    console.log('📥 Respuesta del servidor:', result);
    
    if (!result.exito) {
      console.error('❌ Error en la respuesta:', result);
    }
    
    return result;
  },
};

export const getToken = () => localStorage.getItem("token");
export const setToken = (token) => localStorage.setItem("token", token);
export const removeToken = () => localStorage.removeItem("token");
