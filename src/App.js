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
  const [messageclasses, setMessageclasses] = useState(['message', 'messageBlue'])

  const secret = process.env.REACT_APP_SECRET;

  function status (text, color, timer) {
    color === 'red' ? setMessageclasses( ['message', 'messageRed']) : setMessageclasses( ['message', 'messageBlue']);
    setMessage(text)
    if (timer) {
setTimeout(()=>{setMessage('')}, 2000)
    }
  }

  async function getConnectionList() {
    const response = await fetch("http://192.168.0.201:9001/register");
    const data = await response.json().catch(()=>status('Unable to connect server!', 'red', false));
    return setconnectionsServer(data.connections);
   
  }
  useEffect(() => {
    window.addEventListener("storage", () => {
      setConnectionClient(JSON.parse(localStorage.getItem("connections")));
    });
    status('Getting connection list...', 'blue', true)


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
    fetch("http://192.168.0.201:9001/register").then(response => response.json()).then(data=> setconnectionsServer(data.connections)).catch(()=>status('Unable to connect server!', 'red', false))

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
      }).catch(()=>status('Unable to connect server!', 'red', false));

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
    })
    getConnectionList();
  }

  function onConnect(connection) {
    const url =
      "http://192.168.0.201:9001/register"
      status('Connecting to server...', 'blue', true)

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
    .catch(()=>status('Unable to connect server!', 'red', false));
    
  }

  return (
    <Context.Provider value={{ removeItem: removeItem, onConnect: onConnect }}>
      <div className="wrapper">
        <div className="title">Connections</div>
        {loading && <Loader />}

        {!islogged && !loading && <LoginWindow />}
        {!loading && (
          <div className="add-connect-buttons">
            <StartConnection addConnect={addConnect} onConnect={onConnect} />{" "} <span className={messageclasses.join(' ')}>{message}</span>
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
