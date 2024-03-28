import { message } from "antd";
import { i18n } from "next-i18next";
import { combineEpics, Epic } from "redux-observable";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
// import accountModule from "src/redux/modules/account";

export const rootEpic: Epic = (
  action$: Observable<any>,
  store$: any,
  dependencies: any
) =>
  combineEpics()(action$, store$, dependencies).pipe(
    // ...authModule.epics,
    catchError((_, source) => {
      message.error("error");
      return source;
    })
  );
