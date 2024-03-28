import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDidUpdate, useUnMount } from "src/core/hooks";
import {
  ReduxObservableModuleReducer,
  ReduxObservableModuleReturnType,
  ReduxObservableModulesInput,
} from "src/core/redux/ReduxObservableModule";

interface Options<ReducerType, E extends ReduxObservableModulesInput> {
  moduleName: keyof RootReducer;
  action: keyof E;
  onProcessing?: () => void;
  onSuccess?: (data: ReducerType) => void;
  onError?: (error: any) => void;
}

export function useReduxObservableModuleAction<
  ReducerType = any,
  E extends ReduxObservableModulesInput = ReduxObservableModulesInput<ReducerType>
>(
  module: ReduxObservableModuleReturnType<E, ReducerType>,
  {
    moduleName,
    action,
    onSuccess,
    onError,
    onProcessing,
  }: Options<ReducerType, E>
) {
  const reduxState = useSelector(
    (state: RootReducer) =>
      state[moduleName] as ReduxObservableModuleReducer<ReducerType>
  );
  const [result, setResult] = useState<ReducerType>();
  const [error, setError] = useState<any>();

  const actions = useMemo(() => module.actions[action], [action, module]);
  const processing = useMemo(
    () => reduxState.state === module.reducerStates[action].processing,
    [reduxState.state, module, action]
  );

  const dispatch = useDispatch();

  const run = useCallback(
    (...args: Parameters<typeof actions.start>) => {
      dispatch(actions.start(args[0]));
    },
    [dispatch, actions]
  );

  const cancel = useCallback(() => {
    dispatch(actions.cancelled());
  }, [dispatch, actions]);

  useDidUpdate(() => {
    const { success, failed, processing } = module.reducerStates[action];
    const jobs = {
      [processing]: () => {
        onProcessing && onProcessing();
      },
      [success]: () => {
        reduxState.data && onSuccess && onSuccess(reduxState.data);
        setResult(reduxState.data);
        setError(undefined);
      },
      [failed]: () => {
        onError && onError(reduxState.error);
        setError(reduxState.error);
        setResult(undefined);
      },
    };

    reduxState.state && jobs[reduxState.state] && jobs[reduxState.state]();
  }, [reduxState.state]);

  useUnMount(() => {
    cancel();
  });

  return { run, cancel, result, error, processing };
}
