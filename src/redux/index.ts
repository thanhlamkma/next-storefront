import configureStore from "src/core/redux/configureStore";
import { rootReducer } from "src/redux/modules";

const { store } = configureStore(rootReducer);

export type RootReducer = ReturnType<typeof rootReducer>;

export default store;
