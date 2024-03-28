import { useTranslation } from "react-i18next";
import { OptionType } from "src/components/Select";

export const optionsDays = () => {
  const { t } = useTranslation();
  const options: Array<OptionType> = [{ label: t("common:day"), value: "0" }];
  for (let index = 1; index <= 31; index++) {
    const value = covertValuePicker(String(index));
    options.push({
      label: String(index),
      value,
    });
  }
  return options;
};

export const optionsMonth = () => {
  const { t } = useTranslation();
  const options: Array<OptionType> = [{ label: t("common:month"), value: "0" }];
  for (let index = 1; index <= 12; index++) {
    const value = covertValuePicker(String(index));
    options.push({
      label: String(index),
      value,
    });
  }
  return options;
};

export const optionsYear = () => {
  const { t } = useTranslation();
  const options: Array<OptionType> = [{ label: t("common:year"), value: "0" }];
  const currentDate = new Date().getFullYear();
  for (let index = currentDate; index >= 1900; index--) {
    const value = covertValuePicker(String(index));
    options.push({
      label: String(index),
      value,
    });
  }
  return options;
};

export const covertValuePicker = (number: string) => {
  if (parseInt(number) < 10) {
    return `0${number}`;
  }
  return number;
};
