import React,{useContext} from 'react'
import { context } from '../hooks/AppContext'
import { Login } from './Login';
import { MainComponent } from './MainComponent';


export const Stack = () => {
    const {state} = useContext(context);

  return (
  (!localStorage.getItem('idLogin'))?<Login/> : <MainComponent/>
  )
}
