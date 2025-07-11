import React, { useState, useRef } from 'react';
import { Table, Button, Upload, Progress, Modal, Toast } from "@douyinfe/semi-ui"
import axios from "axios"
import { IconBolt, IconFolder } from '@douyinfe/semi-icons';
import config from "../../../config";

export default function FileTable({ parent, files, onUpload, onRefresh, onDoubleClick, onViewExcel }) {
    const [uploadPercent, setUploadPercent] = useState(0);
    const uploadedRef = useRef(false);

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
        console.log("handleFolderUpload 触发，文件列表：", fileList);
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
            Toast.error("上传失败");
            console.error(err);
        } finally {
            setUploadPercent(0);
            uploadedRef.current = false; // 恢复上传状态，允许下次再上传
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
                <>
                    {!record.is_folder && record.filename.endsWith(".xlsx") && (
                        <Button type="primary" onClick={(e) => { e.stopPropagation(); onViewExcel(record._id); }}>
                            查看
                        </Button>

                    )}
                    <Button type="danger" onClick={(e) => { e.stopPropagation(); handleDelete(record); }}>
                        删除
                    </Button>
                </>
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
                onRow={(record) => ({
                    onClick: () => {
                        if (record.is_folder) {
                            onDoubleClick(record); // 可传 currentFolderId 给它
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
            />
            <Upload
                directory
                multiple
                // action={`${config.API_BASE_URL}/upload_folder?parent=${parent}`}
                // customRequest={handleFolderUpload}
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
