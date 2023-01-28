import { addDoc, getFirestore, collection, onSnapshot, query, orderBy, getDoc, doc, where, updateDoc } from 'firebase/firestore';
import React, { useEffect, useContext, useState } from 'react'
import { app } from '../Firebase/conexion';
import { context } from '../hooks/AppContext'
import { useForm } from '../hooks/useForm';
import { async } from '@firebase/util';
interface Tecnico {
  name: string,
  id: string,
  idDoc: string,
  idLocal: string;
  nameLocal?: string;
  total:number;

}
interface Local {
  name: string;
  idLocal: string;

}

export const Tecnicos = () => {

  const { onChange } = useContext(context);
  const { onChange: onChangeForm, name, id } = useForm({ id: '', name: '' });
  const [Local, setLocal] = useState<Local[]>([])
  const [SelectLocal, setSelectLocal] = useState<Local>({ name: 'Selecciona', idLocal: '' });

  const [IsVisible, setIsVisible] = useState({idTecnico:'',IsVisible:false});
  const [Tecnico, setTecnico] = useState<Tecnico[]>([]);

  useEffect(() => {
    onChange('Técnicos')
  }, [])

  useEffect(() => {
    
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



  const sacarFondo= async(id:string)=>{
    const db = getFirestore(app);
    const collTecDinero = collection(db, 'DineroTecnico');
    const documentTec = doc(collTecDinero, id);
    //const resolve = await getDoc(documentTec);
    updateDoc(documentTec,{
      money:0
    })
    setIsVisible({IsVisible:false,idTecnico:''})

  }





  useEffect(() => {
    const db = getFirestore(app);
    const coll = collection(db, 'Tecnicos');
    const Q = query(coll, orderBy('timestamp', 'desc'));
    onSnapshot(Q, (resp) => {
      resp.docs.map(res => {
        const coll = collection(db, 'Local');
        const getDocument = doc(coll, res.get('idLocal'));
        const getDocs = getDoc(getDocument);

        const collTecDinero = collection(db, 'DineroTecnico');
        const documentTec = doc(collTecDinero, res.get('id'));
        const resolve = getDoc(documentTec);
           resolve.then(resp=>{
            if(resp.exists()){
             
              getDocs.then(data => {

                const tec: Tecnico = {
                  name: res.get('name'),
                  id: res.get('id'),
                  idDoc: res.id,
                  idLocal: data.id,
                  nameLocal: data.get('name'),
                  total:resp.get('money')
      
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



            }else{

              getDocs.then(data => {

                const tec: Tecnico = {
                  name: res.get('name'),
                  id: res.get('id'),
                  idDoc: res.id,
                  idLocal: data.id,
                  nameLocal: data.get('name'),
                  total:0
      
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



            }
     

       

          



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
      <button onClick={create} className='btn col-auto btn-outline-light ml-3 mb-3'>Guardar</button>
  
        <div className="container-fluid">
          <div className="row">
              <div className="form-group col-4">
                 
                  <input type="text" placeholder='Buscar Tecnico' className='form-control'/>
              </div>
          </div>
        </div>
      <div className="table-container ml-3 mr-3">
        <table className="table table-sm table-dark table-hover ">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col th-sm">NOMBRE</th>
              <th scope="col th-sm">LOCAL</th>
              <th scope="col th-sm">$ REPARACION</th>
              <th scope="col th-sm">$ TOTAL</th>
            




            </tr>
          </thead>


          <tbody >
            {
              (Tecnico.map((resp, index) => (

                <tr key={index} className={'pointer'}  onDoubleClick={()=>setIsVisible({IsVisible:true,idTecnico:resp.idDoc})}>
                  <th scope="row">{resp.id}</th>

                  <td>{resp.name}</td>
                  <td>{resp.nameLocal}</td>
                  <td>{resp.total>0 ? Number(resp.total / 2).toLocaleString('es') :0 }</td>
                  <td>{resp.total>0 ? Number(resp.total).toLocaleString('es') :0 }</td>



                </tr>
              )))




            }
          </tbody>
        </table>

      </div>



      {
        (IsVisible.IsVisible) && 

        <div
        className="modal-report-container"
        id="modal-report-container"
        onClick={() => {
          setIsVisible({IsVisible:false,idTecnico:''})
        }}
      >
        <div className="modal-stand" onClick={(e)=>e.stopPropagation()}>
          <div className="d-flex  justify-content-between pb-5">
              <h5 className='ml-3 unseleted'>Retirar Fondo</h5>
              <button onClick={()=>  setIsVisible({IsVisible:false,idTecnico:''})} className='btn '>&times;</button>
          </div>

            <button className='btn btn-color m-auto' onClick={()=>sacarFondo(IsVisible.idTecnico)}>GUARDAR</button>
        </div>
      </div>
      }

 



    </div>
  )
}
