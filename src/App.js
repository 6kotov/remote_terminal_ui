import React, { useEffect } from "react";
import ConnectionsListClient from "./components/ConnestionsListClient";
import ConnestionsListServer from "./components/ConnestionsListServer";
import LoginWindow from "./components/LoginWindow";
import StartConnection from "./components/StartConnection";
import Loader from "./components/Loading";
import Context from "./Context";
// import CryptoJS from "crypto-js";
import {
  addConnectionClient,
  getConnectionServer,
  deleteConnectionClient,
  postConnectionServer,
  setLogged,
  setLoading,
  showMessage

} from "./components/redux/actions";
import { useDispatch, useSelector } from "react-redux";
require("dotenv").config();

function App() {
  const dispatch = useDispatch();
  const islogged = useSelector(state => state.app.is_logged);
  const initial_logged_check = useSelector(state => state.app.init_logged_check) 
  const loading = useSelector(state => state.app.is_loading);
  const message  = useSelector(state => state.app.message_text);
  const messageclasses  = useSelector(state => state.app.message_style);
  const messageShow = useSelector(state => state.app.show_message)

  // const secret = process.env.REACT_APP_SECRET;

  useEffect( () => {
    if(initial_logged_check) {return}
   async function is_logged() {
      try {
        
        const response = await fetch("https://swapi.co/api/people/6");
        const data = await response.json()
        if (data) { 
          dispatch(setLogged(true, true))
        } else{
          dispatch(setLogged(false, false))
        }
        dispatch(setLoading(false));
      } catch {
        dispatch(showMessage("Unable to connect server!",'messageRed', 2000))
      }
    }
    is_logged()
  });


  function addConnect(connectInfo, connectionType) {
    const newConnection = {
      name: connectInfo.name,
      host: connectInfo.host,
      username: connectInfo.username,
      description: connectInfo.description,
      comment: connectInfo.comment,
      sshkey: connectInfo.sshkey,
      action: "store"
    };

    onConnect(newConnection, connectionType);

    if (connectionType === "saveOnPc") {
      newConnection.uuid = Date.now();
      newConnection.pcStorage = true;
      dispatch(addConnectionClient(newConnection));
    }
  }

  function onConnect(connection, connectionType) {
    dispatch(showMessage("Connecting to server...",'messageBlack', 2000))
   
    let reqBody = {};

    switch (connectionType) {
      case "notSave":
      case "saveOnPc":
        reqBody = {
          name: connection.name,
          host: connection.host,
          username: connection.username,
          sshkey: connection.sshkey,
          action: "connect"
        };
        break;

      case "saveOnServer":
        reqBody = {
          name: connection.name,
          host: connection.host,
          username: connection.username,
          sshkey: connection.sshkey,
          description: connection.description,
          comment: connection.comment,
          action: "connect store"
        };
        break;

      case "shortCutConnect":
        if (connection.pcStorage) {
          reqBody = {
            name: connection.name,
            host: connection.host,
            username: connection.username,
            sshkey: connection.sshkey,
            action: "connect"
          };
        } else {
          reqBody = {
            uuid: connection.uuid,
            action: "connect"
          };
        }
        break;

      case "remove":
        if (connection.pcStorage) {
          return dispatch(deleteConnectionClient(connection.uuid));
        } else {
          reqBody = {
            uuid: connection.uuid,
            action: "remove"
          };
        }
        break;

      default:
        break;
    }

    dispatch(postConnectionServer(reqBody));

    if (
      connectionType === "saveOnServer" ||
      (connectionType === "remove" && !connection.pcStorage)
    ) {
      dispatch(getConnectionServer());
    }
  }

  return (
    <Context.Provider value={{ addConnect, onConnect }}>
      <div className="wrapper">
        {loading && <Loader />}
        <div className="title"> Terminal Connections</div>
        {!islogged && !loading && <LoginWindow />}
        {!loading && (
          <div className="add-connect-buttons">
            <StartConnection />{" "}
            {messageShow && <span className={messageclasses + ' message'}>{message}</span>}
          </div>
        )}

        {!loading ? (
          <>
            <ConnectionsListClient />
            <ConnestionsListServer />
          </>
        ) : (
          !loading && (
            <h3 className="emptyList">
              No registered connections. Please click on "Connect" for starting.
            </h3>
          )
        )}
      </div>
    </Context.Provider>
  );
}

export default App;
