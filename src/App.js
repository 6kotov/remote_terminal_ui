import React, { useState, useEffect } from "react";
import ConnectionsList from "./components/ConnestionsList";
import LoginWindow from "./components/LoginWindow";
import StartConnection from "./components/StartConnection";
import Loader from "./components/Loading";
import Context from "./Context";
import CryptoJS from "crypto-js";
require("dotenv").config();

function App() {
  const storageConnections = JSON.parse(localStorage.getItem("connections"))
    ? JSON.parse(localStorage.getItem("connections"))
    : [];
  const [islogged, setLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connectionsClient, setConnectionClient] = useState(storageConnections);
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
    window.addEventListener("storage", () => {
      setConnectionClient(JSON.parse(localStorage.getItem("connections")));
    });
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

  useEffect(() => {
    localStorage.setItem("connections", JSON.stringify(connectionsClient));
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
      newConnection.pcStorage = true
      setConnectionClient(connectionsClient.concat([newConnection]));
    } else if (connectionType === "saveOnServer") {
      getConnectionList();
    }
  }

  function onConnect(connection, connectionType) {
    status("Connecting to server...", "blue", true);
    let reqBody = {};
    // action: "connect",
    //       uuid: connection.uuid

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
    } else if ("shortCutConnect") {
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
          action: "connect",
          uuid: connection.uuid
        };
      }
     
    }

    fetch(url, {
      method: "POST",
      body: JSON.stringify(reqBody)
    })
      .then(response => response.json())
      .then(data => {
        window.open(test_url + data.connect.slice(30), "_blank");
        console.log(
          "SSH Terminal will be connected using url: [" +
            test_url +
            data.connect.slice(30) +
            "]"
        );
      })
      .catch(() => status("Unable to connect server!", "red", false));
  }

  function removeItem(uuid) {
    setConnectionClient(
      connectionsClient.filter(connection => connection.uuid !== uuid)
    );

    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        action: "remove",
        uuid: uuid
      })
    });
    getConnectionList();
  }

  return (
    <Context.Provider value={{ removeItem: removeItem, onConnect: onConnect }}>
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

        {(connectionsClient.length !== 0 || connectionsServer.length !== 0) &&
        !loading ? (
          <>
            <ConnectionsList connections={connectionsClient} />
            <ConnectionsList connections={connectionsServer} />
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
