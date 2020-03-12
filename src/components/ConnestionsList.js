import React from 'react'
import PropTypes from 'prop-types'




function ConnectionsList (prop) {


    return(
        <ul>
           {prop.connections.map(connection => {
               return (
               <div>Profile {connection.name}</div>
               )
           })}
        </ul>
    )
}

ConnectionsList.propTypes = {
    connections: PropTypes.arrayOf(PropTypes.object).isRequired
}
export default ConnectionsList