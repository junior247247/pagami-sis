import { collection, doc, getDoc, getFirestore, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React,{useEffect,useState} from 'react'
import { app } from '../Firebase/conexion';


interface Props{
    idChat:string;
    idUser1:string;
    idUser2:string;
    onClick:()=>void;
}
export const RowChat = ({idChat,idUser1,idUser2,onClick}:Props) => {
    const [Name, setName] = useState('')
    const [Adress, setAdress] = useState('')
    const [Count, setCount] = useState(0)
    const [lastMessage, setlastMessage] = useState('')


    useEffect(() => {
        const db=getFirestore(app)
        const coll=collection(db,'Messages')
        const snap= query(coll,where('idChat','==',idChat),orderBy('timestamp','desc'),limit(1))
        onSnapshot(snap,(resp=>{
            setlastMessage(resp.docs[0].get('message'))
        }))
    }, [])
    

    useEffect(() => {
        const db=getFirestore(app)
        const coll=collection(db,'Messages')

        const snap=query(coll,where('idChat','==',idChat),where('view','==',false))
        onSnapshot(snap,(resp)=>{
            setCount(resp.size)
        })

    }, [])

    useEffect(() => {
        const db=getFirestore(app)
        const coll=collection(db,'Users')
        const document=doc(coll,idUser1)
        getDoc(document).then(resp=>{
            setName(resp.get('name'))
            setAdress(resp.get('adress'))
        })
    }, [])
    
  return (
    <tr onClick={onClick} className='pointer'>
    <td className='text-mobile text-table' scope="row">{Name}</td>

    <td className='text-mobile text-table' scope="row">{Adress}</td>
    <td className='text-mobile text-table' scope="row"> {(Count)&& <span className='count pointer'>{Count} new</span>} {lastMessage.substring(0,10)+'...'} </td>

  </tr>
  )
}
