import React, { useState, useEffect } from "react";
import ConnectionsListClient from "./components/ConnestionsListClient";
import ConnestionsListServer from "./components/ConnestionsListServer";
import LoginWindow from "./components/LoginWindow";
import StartConnection from "./components/StartConnection";
import Loader from "./components/Loading";
import Context from "./Context";
// import CryptoJS from "crypto-js";
import {connect} from 'react-redux'
import {addConnectionClient, getConnectionServer, deleteConnectionClient, postConnectionServer, setConnectionServer} from './components/redux/actions'
import {useDispatch} from 'react-redux'
require("dotenv").config();

function App() {
  const dispatch = useDispatch()
  const [islogged, setLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connectionsServer, setconnectionsServer] = useState([]);
  const [message, setMessage] = useState("");
  const [messageclasses, setMessageclasses] = useState([
    "message",
    "messageBlue"
  ]);

  // const secret = process.env.REACT_APP_SECRET;

  function status(text, color, timer) {
    color === "red"
      ? setMessageclasses(["message", "messageRed"])
      : setMessageclasses(["message", "messageBlue"]);
    setMessage(text);
    if (timer) {
      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
  }

  useEffect(() => {
    const url = process.env.REACT_APP_BACKEND_URL;
    
    status("Getting connection list...", "blue", true);

    fetch("https://mdn.github.io/fetch-examples/fetch-json/products.json")
      .then(response => response.json())
      .then(isMale => {
        if (isMale) {
          setLogin(true);
        }
        setLoading(false);
      });

    fetch(url)
      .then(response => response.json())
      .then(data => dispatch(setConnectionServer(data.connections)))
      .catch(() => status("Unable to connect server!", "red", false));
  }, []);


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
      dispatch(addConnectionClient(newConnection)) 
    }
  }

  function onConnect(connection, connectionType) {
    console.log("Connecting to server...", "blue", true);
    
    let reqBody = {};


    switch (connectionType) {

      case "notSave" :
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
        }else {
          reqBody = {
             uuid: connection.uuid,
             action: "connect"
          };
        }
        break;
      
      case "remove":
        if (connection.pcStorage) {
          return dispatch(deleteConnectionClient(connection.uuid))
        } else {
          reqBody = {
            uuid: connection.uuid,
            action: "remove"
          };

        }
         break;

         default:  break;
      }
    
      dispatch(postConnectionServer(reqBody))

      if(connectionType === "saveOnServer" || (connectionType === "remove" && !connection.pcStorage) ) { dispatch(getConnectionServer()) }
    
  }
  
  

  return (
    <Context.Provider value={{addConnect, onConnect}} >
      <div className="wrapper">
        {loading && <Loader />}
        <div className="title"> Terminal Connections</div>
        {!islogged && !loading && <LoginWindow />}
        {!loading && (
          <div className="add-connect-buttons">
            <StartConnection/>{" "}
            <span className={messageclasses.join(" ")}>{message}</span>
          </div>
        )}

        { !loading ? (
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
