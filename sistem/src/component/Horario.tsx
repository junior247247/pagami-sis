import React, { useContext,useEffect } from 'react'
import { context } from '../hooks/AppContext'

export const Horario = () => {

    const { onChange } = useContext(context);

    useEffect(() => {
        onChange('Horario')
    }, [])
    
    return (
        <div>Horario</div>
    )
}
