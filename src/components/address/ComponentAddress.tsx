import { Button } from "antd";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { Address } from "src/models/Partner";

interface ComponentAddressProps extends Address {
  onDelete: () => void;
}

const ComponentAddress = ({
  id,
  name,
  phone,
  street,
  stateId,
  city,
  isDefault = false,
  onDelete,
}: ComponentAddressProps) => {
  const { t } = useTranslation();

  return (
    <div className="address-item">
      <div className="address p-3 mt-4">
        <div className="address__header flex justify-between">
          <div className="address__name flex xs:flex-col sm:flex-row">
            <span>{name}</span>
            <span
              className={
                isDefault
                  ? "address__default xs:mt-1 sm:mt-0 sm:ml-4"
                  : "hidden"
              }
            >
              <AiOutlineCheckCircle className="inline mr-1 relative" />
              {t("accountAddress:defaultAddress")}
            </span>
          </div>
          <div className="flex justify-end items-center gap-3">
            <Link
              href={{
                pathname: "/my-account/address/update-address",
                query: {
                  id,
                },
              }}
            >
              <a className="ml-1 text-blue-500 cursor-pointer block">
                {t("common:edit")}
              </a>
            </Link>
            {isDefault ? (
              ""
            ) : (
              <Button onClick={() => onDelete()} danger>
                {t("accountAddress:delete")}
              </Button>
            )}
          </div>
        </div>
        <div className="address__item xs:mt-1 sm:mt-3">
          <span>{t("common:address")}: </span>
          {street}
        </div>
        <div className="address__item mt-1">
          <span>{t("accountAddress:phone")}: </span>
          {phone}
        </div>
      </div>
    </div>
  );
};

export default ComponentAddress;
