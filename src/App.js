import React, { useState, useEffect } from "react";
import ConnectionsList from "./components/ConnestionsList";
import LoginWindow from "./components/LoginWindow";
import AddConnection from './components/AddConnection';
import Loader from './components/Loading'
import Context from './Context'

function App() {

  const [islogged, setLogin] = useState(false);
  const [loading, setLoading]  = useState(true)

  useEffect(()=>{
    fetch("https://swapi.co/api/people/30")
    .then(response => response.json())
    .then(isMale => {
      if(isMale.gender === 'male') {
        setLogin(true)
      }
      let storageConnections = JSON.parse(localStorage.getItem('connections'))
    console.log('storageConnections',storageConnections)
        if (storageConnections) {setConnection(storageConnections)}
      setLoading(false)
    });
  }, [])

  
  const [connections, setConnection] = useState([]);

  useEffect(()=>{
    console.log('connections stringify',  JSON.stringify(connections))
      localStorage.setItem('connections', JSON.stringify(connections))
  },[])

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

function removeItem (id) {
setConnection(connections.filter(connection => connection.id !== id))
}

  return (
    <Context.Provider value={{removeItem:removeItem}}>
    <div className="wrapper">
     {loading && <Loader/>}
     {!islogged && !loading && <LoginWindow />}
     {!loading && <AddConnection addConnect={addConnect}/>} 
      {connections.lenght !== 0 && !loading ?  (<ConnectionsList connections={connections}/>) : ( !loading && <p> No saved connections!</p>) }
    </div>
    </Context.Provider>
  );
}

export default App;
