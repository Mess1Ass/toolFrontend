import React, { useState } from "react"
import { Modal, Form, Input } from "@douyinfe/semi-ui"
import axios from "axios"

export default function CreateFolderModal({ visible, onClose, onCreate, parent }) {
    const [name, setName] = useState("");
    const [error, setError] = useState(""); // 错误信息状态

    const handleOk = async () => {
        setError(""); // 清空旧错误
        try {
            //const res = await axios.post("http://localhost:5000/create_folder", { name, parent });
            const res = await axios.post("http://106.14.212.1:5000/create_folder", { name, parent });
            if (res.status === 200) {
                onClose();
                onCreate?.();
                setName("");
            }
        } catch (err) {
            if (err.response && err.response.status === 400) {
                setError(err.response.data.error || "创建失败");
            } else {
                setError("网络错误或服务器异常");
            }
        }
    };

    const handleCancel = () => {
        setError("");
        setName("");
        onClose();
    };

    return (
        <Modal title="创建文件夹" visible={visible} onOk={handleOk} onCancel={handleCancel} >
            <Form>
                <Form.Input
                    label="文件夹名称"
                    field="name"
                    value={name}
                    onChange={setName}
                    validateStatus={error ? "error" : ""}
                    helpText={error}
                    placeholder="输入文件夹名称"
                    showClear
                />
            </Form>
        </Modal>
    )
}
