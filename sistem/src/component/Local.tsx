import { Firestore, getFirestore, collection, onSnapshot, orderBy, query, addDoc, where } from 'firebase/firestore';
import {  createUserWithEmailAndPassword,getAuth} from 'firebase/auth';
import React, { useContext, useEffect, useState } from 'react'
import { app } from '../Firebase/conexion';
import { context } from '../hooks/AppContext'
import { useForm } from '../hooks/useForm';
import { async } from '@firebase/util';



interface Local {
  id: string;
  name: string;
}

export const Local = () => {

  const { onChange } = useContext(context);
  const [Local, setLocal] = useState<Local[]>([]);
  const  {name,email,pass,passConfirm,clear,onChange:onChangeForm}= useForm({name:'',email:'',pass:'',passConfirm:''});

  useEffect(() => {
   onChange('Local');

  }, [])



  const create = async () => {
    if (name == '' && pass=='' && passConfirm=='' &&  email=='') return alert('Debes ingresar el nombre');
    if(pass!=passConfirm)return alert('Las contraseñas no coinciden');
    const db = getFirestore(app);
    const coll = collection(db, 'Local');

   
    const auth=getAuth(app);
    const resp= await createUserWithEmailAndPassword(auth,email,pass);
    addDoc(coll, {
      name,
      email,
      timestamp: new Date().getTime(),
      idLocal:resp.user.uid
    })

    clear()

  }


  useEffect(() => {
    const db = getFirestore(app);
    const coll = collection(db, 'Local');
    const Q = query(coll, orderBy('timestamp', 'desc'));

    onSnapshot(Q, (resp) => {
      const data: Local[] = resp.docs.map(res => {
        return {
          id: res.id,
          name: res.get('name')
        }
      })
      setLocal(data);
    })

  }, [])


  return (
    <div>
      <div className="container-fluid  mt-3 ml-4 mr-4">
        <div className="row justify-content-between">
          <div className="col-5">
            <div className="from-group row ">
              <input placeholder='Nombre'  value={name} onChange={(e) => onChangeForm(e.target.value,'name')} type="text" className='form-control' />

            </div>

          </div>
          <div className="col-5">
            <div className="from-group row ">
              <input placeholder='Email' value={email} onChange={(e) => onChangeForm(e.target.value,'email')} type="text" className='form-control ' />
            </div>
          </div>

         

        </div>

        <div className="row justify-content-between mt-2">
        <div className="col-5">
            <div className="from-group row ">
              <input placeholder='Contraseña'  value={pass} onChange={(e) => onChangeForm(e.target.value,'pass')} type='password' className='form-control ' />
            </div>
          </div>
          <div className="col-5">
            <div className="from-group row ">
              <input placeholder='Confirmar Contraseña' value={passConfirm} onChange={(e) => onChangeForm(e.target.value,'passConfirm')} type='password' className='form-control ' />
            </div>
          </div>
        </div>

        

        <div className="row mt-3">
        <div className="col">
            <div className="from-group row ">

              <button className='btn btn-outline-light ' onClick={create}>Guardar</button>
            </div>
          </div>
        </div>
      </div>



      <div className="table-container col-12 mt-3  mr-3">
        <table className="table  table-dark table-hover ">
          <thead>
            <tr>

              <th scope="col th-sm">Nombre</th>
            </tr>
          </thead>
          <tbody >
            {
              (Local.map((resp, index) => (

                <tr key={index} className={'pointer'} >
                  <th scope="row">{resp.name}</th>
                </tr>
              )))
            }
          </tbody>
        </table>

      </div>

    </div>
  )
}
