import React from "react"
import { Upload, Button } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';
import axios from "axios"

function FileUploader({ parent, onUpload }) {
    const handleUpload = async ({ file }) => {
        const formData = new FormData();
        formData.append("file", file.fileInstance);

        // await axios.post(`http://localhost:5000/upload?parent=${parent}`, formData);
        await axios.post(`http://106.14.212.1:5000/upload?parent=${parent}`, formData);
        onUpload?.();
    };

    let action = 'https://api.semi.design/upload';

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