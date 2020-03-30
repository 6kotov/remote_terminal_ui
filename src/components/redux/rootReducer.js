import { combineReducers } from "redux";
import { clientConnectionReducer } from "./clientConnectionReducer";
import { serverConnectionReducer } from "./serverConnectionReducer";
import { appReducer } from "./appReducer";

export const rootReducer = combineReducers({
  connections_client: clientConnectionReducer,
  connections_server: serverConnectionReducer,
  app: appReducer
});
