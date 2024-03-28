export const urlEncoded = (
  body: { [key: string]: any },
  prefix = "",
  form = new URLSearchParams()
) => {
  Object.keys(body).forEach((key) => {
    const formKey = prefix !== "" ? prefix + "." + key : key;
    const data = body[key];
    if (Array.isArray(data)) {
      data.forEach((d, index) => {
        if (typeof d === "object") {
          form = urlEncoded(d, formKey + `[${index}]`, form);
        } else {
          form.append(formKey, d);
        }
      });
    } else if (typeof data === "object") {
      form = urlEncoded(data, formKey, form);
    } else {
      form.append(formKey, data);
    }
  });

  return form;
};
