import { useState, useEffect, useRef } from 'react';
import { 
  Card, Tag, Typography, Spin, Descriptions, Button, Timeline, 
  Divider, Modal, Form, Input, Select, message, Space, Row, Col, Upload
} from 'antd';
import { 
  ArrowLeftOutlined, PrinterOutlined, EditOutlined, 
  ClockCircleOutlined, PlusOutlined, PictureOutlined, 
  FileTextOutlined, UploadOutlined, EyeOutlined
} from '@ant-design/icons';
import { api } from '../services/api';
import DocumentoEntrega from './DocumentoEntrega';

const { Text, Title } = Typography;
const { TextArea } = Input;

const estadoConfig = {
  recibido: { 
    color: 'blue', 
    label: 'Recibido', 
    bg: '#e3f2fd',
    border: '#2196f3',
    text: '#1565c0',
  },
  proceso: { 
    color: 'orange', 
    label: 'En Proceso', 
    bg: '#fff3e0',
    border: '#ff9800',
    text: '#e65100',
  },
  listo: { 
    color: 'green', 
    label: 'Listo', 
    bg: '#e8f5e9',
    border: '#4caf50',
    text: '#2e7d32',
  },
  entregado: { 
    color: 'default', 
    label: 'Entregado', 
    bg: '#f5f5f5',
    border: '#9e9e9e',
    text: '#616161',
  },
};

