import { useState, useEffect } from 'react';
import { Input, Card, Table, Tag, Typography, Spin, Row, Col, Space, Select, Divider, Modal, Descriptions, Button, Timeline, Form, message, AutoComplete, Tooltip } from 'antd';
import { SearchOutlined, ToolOutlined, InboxOutlined, CheckCircleOutlined, SendOutlined, EyeOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
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

  const obtenerMasReciente = (estado) => {
    const items = reparaciones.filter(r => r.estado === estado);
    if (items.length === 0) return null;
    return items.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0];
  };

  const contarPorEstado = (estado) => reparaciones.filter(r => r.estado === estado).length;

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
  };

  const guardarNuevaReparacion = async (valores) => {
    setGuardando(true);
    try {
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
    const matchBusqueda = !busqueda || 
      r.bien?.tipo_bien?.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.bien?.marca?.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.cliente?.nombre_completo?.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.falla_reportada?.toLowerCase().includes(busqueda.toLowerCase());
    const matchEstado = !filtroEstado || r.estado === filtroEstado;
    const matchTecnico = !filtroTecnico || r.tecnico?.name === filtroTecnico;
    return matchBusqueda && matchEstado && matchTecnico;
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
    return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  }

  return (
    <div>
      {/* Título principal */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, color: '#2e7d32' }}>
          Panel de Control
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={abrirModalNuevaReparacion}
          size="large"
          style={{ background: '#2e7d32', borderColor: '#2e7d32' }}
        >
          Agregar Reparación
        </Button>
      </div>

      {/* Resumen por estado */}
      <Card
        bordered={false}
        style={{
          marginBottom: 32,
          borderRadius: 12,
          background: '#f8f9fa',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <Title level={5} style={{ marginBottom: 16, color: '#555' }}>
          Últimas Reparaciones por Estado
        </Title>
        <Row gutter={[16, 16]}>
        {Object.entries(estadoConfig).map(([estado, config]) => {
          const item = obtenerMasReciente(estado);
          const count = contarPorEstado(estado);
          return (
            <Col xs={24} sm={12} lg={6} key={estado}>
              <Card 
                bordered={false}
                style={{ 
                  height: 140,
                  borderRadius: 10,
                  background: config.bg,
                  borderLeft: `4px solid ${config.border}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
                bodyStyle={{ padding: 12 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <Text style={{ color: config.text, fontSize: 14, fontWeight: 600 }}>
                    {config.icon} {config.label}
                  </Text>
                  <div style={{ 
                    background: config.border, 
                    borderRadius: 6, 
                    padding: '2px 10px',
                  }}>
                    <Text style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{count}</Text>
                  </div>
                </div>
                <Divider style={{ margin: '8px 0', borderColor: config.border, opacity: 0.3 }} />
                {item ? (
                  <div>
                    <Text strong style={{ color: '#333', fontSize: 13, display: 'block' }}>
                      {item.bien?.tipo_bien} - {item.bien?.marca}
                    </Text>
                    <Text style={{ color: '#666', fontSize: 12, display: 'block', marginTop: 4 }}>
                      {item.cliente?.nombre_completo}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 11, display: 'block', marginTop: 4 }}>
                      Recibido: {new Date(item.created_at).toLocaleDateString()}
                    </Text>
                  </div>
                ) : (
                  <Text type="secondary">Sin reparaciones recientes</Text>
                )}
              </Card>
            </Col>
          );
        })}
        </Row>
      </Card>

      {/* Tabla con filtros integrados */}
      <Card 
        bordered={false}
        style={{ 
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        <Title level={5} style={{ marginBottom: 4, color: '#333' }}>
          Listado Completo de Reparaciones
        </Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          {datosFiltrados.length} de {reparaciones.length} registros
        </Text>

        <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
          <Col xs={24} sm={10} md={8}>
            <Input
              placeholder="Buscar equipo, cliente, falla..."
              prefix={<SearchOutlined style={{ color: '#999' }} />}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={12} sm={7} md={5}>
            <Select
              placeholder="Estado"
              value={filtroEstado}
              onChange={setFiltroEstado}
              style={{ width: '100%' }}
              allowClear
              options={Object.entries(estadoConfig).map(([k, v]) => ({ value: k, label: v.label }))}
            />
          </Col>
          <Col xs={12} sm={7} md={5}>
            <Select
              placeholder="Técnico"
              value={filtroTecnico}
              onChange={setFiltroTecnico}
              style={{ width: '100%' }}
              allowClear
              options={tecnicos.map(t => ({ value: t, label: t }))}
            />
          </Col>
        </Row>

        <Table
          dataSource={datosFiltrados}
          columns={columnas}
          rowKey="id"
          size="middle"
          pagination={{ 
            pageSize: 10, 
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total}`,
          }}
        />
      </Card>

      {/* Modal para nueva reparación */}
      <Modal
        title="Nueva Reparación"
        open={modalNuevaReparacion}
        onCancel={cerrarModalNuevaReparacion}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={guardarNuevaReparacion}
          autoComplete="off"
        >
          <Title level={5} style={{ marginBottom: 16, color: '#333' }}>
            Información del Cliente
          </Title>
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

          <Divider />

          <Title level={5} style={{ marginBottom: 16, color: '#333' }}>
            Información del Bien
          </Title>
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

          <Divider />

          <Title level={5} style={{ marginBottom: 16, color: '#333' }}>
            Información de la Reparación
          </Title>
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

          <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={guardando}
                style={{ background: '#2e7d32', borderColor: '#2e7d32' }}
              >
                Guardar Reparación
              </Button>
              <Button onClick={cerrarModalNuevaReparacion}>
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
        title={`Agregar Actualización - Reparación #${reparacionSeleccionada?.id || ''}`}
        open={modalActualizacion}
        onCancel={cerrarModalActualizacion}
        footer={null}
        width={600}
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
          <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={guardandoActualizacion}
                style={{ background: '#2e7d32', borderColor: '#2e7d32' }}
              >
                Guardar Actualización
              </Button>
              <Button onClick={cerrarModalActualizacion}>
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
          color: #333;
        }
        .ant-table-tbody > tr:hover > td {
          background: #e8f5e9 !important;
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
