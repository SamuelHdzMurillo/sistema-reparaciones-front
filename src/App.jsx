import { useState, useEffect } from 'react';
import { ConfigProvider, Layout, Button, Typography, Space } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import Login from './components/Login';
import { getToken, removeToken } from './services/api';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (datos) => {
    setUser(datos.usuario);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    removeToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2e7d32',
        },
      }}
    >
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Layout style={{ minHeight: '100vh' }}>
          <Header style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #e0e0e0'
          }}>
            <Title level={4} style={{ color: '#2e7d32', margin: 0 }}>
              Sistema de Reparaciones
            </Title>
            <Space>
              <Text type="secondary">Bienvenido, {user?.nombre || 'Usuario'}</Text>
              <Button 
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                style={{ background: '#ff9800', borderColor: '#ff9800', color: '#fff' }}
              >
                Cerrar Sesión
              </Button>
            </Space>
          </Header>
          <Content style={{ padding: 24, background: '#f0f2f5' }}>
            <p>Dashboard - Sesión iniciada correctamente</p>
          </Content>
        </Layout>
      )}
    </ConfigProvider>
  );
}

export default App;
