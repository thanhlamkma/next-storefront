import {
  DeleteOutlined,
  FileExcelOutlined,
  FileGifOutlined,
  FileOutlined,
  FilePdfOutlined,
  FilePptOutlined,
  FileWordOutlined,
} from "@ant-design/icons";
import { Image, Progress, Typography, Upload } from "antd";
import { DraggerProps } from "antd/lib/upload";
import { UploadChangeParam, UploadFile } from "antd/lib/upload/interface";
import { isEqual } from "lodash";
import { extension } from "mime-types";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import Button from "src/components/Button";
import { getBase64 } from "src/utilities/imageHelper";

interface FilePreviewProps {
  file: UploadFile;
  onRemove?: () => void;
}

const FilePreview = ({ file, onRemove }: FilePreviewProps) => {
  const [imageUrl, setImageUrl] = useState("");
  const fileType = useMemo(() => {
    if (file.originFileObj) {
      return extension(file?.originFileObj?.type);
    }

    return false;
  }, [file]);

  const progressStatus = useMemo(() => {
    switch (file.status) {
      case "success":
      case "done":
        return "success";
      case "error":
        return "exception";
      case "uploading":
        return "normal";
    }
  }, [file.status]);

  const preview = useMemo(() => {
    switch (fileType) {
      case "png":
      case "jpg":
      case "jpeg":
        return (
          <Image
            src={imageUrl}
            wrapperClassName="flex-1 d-inline-flex align-items-center"
            width={150}
          />
        );

      case "gif":
        return (
          <FileGifOutlined className="flex-1" style={{ fontSize: "4rem" }} />
        );

      case "xlsx":
      case "xls":
        return (
          <FileExcelOutlined className="flex-1" style={{ fontSize: "4rem" }} />
        );

      case "doc":
      case "docx":
        return (
          <FileWordOutlined className="flex-1" style={{ fontSize: "4rem" }} />
        );

      case "ppt":
      case "pptx":
        return (
          <FilePptOutlined className="flex-1" style={{ fontSize: "4rem" }} />
        );

      case "pdf":
        return (
          <FilePdfOutlined className="flex-1" style={{ fontSize: "4rem" }} />
        );

      default:
        return <FileOutlined className="flex-1" style={{ fontSize: "4rem" }} />;
    }
  }, [fileType, imageUrl]);

  const updateImageUrl = useCallback(() => {
    if (file.url) {
      setImageUrl(file.url);
      return;
    }

    if (file.originFileObj) {
      getBase64(file.originFileObj, (url: string) => setImageUrl(url));
    }
  }, [file]);

  useEffect(() => {
    switch (fileType) {
      case "png":
      case "jpg":
      case "jpeg":
        updateImageUrl();
        break;

      default:
        setImageUrl("");
        break;
    }
  }, [fileType]);

  return (
    <div
      className="d-flex flex-column align-items-center border mx-1 p-2 rounded position-relative"
      style={{ maxWidth: "9.68rem" }}
    >
      <Button
        icon={<DeleteOutlined />}
        className="position-absolute"
        shape="circle"
        size="small"
        style={{
          zIndex: 1,
          top: "0.5rem",
          right: "0.5rem",
        }}
        onClick={onRemove}
        danger
      />
      {preview}
      <Typography.Text className="mt-3 d-inline-block w-100" ellipsis strong>
        {file.name}
      </Typography.Text>
      {file.percent || progressStatus !== "normal" ? (
        <Progress percent={file.percent} status={progressStatus} />
      ) : null}
    </div>
  );
};

// Dragger
export interface DraggerUploadProps
  extends Omit<DraggerProps, "onChange" | "onRemove"> {
  onChange?: (files: UploadFile[]) => void;
  onRemove?: (file: UploadFile, index: number) => void;
  children?: ReactNode;
}

const DraggerUpload = ({
  onChange,
  onRemove,
  ...props
}: DraggerUploadProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>(props.fileList || []);

  const containerClassName = useMemo(() => {
    return fileList.length > 0
      ? "d-flex flex-wrap border py-2 pl-1 pr-2"
      : "d-block";
  }, [fileList]);

  const draggerClassName = useMemo(() => {
    return fileList.length > 0 ? "d-inline-block w-auto ml-1" : "";
  }, [fileList]);

  const handleFileChange = useCallback(
    (info: UploadChangeParam<UploadFile>) => {
      setFileList(info.fileList);
      onChange && onChange(info.fileList);
    },
    [onChange]
  );

  const handleRemoveFile = useCallback(
    (index: number) => {
      setFileList((old) => {
        const newFileList = [...old];
        const file = Object.assign({}, newFileList[index]);

        newFileList.splice(index, 1);

        onChange && onChange(newFileList);
        onRemove && onRemove(file, index);

        return newFileList;
      });
    },
    [onChange, onRemove]
  );

  useEffect(() => {
    if (props.fileList && !isEqual(fileList, props.fileList)) {
      setFileList(props.fileList);
    }
  }, [props.fileList]);

  const FilesPreview = useMemo(() => {
    return fileList.map((file, index) => (
      <FilePreview
        key={`file-preview-${Math.random() * 10000 * index}`}
        file={file}
        onRemove={() => handleRemoveFile(index)}
      />
    ));
  }, [fileList, handleRemoveFile]);

  return (
    <div className={containerClassName} style={{ rowGap: "0.5rem" }}>
      {FilesPreview}
      <Upload.Dragger
        {...props}
        className={`${draggerClassName} bg-white`}
        fileList={fileList}
        onChange={handleFileChange}
        showUploadList={false}
        multiple
      >
        {props.children}
      </Upload.Dragger>
    </div>
  );
};

export default DraggerUpload;
