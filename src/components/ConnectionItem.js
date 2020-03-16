import React, {useContext} from "react";
import PropTypes from "prop-types";
import Context from "../Context"
import { ArrowIcon } from '@patternfly/react-icons'
import { Remove2Icon } from '@patternfly/react-icons'

function ConectionItem ({item, index}) {
    const {removeItem, onConnect} = useContext(Context)

    return(
    <div className="item">
        <div >name:{item.name}</div>
        <div>IP:{item.ip}</div>
        <div>
    <button className='connect' onClick={onConnect.bind(null,item)}><ArrowIcon/></button>
        <button className='rm' onClick={removeItem.bind(null,item.id)}><Remove2Icon/></button>
        </div>
    </div>
    )
}

ConectionItem.propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
}

export default ConectionItem