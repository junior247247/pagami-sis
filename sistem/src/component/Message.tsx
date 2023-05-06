import React from 'react'

interface Prop{
    location:'left'|'right',
    messsage:string
}

export const Message = ({location,messsage}:Prop) => {
  return (
    <p className={'message '+ location}>{messsage}</p>
  )
}
