import { useState, useEffect } from 'react';
import { Input, Card, Table, Tag, Typography, Spin, Row, Col, Space, Select, Divider, Modal, Descriptions, Button, Timeline, Form, message, AutoComplete, Tooltip, Upload } from 'antd';
import { SearchOutlined, ToolOutlined, InboxOutlined, CheckCircleOutlined, SendOutlined, EyeOutlined, PlusOutlined, EditOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { api } from '../services/api';

const { Text, Title } = Typography;

const estadoConfig = {
  recibido: { 
    color: 'blue', 
    label: 'Recibido', 
    icon: <InboxOutlined />,
    bg: '#e3f2fd',
    border: '#2196f3',
    text: '#1565c0',
  },
  proceso: { 
    color: 'orange', 
    label: 'En Proceso', 
    icon: <ToolOutlined />,
    bg: '#fff3e0',
    border: '#ff9800',
    text: '#e65100',
  },
  listo: { 
    color: 'green', 
    label: 'Listo', 
    icon: <CheckCircleOutlined />,
    bg: '#e8f5e9',
    border: '#4caf50',
    text: '#2e7d32',
  },
  entregado: { 
    color: 'default', 
    label: 'Entregado', 
    icon: <SendOutlined />,
    bg: '#f5f5f5',
    border: '#9e9e9e',
    text: '#616161',
  },
};

function Dashboard({ onVerDetalle }) {
  const [reparaciones, setReparaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState(null);
  const [filtroTecnico, setFiltroTecnico] = useState(null);
  const [filtroPlantel, setFiltroPlantel] = useState(null);
  const [filtroCliente, setFiltroCliente] = useState(null);
  const [modalNuevaReparacion, setModalNuevaReparacion] = useState(false);
  const [form] = Form.useForm();
  const [guardando, setGuardando] = useState(false);
  const [planteles, setPlanteles] = useState([]);
  const [entidades, setEntidades] = useState([]);
  const [cargandoPlanteles, setCargandoPlanteles] = useState(false);
  const [cargandoEntidades, setCargandoEntidades] = useState(false);
  const [modalNuevoPlantel, setModalNuevoPlantel] = useState(false);
  const [modalNuevaEntidad, setModalNuevaEntidad] = useState(false);
  const [formPlantel] = Form.useForm();
  const [formEntidad] = Form.useForm();
  const [guardandoPlantel, setGuardandoPlantel] = useState(false);
  const [guardandoEntidad, setGuardandoEntidad] = useState(false);
  const [bienes, setBienes] = useState([]);
  const [cargandoBienes, setCargandoBienes] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [cargandoClientes, setCargandoClientes] = useState(false);
  const [modalActualizacion, setModalActualizacion] = useState(false);
  const [reparacionSeleccionada, setReparacionSeleccionada] = useState(null);
  const [formActualizacion] = Form.useForm();
  const [guardandoActualizacion, setGuardandoActualizacion] = useState(false);

  useEffect(() => {
    cargarReparaciones();
    cargarPlanteles();
    cargarClientes();
  }, []);

  const cargarReparaciones = async () => {
    try {
      const res = await api.getReparaciones();
      if (res.exito) {
        setReparaciones(res.datos);
      }
    } catch (error) {
      console.error('Error al cargar reparaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const verDetalle = (id) => {
    if (onVerDetalle) {
      onVerDetalle(id);
    }
  };

  const abrirModalActualizacion = (reparacion) => {
    setReparacionSeleccionada(reparacion);
    formActualizacion.setFieldsValue({
      descripcion: '',
      estado_nuevo: reparacion.estado,
    });
    setModalActualizacion(true);
  };

  const cerrarModalActualizacion = () => {
    setModalActualizacion(false);
    setReparacionSeleccionada(null);
    formActualizacion.resetFields();
  };

  const guardarActualizacion = async (valores) => {
    setGuardandoActualizacion(true);
    try {
      const datos = {
        descripcion: valores.descripcion,
        estado_nuevo: valores.estado_nuevo !== reparacionSeleccionada?.estado ? valores.estado_nuevo : undefined,
      };

      const res = await api.crearActualizacion(reparacionSeleccionada.id, datos);
      
      if (res.exito) {
        message.success('Actualización registrada correctamente');
        cerrarModalActualizacion();
        cargarReparaciones();
      } else {
        message.error(res.mensaje || 'Error al registrar la actualización');
      }
    } catch (error) {
      console.error('Error al guardar actualización:', error);
      message.error('Error de conexión con el servidor');
    } finally {
      setGuardandoActualizacion(false);
    }
  };


  const cargarPlanteles = async () => {
    setCargandoPlanteles(true);
    try {
      const res = await api.getPlanteles();
      if (res.exito) {
        setPlanteles(res.datos || []);
      }
    } catch (error) {
      console.error('Error al cargar planteles:', error);
      message.error('Error al cargar planteles');
    } finally {
      setCargandoPlanteles(false);
    }
  };

  const cargarEntidades = async () => {
    setCargandoEntidades(true);
    try {
      const res = await api.getEntidades();
      if (res.exito) {
        setEntidades(res.datos || []);
      }
    } catch (error) {
      console.error('Error al cargar entidades:', error);
      message.error('Error al cargar entidades');
    } finally {
      setCargandoEntidades(false);
    }
  };

  const cargarBienes = async () => {
    setCargandoBienes(true);
    try {
      const res = await api.getBienes();
      if (res.exito) {
        setBienes(res.datos || []);
      }
    } catch (error) {
      console.error('Error al cargar bienes:', error);
      message.error('Error al cargar bienes');
    } finally {
      setCargandoBienes(false);
    }
  };

  const cargarClientes = async () => {
    setCargandoClientes(true);
    try {
      const res = await api.getClientes();
      if (res.exito) {
        setClientes(res.datos || []);
      }
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      message.error('Error al cargar clientes');
    } finally {
      setCargandoClientes(false);
    }
  };

  const abrirModalNuevaReparacion = () => {
    setModalNuevaReparacion(true);
    form.resetFields();
    cargarPlanteles();
    cargarEntidades();
    cargarBienes();
    cargarClientes();
  };

  const seleccionarBien = (numeroInventario) => {
    const bien = bienes.find(b => b.numero_inventario === numeroInventario);
    if (bien) {
      form.setFieldsValue({
        tipo_bien: bien.tipo_bien || '',
        marca: bien.marca || '',
        modelo: bien.modelo || '',
        numero_serie: bien.numero_serie || '',
        especificaciones: bien.especificaciones || '',
        plantel_id: bien.plantel_id || undefined,
        entidad_id: bien.entidad_id || undefined,
        imagenes_bien: [], // Limpiar imágenes al seleccionar un bien existente
      });
    }
  };

  const seleccionarCliente = (nombreCompleto) => {
    const cliente = clientes.find(c => c.nombre_completo === nombreCompleto);
    if (cliente) {
      form.setFieldsValue({
        telefono_cliente: cliente.telefono || '',
      });
    }
  };

  const cerrarModalNuevaReparacion = () => {
    setModalNuevaReparacion(false);
    form.resetFields();
    // Limpiar también las imágenes del formulario
    form.setFieldsValue({ imagenes_bien: [] });
  };

  const guardarNuevaReparacion = async (valores) => {
    setGuardando(true);
    try {
      // Verificar si el bien existe
      const bienExistente = bienes.find(b => b.numero_inventario === valores.numero_inventario);
      
      // Si el bien no existe, crearlo primero (especialmente si hay imágenes)
      if (!bienExistente) {
        const datosBien = {
          numero_inventario: valores.numero_inventario,
          tipo_bien: valores.tipo_bien,
          marca: valores.marca,
          modelo: valores.modelo || null,
          numero_serie: valores.numero_serie || null,
          especificaciones: valores.especificaciones || null,
          plantel_id: valores.plantel_id,
          entidad_id: valores.entidad_id,
        };

        // Si hay imágenes, usar el endpoint de bienes que soporta FormData
        console.log('🔍 Verificando imágenes en valores:', valores.imagenes_bien);
        
        if (valores.imagenes_bien && valores.imagenes_bien.length > 0) {
          console.log('📋 Total de archivos en imagenes_bien:', valores.imagenes_bien.length);
          
          // Filtrar solo los archivos válidos que tienen originFileObj
          const archivosValidos = valores.imagenes_bien.filter((img, index) => {
            const tieneArchivo = img && (img.originFileObj || img instanceof File);
            console.log(`  Archivo ${index + 1}:`, {
              nombre: img?.name,
              tieneOriginFileObj: !!img?.originFileObj,
              esFile: img instanceof File,
              objeto: img
            });
            if (!tieneArchivo) {
              console.warn(`  ✗ Archivo ${index + 1} sin originFileObj:`, img);
            }
            return tieneArchivo;
          });
          
          console.log('✅ Archivos válidos encontrados:', archivosValidos.length, 'de', valores.imagenes_bien.length);
          
          if (archivosValidos.length > 0) {
            console.log('📤 Creando bien con', archivosValidos.length, 'imagen(es)');
            console.log('Datos del bien:', datosBien);
            
            const resBien = await api.crearBien(datosBien, archivosValidos);
            
            if (!resBien.exito) {
              console.error('❌ Error al crear bien:', resBien);
              message.error(resBien.mensaje || 'Error al crear el bien');
              return;
            }
            
            console.log('✅ Bien creado exitosamente:', resBien.datos);
            message.success(`Bien creado correctamente con ${archivosValidos.length} imagen(es)`);
            // Recargar la lista de bienes
            await cargarBienes();
          } else {
            console.error('❌ No se encontraron archivos válidos. Total de archivos:', valores.imagenes_bien.length);
            console.error('Archivos recibidos:', JSON.stringify(valores.imagenes_bien, null, 2));
            message.error('Las imágenes no se pudieron procesar. Por favor, vuelva a seleccionar las imágenes.');
          }
        } else {
          console.log('ℹ️ No hay imágenes para subir');
        }
        // Si no hay imágenes, el bien se creará automáticamente al crear la reparación
      }

      const datos = {
        nombre_cliente: valores.nombre_cliente,
        telefono_cliente: valores.telefono_cliente || null,
        numero_inventario: valores.numero_inventario,
        tipo_bien: valores.tipo_bien,
        marca: valores.marca,
        modelo: valores.modelo || null,
        numero_serie: valores.numero_serie || null,
        especificaciones: valores.especificaciones || null,
        plantel_id: valores.plantel_id,
        entidad_id: valores.entidad_id,
        falla_reportada: valores.falla_reportada,
        accesorios_incluidos: valores.accesorios_incluidos || null,
      };

      const res = await api.crearReparacion(datos);
      
      if (res.exito) {
        message.success('Reparación registrada exitosamente');
        cerrarModalNuevaReparacion();
        cargarReparaciones();
      } else {
        message.error(res.mensaje || 'Error al registrar la reparación');
      }
    } catch (error) {
      console.error('Error al guardar reparación:', error);
      message.error('Error de conexión con el servidor');
    } finally {
      setGuardando(false);
    }
  };

  const guardarNuevoPlantel = async (valores) => {
    setGuardandoPlantel(true);
    try {
      // Por ahora, solo agregamos localmente. Si hay endpoint POST, se puede usar aquí
      const nuevoPlantel = {
        id: planteles.length > 0 ? Math.max(...planteles.map(p => p.id)) + 1 : 1,
        nombre: valores.nombre,
        total_bienes: 0
      };
      setPlanteles([...planteles, nuevoPlantel]);
      form.setFieldsValue({ plantel_id: nuevoPlantel.id });
      setModalNuevoPlantel(false);
      formPlantel.resetFields();
      message.success('Plantel agregado correctamente');
    } catch (error) {
      console.error('Error al guardar plantel:', error);
      message.error('Error al guardar plantel');
    } finally {
      setGuardandoPlantel(false);
    }
  };

  const guardarNuevaEntidad = async (valores) => {
    setGuardandoEntidad(true);
    try {
      // Por ahora, solo agregamos localmente. Si hay endpoint POST, se puede usar aquí
      const nuevaEntidad = {
        id: entidades.length > 0 ? Math.max(...entidades.map(e => e.id)) + 1 : 1,
        nombre: valores.nombre,
        total_bienes: 0
      };
      setEntidades([...entidades, nuevaEntidad]);
      form.setFieldsValue({ entidad_id: nuevaEntidad.id });
      setModalNuevaEntidad(false);
      formEntidad.resetFields();
      message.success('Entidad agregada correctamente');
    } catch (error) {
      console.error('Error al guardar entidad:', error);
      message.error('Error al guardar entidad');
    } finally {
      setGuardandoEntidad(false);
    }
  };

  const tecnicos = [...new Set(reparaciones.map(r => r.tecnico?.name))].filter(Boolean);

  const datosFiltrados = reparaciones.filter(r => {
    try {
      // Búsqueda general en todas las columnas
      const matchBusqueda = !busqueda || (() => {
        const busquedaLower = busqueda.toLowerCase().trim();
        if (!busquedaLower) return true;
        
        // Función helper para buscar de forma segura
        const safeSearch = (value) => {
          if (value === null || value === undefined) return false;
          try {
            const str = typeof value === 'string' ? value : String(value);
            return str.toLowerCase().includes(busquedaLower);
          } catch {
            return false;
          }
        };
        
        // ID de la reparación
        const idMatch = safeSearch(r.id);
        
        // Información del bien (equipo)
        const tipoBienMatch = safeSearch(r.bien?.tipo_bien);
        const marcaMatch = safeSearch(r.bien?.marca);
        const modeloMatch = safeSearch(r.bien?.modelo);
        const numeroInventarioMatch = safeSearch(r.bien?.numero_inventario);
        const numeroSerieMatch = safeSearch(r.bien?.numero_serie);
        
        // Información del cliente
        const clienteMatch = safeSearch(r.cliente?.nombre_completo);
        const telefonoClienteMatch = safeSearch(r.cliente?.telefono);
        
        // Información de la reparación
        const fallaMatch = safeSearch(r.falla_reportada);
        const accesoriosMatch = safeSearch(r.accesorios_incluidos);
        
        // Información del técnico
        const tecnicoMatch = safeSearch(r.tecnico?.name);
        const tecnicoNumeroMatch = safeSearch(r.tecnico?.numero);
        const tecnicoEmailMatch = safeSearch(r.tecnico?.email);
        
        // Estado (buscar tanto el valor como la etiqueta)
        const estadoValueMatch = safeSearch(r.estado);
        const estadoLabelMatch = r.estado && estadoConfig[r.estado]?.label 
          ? safeSearch(estadoConfig[r.estado].label) 
          : false;
        
        // Fecha (buscar en formato de fecha)
        let fechaMatch = false;
        let fechaCreatedMatch = false;
        try {
          if (r.updated_at) {
            const fecha = new Date(r.updated_at);
            if (!isNaN(fecha.getTime())) {
              fechaMatch = fecha.toLocaleDateString('es-ES').toLowerCase().includes(busquedaLower);
            }
          }
          if (r.created_at) {
            const fecha = new Date(r.created_at);
            if (!isNaN(fecha.getTime())) {
              fechaCreatedMatch = fecha.toLocaleDateString('es-ES').toLowerCase().includes(busquedaLower);
            }
          }
        } catch {
          // Ignorar errores de fecha
        }
        
        // Plantel y entidad
        const plantelMatch = safeSearch(r.bien?.plantel);
        const entidadMatch = safeSearch(r.bien?.entidad);
        
        return idMatch || tipoBienMatch || marcaMatch || modeloMatch || numeroInventarioMatch || 
               numeroSerieMatch || clienteMatch || telefonoClienteMatch || fallaMatch || 
               accesoriosMatch || tecnicoMatch || tecnicoNumeroMatch || tecnicoEmailMatch || 
               estadoValueMatch || estadoLabelMatch || fechaMatch || fechaCreatedMatch || 
               plantelMatch || entidadMatch;
      })();
      
      const matchEstado = !filtroEstado || r.estado === filtroEstado;
      const matchTecnico = !filtroTecnico || r.tecnico?.name === filtroTecnico;
      const matchPlantel = !filtroPlantel || r.bien?.plantel_id === filtroPlantel;
      const matchCliente = !filtroCliente || r.cliente?.nombre_completo === filtroCliente;
      return matchBusqueda && matchEstado && matchTecnico && matchPlantel && matchCliente;
    } catch (error) {
      console.error('Error al filtrar reparación:', error, r);
      // Si hay un error, no incluir esta reparación en los resultados
      return false;
    }
  });

  const columnas = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Equipo',
      render: (_, r) => `${r.bien?.tipo_bien} ${r.bien?.marca} ${r.bien?.modelo}`,
    },
    {
      title: 'Cliente',
      dataIndex: ['cliente', 'nombre_completo'],
    },
    {
      title: 'Falla',
      dataIndex: 'falla_reportada',
      ellipsis: true,
    },
    {
      title: 'Técnico',
      dataIndex: ['tecnico', 'name'],
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      render: (estado) => (
        <Tag color={estadoConfig[estado]?.color}>{estadoConfig[estado]?.label}</Tag>
      ),
    },
    {
      title: 'Fecha',
      dataIndex: 'updated_at',
      render: (fecha) => new Date(fecha).toLocaleDateString(),
      sorter: (a, b) => new Date(a.updated_at) - new Date(b.updated_at),
    },
    {
      title: 'Acciones',
      width: 120,
      fixed: 'right',
      render: (_, r) => (
        <Space size="small">
          <Tooltip title="Ver detalle">
            <Button 
              type="link" 
              icon={<EyeOutlined />} 
              onClick={() => verDetalle(r.id)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Agregar actualización">
            <Button 
              type="link" 
              icon={<EditOutlined />} 
              onClick={() => abrirModalActualizacion(r)}
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '60vh',
        gap: 16
      }}>
        <Spin size="large" />
        <Text type="secondary" style={{ fontSize: 14 }}>Cargando reparaciones...</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: '0 4px' }}>
      {/* Header principal con más profundidad */}
      <Card
        variant="outlined"
        style={{
          marginBottom: 32,
          borderRadius: 16,
          background: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.04)',
        }}
        styles={{ body: { padding: '24px 32px' } }}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div>
            <Title level={2} style={{ 
              margin: 0, 
              color: '#1a1a1a',
              fontWeight: 600,
              fontSize: 28,
              letterSpacing: '-0.02em'
            }}>
              Panel de Control
            </Title>
            <Text type="secondary" style={{ 
              fontSize: 14,
              marginTop: 4,
              display: 'block',
              color: '#8c8c8c'
            }}>
              Gestión de reparaciones y seguimiento
            </Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={abrirModalNuevaReparacion}
            size="large"
            style={{ 
              background: '#2e7d32', 
              borderColor: '#2e7d32',
              height: 44,
              paddingLeft: 24,
              paddingRight: 24,
              borderRadius: 8,
              fontWeight: 500,
              boxShadow: '0 2px 4px rgba(46, 125, 50, 0.2)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(46, 125, 50, 0.3)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(46, 125, 50, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Agregar Reparación
          </Button>
        </div>
      </Card>

      {/* Tabla con filtros integrados - Mejorado */}
      <Card 
        variant="outlined"
        style={{ 
          borderRadius: 16,
          background: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.04)',
          overflow: 'hidden'
        }}
        styles={{ body: { padding: 0 } }}
      >
        {/* Header de la tabla */}
        <div style={{
          padding: '24px 32px',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          background: '#fafafa'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 20
          }}>
            <div>
              <Title level={4} style={{ 
                margin: 0, 
                color: '#1a1a1a',
                fontWeight: 600,
                fontSize: 18
              }}>
                Reparaciones
              </Title>
              <Text type="secondary" style={{ 
                fontSize: 13,
                marginTop: 4,
                display: 'block',
                color: '#8c8c8c'
              }}>
                {datosFiltrados.length} de {reparaciones.length} registros
              </Text>
            </div>
          </div>

          {/* Filtros mejorados */}
          <div 
            className="filters-grid"
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(5, 1fr)', 
              gap: '16px',
              marginBottom: 0
            }}
          >
            <div>
              <Text strong style={{ 
                display: 'block', 
                marginBottom: 8,
                fontSize: 13,
                color: '#595959'
              }}>
                Búsqueda general
              </Text>
              <Input
                placeholder="Equipo, cliente, falla..."
                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                allowClear
                style={{
                  borderRadius: 8,
                  border: '1px solid #d9d9d9',
                  transition: 'all 0.2s ease',
                  width: '100%'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2e7d32';
                  e.target.style.boxShadow = '0 0 0 2px rgba(46, 125, 50, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d9d9d9';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            <div>
              <Text strong style={{ 
                display: 'block', 
                marginBottom: 8,
                fontSize: 13,
                color: '#595959'
              }}>
                Estado
              </Text>
              <Select
                placeholder="Todos"
                value={filtroEstado}
                onChange={setFiltroEstado}
                style={{ width: '100%', borderRadius: 8 }}
                allowClear
                options={Object.entries(estadoConfig).map(([k, v]) => ({ value: k, label: v.label }))}
              />
            </div>
            <div>
              <Text strong style={{ 
                display: 'block', 
                marginBottom: 8,
                fontSize: 13,
                color: '#595959'
              }}>
                Técnico
              </Text>
              <Select
                placeholder="Todos"
                value={filtroTecnico}
                onChange={setFiltroTecnico}
                style={{ width: '100%', borderRadius: 8 }}
                allowClear
                options={tecnicos.map(t => ({ value: t, label: t }))}
              />
            </div>
            <div>
              <Text strong style={{ 
                display: 'block', 
                marginBottom: 8,
                fontSize: 13,
                color: '#595959'
              }}>
                Plantel
              </Text>
              <AutoComplete
                placeholder="Buscar plantel..."
                value={filtroPlantel ? planteles.find(p => p.id === filtroPlantel)?.nombre : ''}
                onChange={(value) => {
                  if (!value) {
                    setFiltroPlantel(null);
                    return;
                  }
                  const plantel = planteles.find(p => p.nombre === value);
                  setFiltroPlantel(plantel ? plantel.id : null);
                }}
                onSelect={(value) => {
                  const plantel = planteles.find(p => p.nombre === value);
                  setFiltroPlantel(plantel ? plantel.id : null);
                }}
                options={planteles.map(p => ({
                  value: p.nombre,
                  label: `${p.nombre} (ID: ${p.id})`
                }))}
                filterOption={(inputValue, option) =>
                  (option?.value ?? '').toLowerCase().includes(inputValue.toLowerCase())
                }
                allowClear
                onClear={() => setFiltroPlantel(null)}
                style={{ width: '100%', borderRadius: 8 }}
              />
            </div>
            <div>
              <Text strong style={{ 
                display: 'block', 
                marginBottom: 8,
                fontSize: 13,
                color: '#595959'
              }}>
                Cliente
              </Text>
              <AutoComplete
                placeholder="Buscar cliente..."
                value={filtroCliente || ''}
                onChange={(value) => setFiltroCliente(value || null)}
                onSelect={(value) => setFiltroCliente(value)}
                options={[...new Set(reparaciones.map(r => r.cliente?.nombre_completo))].filter(Boolean).map(nombre => ({
                  value: nombre,
                  label: nombre
                }))}
                filterOption={(inputValue, option) =>
                  (option?.value ?? '').toLowerCase().includes(inputValue.toLowerCase())
                }
                allowClear
                onClear={() => setFiltroCliente(null)}
                style={{ width: '100%', borderRadius: 8 }}
              />
            </div>
          </div>
        </div>

        {/* Tabla mejorada */}
        <div style={{ padding: '0 32px 24px' }}>
          <Table
            dataSource={datosFiltrados}
            columns={columnas}
            rowKey="id"
            size="middle"
            pagination={{ 
              pageSize: 10, 
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} de ${total}`,
              style: { marginTop: 24 }
            }}
            style={{
              background: '#ffffff'
            }}
          />
        </div>
      </Card>

      {/* Modal para nueva reparación */}
      <Modal
        title={
          <div style={{ padding: '8px 0' }}>
            <Title level={4} style={{ margin: 0, color: '#1a1a1a', fontWeight: 600 }}>
              Nueva Reparación
            </Title>
            <Text type="secondary" style={{ fontSize: 13, marginTop: 4, display: 'block' }}>
              Complete la información para registrar una nueva reparación
            </Text>
          </div>
        }
        open={modalNuevaReparacion}
        onCancel={cerrarModalNuevaReparacion}
        footer={null}
        width={800}
        style={{ top: 40 }}
        styles={{
          body: { padding: '24px' }
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={guardarNuevaReparacion}
          autoComplete="off"
        >
          <div style={{ 
            marginBottom: 24,
            paddingBottom: 16,
            borderBottom: '1px solid #f0f0f0'
          }}>
            <Title level={5} style={{ margin: 0, color: '#1a1a1a', fontWeight: 600 }}>
              Información del Cliente
            </Title>
            <Text type="secondary" style={{ fontSize: 13, marginTop: 4, display: 'block' }}>
              Datos del cliente que solicita la reparación
            </Text>
          </div>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="nombre_cliente"
                label="Nombre Completo"
                rules={[{ required: true, message: 'Seleccione o ingrese el nombre del cliente' }]}
              >
                <AutoComplete
                  placeholder="Buscar o escribir nombre del cliente"
                  loading={cargandoClientes}
                  options={clientes.map(c => ({
                    value: c.nombre_completo,
                    label: `${c.nombre_completo}${c.telefono ? ` - ${c.telefono}` : ''}${c.total_reparaciones ? ` (${c.total_reparaciones} reparaciones)` : ''}`
                  }))}
                  filterOption={(inputValue, option) =>
                    (option?.value ?? '').toLowerCase().includes(inputValue.toLowerCase())
                  }
                  onSelect={(value) => {
                    seleccionarCliente(value);
                  }}
                  onChange={(value) => {
                    if (!value) {
                      // Limpiar teléfono si se borra el nombre
                      form.setFieldsValue({
                        telefono_cliente: '',
                      });
                    }
                  }}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="telefono_cliente"
                label="Teléfono"
              >
                <Input placeholder="Teléfono del cliente (opcional)" />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ 
            marginTop: 32,
            marginBottom: 24,
            paddingBottom: 16,
            borderBottom: '1px solid #f0f0f0'
          }}>
            <Title level={5} style={{ margin: 0, color: '#1a1a1a', fontWeight: 600 }}>
              Información del Bien
            </Title>
            <Text type="secondary" style={{ fontSize: 13, marginTop: 4, display: 'block' }}>
              Detalles del equipo a reparar
            </Text>
          </div>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="numero_inventario"
                label="Número de Inventario"
                rules={[{ required: true, message: 'Seleccione o ingrese el número de inventario' }]}
              >
                <AutoComplete
                  placeholder="Buscar o escribir número de inventario"
                  loading={cargandoBienes}
                  options={bienes.map(b => ({
                    value: b.numero_inventario,
                    label: `${b.numero_inventario} - ${b.tipo_bien} ${b.marca} ${b.modelo || ''}`.trim()
                  }))}
                  filterOption={(inputValue, option) =>
                    (option?.value ?? '').toString().includes(inputValue) ||
                    (option?.label ?? '').toLowerCase().includes(inputValue.toLowerCase())
                  }
                  onSelect={(value) => {
                    seleccionarBien(value);
                  }}
                  onChange={(value) => {
                    if (!value) {
                      // Limpiar campos si se borra el valor
                      form.setFieldsValue({
                        tipo_bien: '',
                        marca: '',
                        modelo: '',
                        numero_serie: '',
                        especificaciones: '',
                        plantel_id: undefined,
                        entidad_id: undefined,
                        imagenes_bien: [],
                      });
                    }
                  }}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="tipo_bien"
                label="Tipo de Bien"
                rules={[{ required: true, message: 'Ingrese el tipo de bien' }]}
              >
                <Input placeholder="Ej: Laptop, Monitor, Impresora, etc." />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="marca"
                label="Marca"
                rules={[{ required: true, message: 'Ingrese la marca' }]}
              >
                <Input placeholder="Marca del equipo" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="modelo"
                label="Modelo"
              >
                <Input placeholder="Modelo del equipo (opcional)" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="numero_serie"
                label="Número de Serie"
              >
                <Input placeholder="Número de serie (opcional)" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="plantel_id"
                label="Plantel"
                rules={[{ required: true, message: 'Seleccione un plantel' }]}
              >
                <Select
                  placeholder="Seleccione un plantel"
                  loading={cargandoPlanteles}
                  notFoundContent={cargandoPlanteles ? <Spin size="small" /> : 'No hay planteles disponibles'}
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider style={{ margin: '8px 0' }} />
                      <Button
                        type="link"
                        icon={<PlusOutlined />}
                        onClick={() => setModalNuevoPlantel(true)}
                        style={{ width: '100%' }}
                      >
                        Agregar nuevo plantel
                      </Button>
                    </>
                  )}
                  options={planteles.map(p => ({
                    value: p.id,
                    label: `${p.nombre} (ID: ${p.id})`
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="entidad_id"
                label="Entidad"
                rules={[{ required: true, message: 'Seleccione una entidad' }]}
              >
                <Select
                  placeholder="Seleccione una entidad"
                  loading={cargandoEntidades}
                  notFoundContent={cargandoEntidades ? <Spin size="small" /> : 'No hay entidades disponibles'}
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider style={{ margin: '8px 0' }} />
                      <Button
                        type="link"
                        icon={<PlusOutlined />}
                        onClick={() => setModalNuevaEntidad(true)}
                        style={{ width: '100%' }}
                      >
                        Agregar nueva entidad
                      </Button>
                    </>
                  )}
                  options={entidades.map(e => ({
                    value: e.id,
                    label: `${e.nombre} (ID: ${e.id})`
                  }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="especificaciones"
                label="Especificaciones"
              >
                <Input.TextArea 
                  rows={3} 
                  placeholder="Especificaciones técnicas (opcional)" 
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                name="imagenes_bien"
                label="Imágenes del Bien"
                tooltip="Puede subir múltiples imágenes del equipo (máximo 5MB por imagen, formatos: JPEG, PNG, JPG, GIF, WEBP)"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  // Cuando se retorna false en beforeUpload, el archivo se agrega a fileList
                  // pero necesitamos asegurarnos de que mantenga el originFileObj
                  if (Array.isArray(e)) {
                    return e;
                  }
                  // e puede ser un objeto con fileList o directamente fileList
                  const fileList = e?.fileList || e;
                  console.log('📎 getValueFromEvent - Archivos capturados:', fileList?.length || 0);
                  if (fileList && Array.isArray(fileList)) {
                    fileList.forEach((file, index) => {
                      if (file.originFileObj) {
                        console.log(`  ✓ Archivo ${index + 1} tiene originFileObj:`, file.name);
                      } else {
                        console.warn(`  ✗ Archivo ${index + 1} SIN originFileObj:`, file.name, file);
                      }
                    });
                  }
                  return fileList || [];
                }}
              >
                <Upload
                  listType="picture-card"
                  multiple
                  accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                  beforeUpload={(file) => {
                    const maxSize = 5 * 1024 * 1024; // 5MB (según documentación)
                    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
                    
                    console.log('📤 Archivo seleccionado:', file.name, `(${(file.size / 1024).toFixed(2)} KB)`, file.type);
                    
                    // Validar tamaño
                    if (file.size > maxSize) {
                      message.error(`La imagen ${file.name} excede el tamaño máximo de 5MB`);
                      return Upload.LIST_IGNORE;
                    }
                    
                    // Validar tipo
                    if (!validTypes.includes(file.type)) {
                      message.error(`El formato de ${file.name} no es válido. Use: JPEG, PNG, JPG, GIF o WEBP`);
                      return Upload.LIST_IGNORE;
                    }
                    
                    // Retornar false para prevenir subida automática pero permitir que se agregue a la lista
                    // El archivo se agregará a fileList con originFileObj
                    return false;
                  }}
                  maxCount={10}
                  onChange={(info) => {
                    // info.fileList contiene todos los archivos
                    const fileList = info.fileList;
                    console.log('🔄 Upload onChange - Total archivos:', fileList.length);
                    
                    // Verificar que cada archivo tenga originFileObj
                    fileList.forEach((file, index) => {
                      if (file.originFileObj) {
                        console.log(`  ✓ Archivo ${index + 1}:`, file.name, `(${(file.originFileObj.size / 1024).toFixed(2)} KB)`);
                      } else if (file.status === 'done') {
                        // Archivo ya subido, no necesita originFileObj
                        console.log(`  ✓ Archivo ${index + 1} (ya subido):`, file.name);
                      } else {
                        console.warn(`  ✗ Archivo ${index + 1} sin originFileObj:`, file.name, file);
                      }
                    });
                    
                    // Actualizar el formulario
                    form.setFieldsValue({ imagenes_bien: fileList });
                  }}
                  onRemove={(file) => {
                    const currentFiles = form.getFieldValue('imagenes_bien') || [];
                    const newFiles = currentFiles.filter(f => f.uid !== file.uid);
                    form.setFieldsValue({ imagenes_bien: newFiles });
                    console.log('🗑️ Archivo removido. Archivos restantes:', newFiles.length);
                  }}
                >
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Subir imagen</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <div style={{ 
            marginTop: 32,
            marginBottom: 24,
            paddingBottom: 16,
            borderBottom: '1px solid #f0f0f0'
          }}>
            <Title level={5} style={{ margin: 0, color: '#1a1a1a', fontWeight: 600 }}>
              Información de la Reparación
            </Title>
            <Text type="secondary" style={{ fontSize: 13, marginTop: 4, display: 'block' }}>
              Descripción del problema y accesorios
            </Text>
          </div>
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                name="falla_reportada"
                label="Falla Reportada"
                rules={[{ required: true, message: 'Describa la falla reportada' }]}
              >
                <Input.TextArea 
                  rows={4} 
                  placeholder="Describa la falla o problema reportado" 
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                name="accesorios_incluidos"
                label="Accesorios Incluidos"
              >
                <Input.TextArea 
                  rows={3} 
                  placeholder="Liste los accesorios incluidos (opcional)" 
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={guardando}
                size="large"
                style={{ 
                  background: '#2e7d32', 
                  borderColor: '#2e7d32',
                  borderRadius: 8,
                  paddingLeft: 24,
                  paddingRight: 24,
                  height: 44,
                  fontWeight: 500,
                  boxShadow: '0 2px 4px rgba(46, 125, 50, 0.2)'
                }}
              >
                Guardar Reparación
              </Button>
              <Button 
                onClick={cerrarModalNuevaReparacion}
                size="large"
                style={{
                  borderRadius: 8,
                  paddingLeft: 24,
                  paddingRight: 24,
                  height: 44
                }}
              >
                Cancelar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal para nuevo plantel */}
      <Modal
        title="Agregar Nuevo Plantel"
        open={modalNuevoPlantel}
        onCancel={() => {
          setModalNuevoPlantel(false);
          formPlantel.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={formPlantel}
          layout="vertical"
          onFinish={guardarNuevoPlantel}
          autoComplete="off"
        >
          <Form.Item
            name="nombre"
            label="Nombre del Plantel"
            rules={[{ required: true, message: 'Ingrese el nombre del plantel' }]}
          >
            <Input placeholder="Nombre del plantel" />
          </Form.Item>
          <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={guardandoPlantel}
                style={{ background: '#2e7d32', borderColor: '#2e7d32' }}
              >
                Guardar Plantel
              </Button>
              <Button onClick={() => {
                setModalNuevoPlantel(false);
                formPlantel.resetFields();
              }}>
                Cancelar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal para nueva entidad */}
      <Modal
        title="Agregar Nueva Entidad"
        open={modalNuevaEntidad}
        onCancel={() => {
          setModalNuevaEntidad(false);
          formEntidad.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={formEntidad}
          layout="vertical"
          onFinish={guardarNuevaEntidad}
          autoComplete="off"
        >
          <Form.Item
            name="nombre"
            label="Nombre de la Entidad"
            rules={[{ required: true, message: 'Ingrese el nombre de la entidad' }]}
          >
            <Input placeholder="Nombre de la entidad" />
          </Form.Item>
          <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={guardandoEntidad}
                style={{ background: '#2e7d32', borderColor: '#2e7d32' }}
              >
                Guardar Entidad
              </Button>
              <Button onClick={() => {
                setModalNuevaEntidad(false);
                formEntidad.resetFields();
              }}>
                Cancelar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal para agregar actualización */}
      <Modal
        title={
          <div style={{ padding: '8px 0' }}>
            <Title level={4} style={{ margin: 0, color: '#1a1a1a', fontWeight: 600 }}>
              Agregar Actualización
            </Title>
            <Text type="secondary" style={{ fontSize: 13, marginTop: 4, display: 'block' }}>
              Reparación #{reparacionSeleccionada?.id || ''}
            </Text>
          </div>
        }
        open={modalActualizacion}
        onCancel={cerrarModalActualizacion}
        footer={null}
        width={600}
        style={{ top: 40 }}
        styles={{
          body: { padding: '24px' }
        }}
      >
        <Form
          form={formActualizacion}
          layout="vertical"
          onFinish={guardarActualizacion}
          autoComplete="off"
        >
          <Form.Item
            name="descripcion"
            label="Descripción de la Actualización"
            rules={[{ required: true, message: 'Ingrese la descripción de la actualización' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Describa los cambios o avances realizados en la reparación"
            />
          </Form.Item>
          <Form.Item
            name="estado_nuevo"
            label="Estado (opcional)"
            tooltip="Si desea cambiar el estado de la reparación, seleccione un nuevo estado. De lo contrario, deje el estado actual."
          >
            <Select
              placeholder="Seleccione un estado (opcional)"
              options={Object.entries(estadoConfig).map(([key, config]) => ({
                value: key,
                label: config.label,
              }))}
            />
          </Form.Item>
          <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={guardandoActualizacion}
                size="large"
                style={{ 
                  background: '#2e7d32', 
                  borderColor: '#2e7d32',
                  borderRadius: 8,
                  paddingLeft: 24,
                  paddingRight: 24,
                  height: 40,
                  fontWeight: 500,
                  boxShadow: '0 2px 4px rgba(46, 125, 50, 0.2)'
                }}
              >
                Guardar Actualización
              </Button>
              <Button 
                onClick={cerrarModalActualizacion}
                size="large"
                style={{
                  borderRadius: 8,
                  paddingLeft: 24,
                  paddingRight: 24,
                  height: 40
                }}
              >
                Cancelar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <style>{`
        .ant-table-thead > tr > th {
          background: #fafafa !important;
          font-weight: 600;
          color: #1a1a1a;
          border-bottom: 2px solid #e8e8e8 !important;
          padding: 16px !important;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .ant-table-tbody > tr {
          transition: all 0.2s ease;
        }
        .ant-table-tbody > tr:hover > td {
          background: #f5f9f6 !important;
          cursor: pointer;
        }
        .ant-table-tbody > tr > td {
          padding: 16px !important;
          border-bottom: 1px solid #f0f0f0 !important;
        }
        .ant-table-pagination {
          margin-top: 24px !important;
        }
        .ant-card {
          transition: all 0.3s ease;
        }
        .ant-input:focus, .ant-input-focused {
          border-color: #2e7d32 !important;
          box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.1) !important;
        }
        .ant-select:not(.ant-select-disabled):hover .ant-select-selector {
          border-color: #2e7d32 !important;
        }
        .ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) .ant-select-selector {
          border-color: #2e7d32 !important;
          box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.1) !important;
        }
        .ant-btn-link {
          padding: 4px 8px;
          height: auto;
        }
        .ant-btn-link:hover {
          background: rgba(46, 125, 50, 0.08);
          border-radius: 4px;
        }
        .ant-modal-header {
          border-bottom: 1px solid #f0f0f0;
          padding: 20px 24px;
        }
        .ant-modal-title {
          font-weight: 600;
        }
        .ant-form-item-label > label {
          font-weight: 500;
          color: #595959;
        }
        .ant-input, .ant-select-selector, .ant-input-affix-wrapper {
          border-radius: 8px !important;
          transition: all 0.2s ease;
        }
        .ant-tag {
          border-radius: 4px;
          font-weight: 500;
          padding: 2px 10px;
        }
        .ant-divider {
          margin: 24px 0;
        }
        @media (max-width: 768px) {
          .filters-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 769px) and (max-width: 992px) {
          .filters-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
