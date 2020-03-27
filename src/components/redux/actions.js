import {
  DELETE_CONNECTION_CLIENT,
  SET_CLIENT_LIST,
  ADD_CLIENT_LIST,
  DELETE_CONNECTION_SERVER,
  SET_SERVER_LIST,
  ADD_SERVER_LIST
} from "./types";

export function setConnectionClient(connections) {
  return {
    type: SET_CLIENT_LIST,
    payload: connections
  };
}

export function addConnectioClient(connection) {
  return {
    type: ADD_CLIENT_LIST,
    payload: connection
  };
}

export function deleteConnectionClient(uuid) {
  return {
    type: DELETE_CONNECTION_CLIENT,
    payload: uuid
  };
}

export async function getConnectionServer(connections) {

    const response = await fetch(url);
    const data = await response
      .json()
      .catch(() => status("Unable to connect server!", "red", false));
    return {
      type: SET_CLIENT_LIST,
      payload: connections
    };
  }
  
  export function addConnectioServer(connection) {
    return {
      type: ADD_CLIENT_LIST,
      payload: connection
    };
  }
  
  export function deleteConnectionClient(uuid) {
    return {
      type: DELETE_CONNECTION_CLIENT,
      payload: uuid
    };
  }
  