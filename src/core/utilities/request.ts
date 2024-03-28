export const formData = (
  body: { [key: string]: any },
  prefix = "",
  form = new FormData()
) => {
  Object.keys(body).forEach((key) => {
    const formKey = prefix !== "" ? prefix + "." + key : key;
    const data = body[key];
    if (Array.isArray(data)) {
      data.forEach((d, index) => {
        if (typeof d === "object") {
          if (d instanceof File) {
            form.append(formKey, d);
          } else {
            form = formData(d, formKey + `[${index}]`, form);
          }
        } else {
          form.append(formKey, d);
        }
      });
    } else if (typeof data === "object") {
      if (data instanceof File) {
        form.append(formKey, data);
      } else {
        form = formData(data, formKey, form);
      }
    } else {
      form.append(formKey, data);
    }
  });

  return form;
};

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
