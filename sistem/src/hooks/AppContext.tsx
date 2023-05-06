import { type } from '@testing-library/user-event/dist/type';
import React, { createContext,useReducer ,useEffect,useState} from 'react'
import {signInWithEmailAndPassword,getAuth, signOut,onAuthStateChanged, User } from 'firebase/auth'

import { app } from '../Firebase/conexion';

export interface State{
    state:string,
    idLoca:string;
    close:boolean,
    stateLogin:'login'|'no-fondo'|'no-authenticate',
    idChat:''|string;
    idUser:''|string;
}

const initState:State={
    state:'Dashboard',
    idLoca:'',
    close:false,
    stateLogin:'no-authenticate',
    idChat:'',
    idUser:''
}

interface Props{
    state:State;
    onChange:(state:string)=>void;
    login:(idLocal:string)=>void;
    signOut:()=>void;
    close:(close:boolean)=>void;
    setChat:(idChat:string)=>void;
    setUserChat:(idUser:string)=>void;
  
}
export const context=createContext({}as Props);

type action={type:'update',state:string}|{type:'login',idLocal:string}|{type:'signOut'}|{type:'close',close:boolean}|{type:'chat',idChat:string}|
{type:'idUser',idUser:string}

const Reducer=(state:State,action:action):State=>{

    switch (action.type) {
        case 'update':
            return {
                ...state,
                state:action.state
            }
        case 'login':
            return{
                ...state,
                idLoca:action.idLocal,
                stateLogin:'login'
             
            }

            case 'signOut':
                return{
                ...state,
                idLoca:'',
                stateLogin:'no-authenticate'
            }
            
            case 'close':
                return{
                    ...state,
                    close:action.close
                }

            case 'chat':
                return{
                    ...state,
                    idChat:action.idChat
                }
            case 'idUser':
                return{
                    ...state,
                    idUser:action.idUser
                }
        default:
            return state;
    }
}
//const auth=getAuth(app);


export const AppContext = ({children}:any) => {

    const [state, dispatch] = useReducer(Reducer,initState);
   // const [CurrentUser, setCurrentUser] = useState<User>();

   const setUserChat=(id:string)=>dispatch({type:'idUser',idUser:id})
   const setChat=(id:string)=>{
        dispatch({type:'chat',idChat:id})
   }

    useEffect(() => {
        const auth=getAuth(app);
        onAuthStateChanged(auth,(user)=>{
            if(user?.uid!=null){
                dispatch({type:'login',idLocal:user.uid})
            }
        })
    }, [])
    

   
    
    const close=(close:boolean)=>{
       // dispatch({type:'close',close});
        localStorage.clear()
    }
    const login=(idLogin:string)=>{
            localStorage.setItem('idLogin',idLogin)
       // dispatch({type:'login',idLocal:idLogin});
        //console.log(idLogin);
    }
    const onChange=(state:string)=>{
        dispatch({type:'update',state});
    }

    const signOut=()=>{
        localStorage.clear()
        const auth=getAuth(app);
        auth.signOut();
        dispatch({type:'signOut'})
    }
    
  return (
   <context.Provider 
   value={{
    state,
    onChange,
    signOut,
    close,
    login,
    setChat,
    setUserChat
   }}
   >
        {children}
   </context.Provider>
  )
}
