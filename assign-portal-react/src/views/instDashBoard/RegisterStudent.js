import React from 'react'
import Register from "../Register";

const RegisterStudent=({ onAdd, OnMessage, OnLoad })=> {
    return (
        <div>
            <Register type={'student'}
                onAdd={onAdd}
                onChange={null} />
        </div>
    )
}

export default RegisterStudent
