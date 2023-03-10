import { async } from '@firebase/util';
import { collection, getFirestore, onSnapshot, query, orderBy, where, doc, getDoc, updateDoc, addDoc, setDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { Entrada } from '../entidades/Entrada';
import { app } from '../Firebase/conexion';
import { context } from '../hooks/AppContext'
import { ParseToDate } from '../hooks/ParseDate';
import { useForm } from '../hooks/useForm';
import { ReporteEntrada } from './ReporteEntrada';

export const En_Reparacion = () => {

    const { onChange, state } = useContext(context);
    const { idLoca } = state;
    const [Data, setData] = useState<Entrada[]>([]);
    const [IsVisible, setIsVisible] = useState({ isVisible: false, id: '',idTecnico:'' });
    const [IsVisibleReport, setIsVisiblReporte] = useState({ isVisible: false, id: '' });
    const { onChange: onChangeForm, costoReparacion, costoRepuesto, description, clear } = useForm({ costoReparacion: '', costoRepuesto: '', description: '' });
    const [IVisibleUpdate, setIVisibleUpdate] = useState({ IsVisible: false, id: '' });
    const [FilterData, setFilterData] = useState<Entrada[]>([]);
    const [visibleDescrip, setVisibleDescript] = useState(false)
    const [dataSelected, setDataSelected] = useState({ observacion: '', description: '' })
    const [DescCosto, setDescCosto] = useState({total:'',cReparacion:'',cRepuesto:''})

    const listo = (id: string) => {
        const db = getFirestore(app);
        const coll = collection(db, 'Entrada');
        const document = doc(coll, id);
        updateDoc(document, {
            estado: 'Listo para entregar'
        })
        setIsVisible({ isVisible: false, id: '',idTecnico:'' })

    }

    const getDataSelect = async (id: string) => {
        setIsVisible({ isVisible: false, id: '',idTecnico:'' })
        setVisibleDescript(true);
        const db = getFirestore(app);
        const coll = collection(db, 'Entrada');
        const document = doc(coll, id);
        const get = await getDoc(document);
        setDataSelected({ observacion: get.get('observacion'), description: get.get('description') });
    }


    const getDataGener = async (id: string,idTecnico:string) => {
        setIsVisible({ isVisible: true, id: id ,idTecnico:idTecnico})
       
        const db = getFirestore(app);
        const coll = collection(db, 'Entrada');
        const document = doc(coll, id);
        const get = await getDoc(document);
        setDescCosto({ cRepuesto: get.get('costoRepuesto'), cReparacion: get.get('costoReparacion'),total:get.get('total') });
    }

    const changeModal = (id: string,idTecnico:string) => {
        setIVisibleUpdate({ IsVisible: true, id: id });
        setIsVisible({ isVisible: false, id: id ,idTecnico:idTecnico});

    }



    const addCajaDiaria = (total: number) => {
        const db = getFirestore(app);
        const coll = collection(db, 'CajaDiaria');

        addDoc(coll, {
            total: total,
            idLocal: idLoca,
            cierre: 'SIN CIERRE',
            tipo: 'VENTA',
            timestamp:new Date().getTime()
        })


    }


    const agregarCaja = async (total: number) => {
        const db = getFirestore(app);
        const coll = collection(db, 'Caja');
        const document = doc(coll, idLoca);
        const get = getDoc(document);
        const resp = await get;
        if (resp.exists()) {

            let money: number = resp.get('money');
            money += Number(total);
            updateDoc(document, {
                money
            })
        } else {
       

            setDoc(doc(db,'Caja',idLoca),{
                idLocal:idLoca,
                money:total
            })
          /*  addDoc(coll, {
                idLocal: idLoca,
                money: total
            })*/
        }
    }


    const showReport = (id: string,idTecnico:string) => {
        setIsVisible({ isVisible: false, id: id ,idTecnico:idTecnico});
        setIsVisiblReporte({ isVisible: true, id: id })
    }

    const updateData = (id: string) => {


        const db = getFirestore(app);
        const coll = collection(db, 'Entrada');
        const document = doc(coll, id);

        updateDoc(document, {
            costoReparacion: costoReparacion,
            costoRepuesto: costoRepuesto,
            total: Number(costoReparacion) + Number(costoRepuesto),
            description,

        })

        setIVisibleUpdate({ IsVisible: false, id: '' });
        clear();


    }

    const retirar = async (id: string,idTecnico?:string) => {
        const db = getFirestore(app);
        const coll = collection(db, 'Entrada');
        const document = doc(coll, id);
        const resp = await getDoc(document);
        const total = Number(resp.get('total'));
        const costoReparacion=resp.get("costoReparacion");
        agregarCaja(total);
        addCajaDiaria(total);
        updateDoc(document, {
            estado: 'Retirado'
        })




      
        const collTecDinero = collection(db, 'DineroTecnico');
        const documentTec = doc(collTecDinero, idTecnico);
        const resolve = getDoc(documentTec);
        const respTec = await resolve;
        if (respTec.exists()) {

            let money: number = respTec.get('money');
            money += Number(costoReparacion);
            updateDoc(documentTec, {
                money
            })
        } else {
       

            setDoc(doc(db,'DineroTecnico',idTecnico!),{
                idLocal:idLoca,
                money:costoReparacion
            })
    
        }

        



        setIsVisible({ isVisible: false, id: '',idTecnico:'' })

    }


    useEffect(() => {
        onChange('En reparacion')
        const db = getFirestore(app);
        const coll = collection(db, 'Entrada');
        const itemsQuery = query(coll, orderBy('timestamp', 'desc'), where('estado', '==', 'En Reparacion'),where('idLoca','==',idLoca));
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
                    costoRepuesto: resp.get('costoRepuesto'),
                    fecha: new Date(resp.get('timestamp')),
                    total: resp.get('total'),
                    equipo: resp.get('equipo'),
                    serial: resp.get('serial'),
                    estado: resp.get('estado'),
                    idTecnico:resp.get('idTecnico'),
                    noFact:resp.get('noFact')
                
                }
            })
            setData(data);
            setFilterData(data);
        })


    }, [])

    return (
        <div>

            <div className="d-flex ml-3 mt-3 mb-5 align-items-center">
                <div className="col-auto">
                    <h5 className='text-white'>Buscar</h5>
                </div>
                <div className="col-auto">
                    <input type="text" onChange={(e) => setFilterData(Data.filter(resp => resp.name.includes(e.target.value)))} placeholder='Buscar por nombre' className='form-control' />
                </div>

            </div>

            <div className="table-container ml-3 mr-3">
                <table className="table  table-dark table-hover ">
                    <thead>
                        <tr>
                            <th className='text-mobile table-desk-header' scope="col">No Fact</th>
                            <th className='text-mobile table-desk-header' scope="col">Nombre</th>
                            <th className='text-mobile table-desk-header' scope="col">DNI</th>
                            <th  className='text-mobile table-desk-header' scope="col">Equipo</th>
                            <th className='text-mobile table-desk-header' scope="col">Serial</th>
                            <th className='text-mobile table-desk-header' scope="col">Telefono</th>
                            <th className='text-mobile table-desk-header' scope="col">Fecha</th>
                            <th className='text-mobile table-desk-header' scope="col">C.Reparacion</th>
                            <th className='text-mobile table-desk-header' scope="col">C.Repuesto</th>
                            <th className='text-mobile table-desk-header' scope="col">C.Total</th>
                            <th className='text-mobile table-desk-header' scope="col">Correo</th>
                            <th className='text-mobile table-desk-header' scope="col">Retirar</th>

                        </tr>
                    </thead>
                    <tbody >
                        {
                            FilterData.map((resp, index) => (
                                <tr key={index} className={'pointer'} onDoubleClick={() => setIsVisiblReporte({ isVisible: true, id: resp.id })}>
                                    <th className='text-mobile table-desk-header' scope="row">{resp.noFact}</th>
                                    <th className='text-mobile table-desk-header' scope="row">{resp.name.toUpperCase()}</th>
                                    <td className='text-mobile table-desk-header'>{resp.identiifcation}</td>
                                    <td className='text-mobile table-desk-header'>{resp.equipo}</td>
                                    <td className='text-mobile table-desk-header'>{resp.serial}</td>
                                    <td className='text-mobile table-desk-header'>{resp.phone}</td>
                                    <td className='text-mobile table-desk-header'>{ParseToDate(resp.fecha)}</td>
                                    <td className='text-mobile table-desk-header'>{Number(resp.costoReparacion).toLocaleString('es')}</td>
                                    <td className='text-mobile table-desk-header'>{Number(resp.costoRepuesto).toLocaleString('es')}</td>
                                    <td className='text-mobile table-desk-header'>{Number(resp.total).toLocaleString('es')}</td>
                                    <td className='text-mobile table-desk-header'>{resp.correo}</td>

                                    <td><a href="#" className='btn btn-color' onClick={() => getDataGener(resp.id,resp.idTecnico!)}>Estado</a></td>
                                </tr>

                            ))
                        }
                    </tbody>
                </table>

            </div>



            {(IsVisible.isVisible) &&
                <div className="modal-container-delete" id='modal-container-delete' onClick={() => setIsVisible({ isVisible: false, id: '' ,idTecnico:''})}>
                    <div className="modal-reparacion" onClick={(e) => e.stopPropagation()}>
                        <div className="d-flex justify-content-between header-modal  align-items-center">

                            <p className='ml-2 mt-3 '>Actualizar Estado</p>
                            <button onClick={() => setIsVisible({ isVisible: false, id: '',idTecnico:'' })} className='btn bg-white f5'>&times;</button>
                        </div>
                        <hr />
                        <div className="container">
                            <div className="row justify-content-between">
                                <div className="col-auto">
                                    <p>C.Reparacion:{DescCosto.cReparacion}</p>
                                </div>
                                <div className="col-auto">
                                    <p>C.Repuesto:{DescCosto.cRepuesto}</p>
                                </div>
                                <div className="col-auto">
                                    <p>Total:{DescCosto.total}</p>
                                </div>
                            </div>
                        </div>
                        <h5 className='display-5 text-center mt-1'>Seleccione una opcion</h5>

                        <div className="d-flex justify-content-between  p-2 mt-3">
                            <button className='btn btn-danger' onClick={() => retirar(IsVisible.id,IsVisible.idTecnico)} >Retirado</button>

                            <button className='btn btn-success' onClick={() => listo(IsVisible.id)} >Listo</button>
                            <button className='btn btn-color' onClick={() => showReport(IsVisible.id,IsVisible.idTecnico)} >Reporte</button>
                            <button className='btn btn-color' onClick={() => changeModal(IsVisible.id,IsVisible.idTecnico)} >Actualizar Precio</button>
                            <button className='btn btn-color' onClick={() => getDataSelect(IsVisible.id)} >Tipo</button>
                        </div>
                    </div>

                </div>



            }








            {

                (IsVisibleReport.isVisible) &&

                <div className="modal-report-container" onClick={() => {

                    setIsVisiblReporte({ isVisible: false, id: '' })


                }}>
                    <div className="modal-report">
                        <div className="modal-report-header" onClick={(e) => e.stopPropagation()}>
                            <h6>Reporte</h6>
                            <a onClick={() => setIsVisiblReporte({ isVisible: false, id: '' })} className="btn f5">&times;</a>
                        </div>
                        <ReporteEntrada id={IsVisibleReport.id} />
                    </div>
                </div>

            }



            {
                (IVisibleUpdate.IsVisible) &&


                <div className="modal-container-delete" id='modal-container-delete' onClick={() => setIVisibleUpdate({ IsVisible: false, id: '' })}>
                    <div className="modal-reparacion" onClick={(e) => e.stopPropagation()}>
                        <div className="d-flex justify-content-between header-modal  align-items-center">

                            <p className='ml-2 mt-3 '>Actualizar Precios</p>
                            <button onClick={() => setIVisibleUpdate({ IsVisible: false, id: '' })} className='btn bg-white f5'>&times;</button>
                        </div>
                        <hr />

                        <div className="form-group">
                            <input type="text" onChange={(e) => onChangeForm(e.target.value, 'description')} placeholder='Description' className='form-control' />
                            <h4 className='text-color text-center mt-2'>Precios</h4>
                            <div className="container mt-2">
                                <div className="row">
                                    <div className="col">
                                        <input type="text" onChange={(e) => onChangeForm(e.target.value, 'costoReparacion')} placeholder='Costo Reparacion' className='form-control' />
                                    </div>
                                    <div className="col">
                                        <input type="text" onChange={(e) => onChangeForm(e.target.value, 'costoRepuesto')} placeholder='Costo Repuestos' className='form-control' />
                                    </div>

                                </div>
                            </div>
                            <div className="container mt-4">
                                <div className="row justify-content-between">
                                    <div className="col-auto">
                                        <h4 className='mt-2 ml-2'>Total:{Number(Number(costoReparacion) + Number(costoRepuesto)).toLocaleString('es')}</h4>
                                    </div>
                                    <div className="col-auto">
                                        <button className='btn btn-color' onClick={() => updateData(IVisibleUpdate.id)} >Guardar</button>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>


            }



            {
                (visibleDescrip) &&



                <div className="modal-container-delete" id='modal-container-delete' onClick={() => setVisibleDescript(false)}>
                    <div className="modal-reparacion" onClick={(e) => e.stopPropagation()}>
                        <div className="d-flex justify-content-between header-modal  align-items-center">

                            <p className='ml-2 mt-3 '>Actualizar Precios</p>
                            <button onClick={() => setVisibleDescript(false)} className='btn bg-white f5'>&times;</button>
                        </div>
                        <hr />

                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <p><strong>Description: </strong>{dataSelected.description}</p>
                                    <p><strong>Observacion: </strong>{dataSelected.observacion}</p>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            }




        </div>

    )
}
