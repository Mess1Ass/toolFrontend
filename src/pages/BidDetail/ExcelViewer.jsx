import React from "react";
import { Modal, Table } from "@douyinfe/semi-ui";

export default function ExcelViewer({ visible, onClose, data }) {
  
  if (!data) return null;
  
  // 处理加载状态
  if (data.loading) {
    return (
      <Modal 
        visible={visible} 
        onCancel={onClose} 
        title="Excel预览" 
        width={1000}
        footer={null}
        destroyOnClose={true}
      >
        <div style={{ textAlign: 'center', padding: '50px' }}>
          加载中...
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
