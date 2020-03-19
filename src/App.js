import React, { useState, useEffect } from "react";
import ConnectionsList from "./components/ConnestionsList";
import LoginWindow from "./components/LoginWindow";
import StartConnection from "./components/StartConnection";
import Loader from "./components/Loading";
import Context from "./Context";
import CryptoJS from "crypto-js";
require("dotenv").config();

function App() {
  const [islogged, setLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const secret = process.env.REACT_APP_SECRET;

  async function serverConnection() {
    const response = await fetch("http://192.168.0.201:9001/register");
    const data = await response.json();
    return setconnectionsServer(data.connections);
  }
  useEffect(() => {
    window.addEventListener("storage", () => {
      setConnectionClient(JSON.parse(localStorage.getItem("connections")));
    });

    fetch("https://mdn.github.io/fetch-examples/fetch-json/products.json")
      .then(response => response.json())
      .then(isMale => {
        if (isMale) {
          setLogin(true);
        }
        setLoading(false);
      });
    serverConnection();
  }, []);

  useEffect(() => {
    localStorage.setItem("connections", JSON.stringify(connectionsClient));
  });

  let storageConnections = JSON.parse(localStorage.getItem("connections"))
    ? JSON.parse(localStorage.getItem("connections"))
    : [];

  const [connectionsClient, setConnectionClient] = useState(storageConnections);
  const [connectionsServer, setconnectionsServer] = useState([]);

  function addConnect(connectInfo, connectionType) {
    const newConnection = {
      name: connectInfo.name,
      id: Date.now(),
      ip: connectInfo.ip,
      description: connectInfo.description,
      username: connectInfo.username,
      password: CryptoJS.AES.encrypt(connectInfo.password, secret).toString(),
      comment: connectInfo.comment
    };
    if (connectionType === "saveOnPc") {
      setConnectionClient(connectionsClient.concat([newConnection]));
    } else if (connectionType === "saveOnServer") {
      setconnectionsServer(connectionsServer.concat([newConnection]));

      fetch("http://192.168.0.201:9001/register", {
        method: "POST",
        body: JSON.stringify({
          name: "test",
          host: "127.4.4.112",
          username: "testName",
          description: "testtest",
          comment: "Test about",
          sshkey: "ijwdvnf03dknfvle4cnui934ufh",
          action: "store"
        })
      });
    }
  }

  function removeItem(id) {
    setConnectionClient(
      connectionsClient.filter(connection => connection.id !== id)
    );
  }

  function onConnect(connection) {
    const url =
      "http://192.168.0.201:9001/start?user=" +
      connection.username +
      "&host=" +
      connection.ip;
    // const url = 'http://192.168.0.201:9001/start?user=alex&host=192.168.0.201'
    fetch(url, { method: "GET" })
      .then(response => response.json())
      .then(data =>
        window.open(
          "http://192.168.0.201:7002/ssh/" + data.connect.slice(25),
          "_blank"
        )
      );
  }

  return (
    <Context.Provider value={{ removeItem: removeItem, onConnect: onConnect }}>
      <div className="wrapper">
        <div className="title">Connections</div>
        {loading && <Loader />}

        {!islogged && !loading && <LoginWindow />}
        {!loading && (
          <div className="add-connect-buttons">
            <StartConnection addConnect={addConnect} onConnect={onConnect} />{" "}
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
