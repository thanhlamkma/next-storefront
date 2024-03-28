type ActionWithoutPayload = {
  type: string;
};

type ActionWithPayload<PayloadType> = ActionWithoutPayload & {
  payload: PayloadType;
};

export type Action<
  PayloadType extends any = undefined
> = PayloadType extends undefined
  ? ActionWithoutPayload
  : ActionWithPayload<PayloadType>;

export function actionHasPayload(
  action: any
): action is ActionWithPayload<any> {
  return (
    typeof action === "object" &&
    Object.prototype.hasOwnProperty.call(action, "payload")
  );
}
