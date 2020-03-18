import React, { useState } from "react";
import PropTypes from "prop-types";
import { AddCircleOIcon } from "@patternfly/react-icons";
import { CloseIcon } from "@patternfly/react-icons";
import { OkIcon } from "@patternfly/react-icons";

function AddConnection({ addConnect }) {
  const [shown, setShown] = useState(false);
  const [name, setName] = useState("");
  const [ip, setIp] = useState("");
  const [description, setDescription] = useState("");
  const [username, setUserName] = useState("");
  const [KeyText, setKeyText] = useState("");
  const [KeyFile, setKeyFile] = useState("");
  const [fileOrText, setFileOrText] = useState(true);
  const [comment, setComment] = useState("");
  const [useKey, setUseKey] = useState(true);

  function handleInput(event) {
    const target = event.target;
    const value = event.target.value;
    const name = target.name;

    if (name === "name") setName(value);
    if (name === "ip") setIp(value);
    if (name === "port") setDescription(value);
    if (name === "username") setUserName(value);
    if (name === "KeyText") setKeyText(value);
    if (name === "KeyFile") setKeyFile(value);
    if (name === "key") setFileOrText(!fileOrText);
    if (name === "comment") setComment(value);
    if (name === "useKey") setUseKey(!useKey);
  }
  function clearInput() {
    setName("");
    setIp("");
    setDescription("");
    setUserName("");
    setKeyText("");
    setKeyFile("");
    setFileOrText(false);
    setComment("");
    setUseKey(false);
  }

  function submitHandle(event) {
    const privatKey = fileOrText ? KeyText : KeyFile,
      connectionName = name ? name : username + "@" + ip;

    const connection = {
      name: connectionName,
      ip: ip,
      description: description,
      username: username,
      password: privatKey,
      comment: comment
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
            <label>Hostname / IP*</label>
            <input name="ip" value={ip} onChange={handleInput} required />
            <label>Username*</label>
            <input
              name="username"
              value={username}
              onChange={handleInput}
              required
            />
            <label>Connection name</label>
            <input name="name" value={name} onChange={handleInput} />
            <label>Description</label>
            <input
              name="description"
              value={description}
              onChange={handleInput}
            />
            <label>Comment</label>
            <textarea
              name="comment"
              rows="1"
              value={comment}
              onChange={handleInput}
            />

            <label>
              {" "}
              <input
                type="checkbox"
                name="useKey"
                value={{ useKey }}
                onChange={handleInput}
              />
              Use private key
            </label>

            <textarea
              name="KeyText"
              rows="3"
              value={KeyText}
              onChange={handleInput}
              disabled={useKey || !fileOrText}
            />
            <div>
              {" "}
              From file{" "}
              <input
                value={{ fileOrText }}
                name="key"
                onChange={handleInput}
                type="checkbox"
                disabled={useKey}
              />{" "}
              <input
                name="KeyFile"
                value={KeyFile}
                onChange={handleInput}
                type="file"
                disabled={useKey || fileOrText}
              />
            </div>
            <button className="loginButton connectionAdd" type="submit">
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
