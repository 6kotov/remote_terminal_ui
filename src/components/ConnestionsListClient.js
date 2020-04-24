import React from "react";
import ConnectionItem from "./ConnectionItem";
import { useSelector } from "react-redux";

function ConnectionsList() {
  const connectionsClient = useSelector(
    (state) => state.connections_client.client_list
  );
  return (
    <ul className="list">
      {connectionsClient.map((connection, index) => {
        return <ConnectionItem item={connection} key={index} />;
      })}
    </ul>
  );
}

export default ConnectionsList;
