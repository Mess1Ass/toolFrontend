import React from "react"
import { Upload, Button } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';
import axios from "axios"
import config from "../../../config";

function FileUploader({ parent, onUpload }) {
    const handleUpload = async ({ file }) => {
        const formData = new FormData();
        formData.append("file", file.fileInstance);

        await axios.post(`${config.API_BASE_URL}/upload?parent=${parent}`, formData);
        onUpload?.();
    };

    return (
        <Upload
            action="" // 不用这个，手动上传
            customRequest={handleUpload}
            drag
            multiple
            accept=".xls,.xlsx"
        >
            <Button icon={<IconUpload />}>点击上传 Excel</Button>
        </Upload>
    )
}
export default FileUploader