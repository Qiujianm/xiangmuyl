import React, { useState } from 'react';

function TokenInputPage({ onTokenValid }) {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const deviceId = localStorage.getItem('care_device_id');
    const res = await fetch('/api/token/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: token, deviceId }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.valid) {
      onTokenValid(token);
    } else {
      // 提示错误
    }
  };

  return (
    <div>
      <input value={token} onChange={e => setToken(e.target.value)} />
      <button onClick={handleSubmit} disabled={loading}>提交</button>
    </div>
  );
}

export default TokenInputPage;
