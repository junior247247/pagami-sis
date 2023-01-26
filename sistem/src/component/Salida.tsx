import React, { useEffect, useContext, useState } from 'react'
import ReactDOM from 'react-dom'
import { context } from '../hooks/AppContext'
import ReactPDF, {
  Document,
  Page,
  View,
  Text,
  Link,
  Font,
  StyleSheet,
  PDFViewer
} from '@react-pdf/renderer';
import { Reporte } from './Reporte';
import { getFirestore, collection, orderBy, where, onSnapshot, query, doc, updateDoc } from 'firebase/firestore';
import { app } from '../Firebase/conexion';
import { Entrada } from '../entidades/Entrada';






export const Salida = () => {

  const { onChange } = useContext(context);
  const [Data, setData] = useState<Entrada[]>([]);
  const [FilterData, setFilterData] = useState<Entrada[]>([]);
  const [IsVisible, setIsVisible] = useState({ id: '', isVisible: false })
  //Listo para entregar

  const retirar = (id: string) => {
    const db = getFirestore(app);
    const coll = collection(db, 'Entrada');
    const document = doc(coll, id);
    updateDoc(document, {
      estado: 'Retirado'
    })
    setIsVisible({ isVisible: false, id: '' })

  }

  useEffect(() => {
    onChange('Listo para entregar');
    const db = getFirestore(app);
    const coll = collection(db, 'Entrada');
    const itemsQuery = query(coll, orderBy('timestamp', 'desc'), where('estado', '==', 'Listo para entregar'));
    onSnapshot(itemsQuery, (snap) => {
      const data: Entrada[] = snap.docs.map(resp => {
        return {
          id: resp.id,
          name: resp.get('name'),
          phone: resp.get('telefono'),
          correo: resp.get('correo'),
          identiifcation: resp.get('identification'),
          observacion: resp.get('observacion'),
          costoReparacion: resp.get('costoReparacion'),
          costoRepuesto: resp.get('csotoRepuesto'),
          fecha: new Date(resp.get('timestamp')),
          total: resp.get('total'),
          equipo: resp.get('equipo'),
          serial: resp.get('serial'),
          estado: resp.get('estado')
        }
      })

      setData(data);
      setFilterData(data);
    })

  }, [])

  return (
    <div >

      <div className="d-flex ml-3  mt-3 mb-5 align-items-center">
        <div className="col-auto">
          <h5 className='text-white'>Buscar</h5>
        </div>
        <div className="col-auto">
          <input type="text" onChange={(e)=>setFilterData(Data.filter(resp=>resp.name.includes(e.target.value)))} className='form-control' />
        </div>

      </div>





      <div className="table-container  ml-3 mr-3">
        <table className="table  table-dark table-hover ">
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Identificacion</th>
              <th scope="col">Equipo</th>
              <th scope="col">Serial</th>

              <th scope="col">Telefono</th>
              <th scope="col">Fecha</th>
              <th scope="col">Reparacion</th>
              <th scope="col">Repuesto</th>
              <th scope="col">Total</th>
              <th scope="col">Correo</th>
              <th scope="col">Estado</th>

            </tr>
          </thead>
          <tbody >
            {
              FilterData.map((resp, index) => (
                <tr key={index}>
                  <th scope="row">{resp.name}</th>
                  <td>{resp.identiifcation}</td>
                  <td>{resp.equipo}</td>
                  <td>{resp.serial}</td>
                  <td>{resp.phone}</td>
                  <td>{resp.fecha?.getDate() + '-' + resp.fecha?.getMonth() + '-' + resp.fecha?.getFullYear()}</td>
                  <td>{resp.costoReparacion}</td>
                  <td>{resp.costoRepuesto}</td>
                  <td>{resp.total}</td>
                  <td>{resp.correo}</td>
                  <td><span className="label-status bg-success" onClick={() => setIsVisible({ id: resp.id, isVisible: true })}>{resp.estado}</span></td>
                </tr>

              ))
            }
          </tbody>
        </table>

      </div>

      {
        (IsVisible.isVisible) &&

        <div className="modal-container-delete" id='modal-container-delete' onClick={() => setIsVisible({ isVisible: false, id: '' })}>

          <div className="modal-delete" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between header-modal  align-items-center">
              <p className='ml-2 mt-3 '>Actualizar Estado</p>
              <button onClick={() => setIsVisible({ isVisible: false, id: '' })} className='btn bg-white f5'>&times;</button>
            </div>
            <hr />
            <h5 className='display-5 text-center mt-1'>Seleccione una opcion</h5>

            <div className="d-flex justify-content-around   mt-5">
              <button className='btn btn-color pl-5 pr-5' onClick={() => retirar(IsVisible.id)} >Si</button>

              <button className='btn btn-color pl-5 pr-5' onClick={() => setIsVisible({ id: '', isVisible: false })} >No</button>
            </div>
          </div>

        </div>

      }



    </div>









  )
}


