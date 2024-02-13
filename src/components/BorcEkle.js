// src/BorcEkle.js
import React from 'react';
import axios from 'axios';
import { Form, Input, Checkbox, Button, DatePicker,message } from 'antd';
import '../App.css'


function BorcEkle() {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        // Tarih değerlerini kontrol et
        const formattedValues = {
          ...values,
          sirket_ismi: values.sirketIsmi,
          fatura_durumu: values.fatura_durumu || false,
          tarih: values.tarih ? values.tarih.format('YYYY-MM-DD') : null,
          vadesi: values.vadesi ? values.vadesi.format('YYYY-MM-DD') : undefined,
          odendi_mi: false
        };
    
        axios.post('https://oytuntekstil-06638c857215.herokuapp.com/api/borclar', formattedValues)
          .then(response => {
            message.success('Gider başarıyla eklendi!');
            form.resetFields();
          })
          .catch(error => {
            const errorMsg = error.response && error.response.data && error.response.data.message
              ? error.response.data.message
              : 'Gider eklenirken bir hata oluştu.';
            console.log(errorMsg);
            message.error(errorMsg);
          });
      };

    return (
        <div className="form-container">

        <Form className="borc-form-container"form={form} onFinish={onFinish} layout="vertical" style={{ maxWidth: 400 }}>
            <h2>Yeni Gider Ekle</h2>
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
            <Form.Item name="vadesi" label="Vadesi">
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