function DetalleReparacion({ reparacionId, onVolver }) {
  const [detalleReparacion, setDetalleReparacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actualizaciones, setActualizaciones] = useState([]);
  const [loadingActualizaciones, setLoadingActualizaciones] = useState(false);
  const [modalActualizarEstado, setModalActualizarEstado] = useState(false);
  const [formEstado] = Form.useForm();
  const [guardandoEstado, setGuardandoEstado] = useState(false);
  const [editando, setEditando] = useState(false);
  const [formEditar] = Form.useForm();
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);
  const [modalNuevaActualizacion, setModalNuevaActualizacion] = useState(false);
  const [formNuevaActualizacion] = Form.useForm();
  const [guardandoNuevaActualizacion, setGuardandoNuevaActualizacion] = useState(false);
  const [modalOrdenFirmada, setModalOrdenFirmada] = useState(false);
  const [formOrdenFirmada] = Form.useForm();
  const [subiendoOrdenFirmada, setSubiendoOrdenFirmada] = useState(false);
  const documentoRef = useRef(null);

  useEffect(() => {
    if (reparacionId) {
      cargarDetalle();
    } else {
      setDetalleReparacion(null);
      setLoading(false);
      setLoadingActualizaciones(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reparacionId]);

  const cargarDetalle = async () => {
    if (!reparacionId) {
      setLoading(false);
      setLoadingActualizaciones(false);
      return;
    }

    setLoading(true);
    setLoadingActualizaciones(true);
    try {
      const [resDetalle, resActualizaciones] = await Promise.all([
        api.getReparacion(reparacionId),
        api.getActualizaciones(reparacionId)
      ]);
      
      if (resDetalle && resDetalle.exito) {
        let datosReparacion = resDetalle.datos;
        
        // Si el bien tiene ID pero no tiene imágenes, intentar obtener el detalle completo del bien
        if (datosReparacion?.bien?.id && (!datosReparacion.bien.imagenes || datosReparacion.bien.imagenes.length === 0)) {
          try {
            const resBien = await api.getBien(datosReparacion.bien.id);
            if (resBien && resBien.exito && resBien.datos) {
              // Combinar los datos del bien con las imágenes
              datosReparacion = {
                ...datosReparacion,
                bien: {
                  ...datosReparacion.bien,
                  ...resBien.datos,
                  // Asegurar que las imágenes estén presentes
                  imagenes: resBien.datos.imagenes || datosReparacion.bien.imagenes || []
                }
              };
            }
          } catch (error) {
            console.warn('No se pudo obtener el detalle del bien:', error);
            // Continuar con los datos originales
          }
        }
        
        setDetalleReparacion(datosReparacion);
        formEditar.setFieldsValue({
          falla_reportada: datosReparacion?.falla_reportada || '',
          accesorios_incluidos: datosReparacion?.accesorios_incluidos || '',
        });
      } else {
        // Si la respuesta no fue exitosa, establecer detalleReparacion a null
        setDetalleReparacion(null);
        message.error(resDetalle?.mensaje || 'No se pudo cargar el detalle de la reparación');
      }
      
      if (resActualizaciones && resActualizaciones.exito) {
        setActualizaciones(resActualizaciones.datos?.actualizaciones || []);
      } else {
        setActualizaciones([]);
      }
    } catch (error) {
      console.error('Error al cargar detalle:', error);
      setDetalleReparacion(null);
      setActualizaciones([]);
      message.error('Error al cargar el detalle de la reparación. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
      setLoadingActualizaciones(false);
    }
  };

  const abrirModalActualizarEstado = () => {
    formEstado.setFieldsValue({
      estado: detalleReparacion?.estado,
      descripcion: '',
    });
    setModalActualizarEstado(true);
  };

  const actualizarEstado = async (valores) => {
    setGuardandoEstado(true);
    try {
      const res = await api.actualizarEstadoReparacion(reparacionId, {
        estado: valores.estado,
        descripcion: valores.descripcion || null,
      });
      
      if (res.exito) {
        message.success('Estado actualizado correctamente');
        setModalActualizarEstado(false);
        formEstado.resetFields();
        cargarDetalle();
      } else {
        message.error(res.mensaje || 'Error al actualizar el estado');
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      message.error('Error de conexión con el servidor');
    } finally {
      setGuardandoEstado(false);
    }
  };

  const guardarEdicion = async (valores) => {
    setGuardandoEdicion(true);
    try {
      // Por ahora solo editamos falla_reportada y accesorios_incluidos
      // Si hay endpoint PUT para editar, se puede usar aquí
      message.success('Funcionalidad de edición en desarrollo');
      setEditando(false);
      // Aquí se podría llamar a un endpoint PUT /reparaciones/{id}
    } catch (error) {
      console.error('Error al guardar edición:', error);
      message.error('Error al guardar los cambios');
    } finally {
      setGuardandoEdicion(false);
    }
  };

  const abrirModalNuevaActualizacion = () => {
    formNuevaActualizacion.setFieldsValue({
      descripcion: '',
      estado_nuevo: detalleReparacion?.estado,
    });
    setModalNuevaActualizacion(true);
  };

  const cerrarModalNuevaActualizacion = () => {
    setModalNuevaActualizacion(false);
    formNuevaActualizacion.resetFields();
  };

  const guardarNuevaActualizacion = async (valores) => {
    setGuardandoNuevaActualizacion(true);
    try {
      const datos = {
        descripcion: valores.descripcion,
        estado_nuevo: valores.estado_nuevo !== detalleReparacion?.estado ? valores.estado_nuevo : undefined,
      };

      const res = await api.crearActualizacion(reparacionId, datos);
      
      if (res.exito) {
        message.success('Actualización registrada correctamente');
        cerrarModalNuevaActualizacion();
        cargarDetalle();
      } else {
        message.error(res.mensaje || 'Error al registrar la actualización');
      }
    } catch (error) {
      console.error('Error al guardar actualización:', error);
      message.error('Error de conexión con el servidor');
    } finally {
      setGuardandoNuevaActualizacion(false);
    }
  };

  const abrirModalOrdenFirmada = () => {
    formOrdenFirmada.setFieldsValue({
      orden_firmada: [],
    });
    setModalOrdenFirmada(true);
  };

  const cerrarModalOrdenFirmada = () => {
    setModalOrdenFirmada(false);
    formOrdenFirmada.resetFields();
    formOrdenFirmada.setFieldsValue({ orden_firmada: [] });
  };

  const guardarOrdenFirmada = async (valores) => {
    // El valor ya es el fileList (array) directamente - igual que con las imágenes
    const fileList = valores.orden_firmada;
    
    console.log('🔍 Valores del formulario:', valores);
    console.log('📋 FileList recibido:', fileList);
    
    if (!fileList || !Array.isArray(fileList) || fileList.length === 0) {
      message.warning('Por favor, seleccione un archivo');
      return;
    }

    // Pasar el objeto del fileList directamente, igual que con las imágenes
    const archivoItem = fileList[0];
    
    console.log('📄 Archivo item:', archivoItem);
    console.log('📄 Tiene originFileObj:', !!archivoItem?.originFileObj);
    console.log('📄 Es File:', archivoItem instanceof File);

    setSubiendoOrdenFirmada(true);
    try {
      // Pasar el objeto completo del fileList, la función API extraerá el archivo
      const res = await api.actualizarOrdenFirmada(reparacionId, archivoItem);
      
      if (res.exito) {
        message.success('Orden firmada subida correctamente');
        cerrarModalOrdenFirmada();
        cargarDetalle();
      } else {
        message.error(res.mensaje || 'Error al subir la orden firmada');
      }
    } catch (error) {
      console.error('❌ Error al subir orden firmada:', error);
      message.error('Error de conexión con el servidor');
    } finally {
      setSubiendoOrdenFirmada(false);
    }
  };

  const imprimirDocumento = () => {
    if (!documentoRef.current) return;
    
    const ventanaImpresion = window.open('', '_blank');
    const contenido = documentoRef.current.innerHTML;
    
    ventanaImpresion.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Orden de Servicio - ${detalleReparacion?.id || ''}</title>
          <meta charset="utf-8">
          <style>
            @page {
              size: A4;
              margin: 0;
            }
            @media print {
              body { 
                margin: 0;
                padding: 0;
              }
              * {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background: white;
            }
          </style>
        </head>
        <body>
          ${contenido}
        </body>
      </html>
    `);
    
    ventanaImpresion.document.close();
    ventanaImpresion.focus();
    
    setTimeout(() => {
      ventanaImpresion.print();
      setTimeout(() => {
        ventanaImpresion.close();
      }, 100);
    }, 500);
  };

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
        <Text type="secondary" style={{ fontSize: 14 }}>Cargando detalle de reparación...</Text>
      </div>
    );
  }

  if (!detalleReparacion) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '100px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16
      }}>
        <Text type="danger" style={{ fontSize: 16 }}>No se pudo cargar el detalle de la reparación</Text>
        <Button 
          onClick={onVolver}
          type="primary"
          size="large"
          style={{ 
            marginTop: 8,
            borderRadius: 8,
            paddingLeft: 24,
            paddingRight: 24,
            height: 40
          }}
        >
          Volver al Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '0 4px' }}>
      {/* Header mejorado con más profundidad */}
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
        <Row justify="space-between" align="middle" wrap>
          <Col xs={24} sm={24} md={14}>
            <Space size="middle" wrap>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={onVolver}
                style={{
                  borderRadius: 8,
                  height: 40,
                  paddingLeft: 16,
                  paddingRight: 16
                }}
              >
                Volver
              </Button>
              <div>
                <Title level={2} style={{ 
                  margin: 0, 
                  color: '#1a1a1a',
                  fontWeight: 600,
                  fontSize: 28,
                  letterSpacing: '-0.02em'
                }}>
                  Reparación #{detalleReparacion?.id || 'N/A'}
                </Title>
                <Text type="secondary" style={{ 
                  fontSize: 14,
                  marginTop: 4,
                  display: 'block',
                  color: '#8c8c8c'
                }}>
                  Detalle completo de la reparación
                </Text>
              </div>
              <Tag 
                color={estadoConfig[detalleReparacion?.estado]?.color || 'default'} 
                style={{ 
                  fontSize: 14, 
                  padding: '6px 16px',
                  borderRadius: 6,
                  fontWeight: 500,
                  marginTop: 4
                }}
              >
                {estadoConfig[detalleReparacion?.estado]?.label || detalleReparacion?.estado || 'Desconocido'}
              </Tag>
            </Space>
          </Col>
          <Col xs={24} sm={24} md={10}>
            <Space size="small" wrap style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button
                icon={<EditOutlined />}
                onClick={() => setEditando(!editando)}
                type={editando ? 'default' : 'primary'}
                size="large"
                style={{
                  borderRadius: 8,
                  height: 40,
                  paddingLeft: 20,
                  paddingRight: 20,
                  fontWeight: 500
                }}
              >
                {editando ? 'Cancelar' : 'Editar'}
              </Button>
              <Button
                icon={<PlusOutlined />}
                onClick={abrirModalNuevaActualizacion}
                type="primary"
                size="large"
                style={{ 
                  background: '#2196f3', 
                  borderColor: '#2196f3',
                  borderRadius: 8,
                  height: 40,
                  paddingLeft: 20,
                  paddingRight: 20,
                  fontWeight: 500,
                  boxShadow: '0 2px 4px rgba(33, 150, 243, 0.2)'
                }}
              >
                Actualización
              </Button>
              <Button
                icon={<PlusOutlined />}
                onClick={abrirModalActualizarEstado}
                type="primary"
                size="large"
                style={{ 
                  background: '#ff9800', 
                  borderColor: '#ff9800',
                  borderRadius: 8,
                  height: 40,
                  paddingLeft: 20,
                  paddingRight: 20,
                  fontWeight: 500,
                  boxShadow: '0 2px 4px rgba(255, 152, 0, 0.2)'
                }}
              >
                Estado
              </Button>
              {detalleReparacion?.estado === 'listo' && (
                <>
                  {detalleReparacion?.orden_firmada ? (
                    <Space>
                      <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => window.open(detalleReparacion.orden_firmada, '_blank')}
                        size="large"
                        style={{ 
                          background: '#9c27b0', 
                          borderColor: '#9c27b0',
                          borderRadius: 8,
                          height: 40,
                          paddingLeft: 20,
                          paddingRight: 20,
                          fontWeight: 500,
                          boxShadow: '0 2px 4px rgba(156, 39, 176, 0.2)'
                        }}
                      >
                        Ver Orden
                      </Button>
                      <Button
                        type="default"
                        icon={<FileTextOutlined />}
                        onClick={abrirModalOrdenFirmada}
                        size="large"
                        style={{ 
                          borderRadius: 8,
                          height: 40,
                          paddingLeft: 20,
                          paddingRight: 20,
                          fontWeight: 500
                        }}
                      >
                        Actualizar
                      </Button>
                    </Space>
                  ) : (
                    <Button
                      type="primary"
                      icon={<FileTextOutlined />}
                      onClick={abrirModalOrdenFirmada}
                      size="large"
                      style={{ 
                        background: '#9c27b0', 
                        borderColor: '#9c27b0',
                        borderRadius: 8,
                        height: 40,
                        paddingLeft: 20,
                        paddingRight: 20,
                        fontWeight: 500,
                        boxShadow: '0 2px 4px rgba(156, 39, 176, 0.2)'
                      }}
                    >
                      Agregar Orden
                    </Button>
                  )}
                  <Button
                    type="primary"
                    icon={<PrinterOutlined />}
                    onClick={imprimirDocumento}
                    size="large"
                    style={{ 
                      background: '#2e7d32', 
                      borderColor: '#2e7d32',
                      borderRadius: 8,
                      height: 40,
                      paddingLeft: 20,
                      paddingRight: 20,
                      fontWeight: 500,
                      boxShadow: '0 2px 4px rgba(46, 125, 50, 0.2)'
                    }}
                  >
                    Imprimir
                  </Button>
                </>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Información del Bien */}
      <Card
        title={
          <div>
            <Title level={5} style={{ margin: 0, color: '#1a1a1a', fontWeight: 600 }}>
              Información del Bien
            </Title>
            <Text type="secondary" style={{ fontSize: 13, marginTop: 4, display: 'block' }}>
              Detalles del equipo a reparar
            </Text>
          </div>
        }
        variant="outlined"
        style={{ 
          marginBottom: 24, 
          borderRadius: 16,
          background: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.04)',
        }}
      >
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="Tipo">{detalleReparacion.bien?.tipo_bien || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Marca">{detalleReparacion.bien?.marca || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Modelo">{detalleReparacion.bien?.modelo || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="No. Serie">{detalleReparacion.bien?.numero_serie || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="No. Inventario">{detalleReparacion.bien?.numero_inventario || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Plantel">
            {typeof detalleReparacion.bien?.plantel === 'string' 
              ? detalleReparacion.bien.plantel 
              : detalleReparacion.bien?.plantel?.nombre || detalleReparacion.bien?.plantel?.name || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Entidad">
            {typeof detalleReparacion.bien?.entidad === 'string' 
              ? detalleReparacion.bien.entidad 
              : detalleReparacion.bien?.entidad?.nombre || detalleReparacion.bien?.entidad?.name || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Especificaciones" span={2}>
            {detalleReparacion.bien?.especificaciones || 'N/A'}
          </Descriptions.Item>
        </Descriptions>
        
        {/* Galería de Imágenes del Bien */}
        {detalleReparacion.bien?.imagenes && 
         Array.isArray(detalleReparacion.bien.imagenes) && 
         detalleReparacion.bien.imagenes.length > 0 && (() => {
          try {
            // Filtrar solo URLs válidas (strings no vacíos)
            const imagenesValidas = detalleReparacion.bien.imagenes
              .filter(url => typeof url === 'string' && url.trim() !== '')
              .map(url => url.trim());
            
            if (imagenesValidas.length > 0) {
              return (
                <div style={{ marginTop: 24 }}>
                  <Divider />
                  <div style={{ marginBottom: 16 }}>
                    <Title level={5} style={{ margin: 0, color: '#1a1a1a', fontWeight: 600 }}>
                      <PictureOutlined style={{ marginRight: 8 }} />
                      Imágenes del Bien
                    </Title>
                    <Text type="secondary" style={{ fontSize: 13, marginTop: 4, display: 'block' }}>
                      {imagenesValidas.length} imagen{imagenesValidas.length > 1 ? 'es' : ''} disponible{imagenesValidas.length > 1 ? 's' : ''}
                    </Text>
                  </div>
                  <Row gutter={[16, 16]}>
                    {imagenesValidas.map((url, index) => (
                      <Col xs={12} sm={8} md={6} lg={4} key={`img-${index}-${url}`}>
                        <div
                          style={{
                            position: 'relative',
                            width: '100%',
                            aspectRatio: '1 / 1',
                            borderRadius: 8,
                            overflow: 'hidden',
                            border: '1px solid #e0e0e0',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            background: '#f5f5f5',
                            minHeight: '150px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                          onClick={() => {
                            window.open(url, '_blank');
                          }}
                        >
                          <img
                            src={url}
                            alt={`Imagen ${index + 1} del bien`}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block'
                            }}
                            onError={(e) => {
                              console.error('Error al cargar imagen:', url);
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              );
            }
            return null;
          } catch (error) {
            console.error('Error al renderizar imágenes:', error);
            return null;
          }
        })()}
      </Card>

      {/* Información del Cliente */}
      <Card
        title={
          <div>
            <Title level={5} style={{ margin: 0, color: '#1a1a1a', fontWeight: 600 }}>
              Información del Cliente
            </Title>
            <Text type="secondary" style={{ fontSize: 13, marginTop: 4, display: 'block' }}>
              Datos del cliente que solicita la reparación
            </Text>
          </div>
        }
        variant="outlined"
        style={{ 
          marginBottom: 24, 
          borderRadius: 16,
          background: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.04)',
        }}
      >
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="Nombre">{detalleReparacion.cliente?.nombre_completo || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Teléfono">{detalleReparacion.cliente?.telefono || 'N/A'}</Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Información de la Reparación */}
      <Card
        title={
          <div>
            <Title level={5} style={{ margin: 0, color: '#1a1a1a', fontWeight: 600 }}>
              Información de la Reparación
            </Title>
            <Text type="secondary" style={{ fontSize: 13, marginTop: 4, display: 'block' }}>
              Descripción del problema y accesorios
            </Text>
          </div>
        }
        variant="outlined"
        style={{ 
          marginBottom: 24, 
          borderRadius: 16,
          background: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.04)',
        }}
      >
        {editando ? (
          <Form
            form={formEditar}
            layout="vertical"
            onFinish={guardarEdicion}
          >
            <Form.Item
              name="falla_reportada"
              label="Falla Reportada"
              rules={[{ required: true, message: 'Describa la falla reportada' }]}
            >
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="accesorios_incluidos"
              label="Accesorios Incluidos"
            >
              <TextArea rows={3} />
            </Form.Item>
            <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
              <Space>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={guardandoEdicion}
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
                  Guardar Cambios
                </Button>
                <Button 
                  onClick={() => setEditando(false)}
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
        ) : (
          <Descriptions bordered column={2} size="middle">
            <Descriptions.Item label="Falla Reportada" span={2}>
              {detalleReparacion?.falla_reportada || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Accesorios" span={2}>
              {detalleReparacion?.accesorios_incluidos || 'N/A'}
            </Descriptions.Item>
            {detalleReparacion?.orden_firmada && (
              <Descriptions.Item label="Orden Firmada" span={2}>
                <Space>
                  <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => window.open(detalleReparacion.orden_firmada, '_blank')}
                    style={{ padding: 0 }}
                  >
                    Ver documento
                  </Button>
                </Space>
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Fecha Recepción">
              {detalleReparacion?.fecha_recepcion || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Última Actualización">
              {detalleReparacion?.ultima_actualizacion || 'N/A'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Card>

      {/* Técnico Asignado */}
      <Card
        title={
          <div>
            <Title level={5} style={{ margin: 0, color: '#1a1a1a', fontWeight: 600 }}>
              Técnico Asignado
            </Title>
            <Text type="secondary" style={{ fontSize: 13, marginTop: 4, display: 'block' }}>
              Información del técnico responsable
            </Text>
          </div>
        }
        variant="outlined"
        style={{ 
          marginBottom: 24, 
          borderRadius: 16,
          background: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.04)',
        }}
      >
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="Nombre">{detalleReparacion.tecnico?.nombre || detalleReparacion.tecnico?.name || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="No. Técnico">{detalleReparacion.tecnico?.numero || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Email" span={2}>{detalleReparacion.tecnico?.email || 'N/A'}</Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Historial de Actualizaciones */}
      <Card
        title={
          <div>
            <Title level={5} style={{ margin: 0, color: '#1a1a1a', fontWeight: 600 }}>
              Historial de Actualizaciones
            </Title>
            <Text type="secondary" style={{ fontSize: 13, marginTop: 4, display: 'block' }}>
              Registro de cambios y avances en la reparación
            </Text>
          </div>
        }
        variant="outlined"
        style={{ 
          marginBottom: 24, 
          borderRadius: 16,
          background: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.04)',
        }}
      >
        {loadingActualizaciones ? (
          <Spin style={{ display: 'block', margin: '40px auto' }} />
        ) : actualizaciones.length > 0 ? (
          <Timeline
            mode="start"
            items={actualizaciones.map((act) => ({
              key: act.id,
              icon: <ClockCircleOutlined style={{ fontSize: '16px', color: estadoConfig[act.estado_nuevo]?.border || '#1890ff' }} />,
              content: (
                <div style={{ marginLeft: 20 }}>
                  <div style={{ marginBottom: 8 }}>
                    <Tag color={estadoConfig[act.estado_anterior]?.color} style={{ marginRight: 8 }}>
                      {estadoConfig[act.estado_anterior]?.label || act.estado_anterior || 'Inicial'}
                    </Tag>
                    <span style={{ margin: '0 8px', color: '#999' }}>→</span>
                    <Tag color={estadoConfig[act.estado_nuevo]?.color}>
                      {estadoConfig[act.estado_nuevo]?.label || act.estado_nuevo}
                    </Tag>
                  </div>
                  <Text strong style={{ display: 'block', marginBottom: 4, color: '#333' }}>
                    {act.descripcion || 'Sin descripción'}
                  </Text>
                  <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                    <Text type="secondary">
                      <strong>Técnico:</strong> {act.tecnico?.nombre || act.tecnico?.name || 'N/A'} ({act.tecnico?.numero || 'N/A'})
                    </Text>
                    <br />
                    <Text type="secondary">
                      <strong>Fecha:</strong> {act.fecha ? (() => {
                        try {
                          return new Date(act.fecha).toLocaleString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          });
                        } catch (e) {
                          return act.fecha || 'N/A';
                        }
                      })() : 'N/A'}
                    </Text>
                  </div>
                </div>
              ),
            }))}
          />
        ) : (
          <Text type="secondary">No hay actualizaciones registradas</Text>
        )}
      </Card>

      {/* Modal para agregar actualización */}
      <Modal
        title={
          <div style={{ padding: '8px 0' }}>
            <Title level={4} style={{ margin: 0, color: '#1a1a1a', fontWeight: 600 }}>
              Agregar Actualización
            </Title>
            <Text type="secondary" style={{ fontSize: 13, marginTop: 4, display: 'block' }}>
              Reparación #{detalleReparacion?.id || ''}
            </Text>
          </div>
        }
        open={modalNuevaActualizacion}
        onCancel={cerrarModalNuevaActualizacion}
        footer={null}
        width={600}
        style={{ top: 40 }}
        styles={{
          body: { padding: '24px' }
        }}
      >
        <Form
          form={formNuevaActualizacion}
          layout="vertical"
          onFinish={guardarNuevaActualizacion}
          autoComplete="off"
        >
          <Form.Item
            name="descripcion"
            label="Descripción de la Actualización"
            rules={[{ required: true, message: 'Ingrese la descripción de la actualización' }]}
          >
            <TextArea
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
                loading={guardandoNuevaActualizacion}
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
                onClick={cerrarModalNuevaActualizacion}
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

      {/* Modal para actualizar estado */}
      <Modal
        title={
          <div style={{ padding: '8px 0' }}>
            <Title level={4} style={{ margin: 0, color: '#1a1a1a', fontWeight: 600 }}>
              Actualizar Estado
            </Title>
            <Text type="secondary" style={{ fontSize: 13, marginTop: 4, display: 'block' }}>
              Reparación #{detalleReparacion?.id || ''}
            </Text>
          </div>
        }
        open={modalActualizarEstado}
        onCancel={() => {
          setModalActualizarEstado(false);
          formEstado.resetFields();
        }}
        footer={null}
        width={600}
        style={{ top: 40 }}
        styles={{
          body: { padding: '24px' }
        }}
      >
        <Form
          form={formEstado}
          layout="vertical"
          onFinish={actualizarEstado}
        >
          <Form.Item
            name="estado"
            label="Nuevo Estado"
            rules={[{ required: true, message: 'Seleccione un estado' }]}
          >
            <Select
              placeholder="Seleccione el nuevo estado"
              options={Object.entries(estadoConfig).map(([key, config]) => ({
                value: key,
                label: config.label,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="descripcion"
            label="Descripción de la Actualización"
          >
            <TextArea
              rows={4}
              placeholder="Describa los cambios realizados (opcional)"
            />
          </Form.Item>
          <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={guardandoEstado}
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
                Actualizar Estado
              </Button>
              <Button 
                onClick={() => {
                  setModalActualizarEstado(false);
                  formEstado.resetFields();
                }}
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

      {/* Modal para subir orden firmada */}
      <Modal
        title={
          <div style={{ padding: '8px 0' }}>
            <Title level={4} style={{ margin: 0, color: '#1a1a1a', fontWeight: 600 }}>
              {detalleReparacion?.orden_firmada ? 'Actualizar Orden Firmada' : 'Agregar Orden Firmada'}
            </Title>
            <Text type="secondary" style={{ fontSize: 13, marginTop: 4, display: 'block' }}>
              Reparación #{detalleReparacion?.id || ''}
            </Text>
          </div>
        }
        open={modalOrdenFirmada}
        onCancel={cerrarModalOrdenFirmada}
        footer={null}
        width={600}
        style={{ top: 40 }}
        styles={{
          body: { padding: '24px' }
        }}
      >
        <Form
          form={formOrdenFirmada}
          layout="vertical"
          onFinish={guardarOrdenFirmada}
          autoComplete="off"
        >
          <Form.Item
            name="orden_firmada"
            label="Documento de Orden Firmada"
            rules={[
              { 
                required: true, 
                message: 'Seleccione un archivo',
                validator: (_, value) => {
                  if (!value || !Array.isArray(value) || value.length === 0) {
                    return Promise.reject(new Error('Seleccione un archivo'));
                  }
                  return Promise.resolve();
                }
              }
            ]}
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              console.log('🔧 getValueFromEvent llamado con:', e);
              
              // Cuando se retorna false en beforeUpload, el archivo se agrega a fileList
              if (Array.isArray(e)) {
                console.log('  ✓ Es array, retornando directamente');
                return e;
              }
              
              // e puede ser un objeto con fileList o directamente fileList
              const fileList = e?.fileList || e;
              console.log('  📋 FileList extraído:', fileList);
              
              // Asegurar que cada archivo tenga originFileObj si es necesario
              if (fileList && Array.isArray(fileList)) {
                fileList.forEach((file, index) => {
                  if (!file.originFileObj && file instanceof File) {
                    // Si el archivo es directamente un File, crear un objeto con originFileObj
                    console.log(`  ⚠️ Archivo ${index + 1} no tiene originFileObj pero es File`);
                  }
                });
              }
              
              return fileList || [];
            }}
          >
            <Upload
              beforeUpload={(file) => {
                console.log('📤 Archivo seleccionado en beforeUpload:', file);
                // Retornar false para prevenir subida automática
                return false;
              }}
              maxCount={1}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
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
                formOrdenFirmada.setFieldsValue({ orden_firmada: fileList });
              }}
            >
              <Button icon={<UploadOutlined />} size="large" style={{ width: '100%' }}>
                Seleccionar archivo
              </Button>
            </Upload>
            <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
              Formatos permitidos: PDF, JPG, PNG, DOC, DOCX
            </Text>
          </Form.Item>
          {detalleReparacion?.orden_firmada && (
            <div style={{ 
              marginBottom: 16, 
              padding: 12, 
              backgroundColor: '#f0f7ff', 
              borderRadius: 8,
              border: '1px solid #91caff'
            }}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                Documento actual:
              </Text>
              <Button
                type="link"
                icon={<EyeOutlined />}
                onClick={() => window.open(detalleReparacion.orden_firmada, '_blank')}
                style={{ padding: 0 }}
              >
                Ver documento actual
              </Button>
            </div>
          )}
          <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={subiendoOrdenFirmada}
                size="large"
                style={{ 
                  background: '#9c27b0', 
                  borderColor: '#9c27b0',
                  borderRadius: 8,
                  paddingLeft: 24,
                  paddingRight: 24,
                  height: 40,
                  fontWeight: 500,
                  boxShadow: '0 2px 4px rgba(156, 39, 176, 0.2)'
                }}
              >
                {detalleReparacion?.orden_firmada ? 'Actualizar' : 'Subir'}
              </Button>
              <Button 
                onClick={cerrarModalOrdenFirmada}
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

      {/* Documento oculto para impresión */}
      {detalleReparacion && (
        <div style={{ display: 'none' }}>
          <div ref={documentoRef}>
            <DocumentoEntrega 
              reparacion={detalleReparacion} 
              actualizaciones={actualizaciones || []}
            />
          </div>
        </div>
      )}

      <style>{`
        .ant-card-head-title {
          padding: 0 !important;
        }
        .ant-descriptions-item-label {
          font-weight: 500;
          color: #595959;
          background: #fafafa;
        }
        .ant-descriptions-item-content {
          color: #1a1a1a;
        }
        .ant-timeline-item-head {
          background: transparent;
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
        .ant-image {
          border-radius: 8px;
        }
        .ant-image-preview-wrap {
          z-index: 9999;
        }
        .custom-image-mask {
          background: rgba(0, 0, 0, 0.5);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}

export default DetalleReparacion;
