import React, {useContext} from "react";
import PropTypes from "prop-types";
import Context from "../Context"

function ConectionItem ({item, index}) {
    const {removeItem} = useContext(Context)

    return(
    <div className="item">
        <div>{index+1}</div>
        <div>{item.name}</div>
        <div>{item.id}</div>
        <div>{item.username}</div>
        <button className='rm' onClick={removeItem.bind(null,item.id)}> &times;</button>
    </div>
    )
}

ConectionItem.propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
}

export default ConectionItem