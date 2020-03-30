import React, { useEffect } from "react";
import ConnectionItem from "./ConnectionItem";
import { useSelector, useDispatch } from "react-redux";
import {getConnectionServer, setConnectionServer, showMessage } from "./redux/actions";

function ConnectionsList() {
  const url = process.env.REACT_APP_BACKEND_URL;
  const connectionsServer = useSelector(
    state => state.connections_server.server_list
  );
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (connectionsServer.length !== 0) {
      return; 
    }
    dispatch(showMessage("Getting connection list...", "message", 2000));
    dispatch(getConnectionServer())
  
  },[connectionsServer.length, dispatch ]);

  return (
    <ul className="list">
      {connectionsServer.map((connection, index) => {
        return <ConnectionItem item={connection} key={index} />;
      })}
    </ul>
  );
}

export default ConnectionsList;
