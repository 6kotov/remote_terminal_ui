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
  const [message, setMessage] = useState('')

  const secret = process.env.REACT_APP_SECRET;

  function status (text) {
    setMessage(text)
  }

  async function getConnectionList() {
    status('Getting connection list')
    const response = await fetch("http://192.168.0.201:9001/register");
    const data = await response.json().catch(e => status('Unable to get connections list from server: ' + e));
    return setconnectionsServer(data.connections);
   
  }
  useEffect(() => {
    window.addEventListener("storage", () => {
      setConnectionClient(JSON.parse(localStorage.getItem("connections")));
    });

    // fetch("https://mdn.github.io/fetch-examples/fetch-json/products.json")
    //   .then(response => response.json())
    //   .then(isMale => {
    //     if (isMale) {
    //       setLogin(true);
    //     }
    //     setLoading(false);
    //   });
    setLoading(false);
    setLogin(true);
    getConnectionList()
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
      sshkey: connectInfo.password,
      action: "store"
    };

    if (connectionType === "saveOnPc") {
      newConnection.uuid = Date.now();
      setConnectionClient(connectionsClient.concat([newConnection]));
    } else if (connectionType === "saveOnServer") {
      fetch("http://192.168.0.201:9001/register", {
        method: "POST",
        body: JSON.stringify(
          newConnection
        )
      }).catch(e =>status('Unable to get connections list from server: ' + e));

      getConnectionList();
    }
  }

  function removeItem(uuid) {
    setConnectionClient(
      connectionsClient.filter(connection => connection.uuid !== uuid)
    );
    const url =
    "http://192.168.0.201:9001/register"

    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        action: "remove",
        uuid:uuid
      })
    });

    getConnectionList();
  }

  function onConnect(connection) {
    const url =
      "http://192.168.0.201:9001/register"
      status('Connecting to server...')

    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        host: connection.host,
        username: connection.username,
        action: "connect",
      })
    }).then(response => response.json())
    .then(data =>
      window.open(
        "http://192.168.0.201:7002/ssh/" + data.connect.slice(25),
        "_blank"
      )
    )
    .catch(e => status('Unable to get connections list from server: ' + e));
    
  }

  return (
    <Context.Provider value={{ removeItem: removeItem, onConnect: onConnect }}>
      <div className="wrapper">
        <div className="title">Connections</div>
        {loading && <Loader />}

        {!islogged && !loading && <LoginWindow />}
        {!loading && (
          <div className="add-connect-buttons">
            <StartConnection addConnect={addConnect} onConnect={onConnect} />{" "} <div>{message}</div>
          </div>
        )}

        {connectionsClient.lenght !== 0 && !loading ? (
          <>
            <ConnectionsList connections={connectionsClient} />
            <ConnectionsList connections={connectionsServer} />
          </>
        ) : (
          !loading && <p> No saved connections!</p>
        )}
      </div>
    </Context.Provider>
  );
}

export default App;
