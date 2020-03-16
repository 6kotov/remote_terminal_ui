import React, { useState } from "react";
import PropTypes from "prop-types";
import { AddCircleOIcon } from "@patternfly/react-icons";
import { CloseIcon } from "@patternfly/react-icons";
import { OkIcon } from "@patternfly/react-icons";

function AddConnection({ addConnect }) {
  const [shown, setShown] = useState(false);
  const [name, setName] = useState("");
  const [ip, setIp] = useState("");
  const [port, setPort] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [fileOrText, setFileOrText] = useState(true);

  function handleInput(event) {
    const target = event.target;
    const value = event.target.value;
    const name = target.name;

    if (name === "name") setName(value);
    if (name === "ip") setIp(value);
    if (name === "port") setPort(value);
    if (name === "username") setUserName(value);
    if (name === "password") setPassword(value);
    if (name === "key") setFileOrText(!fileOrText);
  }
  function clearInput() {
    setName("");
    setIp("");
    setPort("");
    setUserName("");
    setPassword("");
    setFileOrText(false);
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
      <button className="connectionAdd" onClick={() => setShown(true)}>
        Add profile <AddCircleOIcon />
      </button>
      {shown && (
        <div className="modal">
          <form onSubmit={submitHandle} className="modal-body">
            <button className="closeButton" onClick={() => setShown(false)}>
              <CloseIcon />
            </button>
            <div className="modal-header">Add new connection</div>
            <label>Connection name</label>
            <input name="name" value={name} onChange={handleInput} required />
            <label>Ip or </label>
            <input name="ip" value={ip} onChange={handleInput} required />
            <label>PORT</label>
            <input name="port" value={port} onChange={handleInput} required />
            <label>Username</label>
            <input
              name="username"
              value={username}
              onChange={handleInput}
              required
            />
            <label>Private key</label>
            <textarea
              name="password"
              rows="3"
              value={password}
              onChange={handleInput}
              required
              disabled={!fileOrText}
            />
            <div>
              {" "}
              From file{" "}
              <input
                value={{ fileOrText }}
                name="key"
                onChange={handleInput}
                type="checkbox"
              />{" "}
              <input
                name="password"
                value={password}
                onChange={handleInput}
                type="file"
                disabled={fileOrText}

              />

            </div>
            <button className="loginButton" type="submit">
              Save <OkIcon />
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
