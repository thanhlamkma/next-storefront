import { LoadingOutlined } from "@ant-design/icons";
import {
  Col,
  ColProps,
  FormItemProps,
  message,
  Radio,
  Row,
  Upload,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { RcFile, UploadChangeParam } from "antd/lib/upload";
import { UploadFile } from "antd/lib/upload/interface";
import dayjs from "dayjs";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiFillLock } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { MdOutlineEdit } from "react-icons/md";
import { catchError, lastValueFrom, map, of } from "rxjs";
import { Button, Input } from "src/components";
import LayoutAccount from "src/components//layout/LayoutAccount";
import Form from "src/components/Form";
import Layout from "src/components/layout";
import ModalUpdateEmail from "src/components/myAccount/modal/ModalUpdateEmail";
import ModalUpdatePhone from "src/components/myAccount/modal/ModalUpdatePhone";
import Select, { SelectFetchFunc } from "src/components/Select";
import { useJob } from "src/core/hooks";
import { ApiRequestConfig } from "src/core/models/api";
import { getServerSidePropsWithApi } from "src/core/ssr/getServerSidePropsWithApi";
import {
  covertValuePicker,
  optionsDays,
  optionsMonth,
  optionsYear,
} from "src/data/time";
import { Gender, ItemResponse } from "src/models/Common";
import { FileUploadRequest, FileUploadResponse } from "src/models/File";
import {
  ListResponse as UserProfile,
  UpdateRequest as UpdateProfileRequest,
  UpdateResponse,
} from "src/models/InfoUser";
import CommonRepository from "src/repositories/CommonRepository";
import FileRepository from "src/repositories/FileRepository";
import InfoUserRepository from "src/repositories/InfoUserRepository";
import toast from "src/services/toast";

type AccountFormItemProps<Value = any> = {
  customLabelProps?: ColProps;
} & FormItemProps<Value>;

const AccountFormItem = ({
  children,
  className,
  label,
  customLabelProps,
  ...props
}: AccountFormItemProps) => {
  return (
    <Form.Item
      className={`custom-account-form-item w-[100%]  ${className || ""}`}
      labelAlign="left"
      labelCol={{
        xs: 24,
        sm: 6,
        ...customLabelProps,
      }}
      label={label}
      {...props}
    >
      {children}
    </Form.Item>
  );
};

export const getServerSideProps: GetServerSideProps = getServerSidePropsWithApi(
  async (context) => {
    const { locale } = context;

    let propsData: any = {
      profileUser: {},
      countryDetail: {},
      error: false,
    };

    try {
      const { data: dataUserProfile } = await lastValueFrom(
        InfoUserRepository.get()
      );
      propsData.profileUser = dataUserProfile;

      if (dataUserProfile.countryId) {
        const { data: dataDetailCountry } = await lastValueFrom(
          CommonRepository.getDetailCountry(dataUserProfile.countryId)
        );
        propsData.countryDetail = dataDetailCountry;
      }
    } catch (error) {
      propsData = {
        ...propsData,
        error: error,
      };
    }

    return {
      props: {
        ...(await serverSideTranslations(locale ? locale : "vi")),
        ...propsData,
      },
    };
  }
);

interface AccountProps {
  profileUser: UserProfile;
  countryDetail: ItemResponse;
}

