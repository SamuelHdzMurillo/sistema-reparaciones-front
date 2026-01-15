import { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { api, setToken } from "../services/api";

const { Title, Text } = Typography;

function Login({ onLogin }) {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await api.login(values.email, values.password);

      if (response.exito) {
        setToken(response.datos.token);
        message.success("Inicio de sesión exitoso");
        onLogin(response.datos);
      } else {
        message.error(response.mensaje || "Error al iniciar sesión");
      }
    } catch (err) {
      message.error("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f0f2f5",
      }}
    >
      <Card
        style={{
          width: 400,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={3} style={{ color: "#2e7d32", marginBottom: 4 }}>
            Sistema de Reparaciones
          </Title>
          <Text type="secondary">Iniciar Sesión</Text>
        </div>

        <Form name="login" onFinish={onFinish} layout="vertical" size="large">
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Ingresa tu email" },
              { type: "email", message: "Email inválido" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="correo@ejemplo.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Contraseña"
            rules={[{ required: true, message: "Ingresa tu contraseña" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{ background: "#ff9800", borderColor: "#ff9800" }}
            >
              Ingresar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Login;
