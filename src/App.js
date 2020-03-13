import React, { useState, useEffect } from "react";
import ConnectionsList from "./components/ConnestionsList";
import LoginWindow from "./components/LoginWindow";
import AddConnection from "./components/AddConnection";
import Loader from "./components/Loading";
import Context from "./Context";
import CryptoJS from "crypto-js";
require("dotenv").config();

function App() {
  const [islogged, setLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const secret = process.env.REACT_APP_SECRET;

  useEffect(() => {
    window.addEventListener("storage", () => {
      setConnection(JSON.parse(localStorage.getItem("connections")));
    });

    fetch("https://swapi.co/api/people/30")
      .then(response => response.json())
      .then(isMale => {
        if (isMale.gender === "male") {
          setLogin(true);
        }
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("connections", JSON.stringify(connections));
  });

  let storageConnections = JSON.parse(localStorage.getItem("connections"))
    ? JSON.parse(localStorage.getItem("connections"))
    : [];

  const [connections, setConnection] = useState(storageConnections);

  function addConnect(connectInfo) {
    setConnection(
      connections.concat([
        {
          name: connectInfo.name,
          id: Date.now(),
          ip: connectInfo.ip,
          port: connectInfo.port,
          username: connectInfo.username,
          password: CryptoJS.AES.encrypt(
            connectInfo.password,
            secret
          ).toString()
        }
      ])
    );
  }

  function removeItem(id) {
    setConnection(connections.filter(connection => connection.id !== id));
  }

  function onConnect(connection) {
    alert(connection.name + " connected");
  }

  return (
    <Context.Provider value={{ removeItem: removeItem, onConnect: onConnect }}>
      <div className="wrapper">
        <span className="title">Connections List</span>
        {loading && <Loader />}
        {!islogged && !loading && <LoginWindow />}
        {!loading && <AddConnection addConnect={addConnect} />}
        {connections.lenght !== 0 && !loading ? (
          <ConnectionsList connections={connections} />
        ) : (
          !loading && <p> No saved connections!</p>
        )}
      </div>
    </Context.Provider>
  );
}

export default App;
