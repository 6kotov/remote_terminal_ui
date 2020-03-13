import React, {useContext} from "react";
import PropTypes from "prop-types";
import Context from "../Context"

function ConectionItem ({item, index}) {
    const {removeItem, onConnect} = useContext(Context)

    return(
    <div className="item">
        <div className='text'>№{index+1}</div>
        <div className='name'>name:{item.name}</div>
        <div className='name'>IP:{item.ip}</div>
        <button className='connect' onClick={onConnect.bind(null,item)}>&#8658;connect</button>
        <button className='rm' onClick={removeItem.bind(null,item.id)}> &times;</button>
    </div>
    )
}

ConectionItem.propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
}

export default ConectionItem