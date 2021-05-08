import React from 'react'

const user=({onLoad})=> {
    return (
        <tr>
        <td>{onLoad.username}</td>
        <td>{onLoad.email}</td>
        
    </tr>
    )
}

export default user
