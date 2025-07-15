import React from "react";
import { Modal, Table } from "@douyinfe/semi-ui";

export default function ExcelViewer({ visible, onClose, data }) {
  const modalProps = {
    visible,
    onCancel: onClose,
    title: "Excel预览",
    width: 1000,
    footer: null,
    destroyOnClose: true
  };

  // 处理加载状态或无数据状态
  if (!data || data.loading) {
    return (
      <Modal {...modalProps}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          {!data ? '暂无数据' : '加载中...'}
        </div>
      </Modal>
    );
  }


  return (
    <Modal 
      visible={visible} 
      onCancel={onClose} 
      title="Excel预览" 
      width={1000}
      footer={null}
      destroyOnClose={true}
    >
      <div style={{ maxHeight: '70vh', overflow: 'auto' }}>
        {/* dataList 卡片展示 */}
        {Array.isArray(data.dataList) && data.dataList.length > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 24,
            gap: 12
          }}>
            {data.dataList.map((row, idx) => (
              <div
                key={idx}
                style={{
                  flex: 1,
                  background: '#f6f8fa',
                  borderRadius: 8,
                  padding: 16,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  border: '1px solid #eee',
                  minWidth: 0
                }}
              >
                <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8, color: '#1677ff' }}>
                  {row[0]}
                </div>
                <div style={{ fontSize: 14, marginBottom: 4 }}>
                  <span style={{ color: '#888' }}>用户：</span>{row[1]}
                </div>
                <div style={{ fontSize: 14, marginBottom: 4 }}>
                  <span style={{ color: '#888' }}>时间：</span>{row[2]}
                </div>
                <div style={{ fontSize: 14, marginBottom: 4 }}>
                  <span style={{ color: '#888' }}>出价：</span>
                  <span style={{ color: '#f5222d', fontWeight: 'bold' }}>{row[3]}</span>
                </div>
                <div style={{ fontSize: 14, marginBottom: 4 }}>
                  <span style={{ color: '#888' }}>类型：</span>{row[4]}
                </div>
                <div style={{ fontSize: 14 }}>
                  <span style={{ color: '#888' }}>座位：</span>{row[5]}
                </div>
              </div>
            ))}
          </div>
        )}
        <Table
          columns={data.columns.map(col => ({ 
            title: col, 
            dataIndex: col,
            width: 150,
            ellipsis: true,
            render: (text) => (
              <span style={{ 
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'block'
              }}>
                {text || '-'}
              </span>
            )
          }))}
          dataSource={data.rows}
          pagination={false}
          scroll={{ x: 'max-content', y: '60vh' }}
          size="small"
        />
      </div>
    </Modal>
  );
}
