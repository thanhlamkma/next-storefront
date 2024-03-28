import { Reducer } from "redux";
import { StateObservable } from "redux-observable";
import { Observable } from "rxjs";
import { Action } from "src/core/models/redux";
import { actionHasPayload } from "src/core/models/redux/Action";
import { makeId } from "src/core/utilities";

// Action type
type GroupedActionTypes = {
  start: string;
  success: string;
  failed: string;
  cancelled: string;
};

export type ReduxObservableModuleActionTypes<E> = {
  [p in keyof E]: GroupedActionTypes;
};

// Action
type ActionFunc<Payload = any> = Payload extends undefined
  ? () => Action<Payload>
  : (payload: Payload) => Action<Payload>;

type ExtractActionPayloadType<A extends Action<any>> = A extends Action<infer R>
  ? R
  : undefined;

type ActionFuncFromEpic<Epic> = Epic extends ReduxObservableModuleEpic<infer A>
  ? ActionFunc<ExtractActionPayloadType<A>>
  : Epic extends ReduxObservableModule
  ? ActionFuncFromEpic<Epic["epic"]>
  : ActionFunc<any>;

type GroupedActions<Epic> = {
  start: ActionFuncFromEpic<Epic>;
  success: ActionFunc;
  failed: ActionFunc;
  cancelled: ActionFunc<undefined>;
};

export type ReduxObservableModuleActions<
  Epics extends ReduxObservableModulesInput
> = {
  [P in keyof Epics]: GroupedActions<Epics[P]>;
};

// Reducer
export type ReduxObservableModuleReducerState<E> = {
  [P in keyof E]: {
    processing: string;
    success: string;
    failed: string;
  };
};

export interface ReduxObservableModuleReducer<S = any> {
  state?: string | number;
  data?: S;
  error?: any;
}

type ReducerFunction<S = any, P = any> = (
  state: ReduxObservableModuleReducer<S>,
  payload: P
) => ReduxObservableModuleReducer<S>;

// Module

type GroupedReducers<ReducerType = any, PP = any, SP = any, FP = any> = {
  processing?: ReducerFunction<ReducerType, PP>;
  success?: ReducerFunction<ReducerType, SP>;
  failed?: ReducerFunction<ReducerType, FP>;
};

type ReduxObservableModule<ReducerType = any> = {
  epic?: ReduxObservableModuleEpic;
  reducers?: GroupedReducers<ReducerType>;
};

function isReduxObservableModule(module: any): module is ReduxObservableModule {
  return (
    typeof module === "object" &&
    Object.prototype.hasOwnProperty.call(module, "epic")
  );
}

// Epics
export interface ReduxObservableModuleEpicProps<
  A extends Action = Action<undefined>,
  State = any
> {
  /**
   * Action observable
   */
  actions$: Observable<A>;
  /**
   * Root state observable
   */
  state$: StateObservable<State>;
  /**
   * All action types for current epic
   */
  actionTypes: GroupedActionTypes;
  /**
   * All actions for current epic
   */
  actions: GroupedActions<any>;
  /**
   * All module's action types
   */
  moduleActionTypes: ReduxObservableModuleActionTypes<any>;
  /**
   * All module's actions
   */
  moduleActions: ReduxObservableModuleActions<any>;
}

export type ReduxObservableModuleEpic<A extends Action = any> = (
  props: ReduxObservableModuleEpicProps<A>
) => Observable<any>;

function isReduxObservableModuleEpic(
  epic: any
): epic is ReduxObservableModuleEpic {
  return typeof epic === "function";
}

export type ReduxObservableModulesInput<ReducerType = any> = {
  [key: string]: ReduxObservableModuleEpic | ReduxObservableModule<ReducerType>;
};

// Module return type
export interface ReduxObservableModuleReturnType<
  E extends ReduxObservableModulesInput<ReducerType>,
  ReducerType = any
> {
  actionTypes: ReduxObservableModuleActionTypes<E>;
  actions: ReduxObservableModuleActions<E>;
  epics: any[];
  reducer: Reducer<ReduxObservableModuleReducer<ReducerType>, Action<any>>;
  reducerStates: ReduxObservableModuleReducerState<E>;
}

export function createReduxObservableModule<
  ReducerType = any,
  E extends ReduxObservableModulesInput = ReduxObservableModulesInput<ReducerType>
