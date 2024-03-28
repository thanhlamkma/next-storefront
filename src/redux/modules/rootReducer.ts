import { combineReducers } from "redux";
import cartModule from "src/redux/modules/cart";

export const rootReducer = combineReducers({
  cart: cartModule.reducer,
});
