import { Action } from "src/core/models/redux";
import { createReduxModule } from "src/core/redux/ReduxModule";

interface CartStoreState {}

const defaultState: CartStoreState = {

}

const cart = createReduxModule({
  name: "cart",
  defaultState,
  reducers: {
    addProduct(state, action: Action<any>) {
      return {
        ...state,
      }
    }
  }
});


cart.actions.creators.addProduct()
