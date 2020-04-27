import { combineReducers } from "redux";
import { clientConnectionReducer } from "./clientConnectionReducer";
import { serverConnectionReducer } from "./serverConnectionReducer";
import { appReducer } from "./appReducer";
import { withReduxStateSync } from "redux-state-sync";

const rootReducer = combineReducers({
  connections_client: clientConnectionReducer,
  connections_server: serverConnectionReducer,
  app: appReducer,
});

export default withReduxStateSync(rootReducer);
