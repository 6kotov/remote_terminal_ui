import React, { useState, useEffect } from "react";
import ConnectionsList from "./components/ConnestionsList";
import LoginWindow from "./components/LoginWindow";
import AddConnection from "./components/AddConnection";
import StartConnection from './components/StartConnection'
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

    fetch("https://mdn.github.io/fetch-examples/fetch-json/products.json")
      .then(response => response.json())
      .then(isMale => {
        if (isMale) {
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
          description: connectInfo.description,
          username: connectInfo.username,
          password: CryptoJS.AES.encrypt(
            connectInfo.password,
            secret
          ).toString(),
          comment: connectInfo.comment
        }
      ])
    );
  }

  function removeItem(id) {
    setConnection(connections.filter(connection => connection.id !== id));
  }

  function onConnect(connection) {
    const url =
      "http://192.168.0.201:9001/start?user=" +
      connection.username +
      "&host=" +
      connection.ip;
    // const url = 'http://192.168.0.201:9001/start?user=alex&host=192.168.0.201'
    fetch(url, { method: "GET"}).then(response => response.json()).then( data => window.open('http://192.168.0.201:7002/ssh/' + data.connect.slice(25), "_blank"));

  }

  return (
    <Context.Provider value={{ removeItem: removeItem, onConnect: onConnect }}>
      <div className="wrapper">
        <div className="title">Connections</div>
        {loading && <Loader />}
        
        {!islogged && !loading && <LoginWindow />}
        {!loading && <div className='add-connect-buttons' ><AddConnection addConnect={addConnect} /> <StartConnection /></div> }
        
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
