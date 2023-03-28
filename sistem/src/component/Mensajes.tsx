import React,{useContext,useEffect} from 'react'
import { context } from '../hooks/AppContext'

export const Mensajes = () => {
    const {onChange} = useContext(context)
    useEffect(() => {
        onChange('Mensajes')
    }, [])
    

  return (
    <div>Mensajes</div>
  )
}
