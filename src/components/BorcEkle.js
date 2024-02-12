// src/BorcEkle.js
import React from 'react';
import axios from 'axios';
import { Form, Input, Checkbox, Button, DatePicker } from 'antd';
import '../App.css'


function BorcEkle() {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        axios.post('http://localhost:3001/api/borclar', {
            ...values,
            fatura_durumu: values.fatura_durumu || false,
            tarih: values.tarih.format('YYYY-MM-DD'),
            vadesi: values.vadesi.format('YYYY-MM-DD'),
            odendi_mi: false
        })
        .then(response => {
            console.log(response.data);
            form.resetFields(); // Formu sıfırla
        })
        .catch(error => console.log(error));
    };

    return (
        <div className="form-container">

        <Form className="borc-form-container"form={form} onFinish={onFinish} layout="vertical" style={{ maxWidth: 400 }}>
            <h2>Yeni Borç Ekle</h2>
            <Form.Item label="Şirket İsmi" name="sirketIsmi" rules={[{ required: true, message: 'Lütfen şirket ismini girin!' }]}>
            <Input placeholder="Şirket ismini girin" />
            </Form.Item>
            <Form.Item name="bakiye" label="Bakiye" rules={[{ required: true }]}>
                <Input placeholder="Bakiyeyi girin" />
            </Form.Item>
            <Form.Item name="fatura_durumu" valuePropName="checked">
                <Checkbox>Faturalı mı?</Checkbox>
            </Form.Item>
            <Form.Item name="tarih" label="Tarih" rules={[{ required: true }]}>
                <DatePicker />
            </Form.Item>
            <Form.Item name="vadesi" label="Vadesi" rules={[{ required: true }]}>
                <DatePicker />
            </Form.Item>
            <Form.Item>
            <Button type="primary" htmlType="submit">
                    Ekle
                </Button>
            </Form.Item>
        </Form>
        </div>

    );
}

export default BorcEkle;
