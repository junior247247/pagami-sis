import React,{useState} from 'react'

export const useForm = <T extends object>(form:T) => {

    const [state, setState] = useState(form);
    const onChange=(value:any,fiels:keyof T)=>{
        setState({
            ...state,
            [fiels]:value
        })
    }

    const clear=()=>{
      setState(form);
    }

  return {
    onChange,
    ...state,
    clear
  }
}
