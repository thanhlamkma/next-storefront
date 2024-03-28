import {
  Button,
  ColProps,
  Form as AntForm,
  FormItemProps,
  message,
  Modal,
  ModalProps,
  Rate,
  RowProps,
  Upload,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { UploadFile, UploadProps } from "antd/lib/upload/interface";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineCamera } from "react-icons/ai";
import { catchError, map, of } from "rxjs";
import Images from "src/assets/images";
import Form from "src/components/Form";
import Input from "src/components/Input";
import { useJob } from "src/core/hooks";
import { ApiRequestConfig } from "src/core/models/api";
import { FileUploadRequest, FileUploadResponse } from "src/models/File";
import { GetBaseProfileResponse } from "src/models/InfoUser";
import { ProductRatingRequest } from "src/models/Product";
import FileRepository from "src/repositories/FileRepository";
import InfoUserRepository from "src/repositories/InfoUserRepository";
import RatingProductRepository from "src/repositories/RatingProductRepository";
import toast from "src/services/toast";

const FormItemFlex = ({ children = <Input />, ...props }: FormItemProps) => {
  return (
    <Form.Item
      labelAlign="left"
      labelCol={{
        span: 24,
      }}
      wrapperCol={{
        span: 24,
      }}
      {...props}
    >
      {children}
    </Form.Item>
  );
};

type RowFormItemType = {
  rowProps?: RowProps;
  colProps?: ColProps;
  childrens: [ReactNode, ReactNode];
};

interface Props extends ModalProps {
  productId?: number | string;
  name?: string;
  image?: string;
  saleOrderLineId?: number;
  onRating?: (saleOrderLineId?: number) => void;
}

function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const dataImg = {
  previewVisible: false,
  previewImage: "",
  previewTitle: "",
  fileList: [],
};

const CommentProduct = ({
  productId,
  name,
  image,
  saleOrderLineId,
  onRating,
  ...props
}: Props) => {
  const { t } = useTranslation();
  const session = useSession();
  const [data, setData] = useState(dataImg);
  const [form] = AntForm.useForm();

  const [imageData, setImageData] = useState<string[]>([]);
  const [infoUser, setInfoUser] = useState<GetBaseProfileResponse>();
  const [defaultFileList, setDefaultFileList] = useState<UploadFile<any>[]>([]);

  // Call API
  const { run: addRateApi } = useJob((data: ProductRatingRequest) => {
    return RatingProductRepository.addRatingProduct(data).pipe(
      map((res: any) => {
        toast.show("success", t("myAccount:sendReviewSuccess"));
        onRating && onRating(data.saleOrderLineId);
      }),
      catchError((err: any) => {
        return of(err);
      })
    );
  });

  const { run: getUserApi } = useJob(() => {
    return InfoUserRepository.getBaseProfile().pipe(
      map(({ data }: { data: GetBaseProfileResponse }) => {
        setInfoUser(data);
      }),
      catchError((err) => {
        console.log("get user err", err);
        return of(err);
      })
    );
  });

  const { run: uploadFileApi } = useJob(
    (data: FileUploadRequest, config?: ApiRequestConfig<any>) => {
      return FileRepository.uploadImage(data, config).pipe(
        map(({ data }: { data: FileUploadResponse[] }) => {
          if (data) {
            const images: string[] = imageData;
            images.push(data[0].url);
            setImageData(images);
          }
        }),
        catchError((err) => {
          console.log("upload err", err);
          return of(err);
        })
      );
    }
  );

  useEffect(() => {
    if (session.status === "authenticated") getUserApi();
  }, []);

  const onFinishForm = useCallback(({ description, rating }: any) => {
    if (productId) {
      addRateApi({
        productId: productId,
        saleOrderLineId: saleOrderLineId,
        description: description,
        rating: rating,
        images: imageData,
        // userId: infoUser.userId,
      });
    }
    form.resetFields();
  }, []);

  const handleCancel = () =>
    setData((prev) => {
      return {
        ...prev,
        previewVisible: false,
      };
    });

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setData((prev) => {
      return {
        ...prev,
        previewImage: file.url || file.preview,
        previewVisible: true,
        previewTitle:
          file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
      };
    });
  };

  const handleChange2: UploadProps["onChange"] = ({
    fileList: newFileList,
  }: any) => setDefaultFileList(newFileList);

  const updateButton = useMemo(() => {
    return (
      <div className="btn-upload">
        <Button className="comment-product-form__btn rounded-[3px] h-[40px] w-[100%]">
          <AiOutlineCamera className="mr-2" style={{ fontSize: "1.1rem" }} />
          {t("myAccount:addPhoto")}
        </Button>
      </div>
    );
  }, []);

  const propsUpload: UploadProps = {
    // Validate Image
    beforeUpload(file: { type: string; size: number }) {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error(t("myAccount:typeImage"));
      }
      const isLt2M = file.size / 1024 / 1024 < 4;
      if (!isLt2M) {
        message.error(t("myAccount:limitImage"));
      }
      return isJpgOrPng && isLt2M;
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.fileList);
        console.log(info.file);
      }
      if (info.file.status === "done") {
        message.success(
          `${info.file.name} ${t("myAccount:uploadRatingSuccess")}`
        );
        setDefaultFileList(info.fileList);
        uploadFileApi({
          uploadType: "rating",
          files: info.file.originFileObj,
        });
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} ${t("myAccount:uploadRatingFail")}`);
      }
    },
    // customRequest(options: any) {
    //   const { file, onProgress } = options;
    //   console.log("file", file);

    //   uploadFileApi({
    //     uploadType: "rating",
    //     files: file,
    //   });
    // },
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
  };

  return (
    <Modal {...props}>
      <Form
        className="comment-product-form"
        onFinish={onFinishForm}
        form={form}
      >
        <div className="comment-product-form__product flex">
          <div className="min-w-[60px]">
            <Image
              className="w-[100%] border"
              src={image ? image : Images.product.noProductImg}
              objectFit="contain"
              width={60}
              height={90}
            />
          </div>
          <div className="ml-3 pt-4">
            <div className="font-semibold mb-1">{name}</div>
          </div>
        </div>
        <div className="text-center mb-5 mt-2">
          <div className="comment-product-form__rate font-semibold text-base">
            {t("myAccount:pleaseReview")}
          </div>
          <FormItemFlex name="rating">
            <Rate count={5} style={{ fontSize: "1.65rem" }} />
          </FormItemFlex>
        </div>
        <FormItemFlex name="description">
          <TextArea cols={4} rows={5} placeholder={t("myAccount:yourReview")} />
        </FormItemFlex>
        <Upload
          className="my-1"
          listType="picture-card"
          fileList={defaultFileList}
          {...propsUpload}
          // fileList={data.fileList as UploadFile<unknown>[]}
          // onPreview={handlePreview}
          // onChange={handleChange2}
        ></Upload>
        <Modal
          visible={data.previewVisible}
          title={data.previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img
            alt="example"
            style={{ width: "100%" }}
            src={data.previewImage}
          />
        </Modal>
        <div className="flex items-center justify-between mt-1 comment-product-form__group-btn">
          <Upload className="upload-hidden-img-name" {...propsUpload}>
            {updateButton}
          </Upload>
          <Button
            className="comment-product-form__btn active rounded-[3px] h-[40px] w-[48%]"
            htmlType="submit"
          >
            {t("myAccount:sendReview")}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CommentProduct;
