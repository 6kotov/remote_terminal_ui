import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import Context from "../Context";
import { ArrowIcon ,Remove2Icon ,  WarningTriangleIcon} from "@patternfly/react-icons";

function ConectionItem({ item }) {
  const { onConnect } = useContext(Context);
  const [promptShow, setPromptShow] = useState(false);

  function deleteConnection (connection) {
    onConnect(connection, "remove")
    setPromptShow(false)
  };

  return (
    <>
    {promptShow && (
        <>
        <div className='overlay' onClick={setPromptShow.bind(null, false)}>
              </div>
          <div className="prompt">
              <div className="block">
                  <WarningTriangleIcon className='WarningIcon'/>
                  </div>
                  <div className='prompt_block'>Delete connection?
            <span>
              <button className='yes' onClick={deleteConnection.bind(null, item)}>Yes</button>
              <button  className='no' onClick={setPromptShow.bind(null, false)}>No</button>
            </span></div>
          </div>
          </>
        )}

      <div className="item">
      <div className="span"> {item.name}</div>
        <div className="span"> {item.username}</div>
        <div className="span">{item.host}</div>
        <div className="itemButtons">
          <button className="connect" onClick={onConnect.bind(null, item, "shortCutConnect")}>
            <ArrowIcon />
          </button>
          <button className="rm" onClick={setPromptShow.bind(null, true)}>
            <Remove2Icon />
          </button>
        </div>
      </div>
    </>
  );
}

ConectionItem.propTypes = {
  item: PropTypes.object.isRequired
};

export default ConectionItem;
