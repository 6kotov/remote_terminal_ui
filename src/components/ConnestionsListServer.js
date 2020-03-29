import React from 'react'
import ConnectionItem from './ConnectionItem'
import {useSelector} from 'react-redux'

function ConnectionsList ({connectionsClient, setConnectionClient}) {

const connectionsServer = useSelector(state => state.connections.server_list)


    return(
        <ul className='list'>
           {connectionsServer.map((connection, index) => {
               return (
              <ConnectionItem item={connection} key={index} />
               )
           })}
        </ul>
    )
}

  export default ConnectionsList;