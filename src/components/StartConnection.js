import React, { useState } from "react";
import PropTypes from "prop-types";
import { ArrowIcon } from "@patternfly/react-icons";
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
    const reader = new FileReader()

    if (name === "name") setName(value);
    if (name === "ip") setIp(value);
    if (name === "description") setDescription(value);
    if (name === "username") setUserName(value);
    if (name === "KeyText") setKeyText(value);
    if (name === "key") setFileOrText(!fileOrText);
    if (name === "comment") setComment(value);
    if (name === "useKey") setUseKey(!useKey);
    if (name === "KeyFile") {
      const file = target.files[0];
      if (file.size < 10000) {reader.readAsText(file)
        reader.onload = function() {
          setKeyFile(reader.result)
        };
      }
    } 
  }

  function clearInput() {
    setName("");
    setIp("");
    setDescription("");
    setUserName("");
    setKeyText("");
    setFileOrText(!fileOrText);
    setKeyFile("")
    setComment("");
    setUseKey(!useKey);
    setconnectionType("notSave");
  }

  function submitHandle(event) {
    const connectionName = name ? name : username + "@" + ip,
    privatKey = fileOrText ? KeyText : KeyFile ;

    const connection = {
      name: connectionName,
      host: ip,
      description: description,
      username: username,
      password:privatKey ,
      comment: comment
    };
    console.log(connection)
    event.preventDefault();
    onConnect(connection);
    if (connectionType !== "notSave") {
      addConnect(connection, connectionType);
    }
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
            <div className="button_group">
              <label><input
                type="radio"
                value={connectionType}
                onChange={setconnectionType.bind(null, "notSave")}
                name="needSave"
                checked={connectionType === "notSave"}
              />
              Connect without saving{" "}</label>
              <label><input
                type="radio"
                value={connectionType}
                onChange={setconnectionType.bind(null, "saveOnServer")}
                name="needSave"
              />{" "}
              Save on server{" "}</label>
              <label><input
                type="radio"
                value={connectionType}
                onChange={setconnectionType.bind(null, "saveOnPc")}
                name="needSave"
              />{" "}
              Save on my computer</label>
              
            </div>
            <label>Connection name</label>
            <input
              name="name"
              value={name}
              onChange={handleInput}
              disabled={connectionType === "notSave"}
            />
            <label>Description</label>
            <textarea
              name="description"
              value={description}
              onChange={handleInput}
              disabled={connectionType === "notSave"}
            />
            <label>Comment</label>
            <input
              name="comment"
              rows="1"
              value={comment}
              onChange={handleInput}
              disabled={connectionType === "notSave"}
            />

            <div>
              <label><input
                type="checkbox"
                name="useKey"
                value={{ useKey }}
                onChange={handleInput}
              />
              Use private key{" "}</label>
              <label> <input
                value={{ fileOrText }}
                name="key"
                onChange={handleInput}
                type="checkbox"
                disabled={useKey}
              />{" "}
              From file</label>
            </div>

            {fileOrText && (
              <textarea
                name="KeyText"
                rows="3"
                value={KeyText}
                onChange={handleInput}
                disabled={useKey}
              />
            )}

            {!fileOrText && (
              <input
                name="KeyFile"
                onChange={handleInput}
                type="file"
                disabled={useKey}
              />
            )}

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
