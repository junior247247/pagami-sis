import { collection, getFirestore, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { app } from '../Firebase/conexion';
import { context } from '../hooks/AppContext'
import { ParseToDate } from '../hooks/ParseDate';
interface CajaDiaria {
  monto: string;
  fecha: string;
}

export const HistorialIngreso = () => {

  const { onChange } = useContext(context);

  const [Ingresos, setIngresos] = useState<CajaDiaria[]>([])
  useEffect(() => {
    onChange('Historial Ingreso')
  }, [])

  useEffect(() => {

    const db = getFirestore(app);
    const coll = collection(db, 'CajaDiaria')
    const Q = query(coll, orderBy('timestamp', 'desc'));
    onSnapshot(Q, (resp) => {
      const data: CajaDiaria[] = resp.docs.map(res => {
        return {
          monto: res.get('total'),
          fecha: res.get('timestamp')
        }
      })

      setIngresos(data)

    })


  }, [])


  return (
    <div className='container-fluid mt-3'>
      <div className="row">
        <div className="col">
          <h1 className='text-color'>Total:{Ingresos.reduce((total,monto)=>total=Number(monto.monto),0)}</h1>
        </div>
      </div>
      <div className="row">
        <div className="col">

        <div className="table-container ml-3 mr-3">
        <table className="table  table-dark table-hover ">
          <thead>
            <tr>
              <th scope="col th-sm">Fecha</th>
              <th scope="col th-sm">Monto</th>


            </tr>
          </thead>
          <tbody >
            {
              Ingresos.map((resp, index) => (

                <tr key={index} >
                  <th scope="row">{ParseToDate(new Date(Number(resp.fecha)))}</th>
                  <th scope="row">{Number(resp.monto).toLocaleString('es')}</th>


                </tr>

              ))




            }
          </tbody>
        </table>

      </div>

        </div>
      </div>



    </div>
  )
}
