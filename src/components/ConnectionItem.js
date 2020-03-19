import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import Context from "../Context";
import { ArrowIcon ,Remove2Icon ,  WarningTriangleIcon} from "@patternfly/react-icons";

function ConectionItem({ item, index }) {
  const { removeItem, onConnect } = useContext(Context);
  const [promptShow, setPromptShow] = useState(false);

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
              <button className='yes' onClick={removeItem.bind(null, item.id)}>Yes</button>
              <button  className='no' onClick={setPromptShow.bind(null, false)}>No</button>
            </span></div>
          </div>
          </>
        )}

      <div className="item">
        <div className="span">Name: {item.name}</div>
        <div className="span">Hostname {item.ip}</div>
        <div className="item-buttons ">
          <button className="connect" onClick={onConnect.bind(null, item)}>
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
