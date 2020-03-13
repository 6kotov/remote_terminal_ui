import React, { useState } from "react";
import PropTypes from "prop-types";

function AddConnection({ addConnect }) {
  const [shown, setShown] = useState(false);
  const [name, setName] = useState("");
  const [ip, setIp] = useState("");
  const [port, setPort] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  function handleInput(event) {
    const target = event.target;
    const value = event.target.value;
    const name = target.name;

    if (name === "name") setName(value);
    if (name === "ip") setIp(value);
    if (name === "port") setPort(value);
    if (name === "username") setUserName(value);
    if (name === "password") setPassword(value);
  }
  function clearInput() {
    setName("");
    setIp("");
    setPort("");
    setUserName("");
    setPassword("");
  }

  function submitHandle(event) {
    const connection = {
      name: name,
      ip: ip,
      port: port,
      username: username,
      password: password
    };
    event.preventDefault();
    addConnect(connection);
    clearInput();
    setShown(false);
  }

  return (
    <div>
      <button className="connectionAdd" onClick={() => setShown(true)}>Add Profile</button>
      {shown && (
        <div className="modal">
          <form onSubmit={submitHandle} className="modal-body">
            <button className="closeButton" onClick={() => setShown(false)}>
              &times;
            </button>
            <h3>Add new connection</h3>
            <label>Connection name</label>
            <input name="name" value={name} onChange={handleInput} required />
            <label >IP</label>
            <input name="ip" value={ip} onChange={handleInput} required />
            <label >PORT</label>
            <input name="port" value={port} onChange={handleInput} required />
            <label >Username</label>
            <input name="username" value={username} onChange={handleInput} required />
            <label >Password</label>
            <textarea name="password" rows='3' value={password} onChange={handleInput} required />
            <button className="loginButton" type="submit">
              Add
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

AddConnection.propTypes = {
  addConnect: PropTypes.func.isRequired
};

export default AddConnection;
