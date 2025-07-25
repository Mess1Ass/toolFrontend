import React, { useEffect, useState, useRef } from "react"
import { Button, Breadcrumb, Space, Toast } from "@douyinfe/semi-ui"
import axios from "axios"

import FileUploader from "./FileUpload/FileUploader";
import FileTable from "./FileUpload/FileTable";
import CreateFolderModal from "./FileUpload/CreateFolderModal";
import ExcelViewer from "../BidDetail/ExcelViewer";
import config from "../../config";


export default function BidDetail() {
  const [files, setFiles] = useState([]);
  const [folderStack, setFolderStack] = useState([{ id: "root", name: "全部文件" }]);
  const [showCreate, setShowCreate] = useState(false);
  const [excelData, setExcelData] = useState(null);
  const [showExcelViewer, setShowExcelViewer] = useState(false);
  const lastClickTimeRef = useRef(0);
  const lastFolderIdRef = useRef(null);

  const currentFolder = folderStack[folderStack.length - 1];

  const fetchFiles = async () => {
    const res = await axios.get(`${config.API_BASE_URL}/files`, {
      params: { parent: currentFolder.id }
    });
    setFiles(res.data);
  };

  const enterFolder = (record) => {
    const now = Date.now();
    const timeDiff = now - lastClickTimeRef.current;
    const isSameFolder = lastFolderIdRef.current === record._id;
    
    // 防抖：如果点击的是同一个文件夹且时间间隔小于300ms，则忽略
    // 减少防抖时间，避免影响按钮点击
    if (isSameFolder && timeDiff < 300) {
      return;
    }
    
    // 检查是否已经在当前路径中，避免重复添加
    const isAlreadyInPath = folderStack.some(folder => folder.id === record._id);
    if (isAlreadyInPath) {
      return;
    }
    
    setFolderStack([...folderStack, { id: record._id, name: record.filename }]);
    lastClickTimeRef.current = now;
    lastFolderIdRef.current = record._id;
  };

  const goBackTo = (index) => {
    setFolderStack(folderStack.slice(0, index + 1));
  };

  const viewExcel = async (id) => {
    try {
      // 先设置一个加载状态，确保 Modal 立即显示
      setExcelData({ loading: true });
      setShowExcelViewer(true);
      
      const res = await axios.get(`${config.API_BASE_URL}/view_excel/${id}`);
      setExcelData(res.data);
    } catch (error) {
      let msg = '获取Excel数据失败';
      if (error.response && error.response.data && error.response.data.message) {
        msg = error.response.data.message;
      }
      Toast.error(msg);
      setExcelData(null);
      setShowExcelViewer(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [currentFolder]);

  return (
    <div style={{ 
      padding: 30,
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none'
    }}>
      <h2 style={{ 
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}>竞价文件管理</h2>

      <Breadcrumb style={{ margin: "12px 0" }}>
        {folderStack.map((item, idx) => (
          <Breadcrumb.Item key={item.id} onClick={() => goBackTo(idx)} style={{ cursor: "pointer" }}>
            {item.name}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>

      {/* <div style={{ marginBottom: 16 }}>
        <Space>
          <FileUploader parent={currentFolder.id} onUpload={fetchFiles} />
          <Button onClick={() => setShowCreate(true)} type="secondary" theme="solid">
            新建文件夹
          </Button>
        </Space>
      </div> */}

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
        visible={showExcelViewer}
        data={excelData}
        onClose={() => {
          setShowExcelViewer(false);
          setExcelData(null);
        }}
      />
    </div>
  )
}


