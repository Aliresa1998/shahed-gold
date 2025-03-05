import React, { useState } from "react";
import { Upload, Button, Input, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { controller } from "../assets/controller/controller";

const ImageUploadForm = (props) => {
    const [fileList, setFileList] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [preview, setPreview] = useState(null);

    const handleChange = ({ fileList }) => {
        setFileList(fileList.slice(-1)); // Keep only the last selected file
        const file = fileList.length > 0 ? fileList[0].originFileObj : null;
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
        } else {
            setPreview(null);
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleUpload = async () => {
        if (fileList.length === 0) {
            message.error("لطفاً یک تصویر را انتخاب کنید");
            return;
        }

        const formData = new FormData();
        formData.append("file", fileList[0].originFileObj); // Only use the first file
        formData.append("notes", inputValue);

        const response = await controller.createAttachment(formData);

        if (response.status < 250) {
            // success 
            console.log("Success")
            // Reset fileList and inputValue after successful upload
            setFileList([]);
            setInputValue("");
            setPreview(null);
            message.success("بارگذاری با موفقیت انجام شد");
            props.handleSuccessUpload();
        } else {
            // error
            console.log("Error")
            message.error("خطا در بارگذاری");
        }
    };

    const handleCancel = () => {
        // Reset fileList and inputValue
        setFileList([]);
        setInputValue("");
        setPreview(null);
        props.handleSuccessUpload();
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <p style={{ marginLeft: "6px" }}>توضیحات:</p>
                <Input
                    placeholder="توضیحات"
                    value={inputValue}
                    onChange={handleInputChange}
                    style={{ marginBottom: 16 }}
                />
            </div>

            <Upload
                fileList={fileList}
                onChange={handleChange}
                beforeUpload={() => false}
                multiple={false} // Allow only one file
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <p style={{ marginLeft: "6px" }}>بارگذاری فایل:</p>
                    <Button icon={<UploadOutlined />}>بارگذاری تصویر</Button>
                </div>
            </Upload>

            {preview && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 16 }}>
                    <img src={preview} alt="Image Preview" style={{ maxWidth: "100%", maxHeight: 200 }} />
                </div>
            )}

            <Button
                type="primary"
                onClick={handleUpload}
                disabled={fileList.length === 0 || !inputValue}
                style={{ marginTop: 16, marginRight: 8 }}
            >
                بارگذاری
            </Button>
            <Button onClick={handleCancel} style={{ marginRight: 16 }}>
                لغو
            </Button>
        </div>
    );
};

export default ImageUploadForm;

