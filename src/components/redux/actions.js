import {
  DELETE_CONNECTION_CLIENT,
  SET_CLIENT_LIST,
  ADD_CLIENT_LIST,
  DELETE_CONNECTION_SERVER,
  SET_SERVER_LIST,
  ADD_SERVER_LIST
} from "./types";

const secret = process.env.REACT_APP_SECRET,
url = process.env.REACT_APP_BACKEND_URL,
test_url = process.env.REACT_APP_CONNECTION_TEST_URL;

export function setConnectionClient(connections) {
  return {
    type: SET_CLIENT_LIST,
    payload: connections
  };
}

export function addConnectionClient(connection) {
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


export function setConnectionServer(connections) {
  return {
    type: SET_SERVER_LIST,
    payload: connections
  };
}


export function getConnectionServer(connections) {

  return async dispatch => {
    const response = await fetch(url);
    const data = await response
      .json()
      // .catch(() => status("Unable to connect server!", "red", false));
    
     dispatch(setConnectionServer(data.connections))
    }
  }

  export function postConnectionServer (reqBody) {
    return async dispatch => {
      try {
        const response = await  fetch(url, {
          method: "POST",
          body: JSON.stringify(reqBody)
        });
        const data = await response.json()

        const re = /ssh\/.*/g
         
        window.open(test_url + data.connect.match(re), "_blank");
        console.log(
          "SSH Terminal will be connected using url: [" +
            test_url +
            data.connect.slice(30) +
            "]"
        );
      } catch (e) {
        console.log("Unable to connect server!", "red", false)
      }
     
      }

  }
  
  
  export function deleteConnectionServer(uuid) {
    return {
      type: DELETE_CONNECTION_SERVER,
      payload: uuid
    };
  }
  