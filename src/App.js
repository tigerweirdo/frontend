// src/App.js
import React from 'react';
import { Layout, Menu } from 'antd';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BorcEkle from './components/BorcEkle';
import BorcListesi from './components/BorcListesi';
import './App.css'



const { Header, Content } = Layout;

function App() {
  return (
    <Router>
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Link to="/">Gider Listesi</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/borc-ekle">Gider Ekle</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <div className="site-layout-content">
            <Routes> {/* Burada Switch yerine Routes kullanıldı */}
              <Route path="/borc-ekle" element={<BorcEkle />} />
              <Route path="/" element={<BorcListesi />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
