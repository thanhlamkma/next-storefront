import {
  Action,
  applyMiddleware,
  CombinedState,
  compose,
  createStore,
  Reducer,
} from "redux";
import { createEpicMiddleware } from "redux-observable";
import { Observable } from "rxjs";

export default function configureStore<S = {}>(
  rootReducer: Reducer<CombinedState<S>>,
  rootEpic?: (
    action$: Observable<any>,
    store$: any,
    dependencies: any
  ) => Observable<Action<any>>
) {
  const epicMiddleware = createEpicMiddleware();

  const store = createStore(
    rootReducer,
    compose(applyMiddleware(epicMiddleware))
  );

  if (rootEpic) {
    epicMiddleware.run(rootEpic);
  }

  return { store };
}
