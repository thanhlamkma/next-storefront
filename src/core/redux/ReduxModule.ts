import { mapValues } from "lodash";
import { Reducer } from "redux";
import { Action } from "src/core/models/redux";

type GetActionPayload<A> = A extends Action<infer P> ? P : undefined;

type CaseReducer<S, A extends Action = Action<undefined>> = (
  state: S,
  action: A
) => S;

type CaseReducers<S> = {
  [key: string]: CaseReducer<S, any>;
};

interface ReduxModuleOutput<
  S,
  CRS extends CaseReducers<S>,
  Name extends string
> {
  name: Name;
  reducer: Reducer<S>;
  actions: {
    types: {
      [P in keyof CRS]: string;
    };
    creators: {
      [P in keyof CRS]: Parameters<CRS[P]>[1] extends { payload: infer P }
        ? (payload: P) => Action<P>
        : () => Action<GetActionPayload<Parameters<CRS[P]>[1]>>;
    };
  };
}

interface ReduxModuleInput<
  S,
  CRS extends CaseReducers<S>,
  Name extends string
> {
  name: Name;
  defaultState: S;
  reducers: CRS;
}

const findKeyHasValue = (object: any, value: any) => {
  return Object.keys(object).find((key) => object[key] === value);
};

export function createReduxModule<
  S,
  CRS extends CaseReducers<S>,
  Name extends string
>(input: ReduxModuleInput<S, CRS, Name>): ReduxModuleOutput<S, CRS, Name> {
  const actionTypes = mapValues(
    input.reducers,
    (_, type) => input.name.toUpperCase() + "_" + type.toUpperCase()
  );
  const actionCreators = mapValues(input.reducers, (_, type) => {
    return (payload?: any): Action<any> => ({
      payload,
      type: actionTypes[type],
    });
  });

  const reducer: Reducer<S> = (
    state = input.defaultState,
    action: Action<any>
  ) => {
    const type = findKeyHasValue(actionTypes, action.type);

    return type ? input.reducers[type](state, action) : state;
  };

  return {
    name: input.name,
    actions: {
      types: actionTypes,
      creators: actionCreators as any,
    },
    reducer,
  };
}
