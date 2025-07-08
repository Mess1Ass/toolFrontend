import React from "react";
import { SideSheet, Table } from "@douyinfe/semi-ui";

export default function ExcelViewer({ visible, onClose, data }) {
  if (!data) return null;
  return (
    <SideSheet visible={visible} onCancel={onClose} title="Excel预览" width={800}>
      <Table
        columns={data.columns.map(col => ({ title: col, dataIndex: col }))}
        dataSource={data.rows}
        pagination={false}
      />
    </SideSheet>
  );
}
