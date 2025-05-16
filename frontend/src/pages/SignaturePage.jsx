import React, { useRef, useState } from 'react';
import { Input, Button, Typography, Form, message } from 'antd';
import SignaturePadComponent from '../components/NDA/SignaturePad';

const { Title } = Typography;

const SignaturePage = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [touched, setTouched] = useState(false);
  const signatureRef = useRef();

  const handleSubmit = () => {
    const signature = signatureRef.current.getSignature();
    if (!name.trim()) {
      message.error('Please enter your name.');
      return;
    }
    if (!signature) {
      message.error('Please provide your signature.');
      return;
    }
    onSubmit && onSubmit({ name, signature });
  };

  const handleClear = () => {
    signatureRef.current.clear();
    setTouched(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #f0f1f2' }}>
      <Title level={4} style={{ textAlign: 'center' }}>Please Sign the NDA</Title>
      <Form layout="vertical">
        <Form.Item label="Your Name" required>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full name" />
        </Form.Item>
        <Form.Item label="Signature" required>
          <SignaturePadComponent ref={signatureRef} onEnd={() => setTouched(true)} />
        </Form.Item>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button type="primary" disabled={!name.trim() || !touched} onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SignaturePage;
