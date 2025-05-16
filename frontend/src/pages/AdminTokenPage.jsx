import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, message, Popconfirm, Input, Tooltip, InputNumber, Modal } from 'antd';
import { CopyOutlined, PlusOutlined, ReloadOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons';

const API_BASE = 'http://localhost:5000/api/token';

const statusColor = {
  active: 'green',
  used: 'blue',
  revoked: 'red',
};

function AdminTokenPage() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newToken, setNewToken] = useState('');
  const [batchCount, setBatchCount] = useState(5);
  const [batchValidDays, setBatchValidDays] = useState(3);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [batchDeleteLoading, setBatchDeleteLoading] = useState(false);
  const [batchModalVisible, setBatchModalVisible] = useState(false);

  const fetchTokens = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setTokens(data);
    } catch (err) {
      message.error('获取Token列表失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: newToken.trim() || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        message.success('Token生成成功');
        setNewToken('');
        fetchTokens();
      } else {
        message.error(data.message || 'Token生成失败');
      }
    } catch (err) {
      message.error('Token生成失败');
    }
    setCreating(false);
  };

  const handleBatchCreate = async () => {
    setCreating(true);
    try {
      const res = await fetch(`${API_BASE}/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: batchCount, validDays: batchValidDays }),
      });
      const data = await res.json();
      if (data.success) {
        message.success(`成功生成${data.tokens.length}个Token`);
        setBatchModalVisible(false);
        fetchTokens();
      } else {
        message.error(data.message || '批量生成失败');
      }
    } catch (err) {
      message.error('批量生成失败');
    }
    setCreating(false);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      message.success('删除成功');
      fetchTokens();
    } catch {
      message.error('删除失败');
    }
  };

  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) return;
    setBatchDeleteLoading(true);
    try {
      await fetch(`${API_BASE}/batch-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedRowKeys }),
      });
      message.success('批量删除成功');
      setSelectedRowKeys([]);
      fetchTokens();
    } catch {
      message.error('批量删除失败');
    }
    setBatchDeleteLoading(false);
  };

  const handleStatus = async (id, status) => {
    try {
      await fetch(`${API_BASE}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      message.success('状态更新成功');
      fetchTokens();
    } catch {
      message.error('状态更新失败');
    }
  };

  const handleCopy = (value) => {
    navigator.clipboard.writeText(value);
    message.success('已复制到剪贴板');
  };

  const handleExport = () => {
    window.open(`${API_BASE}/export`, '_blank');
  };

  const columns = [
    {
      title: 'Token',
      dataIndex: 'value',
      key: 'value',
      render: (text) => (
        <Tooltip title={text}>
          <span style={{ wordBreak: 'break-all' }}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={statusColor[status] || 'default'}>{status}</Tag>,
    },
    {
      title: '有效天数',
      dataIndex: 'validDays',
      key: 'validDays',
      render: (d) => d || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (t) => t && t.replace('T', ' ').slice(0, 19),
    },
    {
      title: '激活时间',
      dataIndex: 'activatedAt',
      key: 'activatedAt',
      render: (t) => t ? t.replace('T', ' ').slice(0, 19) : '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<CopyOutlined />} size="small" onClick={() => handleCopy(record.value)} />
          {record.status !== 'revoked' ? (
            <Button size="small" danger onClick={() => handleStatus(record.id, 'revoked')}>作废</Button>
          ) : (
            <Button size="small" onClick={() => handleStatus(record.id, 'active')}>恢复</Button>
          )}
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <div style={{ maxWidth: 1100, margin: '40px auto', background: '#fff', padding: 24, borderRadius: 8 }}>
      <h2>Token管理后台</h2>
      <Space style={{ marginBottom: 16, flexWrap: 'wrap' }}>
        <Input
          placeholder="自定义Token（可选，留空自动生成）"
          value={newToken}
          onChange={e => setNewToken(e.target.value)}
          style={{ width: 220 }}
        />
        <Button type="primary" icon={<PlusOutlined />} loading={creating} onClick={handleCreate}>
          生成Token
        </Button>
        <Button icon={<PlusOutlined />} onClick={() => setBatchModalVisible(true)}>
          批量生成
        </Button>
        <Button icon={<DeleteOutlined />} danger disabled={selectedRowKeys.length === 0} loading={batchDeleteLoading} onClick={handleBatchDelete}>
          批量删除
        </Button>
        <Button icon={<DownloadOutlined />} onClick={handleExport}>
          导出TXT
        </Button>
        <Button icon={<ReloadOutlined />} onClick={fetchTokens}>刷新</Button>
      </Space>
      <Table
        columns={columns}
        dataSource={tokens}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
        rowSelection={rowSelection}
      />
      <Modal
        title="批量生成Token"
        open={batchModalVisible}
        onOk={handleBatchCreate}
        onCancel={() => setBatchModalVisible(false)}
        confirmLoading={creating}
        okText="生成"
        cancelText="取消"
      >
        <div style={{ marginBottom: 12 }}>
          <span>数量：</span>
          <InputNumber min={1} max={100} value={batchCount} onChange={setBatchCount} />
        </div>
        <div>
          <span>有效天数：</span>
          <InputNumber min={1} max={365} value={batchValidDays} onChange={setBatchValidDays} />
        </div>
      </Modal>
    </div>
  );
}

export default AdminTokenPage;
