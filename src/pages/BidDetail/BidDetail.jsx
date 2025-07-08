import React, { useEffect, useState } from "react"
import { Button, Breadcrumb, Space } from "@douyinfe/semi-ui"
import axios from "axios"

import FileUploader from "../BidDetail/FileUploader";
import FileTable from "../BidDetail/FileTable";
import CreateFolderModal from "../BidDetail/CreateFolderModal";
import ExcelViewer from "../BidDetail/ExcelViewer";


export default function BidDetail() {
  const [files, setFiles] = useState([]);
  const [folderStack, setFolderStack] = useState([{ id: "root", name: "全部文件" }]);
  const [showCreate, setShowCreate] = useState(false);
  const [excelData, setExcelData] = useState(null);

  const currentFolder = folderStack[folderStack.length - 1];

  const fetchFiles = async () => {
    const res = await axios.get("http://localhost:5000/files", {
      params: { parent: currentFolder.id }
    });
    setFiles(res.data);
  };

  const enterFolder = (record) => {
    setFolderStack([...folderStack, { id: record._id, name: record.filename }]);
  };

  const goBackTo = (index) => {
    setFolderStack(folderStack.slice(0, index + 1));
  };

  const viewExcel = async (id) => {
    //const res = await axios.get(`http://localhost:5000/view_excel/${id}`);
    const res = await axios.get(`http://106.14.212.1:5000/view_excel/${id}`);
    setExcelData(res.data);
  };

  useEffect(() => {
    fetchFiles();
  }, [currentFolder]);

  return (
    <div style={{ padding: 30 }}>
      <h2>竞价文件管理</h2>

      <Breadcrumb style={{ margin: "12px 0" }}>
        {folderStack.map((item, idx) => (
          <Breadcrumb.Item key={item.id} onClick={() => goBackTo(idx)} style={{ cursor: "pointer" }}>
            {item.name}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>

      <div style={{ marginBottom: 16 }}>
        <Space>
          <FileUploader parent={currentFolder.id} onUpload={fetchFiles} />
          <Button onClick={() => setShowCreate(true)} type="secondary" theme="solid">
            新建文件夹
          </Button>
        </Space>
      </div>

      <FileTable
        parent={currentFolder.id}
        files={files}
        onUpload={fetchFiles}
        onRefresh={fetchFiles}
        onDoubleClick={enterFolder}
        onViewExcel={viewExcel}
      />

      <CreateFolderModal
        visible={showCreate}
        parent={currentFolder.id}
        onClose={() => setShowCreate(false)}
        onCreate={fetchFiles}
      />

      <ExcelViewer
        visible={!!excelData}
        data={excelData}
        onClose={() => setExcelData(null)}
      />
    </div>
  )
}


