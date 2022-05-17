import React from 'react'

import Authentication from './Authentication'
import FormRegister from '../components/authentication/FormRegister'

const Register = () => {
    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6'>
                    <Authentication />
                </div>
                <div className="col-md-6">
                    <FormRegister />
                </div>
            </div>
        </div>
    )
}

export default Register