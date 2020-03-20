import React, { useState } from "react";
import PropTypes from "prop-types";
import { ArrowIcon } from '@patternfly/react-icons'
import { CloseIcon } from "@patternfly/react-icons";
import { OkIcon } from "@patternfly/react-icons";

function StartConnection({ addConnect, onConnect }) {
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
  const [connectionType, setconnectionType] = useState("notSave");

  function handleInput(event) {
    const target = event.target;
    const value = event.target.value;
    const name = target.name;

    if (name === "name") setName(value);
    if (name === "ip") setIp(value);
    if (name === "description") setDescription(value);
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
    setconnectionType("notSave")
  }

  function submitHandle(event) {
    const privatKey = fileOrText ? KeyText : KeyFile,
      connectionName = name ? name : username + "@" + ip;

    const connection = {
      name: connectionName,
      host: ip,
      description: description,
      username: username,
      password: privatKey,
      comment: comment
    };
    event.preventDefault();
    onConnect(connection);
    if (connectionType !== "notSave") { addConnect(connection, connectionType); }
    clearInput();
    setShown(false);
  }

  return (
    <div>
      <button className="connectionAdd" onClick={() => setShown(true)}>
        Connect <ArrowIcon />
      </button>
      {shown && (
        <div className="modal">
          <form onSubmit={submitHandle} className="modal-body">
            <button className="closeButton" onClick={() => setShown(false)}>
              <CloseIcon />
            </button>
            <div className="modal-header">Open new connection</div>
            <label>Hostname / IP*</label>
            <input name="ip" value={ip} onChange={handleInput} required />
            <label>Username*</label>
            <input
              name="username"
              value={username}
              onChange={handleInput}
              required
            />
            <label className='button_group'>
              <input
                type="radio"
                value={connectionType}
                onChange={setconnectionType.bind(null, "notSave")}
                name="needSave"
                checked={connectionType === "notSave"}
              />
              Connect without saving{" "}
              <input
                type="radio"
                value={connectionType}
                onChange={setconnectionType.bind(null, "saveOnServer")}
                name="needSave"
              />{" "}
              Save on server{" "}
              <input
                type="radio"
                value={connectionType}
                onChange={setconnectionType.bind(null, "saveOnPc")}
                name="needSave"
              />{" "}
              Save on my computer
            </label>
            <label>Connection name</label>
            <input name="name" value={name} onChange={handleInput} disabled={connectionType === "notSave"} />
            <label>Description</label>
            <input
              name="description"
              value={description}
              onChange={handleInput}
              disabled={connectionType === "notSave"}
            />
            <label>Comment</label>
            <textarea
              name="comment"
              rows="1"
              value={comment}
              onChange={handleInput}
              disabled={connectionType === "notSave"}
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
             Connect <OkIcon />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

StartConnection.propTypes = {
  addConnect: PropTypes.func.isRequired,
  onConnect: PropTypes.func.isRequired
};

export default StartConnection;
