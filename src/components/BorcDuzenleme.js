// BorcDuzenleFormu.js
import React from 'react';
import { Modal, Form, Input, Select, DatePicker, message } from 'antd';
import axios from 'axios';
import moment from 'moment';


const { Option } = Select;

const BorcDuzenleFormu = ({ visible, onCancel, currentBorc, onSuccess }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        // Form verileriyle borcu güncelle
        const yeniBilgiler = {
          ...values,
          tarih: values.tarih.format('YYYY-MM-DD'),
          vadesi: values.vadesi ? values.vadesi.format('YYYY-MM-DD') : undefined, 
          fatura_durumu: values.fatura_durumu === 'true',
        };
        axios.put(`https://oytuntekstil-06638c857215.herokuapp.com/api/borclar/api/borclar/${currentBorc._id}`, yeniBilgiler)
  .then(() => {
    message.success('Borç başarıyla güncellendi');
    form.resetFields();
    onSuccess(); // Başarı durumunda dış bileşeni güncelle
  })
  .catch(error => {
    console.log(error);
    message.error('Borç güncellenirken bir hata oluştu');
  });
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };
  

  return (
    <Modal
      title="Borç Düzenle"
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Kaydet"
      cancelText="İptal"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          sirket_ismi: currentBorc?.sirket_ismi,
          bakiye: currentBorc?.bakiye,
          fatura_durumu: currentBorc?.fatura_durumu.toString(),
          tarih: moment(currentBorc?.tarih),
          vadesi: moment(currentBorc?.vadesi),
        }}
      >
        <Form.Item name="sirket_ismi" label="Şirket İsmi" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="bakiye" label="Bakiye" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item name="fatura_durumu" label="Fatura Durumu" rules={[{ required: true }]}>
          <Select>
            <Option value="true">Faturalı</Option>
            <Option value="false">Faturasız</Option>
          </Select>
        </Form.Item>
        <Form.Item name="tarih" label="Tarih" rules={[{ required: true }]}>
          <DatePicker />
        </Form.Item>
        <Form.Item name="vadesi" label="Vadesi">
  <DatePicker />
</Form.Item>
      </Form>
    </Modal>
  );
};

export default BorcDuzenleFormu;
