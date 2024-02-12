import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, Button, Modal, message, Input, Select, Typography, Radio } from 'antd';
import { ExclamationCircleOutlined, CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/tr'; // Türkçe yerelleştirme için gerekli

import BorcDuzenleFormu from './BorcDuzenleme';
import '../App.css'

const { confirm } = Modal;
const { Search } = Input;
const { Option } = Select;
const { Text } = Typography;
moment.locale('tr'); // Moment.js'i Türkçe'ye ayarla


function BorcListesi() {
    const [borclar, setBorclar] = useState([]);
    const [aramaTerimi, setAramaTerimi] = useState('');
    const [siralamaKriteri, setSiralamaKriteri] = useState('');
    const [isDuzenleModalVisible, setIsDuzenleModalVisible] = useState(false);
    const [currentBorc, setCurrentBorc] = useState(null); // Bu state eksikti, ekledim.
    const [seciliAy, setSeciliAy] = useState(moment().month());
    const [seciliYil, setSeciliYil] = useState(moment().year());

    useEffect(() => {
        borclariYukle();
    }, []);

    const borclariYukle = () => {
        axios.get('http://localhost:3001/api/borclar')
            .then(response => {
                setBorclar(response.data);
            })
            .catch(error => console.log(error));
    };

    const borcuSil = (id) => {
        confirm({
            title: 'Bu borcu silmek istediğinizden emin misiniz?',
            icon: <ExclamationCircleOutlined />,
            content: 'Bu işlem geri alınamaz',
            onOk() {
                axios.delete(`http://localhost:3001/api/borclar/${id}`)
                    .then(() => {
                        message.success('Borç başarıyla silindi');
                        borclariYukle(); // Listeyi güncelle
                    })
                    .catch(error => console.log(error));
            },
            onCancel() {
                console.log('İptal edildi');
            },
        });
    };
    

    const toggleOdemeDurumu = (id, odendiMi) => {
        axios.patch(`http://localhost:3001/api/borclar/${id}`, { odendi_mi: !odendiMi })
            .then(() => {
                // Borç başarıyla güncellendiğinde, yerel state'i de güncelleyelim.
                const guncellenmisBorclar = borclar.map(borc => {
                    if (borc._id === id) {
                        return { ...borc, odendi_mi: !odendiMi };
                    }
                    return borc;
                });
                setBorclar(guncellenmisBorclar); // Yeni borç listesi ile state'i güncelle
                message.success(`Borç ${!odendiMi ? 'ödendi' : 'ödenmedi'} olarak işaretlendi`);
            })
            .catch(error => {
                console.error("Borç güncellenirken bir hata oluştu", error);
                message.error("Borç güncellenirken bir hata oluştu");
            });
    };

    const onDuzenleClick = (borc) => {
        setCurrentBorc(borc);
        setIsDuzenleModalVisible(true);
    };

    const handleDuzenleModalCancel = () => {
        setIsDuzenleModalVisible(false); // Modalı kapat
    };

    const handleDuzenlemeSuccess = () => {
        setIsDuzenleModalVisible(false); // Modalı kapat
        borclariYukle(); // Listeyi güncelle
    };

    const filtrelenmisVeSiralanmisBorclar = borclar
        .filter(borc => borc.sirket_ismi.toLowerCase().includes(aramaTerimi.toLowerCase()))
        .filter(borc => {
            if (siralamaKriteri === 'odendi') return borc.odendi_mi === true;
            if (siralamaKriteri === 'odenmedi') return borc.odendi_mi === false;
            return true; // Eğer 'odendi' veya 'odenmedi' seçilmediyse, tüm borçları döndür
        })
        .filter(borc => {
            const borcTarihi = new Date(borc.tarih);
            return borcTarihi.getMonth() === seciliAy && borcTarihi.getFullYear() === seciliYil;
        })
        .sort((a, b) => {
            switch (siralamaKriteri) {
                case 'artan':
                    return a.bakiye - b.bakiye;
                case 'azalan':
                    return b.bakiye - a.bakiye;
                case 'tarihArtan':
                    return new Date(a.tarih) - new Date(b.tarih);
                case 'tarihAzalan':
                    return new Date(b.tarih) - new Date(a.tarih);
                case 'vadeArtan':
                    return new Date(a.vadesi) - new Date(b.vadesi);
                case 'vadeAzalan':
                    return new Date(b.vadesi) - new Date(a.vadesi);
                default:
                    return 0;
            }
        });
        const getOzgunYillar = () => {
            const yillar = borclar.map(borc => new Date(borc.tarih).getFullYear());
            return [...new Set(yillar)].sort((a, b) => a - b);
        };

    return (
        <div>
            <div className="search-and-filter-container">

                <Search
                    placeholder="Şirket ismine göre ara"
                    onSearch={value => setAramaTerimi(value)}
                    style={{ width: 200, marginBottom: 10, marginTop: 10 }}
                />
              
             
                <Select
                    defaultValue="siralama"
                    style={{ width: 200, marginBottom: 10, marginTop: 10, marginLeft: 10 }}
                    onChange={value => setSiralamaKriteri(value)}
                >
                    <Option value="siralama">Varsayılan Sıralama</Option>
                    <Option value="artan">Artan Bakiye</Option>
                    <Option value="azalan">Azalan Bakiye</Option>
                    <Option value="tarihArtan">Tarihe Göre Artan</Option>
                    <Option value="tarihAzalan">Tarihe Göre Azalan</Option>
                    <Option value="vadeArtan">Vadeye Göre Artan</Option>
                    <Option value="vadeAzalan">Vadeye Göre Azalan</Option>
                </Select>
            </div>
          <div className="select-and-radio-container">
            <div className="radio">  <Radio.Group defaultValue="tumu"
                    onChange={(e) => setSiralamaKriteri(e.target.value)}>
                    <Radio.Button value="tumu">Tümü</Radio.Button>
                    <Radio.Button value="odendi">Ödendi</Radio.Button>
                    <Radio.Button value="odenmedi">Ödenmedi</Radio.Button>
                </Radio.Group></div>
                <div className="select-container">

  <Select
    defaultValue={seciliYil}
    style={{ width: 100 }}
    onChange={setSeciliYil}
  >
    {getOzgunYillar().map(year => (
      <Option key={year} value={year}>{year}</Option>
    ))}
  </Select>
  <Select
    defaultValue={moment().month()}
    style={{ width: 120 }}
    onChange={value => setSeciliAy(value)}
  >
    {moment.months().map((month, index) => (
      <Option key={index} value={index}>{month}</Option>
    ))}
  </Select>
</div>

</div>
            <List
                header={<div>Borç Listesi</div>}
                bordered
                dataSource={filtrelenmisVeSiralanmisBorclar}
                renderItem={item => (
                    <List.Item>
                        <div className="list-item-content">
                            <List.Item.Meta
                                title={item.sirket_ismi}
                                description={
                                    <>
                                        <Text>Bakiye: {item.bakiye} TL</Text><br />
                                        <Text>Fatura Durumu: {item.fatura_durumu ? "Faturalı" : "Faturasız"}</Text><br />
                                        <Text>Tarih: {moment(item.tarih).format('DD/MM/YYYY')}</Text><br />
                                        <Text>Vadesi: {moment(item.vadesi).format('DD/MM/YYYY')}</Text>
                                    </>
                                }
                            />
                            <div className="list-item-actions">
                                <Button onClick={() => toggleOdemeDurumu(item._id, item.odendi_mi)} type={item.odendi_mi ? "default" : "primary"}>
                                    {item.odendi_mi ? <CloseOutlined /> : <CheckOutlined />}
                                </Button>
                                <Button onClick={() => borcuSil(item._id)}>
                                    <DeleteOutlined />
                                </Button>
                                <Button onClick={() => onDuzenleClick(item)}>
                                    <EditOutlined />
                                </Button>
                            </div>
                        </div>
                    </List.Item>
                )}
            />
            {isDuzenleModalVisible && <BorcDuzenleFormu
                visible={isDuzenleModalVisible}
                onCancel={handleDuzenleModalCancel}
                currentBorc={currentBorc}
                onSuccess={handleDuzenlemeSuccess}
            />}
        </div>
    );
}

export default BorcListesi;