>(
  inputEpics: E,
  name?: string,
  defaultReducerData?: ReducerType
): ReduxObservableModuleReturnType<E, ReducerType> {
  if (!name) {
    name = makeId(5);
  }
  // Action type
  const actionTypes: any = {};
  for (const key in inputEpics) {
    const upperCaseKey = key.toUpperCase();
    const upperCaseName = name.toUpperCase();
    actionTypes[key] = {
      start: upperCaseName + "_" + upperCaseKey + "_START",
      success: upperCaseName + "_" + upperCaseKey + "_SUCCESS",
      failed: upperCaseName + "_" + upperCaseKey + "_FAILED",
      cancelled: upperCaseName + "_" + upperCaseKey + "_CANCELLED",
    };
  }

  // Action
  const actions: any = {};
  for (const key in inputEpics) {
    actions[key] = {
      start: (payload?: any): Action<any> => ({
        type: actionTypes[key].start,
        payload,
      }),
      success: (payload?: any): Action<any> => ({
        type: actionTypes[key].success,
        payload,
      }),
      failed: (payload?: any): Action<any> => ({
        type: actionTypes[key].failed,
        payload,
      }),
      cancelled: (): Action => ({
        type: actionTypes[key].cancelled,
      }),
    };
  }

  // Epic
  const epics: any[] = [];
  for (const key in inputEpics) {
    const module = inputEpics[key];
    if (isReduxObservableModule(module)) {
      const epic = module.epic;
      if (epic) {
        epics.push((actions$: Observable<Action>, state$: any) => {
          return epic({
            actions$,
            state$,
            actionTypes: actionTypes[key],
            actions: actions[key],
            moduleActionTypes: actionTypes,
            moduleActions: actions,
          });
        });
      }
    } else if (isReduxObservableModuleEpic(module)) {
      epics.push((actions$: Observable<Action>, state$: any) => {
        return module({
          actions$,
          state$,
          actionTypes: actionTypes[key],
          actions: actions[key],
          moduleActionTypes: actionTypes,
          moduleActions: actions,
        });
      });
    }
  }

  // States
  const reducerStates: any = {};
  for (const key in inputEpics) {
    const upperCaseKey = key.toUpperCase();
    reducerStates[key] = {
      processing: upperCaseKey + "_PROCESSING",
      success: upperCaseKey + "_SUCCESS",
      failed: upperCaseKey + "_FAILED",
    };
  }

  // Reducer
  const defaultState: ReduxObservableModuleReducer<ReducerType> = {
    data: defaultReducerData,
  };

  const reducer = (
    state: ReduxObservableModuleReducer<ReducerType> = defaultState,
    action: Action<any>
  ): ReduxObservableModuleReducer<ReducerType> => {
    for (const key in inputEpics) {
      for (const actionKey in actionTypes[key]) {
        const rAction = actionTypes[key][actionKey];
        const curReducerState = reducerStates[key];
        if (rAction === action.type) {
          const reducerState = action.type.includes("SUCCESS")
            ? curReducerState.success
            : action.type.includes("FAILED")
            ? curReducerState.failed
            : action.type.includes("START")
            ? curReducerState.processing
            : curReducerState.standing;

          const module = inputEpics[key];
          if (isReduxObservableModule(module)) {
            const payload = actionHasPayload(action)
              ? action.payload
              : undefined;

            if (
              module.reducers?.processing &&
              reducerState === curReducerState.processing
            ) {
              return {
                state: reducerState,
                ...module.reducers.processing(state, payload),
              };
            }

            if (
              module.reducers?.success &&
              reducerState === curReducerState.success
            ) {
              return {
                state: reducerState,
                ...module.reducers.success(state, payload),
              };
            }

            if (
              module.reducers?.failed &&
              reducerState === curReducerState.failed
            ) {
              return {
                state: reducerState,
                ...module.reducers.failed(state, payload),
              };
            }
          }

          const payload = actionHasPayload(action)
            ? action.payload
            : state.data;

          const newState = {
            ...state,
            state: reducerState,
            data: action.type.includes("FAILED") ? undefined : payload,
            error: action.type.includes("FAILED") ? payload : undefined,
          };

          return newState;
        }
      }
    }

    return state;
  };

  return {
    actionTypes: actionTypes as ReduxObservableModuleActionTypes<E>,
    actions,
    epics: epics,
    reducer,
    reducerStates,
  };
}
