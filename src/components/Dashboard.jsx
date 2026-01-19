import { useState, useEffect } from 'react';
import { Input, Card, Table, Tag, Typography, Spin, Row, Col, Space, Select, Divider, Modal, Descriptions, Button, Timeline } from 'antd';
import { SearchOutlined, ToolOutlined, InboxOutlined, CheckCircleOutlined, SendOutlined, EyeOutlined, ClockCircleOutlined } from '@ant-design/icons';
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

function Dashboard() {
  const [reparaciones, setReparaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState(null);
  const [filtroTecnico, setFiltroTecnico] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [detalleReparacion, setDetalleReparacion] = useState(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [actualizaciones, setActualizaciones] = useState([]);
  const [loadingActualizaciones, setLoadingActualizaciones] = useState(false);

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

  const verDetalle = async (id) => {
    setLoadingDetalle(true);
    setLoadingActualizaciones(true);
    setModalVisible(true);
    setDetalleReparacion(null);
    setActualizaciones([]);
    try {
      const [resDetalle, resActualizaciones] = await Promise.all([
        api.getReparacion(id),
        api.getActualizaciones(id)
      ]);
      if (resDetalle.exito) {
        setDetalleReparacion(resDetalle.datos);
      }
      if (resActualizaciones.exito) {
        setActualizaciones(resActualizaciones.datos?.actualizaciones || []);
      }
    } catch (error) {
      console.error('Error al cargar detalle:', error);
    } finally {
      setLoadingDetalle(false);
      setLoadingActualizaciones(false);
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
      width: 80,
      render: (_, r) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />} 
          onClick={() => verDetalle(r.id)}
        >
          Ver
        </Button>
      ),
    },
  ];

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  }

  return (
    <div>
      {/* Título principal */}
      <Title level={3} style={{ marginBottom: 24, color: '#2e7d32' }}>
        Panel de Control
      </Title>

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

      <Modal
        title="Detalle de Reparación"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
      >
        {loadingDetalle ? (
          <Spin style={{ display: 'block', margin: '40px auto' }} />
        ) : detalleReparacion && (
          <div>
            <Tag color={estadoConfig[detalleReparacion.estado]?.color} style={{ marginBottom: 16 }}>
              {estadoConfig[detalleReparacion.estado]?.label}
            </Tag>

            <Descriptions title="Información del Bien" bordered size="small" column={2} style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Tipo">{detalleReparacion.bien?.tipo_bien}</Descriptions.Item>
              <Descriptions.Item label="Marca">{detalleReparacion.bien?.marca}</Descriptions.Item>
              <Descriptions.Item label="Modelo">{detalleReparacion.bien?.modelo}</Descriptions.Item>
              <Descriptions.Item label="No. Serie">{detalleReparacion.bien?.numero_serie}</Descriptions.Item>
              <Descriptions.Item label="No. Inventario">{detalleReparacion.bien?.numero_inventario}</Descriptions.Item>
              <Descriptions.Item label="Plantel">{detalleReparacion.bien?.plantel}</Descriptions.Item>
              <Descriptions.Item label="Entidad">{detalleReparacion.bien?.entidad}</Descriptions.Item>
              <Descriptions.Item label="Especificaciones" span={2}>{detalleReparacion.bien?.especificaciones}</Descriptions.Item>
            </Descriptions>

            <Descriptions title="Información del Cliente" bordered size="small" column={2} style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Nombre">{detalleReparacion.cliente?.nombre_completo}</Descriptions.Item>
              <Descriptions.Item label="Teléfono">{detalleReparacion.cliente?.telefono}</Descriptions.Item>
            </Descriptions>

            <Descriptions title="Información de la Reparación" bordered size="small" column={2} style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Falla Reportada" span={2}>{detalleReparacion.falla_reportada}</Descriptions.Item>
              <Descriptions.Item label="Accesorios" span={2}>{detalleReparacion.accesorios_incluidos}</Descriptions.Item>
              <Descriptions.Item label="Fecha Recepción">{detalleReparacion.fecha_recepcion}</Descriptions.Item>
              <Descriptions.Item label="Última Actualización">{detalleReparacion.ultima_actualizacion}</Descriptions.Item>
            </Descriptions>

            <Descriptions title="Técnico Asignado" bordered size="small" column={2} style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Nombre">{detalleReparacion.tecnico?.nombre}</Descriptions.Item>
              <Descriptions.Item label="No. Técnico">{detalleReparacion.tecnico?.numero}</Descriptions.Item>
              <Descriptions.Item label="Email" span={2}>{detalleReparacion.tecnico?.email}</Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={5} style={{ marginBottom: 16, color: '#333' }}>
              Historial de Actualizaciones
            </Title>
            {loadingActualizaciones ? (
              <Spin style={{ display: 'block', margin: '20px auto' }} />
            ) : actualizaciones.length > 0 ? (
              <Timeline
                mode="left"
                items={actualizaciones.map((act, index) => ({
                  key: act.id,
                  dot: <ClockCircleOutlined style={{ fontSize: '16px', color: estadoConfig[act.estado_nuevo]?.border || '#1890ff' }} />,
                  children: (
                    <div style={{ marginLeft: 20 }}>
                      <div style={{ marginBottom: 8 }}>
                        <Tag color={estadoConfig[act.estado_anterior]?.color} style={{ marginRight: 8 }}>
                          {estadoConfig[act.estado_anterior]?.label || act.estado_anterior}
                        </Tag>
                        <span style={{ margin: '0 8px', color: '#999' }}>→</span>
                        <Tag color={estadoConfig[act.estado_nuevo]?.color}>
                          {estadoConfig[act.estado_nuevo]?.label || act.estado_nuevo}
                        </Tag>
                      </div>
                      <Text strong style={{ display: 'block', marginBottom: 4, color: '#333' }}>
                        {act.descripcion}
                      </Text>
                      <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                        <Text type="secondary">
                          <strong>Técnico:</strong> {act.tecnico?.nombre} ({act.tecnico?.numero})
                        </Text>
                        <br />
                        <Text type="secondary">
                          <strong>Fecha:</strong> {new Date(act.fecha).toLocaleString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Text>
                      </div>
                    </div>
                  ),
                }))}
              />
            ) : (
              <Text type="secondary">No hay actualizaciones registradas</Text>
            )}
          </div>
        )}
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
