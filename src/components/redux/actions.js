import {
  DELETE_CONNECTION_CLIENT,
  SET_CLIENT_LIST,
  ADD_CLIENT_LIST,
  SET_SERVER_LIST,
  SHOW_MESSAGE,
  SET_LOADING,
  SET_LOGGED,
} from "./types";

const url = process.env.REACT_APP_BACKEND_URL,
  test_url = process.env.REACT_APP_CONNECTION_TEST_URL;

export function setLogged(isLogged, init) {
  return {
    type: SET_LOGGED,
    payload: { isLogged, init },
  };
}

export function setLoading(isLoading) {
  return {
    type: SET_LOADING,
    payload: isLoading,
  };
}

export function showMessage(text, style, delay) {
  return (dispatch) => {
    dispatch({
      type: SHOW_MESSAGE,
      payload: { text, style, isShown: true },
    });
    setTimeout(() => {
      dispatch({
        type: SHOW_MESSAGE,
        payload: { text: "", style: "messageBlue", isShown: false },
      });
    }, delay);
  };
}

export function setConnectionClient(connections) {
  return {
    type: SET_CLIENT_LIST,
    payload: connections,
  };
}

export function addConnectionClient(connection) {
  return {
    type: ADD_CLIENT_LIST,
    payload: connection,
  };
}

export function deleteConnectionClient(uuid) {
  return {
    type: DELETE_CONNECTION_CLIENT,
    payload: uuid,
  };
}

export function setConnectionServer(connections) {
  return {
    type: SET_SERVER_LIST,
    payload: connections,
  };
}

export function getConnectionServer() {
  return async (dispatch) => {
    try {
      dispatch(showMessage("Getting connection list...", "messageBlue", 9000));
      const response = await fetch(url);
      const data = await response.json();
      dispatch(setConnectionServer(data.connections));
      dispatch(showMessage("Getting connection list...", "messageBlue", 1000));
    } catch {
      dispatch(showMessage("Unable to connect server!", "messageRed", 2000));
    }
  };
}

export function postConnectionServer(reqBody) {
  return async (dispatch) => {
    try {
      dispatch(showMessage("Connecting to server...", "messageBlue", 10000));
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(reqBody),
      });
      const data = await response.json();

      const re = /ssh\/.*/g;

      window.open(test_url + data.connect.match(re), "_blank");
      console.log(
        `SSH Terminal will be connected using url: [${test_url}${data.connect.match(
          re
        )}]`
      );
      dispatch(showMessage("Connecting to server...", "messageBlue", 300));
    } catch {
      dispatch(showMessage("Unable to connect server!", "messageRed", 2000));
    }
  };
}