const Account: PageComponent<AccountProps> = ({
  profileUser,
  countryDetail,
}) => {
  const styleIcon = { color: "#6c757d", fontSize: "1.3rem" };
  const [facebook, setFacebook] = useState(false);
  const [google, setGoogle] = useState(true);
  // const [isDisableForm, setIsDisableForm] = useState<boolean>(true);p
  const { t } = useTranslation();
  const [form] = useForm();

  const [modalUpdatePhone, setModalUpdatePhone] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>(profileUser.phone || "");
  const [modalUpdateEmail, setModalUpdateEmail] = useState<boolean>(false);
  const [email, setEmail] = useState<string>(profileUser.email || "");

  const hasProfileUser: boolean = useMemo(() => {
    return profileUser && Object.keys(profileUser).length > 0;
  }, [profileUser]);

  const birthdayForm = useMemo(() => {
    return {
      day: profileUser.birthday
        ? covertValuePicker(dayjs(profileUser.birthday).get("date").toString())
        : "0",
      month: profileUser.birthday
        ? covertValuePicker(
            (dayjs(profileUser.birthday).get("M") + 1).toString()
          )
        : "0",
      year: profileUser.birthday
        ? covertValuePicker(dayjs(profileUser.birthday).get("year").toString())
        : "0",
    };
  }, [profileUser.birthday]);

  // Call API
  const updateProfile = useCallback(async (data: UpdateProfileRequest) => {
    try {
      const { data: resData } = await lastValueFrom(
        InfoUserRepository.updateProfileUser(data)
      );
      if (resData) {
        toast.show("info", t("common:updateSuccess"));
        window.location.reload();
      }
      return Promise.resolve(resData);
    } catch (error) {
      toast.show("error", t("common:updateError"));
      form.resetFields();
      return Promise.reject(error);
    }
  }, []);

  const fetchMoreCountries: SelectFetchFunc = useCallback(
    (searchText, page) => {
      return CommonRepository.getListCountry({
        PageIndex: page,
        PageSize: 10,
        NameFilter: searchText,
      }).pipe(
        map(({ data }) => {
          return {
            hasMore: data.total >= data.pageIndex * data.pageSize,
            options: data.data.map((country: any) => ({
              value: country.id,
              label: country.name,
            })),
          };
        })
      );
    },
    []
  );

  const [defaultFileList, setDefaultFileList] = useState<UploadFile<any>[]>([]);

  // Call API
  const { run: uploadFileApi } = useJob(
    (data: FileUploadRequest, config?: ApiRequestConfig<any>) => {
      return FileRepository.uploadImage(data, config).pipe(
        map(({ data }: { data: FileUploadResponse[] }) => {
          form.setFieldsValue({
            image: data[0],
          });
        }),
        catchError((err) => {
          console.log("upload err", err);
          return of(err);
        })
      );
    }
  );

  const { run: runUpdateEmailApi } = useJob((email: string) => {
    return InfoUserRepository.updateProfileUser({
      image: form.getFieldValue("image"),
      email,
      isUpdateEmail: true,
    }).pipe(
      map(({ data, status }: { data: UpdateResponse; status: any }) => {
        if (data) {
          toast.show("info", t("myAccount:updateEmailSuccess"));
          setEmail(email);
          setModalUpdateEmail(false);
        }
        return data;
      }),
      catchError((err: any) => {
        toast.show("error", t("common:updateError"));
        setModalUpdateEmail(false);
        return of(err);
      })
    );
  });

  const { run: runUpdatePhoneApi } = useJob((phone: string) => {
    return InfoUserRepository.updateProfileUser({
      image: form.getFieldValue("image"),
      phone,
      isUpdatePhone: true,
    }).pipe(
      map(({ data, status }: { data: UpdateResponse; status: any }) => {
        if (data) {
          toast.show("info", t("myAccount:updatePhoneSuccess"));
          setPhone(phone);
          setModalUpdatePhone(false);
        }
        return data;
      }),
      catchError((err: any) => {
        toast.show("error", t("common:updateError"));
        setModalUpdatePhone(false);
        return of(err);
      })
    );
  });

  useEffect(() => {
    form.setFieldsValue({
      image: {
        url: profileUser.avatar
          ? "/app/" + profileUser.avatar.split("/").slice(3).join("/")
          : "",
        mimeType: "img/avatar",
        name: "",
      },
    });
  }, []);

  const uploadImage = (options: any) => {
    const { file, onProgress } = options;

    // const config = {
    //   headers: { "content-type": "multipart/form-data" },
    //   onUploadProgress: (event: any) => {
    //     const percent = Math.floor((event.loaded / event.total) * 100);
    //     setProgress(percent);
    //     if (percent === 100) {
    //       setTimeout(() => setProgress(0), 1000);
    //     }
    //     onProgress({ percent: (event.loaded / event.total) * 100 });
    //   },
    // };
    uploadFileApi({
      uploadType: "avatar",
      files: file,
    });
  };

  const handleOnChange = ({
    file,
    fileList,
    event,
  }: UploadChangeParam<UploadFile<unknown>>) => {
    setDefaultFileList(fileList);
  };

  function isValidDate(date: Date) {
    if (
      typeof date === "object" &&
      date !== null &&
      typeof date.getTime === "function" &&
      !isNaN(Number(date))
    ) {
      return true;
    }

    return false;
  }

  const handleUpdateProfile = useCallback(
    async (values) => {
      console.log("dataSubmit", values);
      var dataSubmit = { ...values };
      const birthday = `${values.year}-${values.month}-${values.day}`;
      var date = new Date();
      var dd = String(date.getDate()).padStart(2, "0");
      var mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = date.getFullYear();
      var today = yyyy + "-" + mm + "-" + dd;
      if (!isValidDate(new Date(birthday))) {
        delete dataSubmit.day;
        delete dataSubmit.month;
        delete dataSubmit.year;
        delete dataSubmit.avatar;
        updateProfile({
          ...dataSubmit,
        });
        return;
      }
      if (new Date(today).getTime() > new Date(birthday).getTime()) {
        dataSubmit = {
          ...values,
          birthday,
        };
        delete dataSubmit.day;
        delete dataSubmit.month;
        delete dataSubmit.year;
        delete dataSubmit.avatar;
        updateProfile({
          ...dataSubmit,
        });
      } else {
        toast.show("error", t("myAccount:overBirthday"));
      }
    },
    [hasProfileUser]
  );

  /**
   * Handle Upload Avatar
   */

  const [loadingAvatar, setLoadingAvatar] = useState<boolean>(false);

  // Validate Image
  const beforeUpload = useCallback((file: { type: string; size: number }) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 4;
    if (!isLt2M) {
      message.error("Image must smaller than 4MB!");
    }
    return isJpgOrPng && isLt2M;
  }, []);

  // Change Image to base64url
  const getBase64 = useCallback(
    (
      img: RcFile,
      callback: (imageUrl: string | ArrayBuffer | null) => void
    ) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => callback(reader.result));
      reader.readAsDataURL(img);
    },
    []
  );

  const handleChange = useCallback((info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === "uploading") {
      setLoadingAvatar(true);
      return;
    }
    if (info.file.status === "done") {
      if (info.file.originFileObj) {
        console.log("origin", info.file.originFileObj);
        getBase64(info.file.originFileObj, (imageUrl) => {
          setLoadingAvatar(false);
        });
      }
    }
  }, []);

  /**
   * End Handle Upload Avatar
   */

  return (
    <>
      <Head>
        <title>{t("myAccount:accountInformation")}</title>
      </Head>
      <div id="account" className="account">
        <ModalUpdatePhone
          status={modalUpdatePhone}
          phone={phone}
          onCancel={() => setModalUpdatePhone(false)}
          onUpdate={(newPhone) => runUpdatePhoneApi(newPhone)}
        />
        <ModalUpdateEmail
          status={modalUpdateEmail}
          email={email}
          onCancel={() => setModalUpdateEmail(false)}
          onUpdate={(newEmail) => runUpdateEmailApi(newEmail)}
        />
        <Form
          form={form}
          onFinish={handleUpdateProfile}
          enableReinitialize
          initialValues={{ ...profileUser, ...birthdayForm }}
        >
          <Row>
            <Col
              xl={{
                span: 15,
              }}
              md={{
                span: 16,
              }}
              xs={{
                span: 24,
              }}
              className="pr-5 xxs:pl-2 2sm:pl-5 mlg:pl-0 md:border-r xxs:mb-5 mlg:mb-0"
            >
              <div className="account__title account-main-title">
                {t("myAccount:personalInformation")}
              </div>
              <div className="account__form my-5">
                <Row gutter={2}>
                  <Col className="xxs:mb-[24px] 2sm:mb-0" xs={24} sm={6}>
                    <Form.Item name="image" hidden />
                    <Form.Item
                      className="mb-[unset]"
                      shouldUpdate={(prev, next) => {
                        return prev.image !== next.image;
                      }}
                    >
                      {(form) => {
                        const imgUrl =
                          process.env.NEXT_PUBLIC_API_CDN_URL +
                          form.getFieldValue("image")?.url.replace("/app", "");
                        return (
                          <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            // onChange={handleChange}
                            beforeUpload={beforeUpload}
                            customRequest={uploadImage}
                            onChange={handleOnChange}
                            // defaultFileList={defaultFileList}
                            fileList={defaultFileList}
                          >
                            <div className="avatar-uploader__edit w-[18px] h-[18px] rounded-full">
                              <MdOutlineEdit
                                style={{ fontSize: ".85rem", color: "#fff" }}
                              />
                            </div>
                            {loadingAvatar ? (
                              <LoadingOutlined />
                            ) : (
                              <>
                                {form.getFieldValue("image") &&
                                form.getFieldValue("image").url !== "" ? (
                                  <div className="w-[97.5%] h-[97.5%] rounded-full overflow-hidden">
                                    <img
                                      src={imgUrl as string}
                                      className="object-cover object-center w-full h-full"
                                    />
                                  </div>
                                ) : (
                                  <FaRegUser
                                    style={{
                                      fontSize: "3rem",
                                      color: "#336699",
                                    }}
                                  />
                                )}
                              </>
                            )}
                          </Upload>
                        );
                      }}
                      {/* {progress > 0 ? <Progress percent={progress} /> : null} */}
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={18}>
                    <AccountFormItem
                      label={t("myAccount:fullName")}
                      customLabelProps={{
                        sm: 5,
                      }}
                      name="name"
                      rules={[
                        {
                          required: true,
                          pattern: /[^\s]/g,
                          message: t("myAccount:fullNameRequired"),
                        },
                        {
                          max: 50,
                          message: t("myAccount:maxLengthFullName"),
                        },
                      ]}
                    >
                      <Input placeholder={t("myAccount:addFullName")} />
                    </AccountFormItem>

                    <AccountFormItem
                      label={t("myAccount:nickName")}
                      customLabelProps={{
                        sm: 5,
                      }}
                      name="nickName"
                      // rules={[
                      //   {
                      //     required: true,
                      //     pattern: /[^\s]/g,
                      //     message: t("myAccount:nickNameRequired"),
                      //   },
                      //   {
                      //     max: 50,
                      //     message: t("myAccount:maxLengthNickName"),
                      //   },
                      // ]}
                    >
                      <Input
                        placeholder={t("myAccount:addNickname")}
                        disabled
                      />
                    </AccountFormItem>
                  </Col>
                </Row>
                <Row className="flex mt-5">
                  <AccountFormItem
                    label={t("myAccount:dateBirth")}
                    style={{ marginBottom: 0 }}
                  >
                    <Row className="">
                      <Col span={8} className="pr-3">
                        <AccountFormItem name="day">
                          <Select
                            defaultValue={birthdayForm.day}
                            options={optionsDays()}
                            placeholder={t("common:day")}
                            className="w-[100%] rounded-[3px]"
                          ></Select>
                        </AccountFormItem>
                      </Col>
                      <Col span={8} className="px-3">
                        <AccountFormItem name="month">
                          <Select
                            defaultValue={birthdayForm.month}
                            options={optionsMonth()}
                            placeholder={t("common:month")}
                            className="w-[100%] rounded-[3px]"
                          ></Select>
                        </AccountFormItem>
                      </Col>
                      <Col span={8} className="pl-3">
                        <AccountFormItem name="year">
                          <Select
                            defaultValue={birthdayForm.year}
                            options={optionsYear()}
                            placeholder={t("common:year")}
                            className="w-[100%] rounded-[3px]"
                          ></Select>
                        </AccountFormItem>
                      </Col>
                    </Row>
                  </AccountFormItem>
                </Row>

                <AccountFormItem
                  name="gender"
                  label={t("myAccount:sex")}
                  rules={[
                    {
                      required: true,
                      message: t("myAccount:sexRequired"),
                    },
                  ]}
                >
                  <Radio.Group className="radio-type-common">
                    <Radio value={Gender.Male}>{t("common:male")}</Radio>
                    <Radio value={Gender.Female}>{t("common:feMale")}</Radio>
                    <Radio value={Gender.Other}>{t("common:other")}</Radio>
                  </Radio.Group>
                </AccountFormItem>

                <AccountFormItem
                  name="countryId"
                  label={t("myAccount:nationality")}
                >
                  <Select.Ajax
                    placeholder={t("myAccount:chooseNationality")}
                    className="w-[75%]"
                    fetchFunc={fetchMoreCountries}
                    extraOptions={[
                      { label: countryDetail.name, value: countryDetail.id },
                    ]}
                  ></Select.Ajax>
                </AccountFormItem>

                <Button
                  htmlType="submit"
                  className="account__btn px-10 hidden mlg:block py-2  active ml-[25%] mt-5"
                  disabled={false}
                >
                  {t("common:saveChange")}
                </Button>
              </div>
            </Col>

            {/* right bar */}
            <Col
              xl={{
                span: 9,
              }}
              md={{
                span: 8,
              }}
              xs={{
                span: 24,
              }}
              className="xxs:pl-2 2sm:pl-5"
            >
              <div className="account__title">
                {t("myAccount:phoneAndMail")}
              </div>
              <div className="account__item flex-item border-b py-4">
                <div className="flex">
                  <div className="w-[32px] h-[32px] pt-2">
                    <FiPhone style={styleIcon} />
                  </div>
                  <div>
                    <label>{t("common:phoneNumber")}</label>
                    <span>{phone || t("common:addPhoneNumber")}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setModalUpdatePhone(true)}
                  className="account__btn px-3 py-1"
                >
                  {t("common:update")}
                </button>
              </div>
              <div className="account__item flex-item py-4">
                <div className="flex">
                  <div className="w-[32px] h-[32px] pt-2">
                    <HiOutlineMail style={styleIcon} />
                  </div>
                  <div>
                    <label>{t("common:emailAddress")}</label>
                    <span className="truncate overflow-hidden">
                      {email || t("common:addEmail")}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setModalUpdateEmail(true)}
                  className="account__btn px-3 py-1"
                >
                  {t("common:update")}
                </button>
              </div>
              <div className="account__title mt-3">
                {t("myAccount:security")}
              </div>
              <div className="account__item flex-item py-4">
                <div className="flex">
                  <div className="w-[32px] h-[20px]">
                    <AiFillLock style={styleIcon} />
                  </div>
                  <label>{t("myAccount:changePassword")}</label>
                </div>
                <Link href="/my-account/information/change-password">
                  <button className="account__btn px-3 py-1">
                    {t("common:update")}
                  </button>
                </Link>
              </div>
              {/* <div className="account__title mt-3">
                {t("myAccount:socialLink")}
              </div>
              <div className="account__item flex-item border-b py-4">
                <div className="flex">
                  <div className="w-[32px] h-[20px]">
                    <BsFacebook
                      style={{ fontSize: "1.3rem", color: "#4267b2" }}
                    />
                  </div>
                  <label>Facebook</label>
                </div>
                <button
                  className={
                    facebook
                      ? "account__btn px-3 py-1 active"
                      : "account__btn px-3 py-1"
                  }
                  onClick={() => setFacebook(!facebook)}
                >
                  {facebook ? t("myAccount:connected") : t("myAccount:connect")}
                </button>
              </div>
              <div className="account__item flex-item py-4">
                <div className="flex">
                  <div className="w-[32px] h-[20px]">
                    <FcGoogle style={styleIcon} />
                  </div>
                  <label>Google</label>
                </div>
                <button
                  className={
                    google
                      ? "account__btn px-3 py-1 -[2px] active"
                      : "account__btn px-3 py-1 -[2px]"
                  }
                  onClick={() => setGoogle(!google)}
                >
                  {google ? t("myAccount:connected") : t("myAccount:connect")}
                </button>
              </div> */}
            </Col>
          </Row>

          <button className="account__btn px-10 block mlg:hidden py-2  active w-[100%] mt-5">
            {t("common:saveChange")}
          </button>
        </Form>
      </div>
    </>
  );
};

Account.getLayout = (page: any) => {
  return (
    <Layout>
      <LayoutAccount>{page}</LayoutAccount>
    </Layout>
  );
};

export default Account;
