import React from 'react'
import PropTypes from 'prop-types'
import ConnectionItem from './ConnectionItem'
import {setConnectionClient, deleteConnectionClient} from './redux/actions'
import {connect} from 'react-redux'

function ConnectionsList ({connectionsClient, setConnectionClient}) {

    return(
        <ul className='list'>
           {connectionsClient.map((connection, index) => {
               return (
              <ConnectionItem item={connection} key={index} />
               )
           })}
        </ul>
    )
}

ConnectionsList.propTypes = {
    connectionsClient: PropTypes.array.isRequired,
    setConnectionClient: PropTypes.func.isRequired,
    deleteConnectionClient: PropTypes.func.isRequired
}

const mapDispatchToProps = {
    setConnectionClient, deleteConnectionClient
  }
  const mapStateToProps = state => {
    return {
        connectionsClient: state.connectionsClient.list
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps) (ConnectionsList);