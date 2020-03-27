import React, { useState, useEffect } from "react";
import ConnectionsListClient from "./components/ConnestionsListClient";
import ConnestionsListServer from "./components/ConnestionsListServer";
import LoginWindow from "./components/LoginWindow";
import StartConnection from "./components/StartConnection";
import Loader from "./components/Loading";
import Context from "./Context";
import CryptoJS from "crypto-js";
import {connect} from 'react-redux'
import {setConnectionClient, deleteConnectionClient, addConnectioClient} from './components/redux/actions'
require("dotenv").config();

function App(props) {
 
  const [islogged, setLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connectionsServer, setconnectionsServer] = useState([]);
  const [message, setMessage] = useState("");
  const [messageclasses, setMessageclasses] = useState([
    "message",
    "messageBlue"
  ]);

  const secret = process.env.REACT_APP_SECRET,
    url = process.env.REACT_APP_BACKEND_URL,
    test_url = process.env.REACT_APP_CONNECTION_TEST_URL;

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

  async function getConnectionList() {
    const response = await fetch(url);
    const data = await response
      .json()
      .catch(() => status("Unable to connect server!", "red", false));
    return setconnectionsServer(data.connections);
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
      .then(data => setconnectionsServer(data.connections))
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
      props.addConnectioClient(newConnection)
      // setConnectionClient(connectionsClient.concat([newConnection]));
    } else if (connectionType === "saveOnServer") {
      getConnectionList();
    }
  }

  function onConnect(connection, connectionType) {
    status("Connecting to server...", "blue", true);
    let reqBody = {};
    if (connectionType === "notSave" || connectionType === "saveOnPc") {
      reqBody = {
        name: connection.name,
        host: connection.host,
        username: connection.username,
        sshkey: connection.sshkey,
        action: "connect"
      };
    } else if (connectionType === "saveOnServer") {
      reqBody = {
        name: connection.name,
        host: connection.host,
        username: connection.username,
        sshkey: connection.sshkey,
        description: connection.description,
        comment: connection.comment,
        action: "connect store"
      };
    } else if (connectionType === "shortCutConnect") {
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
    } else if (connectionType === "remove") {
      if (connection.pcStorage) {
      // return setConnectionClient(
      //     connectionsClient.filter(item => item.uuid !== connection.uuid)
      //   );
        return props.deleteConnectionClient(connection.uuid)
      
      } else {
        reqBody = {
          uuid: connection.uuid,
          action: "remove"
        };
      }
    }
let re = /ssh\/.*/g

    fetch(url, {
      method: "POST",
      body: JSON.stringify(reqBody)
    })
      .then(response => response.json())
      .then(data => {
        window.open(test_url + data.connect.match(re), "_blank");
        console.log(
          "SSH Terminal will be connected using url: [" +
            test_url +
            data.connect.slice(30) +
            "]"
        );
      })
      .catch(() => status("Unable to connect server!", "red", false));

      if(connectionType === "saveOnServer" || connectionType === "remove" ) { getConnectionList() }
  }

  return (
    <Context.Provider value={{ onConnect: onConnect }}>
      <div className="wrapper">
        {loading && <Loader />}
        <div className="title"> Terminal Connections</div>
        {!islogged && !loading && <LoginWindow />}
        {!loading && (
          <div className="add-connect-buttons">
            <StartConnection addConnect={addConnect} onConnect={onConnect} />{" "}
            <span className={messageclasses.join(" ")}>{message}</span>
          </div>
        )}

        {(props.connectionsClient.length !== 0 || connectionsServer.length !== 0) &&
        !loading ? (
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
const mapDispatchToProps = {
  setConnectionClient, deleteConnectionClient, addConnectioClient
}
const mapStateToProps = state => {
  return {
    connectionsClient: state.connectionsClient.list
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (App);
