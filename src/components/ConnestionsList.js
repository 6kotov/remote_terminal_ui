import React from 'react'
import PropTypes from 'prop-types'
import ConnectionItem from './ConnectionItem'



function ConnectionsList (prop) {


    return(
        <ul>
           {prop.connections.map((connection, index) => {
               return (
              <ConnectionItem index={index} item={connection} key={index} />
               )
           })}
        </ul>
    )
}

ConnectionsList.propTypes = {
    connections: PropTypes.arrayOf(PropTypes.object).isRequired
}
export default ConnectionsList