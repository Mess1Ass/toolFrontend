import React, { useState, useRef } from 'react';
import { Table, Button, Upload, Progress, Modal, Toast, Space } from "@douyinfe/semi-ui"
import axios from "axios"
import { IconBolt, IconFolder } from '@douyinfe/semi-icons';
import config from "../../../config";
import { useNavigate } from "react-router-dom";
import './FileTable.css';

export default function FileTable({ parent, files, onUpload, onRefresh, onDoubleClick, onViewExcel }) {
    const [uploadPercent, setUploadPercent] = useState(0);
    const uploadedRef = useRef(false);
    const navigate = useNavigate();

    const handleDelete = (record) => {
        const isFolder = record.is_folder;
        const fileId = record._id;

        if (isFolder) {
            Modal.confirm({
                title: '确认删除整个文件夹？',
                content: '该文件夹下可能包含子文件或子文件夹，是否确认删除所有内容？',
                onOk: async () => {
                    try {
                        await axios.delete(`${config.API_BASE_URL}/file/${fileId}?force=true`);
                        Toast.success('文件夹已删除');
                        onRefresh?.(); // 👈 删除成功后刷新列表
                    } catch (err) {
                        Toast.error('删除失败');
                    }
                }
            });
        } else {
            Modal.confirm({
                title: '确认删除文件？',
                content: record.name,
                onOk: async () => {
                    try {
                        await axios.delete(`${config.API_BASE_URL}/file/${fileId}`);
                        Toast.success('文件已删除');
                        onRefresh?.();
                    } catch (err) {
                        Toast.error('删除失败');
                    }
                }
            });
        }
    };

    const handleFolderUpload = async (fileList) => {
        if (uploadedRef.current) return; // 已上传，防止重复
        uploadedRef.current = true;

        const formData = new FormData();

        for (const item of fileList) {
            const file = item.fileInstance;
            const relPath = file.webkitRelativePath || file.name;

            if (!relPath.endsWith(".xls") && !relPath.endsWith(".xlsx")) {
                Toast.warning(`${relPath} 不是 Excel，已跳过`);
                continue;
            }

            formData.append("files", file, relPath);
        }

        try {
            await axios.post(`${config.API_BASE_URL}/upload_folder?parent=${parent}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadPercent(percent);
                }
            });
            Toast.success("上传成功");
            onUpload?.();
        } catch (err) {
            let msg = '上传失败';
            if (err.response && err.response.data && err.response.data.message) {
                msg = err.response.data.message;
            }
            Toast.error(msg);
            console.error(err);
        } finally {
            setUploadPercent(0);
            uploadedRef.current = false; // 恢复上传状态，允许下次再上传
        }
    };

    const viewFolderExcel = async (folderId) => {
        try {
          // 先判断类型
          const typeRes = await axios.get(`${config.API_BASE_URL}/file_type/${folderId}`);
          if (typeRes.data.type === "folder") {
            const res = await axios.get(`${config.API_BASE_URL}/folder/view_excels/${folderId}`);
            navigate('/seatMap', { state: { seatData: res.data } });
          } else if (typeRes.data.type === "excel") {
            const res = await axios.get(`${config.API_BASE_URL}/view_excel/${folderId}`);
            navigate('/seatMap', { state: { seatData: res.data } });
          } else {
            Toast.error("该类型不支持座位图预览");
          }
        } catch (error) {
          Toast.error("获取数据失败");
        }
      };

    const columns = [
        {
            title: "文件名",
            dataIndex: "filename",
            render: (text, record) => (
                <span style={{
                    cursor: record.is_folder ? "pointer" : "default",
                    fontWeight: record.is_folder ? "bold" : "normal",
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none'
                }}>
                    {record.is_folder ? <IconFolder /> : null}{text}
                </span>
            )
        },
        {
            title: "大小",
            dataIndex: "size",
            render: size => size ? `${(size / 1024).toFixed(2)} KB` : "-"
        },
        {
            title: "上传时间",
            dataIndex: "upload_time",
            render: time => new Date(time).toLocaleString()
        },
        {
            title: "操作",
            render: (_, record) => (
                <Space spacing={8}>
                    {!record.is_folder && record.filename.endsWith(".xlsx") && (
                        <Button
                            type="primary"
                            onClick={() => onViewExcel(record._id)}
                        >
                            查看
                        </Button>
                    )}
                    {record.is_folder && (
                        <Button
                            type="primary"
                            onClick={() => viewFolderExcel(record._id)}
                        >
                            查看总体座位
                        </Button>
                    )}
                    <Button
                        type="danger"
                        onClick={() => handleDelete(record)}
                    >
                        删除
                    </Button>
                </Space>
            )
        }
    ];


    return (
        <div style={{
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none'
        }}>
            {uploadPercent > 0 && (
                <Progress
                    percent={uploadPercent}
                    strokeWidth={6}
                    showInfo
                    style={{ marginTop: 10 }}
                />
            )}
            <Table
                columns={columns}
                dataSource={files}
                rowKey="_id"
                bordered
                onRow={(record) => ({
                    onClick: (e) => {
                        // 检查点击的目标是否是按钮或其子元素
                        const target = e.target;
                        const isButton = target.closest('button') || target.tagName === 'BUTTON';

                        if (isButton) {
                            return; // 如果是按钮，不处理行点击
                        }

                        if (record.is_folder) {
                            onDoubleClick(record);
                        }
                    },
                    style: {
                        cursor: record.is_folder ? 'pointer' : 'default',
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        MozUserSelect: 'none',
                        msUserSelect: 'none'
                    }
                })}
                style={{
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none'
                }}
                className="no-select-table"
            />
            <Upload
                directory
                multiple
                beforeUpload={() => false}
                dragIcon={<IconBolt />}
                draggable={true}
                accept=".xls,.xlsx"
                dragMainText={'点击上传文件或拖拽文件到这里'}
                dragSubText="仅支持xls、xlsx以及文件夹"
                style={{ marginTop: 10 }}
                onChange={({ fileList, currentFile }) => {
                    setTimeout(() => handleFolderUpload(fileList), 200);
                }}
            ></Upload>

        </div>

    )
}
