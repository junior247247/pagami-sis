import React, { useContext, useEffect,useState } from 'react'
import { context } from '../hooks/AppContext'
import { collection, getFirestore, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { app } from '../Firebase/conexion';
import { RowChat } from './RowChat';
interface Chat{
  idUser1:string;
  idUser2:string;
  idChat:string;
}

export const Mensajes = () => {
  const { onChange ,setChat,state,setUserChat} = useContext(context)
  const [Chats, setChats] = useState<Chat[]>([])

  const showChat=(idChat:string,idUser:string)=>{
    setChat(idChat)
    setUserChat(idUser)
    const window=document.getElementById('chat-windows')
    window!.style.display='flex'
  }
  useEffect(() => {
    onChange('Mensajes')
  }, [])
  
  useEffect(() => {
    const db=getFirestore(app)
    const coll=collection(db,'Chats')
   // alert(localStorage.getItem('idLogin'))
    
    const Q=query(coll,where('ids','array-contains-any',[localStorage.getItem('idLogin')]),orderBy('timestamp','desc'))
    onSnapshot(Q,(resp)=>{
      const data:Chat[]=resp.docs.map(res=>{
        return{
          idChat:res.id,
          idUser1:res.get('idUser1'),
          idUser2:res.get('idUser2')
        }
    
      })
      
      setChats(data)
    })
  }, [])
  


  return (
    <div>
       <div className="container-fluid mt-3">
          <div className="row">
            <div className="col-md-4">
              <div className="form-group ">
                <p className='text-white'>Buscar</p>
                <input type="text" placeholder='Buscar' className='form-control' />
              </div>
            </div>
          </div>
        </div>


      <div className='ml-3 mr-3 mt-5  table-container'>

       





        <table className="table table-dark table-hover ">
          <thead>
            <tr>
              <th className='text-mobile text-table' scope="col">Nombre</th>
              <th className='text-mobile text-table' scope="col">Direccion</th>
              <th className='text-mobile text-table' scope="col">Mensaje</th>

            </tr>
          </thead>
          <tbody >

            {
              Chats.map((item,index)=>(
                <RowChat onClick={()=>{showChat(item.idChat,item.idUser1)}} key={index} idChat={item.idChat} idUser1={item.idUser1} idUser2={item.idUser2}/>
              ))
            }

     



          </tbody>
        </table>


      </div>
    </div>
  )
}
