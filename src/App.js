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
        <Header style={{ backgroundColor: '#d61a67' }} >
          <div className="logo" />
          <Header className="header-container">
  <div className="logo" />
  <Menu  style={{ backgroundColor: '#d61a67', color: '#ffdec2',flex: 1 }} theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
    <Menu.Item  style={{ backgroundColor: '#d61a67', color: '#ffdec2' }} key="1">
      <Link to="/">Gider Listesi</Link>
    </Menu.Item>
    <Menu.Item  style={{ backgroundColor: '#d61a67', color: '#ffdec2' }} key="2">
      <Link to="/borc-ekle">Gider Ekle</Link>
    </Menu.Item>
  </Menu>
  <img src="/oytun.png" alt="Logo" className="header-logo"/>
</Header>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <div className="site-layout-content">
            <Routes> 
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
