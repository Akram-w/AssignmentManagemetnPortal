import React from 'react'
import Register from "../Register";

const RegisterTutor=({ onAdd, OnMessage, OnLoad})=> {
    return (
        <div>
            <Register type={'tutor'}
                onAdd={onAdd}
                onChange={null} />
        </div>
    )
}

export default RegisterTutor
