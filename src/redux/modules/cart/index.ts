import { Action } from "src/core/models/redux";
import { createReduxModule } from "src/core/redux/ReduxModule";

export type CartItemState = {
  productId: number;
  quantity: number;
  unitPrice: number;
};

export type CartStoreState = CartItemState[];

const defaultState: CartStoreState = [];

const cartModule = createReduxModule({
  name: "cart",
  defaultState,
  reducers: {
    addProduct(state, action: Action<CartItemState>) {
      state.push(action.payload)
      return state;
    },
    setCart(state, action: Action<CartStoreState>) {
      state = action.payload
      return state;
    },
  },
});

export default cartModule;
