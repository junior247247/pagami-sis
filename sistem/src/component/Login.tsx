import React,{useContext} from 'react'

import {signInWithEmailAndPassword,getAuth}from 'firebase/auth'
import { useForm } from '../hooks/useForm'
import { async } from '@firebase/util';
import { app } from '../Firebase/conexion';
import { context } from '../hooks/AppContext';

export const Login = () => {
    const {onChange,email,pass} = useForm({email:'04@gmail.com',pass:'123456'});

    const {login} = useContext(context)

    const sigin= async ()=>{
        if(email=='' && pass=='')return alert('Completa todos los campos');
        const auth=getAuth(app);
         const current= await  signInWithEmailAndPassword(auth,email,pass);
         if(current.user==null)return alert('Email o contraseña incorrecta');
         login(current.user.uid);
    }


    return (
        <div className='container-login'>
            <div className="login">
                <div className="d-flex flex-column">
                    <h1 className='text-white text-center mt-2'>Login</h1>
                </div>
                <div className="container mt-4">
                    <div className="row justify-content-center">
                        <div className="form-group col-8">
                            <p className='text-color'>Email</p>
                            <input type="email" className='form-control' onChange={(e)=>onChange(e.target.value,'email')} value={email} placeholder='Email' />
                        </div>
                        <div className="form-group col-8">
                            <p className='text-color'>Contraseña</p>
                            <input type="password" className='form-control' onChange={(e)=>onChange(e.target.value,'pass')} value={pass} placeholder='*******'  />
                        </div>
                       
                        <div className="col-12 d-flex mt-3">
                        <div className='btn btn-outline-light m-auto' onClick={sigin}>Iniciar sesion</div>
                        </div>  
                       
                    </div>
                 
                </div>
              
            </div>
        </div>
    )
}
