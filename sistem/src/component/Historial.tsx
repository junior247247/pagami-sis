import { getFirestore, collection, onSnapshot, query, orderBy, where,doc,getDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { Caracteristicas, Entrada } from '../entidades/Entrada';
import { app } from '../Firebase/conexion';
import { context } from '../hooks/AppContext'
import { ReporteEntrada } from './ReporteEntrada';

interface IsView{
  id:string;
  isVisible:boolean
}

const Init:Caracteristicas={
   
  encendido:false,
  audio:false,
  pantalla:false,
  microfono:false,
  senal:false,
  wifi:false,
  camara1:false,
  camara2:false,
  carga:false,
  auricular:false,
  altavoz:false,
  sensores:false,
  bateria:false,
  flash:false,
  botones:false,
  software:false,
  recalentamiento:false,
  malware:false,
  piezas:false,
  reportado:false,
  costoReparacion:0,
  costoRepuesto:0,
  total:0,
  equipo:'',
  serial:'',
  cliente:'',
  fecha:new Date(212311231),
  description:"",
  observacion:''
  

}

export const Historial = () => {
  const { onChange } = useContext(context);
  const [Data, setData] = useState<Entrada[]>([]);
  const [CaracteristicasState, setCaracteristicas] = useState<Caracteristicas>(Init);

  const [Isvisible, setIsvisible] = useState<IsView>({id:'',isVisible:false})


  const getData= async (id:string)=>{

    document.getElementById('id-rep')!.style.display = 'flex';
    const db = getFirestore(app);
    const coll = collection(db, 'Entrada');
    const documents= doc(coll,id);
    const resp= await getDoc(documents);
    

  

    const Crs:Caracteristicas={
      encendido:resp.get('encendido'),
      audio:resp.get('audio'),
      pantalla:resp.get('pantalla'),
      microfono:resp.get('microfono'),
      senal:resp.get('senal'),
      wifi:resp.get('wifi'),
      camara1:resp.get('camara1'),
      camara2:resp.get('camara2'),
      carga:resp.get('carga'),
      auricular:resp.get('auricular'),
      altavoz:resp.get('altavoz'),
      sensores:resp.get('sensores'),
      bateria:resp.get('bateria'),
      flash:resp.get('flash'),
      botones:resp.get('botones'),
      software:resp.get('software'),
      recalentamiento:resp.get('recalentamiento'),
      malware:resp.get('malware'),
      piezas:resp.get('piezas'),
      reportado:resp.get('reportado'),
      costoReparacion:resp.get('costoReparacion'),
      costoRepuesto:resp.get('costoRepuesto'),
      total:resp.get('total'),
      equipo:resp.get('equipo'),
      serial:resp.get('serial'),
      cliente:resp.get('name'),
      fecha:new Date(resp.get('timestamp')),
      observacion:resp.get('observacion'),
      description:resp.get('description')
      
    }

    setCaracteristicas(Crs);

  }

  useEffect(() => {
    onChange('Historial')
    const db = getFirestore(app);
    const coll = collection(db, 'Entrada');
    const itemsQuery = query(coll, orderBy('timestamp', 'desc'), where('estado', '==', 'Retirado'));
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
          equipo:resp.get('equipo'),
          serial:resp.get('serial'),
          estado:resp.get('estado')
        }
      })
    
      setData(data);
    })


  }, [])

  return (
    <div>

      <div className="d-flex  align-items-center mt-3 mb-3">
        <div className="col-auto">
          <h4 className='text-white'>Buscar</h4>
        </div>
        <div className="col-6">
          <input type="text" className='form-control' />
        </div>

        <div className="d-flex justify-content-end align-items-center">
          <div className="col-auto">
            <p className='text-white pt-3'>Desde</p>
          </div>
          <input type="date" className='form-control' name="" id="" />

          <div className="col-auto align-self-center  ">
            <p className='text-white pt-3'>Hasta</p>
          </div>
          <input type="date" className='form-control' name="" id="" />
        </div>


      </div>

      <div className="table-container ml-3 mr-3">
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
              <th scope="col">Reporte</th>

            </tr>
          </thead>
          <tbody >
            {
              Data.map((resp, index) => (
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
                  <td><a className='btn btn-success' onClick={()=>setIsvisible({id:resp.id,isVisible:true})} >Imprimir</a></td>
                </tr>

              ))
            }
          </tbody>
        </table>

      </div>

  

  {

    (Isvisible.isVisible) &&
    
    <div className="modal-report-container"   onClick={() => {

        setIsvisible({isVisible:false,id:''})
 
 
       }}>
         <div className="modal-report">
           <div className="modal-report-header" onClick={(e) => e.stopPropagation()}>
             <h6>Reporte</h6>
             <a onClick={() =>  setIsvisible({isVisible:false,id:''})} className="btn f5">&times;</a>
           </div>
           <ReporteEntrada id={Isvisible.id}  />
         </div>
       </div>

  }
    


      


    </div>
  )
}
