import React, { useState, useContext } from "react";
import {useSelector} from 'react-redux'
import Context from "../Context";
import {
  ArrowIcon,
  CloseIcon,
  OkIcon,
  FolderOpenIcon
} from "@patternfly/react-icons";



function StartConnection() {
  const { addConnect } = useContext(Context);
  const loading = useSelector(state => state.app.is_loading);
  const [shown, setShown] = useState(false);
  const [name, setName] = useState("");
  const [ip, setIp] = useState("");
  const [description, setDescription] = useState("");
  const [username, setUserName] = useState("");
  const [KeyText, setKeyText] = useState("");
  const [KeyFile, setKeyFile] = useState("");
  const [fileOrText, setFileOrText] = useState(false);
  const [comment, setComment] = useState("");
  const [useKey, setUseKey] = useState(false);
  const [connectionType, setconnectionType] = useState("notSave");
  const [fileName, setFileName] = useState("...");

  function handleInput(event) {
    const target = event.target;
    const value = event.target.value;
    const name = target.name;
    const reader = new FileReader();

    if (name === "name") setName(value);
    if (name === "ip") setIp(value.trim());
    if (name === "description") setDescription(value);
    if (name === "username") setUserName(value.trim());
    if (name === "KeyText") setKeyText(value);
    if (name === "key") setFileOrText(!fileOrText);
    if (name === "comment") setComment(value);
    if (name === "useKey") setUseKey(!useKey);
    if (name === "KeyFile") {
      const file = target.files[0];
      if (!file) { return }
      setFileName(file.name);
      if (file.size < 10000) {
        reader.readAsText(file);
        reader.onload = function() {
          setKeyFile(reader.result);
        };
      }
    }
  }

  function clearInput() {
    setShown(false);
    setName("");
    setIp("");
    setDescription("");
    setUserName("");
    setKeyText("");
    setFileOrText(false);
    setKeyFile("");
    setComment("");
    setUseKey(false);
    setconnectionType("notSave");
    setFileName("...");
  }

 

  function submitHandle(event) {
    const connectionName = name ? name : username + "@" + ip,
      privatKey = !fileOrText ? KeyText : KeyFile;

    const connection = {
      name: connectionName,
      host: ip,
      description: description,
      username: username,
      sshkey: privatKey,
      comment: comment
    };

    event.preventDefault();
    addConnect(connection, connectionType);
    clearInput();
  }

  return (
    <div>
      <button className="connectionAdd" onClick={() => setShown(true)} disabled={loading}>
        Connect <ArrowIcon />
      </button>
      {shown && (
        <div className="modal">
          <form onSubmit={submitHandle} className="modal-body">
            <button className="closeButton" onClick={() => clearInput()}>
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
              <label>
                <input
                  type="radio"
                  value={connectionType}
                  onChange={setconnectionType.bind(null, "notSave")}
                  name="needSave"
                  checked={connectionType === "notSave"}
                />
                Connect without saving{" "}
              </label>
              <label>
                <input
                  type="radio"
                  value={connectionType}
                  onChange={setconnectionType.bind(null, "saveOnServer")}
                  name="needSave"
                  checked={connectionType === "saveOnServer"}
                />{" "}
                Save on server{" "}
              </label>
{window.localStorage &&
              <label>
                <input
                  type="radio"
                  value={connectionType}
                  onChange={setconnectionType.bind(null, "saveOnPc")}
                  checked={connectionType === "saveOnPc"}
                  name="needSave"
                />{" "}
                Save on my computer
              </label> }
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

            <div className="button_group">
              <label>
                <input
                  type="checkbox"
                  name="useKey"
                  value={{ useKey }}
                  onChange={handleInput}
                  checked={useKey}
                />
                Use private key{" "}
              </label>
              <label>
                {" "}
                <input
                  value={{ fileOrText }}
                  name="key"
                  onChange={handleInput}
                  type="checkbox"
                  disabled={!useKey}
                  checked={fileOrText}
                />{" "}
                From file
              </label>
            </div>

            {(!fileOrText && useKey) && (
              <textarea
                name="KeyText"
                rows="3"
                value={KeyText}
                onChange={handleInput}
              />
            )}

            {(fileOrText && useKey) && (
              <>
                <div className="fileName">
                  {" "}
                  <label htmlFor="KeyFile" className="FileKeyLabel">
                    {" "}
                    Choose a file <FolderOpenIcon />{" "}
                  </label>{" "}
                  <div>
                    <strong>{fileName}</strong>
                  </div>
                </div>
                <input
                  name="KeyFile"
                  id="KeyFile"
                  onChange={handleInput}
                  type="file"
                />
              </>
            )}

            <button className="selfAlignCenter connectionAdd" type="submit">
              Connect <OkIcon />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default StartConnection;
