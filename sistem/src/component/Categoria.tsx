import { addDoc, collection, getFirestore, onSnapshot, orderBy, query } from 'firebase/firestore'
import React,{useContext,useEffect,useState} from 'react'
import { app } from '../Firebase/conexion'
import { context } from '../hooks/AppContext'
import { ParseToDate } from '../hooks/ParseDate'
import { useForm } from '../hooks/useForm'

interface Categoria{
    name:string;
    id:string;
    fecha:string;
}
export const Categoria = () => {


    const {onChange} = useContext(context)
    const [cagoria, setCagoria] = useState<Categoria[]>([])
   const {name,onChange:onChangeForm,clear} =  useForm({name:''})
    useEffect(() => {
      onChange('Categoria')
    }, [])

    useEffect(() => {
        const db=getFirestore(app)
        const coll=collection(db,'Categoria')
        const Q=query(coll,orderBy('timestamp','desc'))
        onSnapshot(Q,(resp)=>{
            const data:Categoria[]=resp.docs.map(res=>{
                return{
                    id:res.id,
                    name:res.get('name'),
                    fecha:res.get('timestamp')
                }
            })
            setCagoria(data)
        })

    }, [])
    

    let add=()=>{
        const db=getFirestore(app)
        const coll=collection(db,'Categoria')
        addDoc(coll,{name,timestamp:new Date().getTime()})
        clear()
    }
    
  return (
    <div className='container'>
        <div className="row justify-content-between mt-2">
            <div className="col-6">
                <form>
                    <label className='text-color'>Categoria</label>
                    <input value={name} onChange={(e)=>onChangeForm(e.target.value,'name')} type="text" placeholder='Nombre Categoria' className='form-control'  />
                </form>
            </div>

            <div className="col-auto align-self-end">
                <button className='btn btn-outline-light bg-main' onClick={add}>Guardar</button>
            </div>
        </div>

        <div className="table-container mt-3">
        <table className='table  table-dark '>
            <thead >
                <tr>
                    <th className='text-mobile text-table table-desk-header' colSpan={2} >FECHA</th>
                    <th className='text-mobile text-table table-desk-header' colSpan={2} >CATEGORIA</th>
             
                </tr>

        

            </thead>


            <tbody>
                    {
                        cagoria.map((item,index)=>(

                            <tr>
                            <td colSpan={2}  className='text-mobile table-desk-header'>{ParseToDate(new Date(item.fecha))}</td>
                            <td colSpan={2}>{item.name.toUpperCase()}</td>
                           <td ><a className='btn btn-primary' href="#">Editar</a></td>
                           <td><a className='btn btn-danger' href="#">Eliminar</a></td>
                       </tr>
                        ))    

                    }

                

                </tbody>
        </table>
        </div>

   

    </div>
  )
}
