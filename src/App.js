import React, { useState, useEffect } from "react";
import ConnectionsList from "./components/ConnestionsList";
import LoginWindow from "./components/LoginWindow";
import AddConnection from './components/AddConnection';

function App() {

  const [islogged, setLogin] = useState(false);

  useEffect(()=>{
    fetch("https://swapi.co/api/people/30")
    .then(response => response.json())
    .then(isMale => {
      if(isMale.gender === 'male') {
        setLogin(true)
      }
    });
  }, [])

  const [connections, setConnection] = useState([
    {
      name: "default",
      id: "f4u5",
      ip: "192.168.0.201",
      port: 8034,
      username: "userX",
      password: "superPASS36"
    },{
      name: "default",
      id: "f4u5",
      ip: "192.168.0.201",
      port: 8034,
      username: "userX",
      password: "superPASS36"
    },{
      name: "userX",
      id: "f4u5",
      ip: "192.168.0.201",
      port: 8034,
      username: "userX",
      password: "superPASS36"
    },{
      name: "superPASS36",
      id: "f4u5",
      ip: "192.168.0.201",
      port: 8034,
      username: "userX",
      password: "superPASS36"
    }
  ]);

  function addConnect(connectInfo) {
    setConnection(
      connections.concat([
        {
          name: connectInfo.name,
          id: Date.now(),
          ip: connectInfo.ip,
          port: connectInfo.port,
          username: connectInfo.username,
          password: connectInfo.password,
          key:connectInfo.key
        }
      ])
    );
  }


  return (
    <div className="wrapper">
      {!islogged && <LoginWindow />}
      <AddConnection addConnect={addConnect}/>
      <ConnectionsList connections={connections} />
    </div>
  );
}

export default App;
