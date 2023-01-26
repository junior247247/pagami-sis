import { addDoc, getFirestore, collection, onSnapshot, query, orderBy, getDoc, doc } from 'firebase/firestore';
import React, { useEffect, useContext, useState } from 'react'
import { app } from '../Firebase/conexion';
import { context } from '../hooks/AppContext'
import { useForm } from '../hooks/useForm';
interface Tecnico {
  name: string,
  id: string,
  idDoc: string,
  idLocal: string;
  nameLocal?: string;

}
interface Local {
  name: string;
  idLocal: string;

}

export const Tecnicos = () => {

  const { onChange } = useContext(context);
  const { onChange: onChangeForm, name, id } = useForm({ id: '', name: '' });
  const [Local, setLocal] = useState<Local[]>([])
  const [SelectLocal, setSelectLocal] = useState<Local>({ name: 'Selecciona', idLocal: '' })
  const [Tecnico, setTecnico] = useState<Tecnico[]>([]);

  useEffect(() => {
    onChange('Técnicos')
  }, [])



  useEffect(() => {
    const db = getFirestore(app);
    const coll = collection(db, 'Local');
    const Q = query(coll, orderBy('timestamp', 'desc'));

    onSnapshot(Q, (resp) => {
      const data: Local[] = resp.docs.map(res => {
        return {
          idLocal: res.id,
          name: res.get('name')
        }
      })
      setLocal(data);
    })

  }, [])









  useEffect(() => {
    const db = getFirestore(app);
    const coll = collection(db, 'Tecnicos');
    const Q = query(coll, orderBy('timestamp', 'desc'));
    onSnapshot(Q, (resp) => {
      resp.docs.map(res => {
        const coll = collection(db, 'Local');
        const getDocument = doc(coll, res.get('idLocal'));
        const getDocs = getDoc(getDocument);
        getDocs.then(data => {

          const tec: Tecnico = {
            name: res.get('name'),
            id: res.get('id'),
            idDoc: res.id,
            idLocal: data.id,
            nameLocal: data.get('name'),

          }

          setTecnico(resp => {
            const index = resp.find(resp => resp.idDoc === tec.idDoc);
            if (index) {
              return [...resp];
            } else {

              return [...resp, tec]
            }
          })

        })

      })
    })

  }, [])


  const create = () => {
    if (name == '' && id == '') return alert('Completa todos los campos');
    const db = getFirestore(app);
    const coll = collection(db, 'Tecnicos');
    addDoc(coll, {
      id,
      name,
      timestamp: new Date().getTime(),
      idLocal: SelectLocal.idLocal
    })
  }

  //Conviene que yo declare las señales y milagros que el dios altisimo ha hecho conmigo
  return (
    <div>

      <div className="form-group d-flex mr-3 ml-3 justify-content-between">
        <input type="text" onChange={(e) => onChangeForm(e.target.value, 'id')} className='form-control col-4' placeholder='ID' />
        <input type="text" onChange={(e) => onChangeForm(e.target.value, 'name')} className='form-control col-4' placeholder='Nombre' />
        <div className="dropdown col-2">
          <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {SelectLocal?.name}
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">

            {
              Local.map(({ idLocal, name }, index) => (
                <a key={index} className="dropdown-item pointer" onClick={() => setSelectLocal({ name, idLocal })}>{name}</a>
              ))



            }


          </div>
        </div>
      </div>
      <button onClick={create} className='btn btn-outline-light ml-3 mb-5'>Guardar</button>

      <div className="table-container ml-3 mr-3">
        <table className="table table-sm table-dark table-hover ">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col th-sm">Nombre</th>




            </tr>
          </thead>


          <tbody >
            {
              (Tecnico.map((resp, index) => (

                <tr key={index} className={'pointer'} >
                  <th scope="row">{resp.id}</th>

                  <td>{resp.name}</td>
                  <td>{resp.nameLocal}</td>



                </tr>
              )))




            }
          </tbody>
        </table>

      </div>

    </div>
  )
}
