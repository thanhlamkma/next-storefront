import {
  toast as reactToast,
  ToastContent,
  ToastOptions,
} from "react-toastify";

export interface Config extends ToastOptions {}

export type TypeFunctionShow =
  | "loading"
  | "success"
  | "info"
  | "error"
  | "warning"
  | "warn"
  | "dark";

class Toast<Message = string> {
  private config: Config = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  };

  public setConfig(newConfig: Config) {
    this.config = {
      ...this.config,
      ...newConfig,
    };
  }

  public show(
    typeFunc: TypeFunctionShow,
    message: ToastContent<Message>,
    config = this.config
  ) {
    reactToast[typeFunc](message, config);
  }
}

export default new Toast();
