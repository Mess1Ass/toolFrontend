import React from "react"
import { Table, Button, Upload } from "@douyinfe/semi-ui"
import axios from "axios"
import { IconBolt, IconFolder } from '@douyinfe/semi-icons';

export default function FileTable({ parent, files, onUpload, onRefresh, onDoubleClick, onViewExcel }) {
    const handleDelete = async (id) => {
        // await axios.delete(`http://localhost:5000/file/${id}`);
        await axios.delete(`http://106.14.212.1:5000/file/${id}`);
        onRefresh?.();
    };

    const handleUpload = async ({ file }) => {
        const formData = new FormData();
        formData.append("file", file.fileInstance);

        // await axios.post(`http://localhost:5000/upload?parent=${parent}`, formData);
        await axios.post(`http://106.14.212.1:5000/upload?parent=${parent}`, formData);
        onUpload?.();
    };

    const columns = [
        {
            title: "文件名",
            dataIndex: "filename",
            render: (text, record) => (
                <span style={{ cursor: record.is_folder ? "pointer" : "default", fontWeight: record.is_folder ? "bold" : "normal" }}>
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
                    <Button type="danger" onClick={(e) => { e.stopPropagation(); handleDelete(record._id); }}>
                        删除
                    </Button>
                </>
            )
        }
    ];


    return (
        <div>
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
                        cursor: record.is_folder ? 'pointer' : 'default'
                    }
                })}
            />
            <Upload
                action=""
                customRequest={handleUpload}
                dragIcon={<IconBolt />}
                draggable={true}
                accept=".xls,.xlsx"
                dragMainText={'点击上传文件或拖拽文件到这里'}
                dragSubText="仅支持xls、xlsx"
                style={{ marginTop: 10 }}
            ></Upload>
        </div>

    )
}
