import React, { useEffect, useContext, useState, useRef } from 'react'
import { context } from '../hooks/AppContext';
import { collection, query, orderBy, getFirestore, onSnapshot, addDoc, where, updateDoc, getDoc, QuerySnapshot, getDocs, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { Producto } from '../entidades/Producto';
import { app } from '../Firebase/conexion';
import { Console } from 'console';
import { async } from '@firebase/util';
import { Reporte } from './Reporte';

interface Item {
    idProducto: string;
    cantidad: number;
}
export interface Detalle {
    id: string;
    cant: number;
    description: string;
    total: string;
    precio: string;
    idProducto: string;
}
let id = '';
//let dt:Detalle;
interface Delete {
    isVisible: boolean,
    id: string;
    idProducto: string;
}

export const Ventas = () => {

    const { onChange,state } = useContext(context);
    const [producto, setProducto] = useState<Producto[]>([]);
    const {idLoca} =state;

    const [filterProducto, setfilterProducto] = useState<Producto[]>([]);
    const [IsVisible, setIsVisible] = useState<boolean>(false);

    const idDoc = useRef<string | undefined>('');
    const [Detalle, setDetalle] = useState<Detalle[]>([]);
    const [idVenta, setIdVenta] = useState('');
    const [Random, setRandom] = useState(Math.random());
    const [ClientName, setClientName] = useState('');
    const [Delete, setDelete] = useState<Delete>({ isVisible: false, id: '', idProducto: '' })


    const addCajaDiaria = () => {
        const db = getFirestore(app);
        const coll = collection(db, 'CajaDiaria');
        const total = Detalle.reduce((total, prod) => total + Number(prod.total), 0);
        addDoc(coll, {
            total: total,
            idLocal: idLoca,
            cierre: 'SIN CIERRE',
            tipo: 'VENTA'
        })


    }


    const showModal = (e: any) => {
        e.stopPropagation()
        const modalContainer = document.getElementById('modal-container');
        modalContainer!.style.display = 'flex';
    }
    const buscar = (filtro: string) => {
        setfilterProducto(producto.filter(rep => rep.description.includes(filtro)));
    }

    const agregarCaja= async()=>{
        const db=getFirestore(app);
        const coll=collection(db,'Caja');
        const document = doc(coll, idLoca);

        const get = getDoc(document);
        const resp= await get;
        if(resp.exists()){
            const total = Detalle.reduce((total, prod) => total + Number(prod.total), 0);
            let money:number=resp.get('money');
            money+=Number(total);
            updateDoc(document,{
               money     
            })
        }else{
            const total = Detalle.reduce((total, prod) => total + Number(prod.total), 0);
            setDoc(doc(db,'Caja',idLoca),{
                idLocal:idLoca,
                money:total
            })
         
        }
    }

    const closeModal = () => {
        const modalContainer = document.getElementById('modal-container');
        modalContainer!.style.display = 'none';
    }
    const cerrarVenta = () => {

        if (Detalle.length == 0) return alert('Debes agregar productos a la venta');
        const db = getFirestore(app);
        const coll = collection(db, 'ventaFinal');
        const total = Detalle.reduce((total, prod) => total + Number(prod.total), 0);
        addDoc(coll, {
            total: total,
            idVenta: idVenta,
            subTotal: total,
            idLocal:idLoca,
            cierre:'SIN CIERRE'

        })
        addCajaDiaria();
        setIsVisible(false);
     
        agregarCaja();
        setIdVenta('');
        setDetalle([]);
       

    }
    const aumentarStock = async (idProducto: string) => {

        const ojb: Detalle = Detalle.find(resp => resp.idProducto == idProducto)!;

        const db = getFirestore(app);
        const coll = collection(db, 'Producto');
        const document = doc(coll, idProducto);
        const allDoc = await getDoc(document);
        let existencia: number = allDoc.get('existencia');
        existencia += ojb!.cant;
        updateDoc(document, {
            existencia: existencia
        })

    }

    const deleteItem = async (id: string) => {
        await aumentarStock(Delete.idProducto);
        const db = getFirestore(app);
        const coll = collection(db, 'detalleVenta');
        const document = doc(coll, id);
        deleteDoc(document);
        setDetalle(resp => resp.filter(item => item.id !== id));
        setDelete({ isVisible: false, id: '', idProducto: '' })



    }



    const disminuirStock = async (idProducto: string, cant: number) => {
        const db = getFirestore(app);
        const coll = collection(db, 'Producto');
        const document = doc(coll, idProducto);
        const allDoc = await getDoc(document);
        let existencia: number = allDoc.get('existencia');
        existencia -= cant;
        updateDoc(document, {
            existencia: existencia
        })




    }

    const aumentar = async (idProducto: string, cant: number, precio: number) => {
        const db = getFirestore(app);
        const q = query(collection(db, "detalleVenta"), where("idVenta", "==", id), where('idProducto', '==', idProducto));
        const getDocuments = getDocs(q);

        (await getDocuments).docs.map(async (resp) => {
            if (!resp.exists()) return;
            const collDetalle = collection(db, 'detalleVenta')
            const documentDetalle = doc(collDetalle, resp.id);
            const Get = await getDoc(documentDetalle);
            let cantidadIngresada: number = Get.get('cant');


            cantidadIngresada = cantidadIngresada + cant;
            let total = precio * cantidadIngresada;

            updateDoc(documentDetalle, {
                cant: cantidadIngresada,
                total: total
            })

        })

    }

    const insertDetalleVenta = async () => {

        const proSelect: Producto[] = filterProducto.filter(resp => resp.isSelected == true);
        const isSelectOneItem = filterProducto.some(resp => resp.isSelected === true);
        if (!isSelectOneItem) return alert('Debes seleccionar un producto');

        // console.log(proSelect)

        const db = getFirestore(app);


        const coll = collection(db, 'detalleVenta');




        if (id === '') {
            const collVenta = collection(db, 'venta');
            const doc = await addDoc(collVenta, {
                timestamp: new Date().getTime()
            })

            id = doc.id;
            setIdVenta(doc.id);
            idDoc.current = doc.id;

        } else {
            setIdVenta(id);
        }

        proSelect.map(resp => {
            // const detallesVenta = query(coll, where('idVenta', '==', id), where('idProducto', '==', resp.id));

            const q = query(collection(db, "detalleVenta"), where("idVenta", "==", id), where('idProducto', '==', resp.id));
            setRandom(Math.random())
            const snap = getDocs(q);
            snap.then(data => {

                if (data.size > 0) {

                    data.docs.map(res => {
                        const document = doc(coll, res.id);
                        updateDoc(document, {
                            idProducto: resp.id,
                            idVenta: id,

                            timestamp: new Date().getTime()
                        })
                    })
                    aumentar(resp.id, resp.cant!, Number(resp.precio));

                } else {

                    addDoc(coll, {
                        idProducto: resp.id,
                        cant: resp.cant,
                        idVenta: id,
                        total: Number(resp.precio) * Number(resp.cant),
                        timestamp: new Date().getTime()
                    })

                }

                disminuirStock(resp.id, Number(resp.cant))

            })

        })
        closeModal();
        UnSelect();
    }



    const more = (id: string, cant?: number) => {
        setfilterProducto([...filterProducto].map(res => {
            if (res.id == id) {

                return {
                    ...res,
                    cant: 0 + cant!
                }

            } else {
                return {
                    ...res,

                }
            }
        }))

    }

    const UnSelect = () => {
        setfilterProducto([...filterProducto].map(resp => {
            return {
                ...resp,
                isSelected: false,
                cant: 1
            }
        }));
    }

    const Select = (id: string, cant?: number) => {

        setfilterProducto([...filterProducto].map(resp => {
            if (resp.id === id) {
                return {
                    ...resp,
                    isSelected: (resp.isSelected) ? false : true
                }
            } else {
                return resp;
            }
        }));
    }


    useEffect(() => {
        const as = Detalle.reduce((total, obj) => total + Number(obj.total), 0);
        const db = getFirestore(app);
        const coll = collection(db, 'Producto');
        const items = query(coll, orderBy('timestamp', 'desc'));
        onSnapshot(items, (resp) => {
            const prod: Producto[] = resp.docs.map(data => {
                return {
                    id: data.id,
                    description: data.get('description'),
                    existencia: data.get('existencia'),
                    codigo: data.get('codigo'),
                    precio: data.get('precio'),
                    isSelected: false,
                    cant: 1
                }

            })
            setProducto(prod);
            setfilterProducto(prod);
        })


    }, [])


    useEffect(() => {
        const db = getFirestore(app);
        const coll = collection(db, 'detalleVenta');
        const items = query(coll, where('idVenta', '==', idVenta), orderBy('timestamp', 'desc'));
        onSnapshot(items, (resp) => {
            resp.docs.map((data) => {

                const document = doc(db, 'Producto', data.get('idProducto'));
                const get = getDoc(document);
                get.then(prod => {
                    const del: Detalle = {
                        precio: prod.get('precio'),
                        cant: data.get('cant'),
                        total: data.get('total'),
                        id: data.id,
                        description: prod.get('description'),
                        idProducto: data.get('idProducto')
                    }
                    setDetalle(resp => {
                        const index = resp.find(find => find.id === data.id);
                        if (index) {
                            return [...resp].map(res => {
                                if (res.id === data.id) {
                                    if (del.cant > res.cant) {
                                        return {
                                            ...res,
                                            cant: del.cant,
                                            total: del.total
                                        }

                                    } else {
                                        return { ...res }
                                    }


                                } else {
                                    return { ...res }
                                }
                            })
                        } else {
                            return [del, ...resp];
                        }
                    })
                })
            })
        })

    }, [Random])






    useEffect(() => {
        onChange('Venta');
    }, [])
    return (
        <div >
            <div className=" ml-3 mr-3 ">


                <div className="row justify-content-between bg-main   align-items-center">
                    <div className="col-6 ml-3 mt-2">
                        <form className='form-group'>

                            <input type="text" value={ClientName} onChange={(e) => setClientName(e.target.value)} placeholder='Nombre de cliente' className='form-control' />
                        </form>
                    </div>
                    <div className="col-auto mr-3 ">
                        <button className='btn btn-outline-light' onClick={showModal}>nueva</button>
                    </div>
                </div>
            </div>

            <div className='ml-3 mr-3 mt-5 bg-main-2 table-container'>







                <table className="table table-dark table-hover ">
                    <thead>
                        <tr>
                            <th scope="col">Description</th>
                            <th scope="col">Precio</th>
                            <th scope="col">Cantidad</th>
                            <th scope="col">Total</th>

                            <th scope="col">Eliminar</th>
                        </tr>
                    </thead>
                    <tbody >

                        {
                            Detalle.map((resp, index) => (

                                <tr key={index}>
                                    <th scope="row">{resp.description}</th>
                                    <td>{resp.precio}</td>
                                    <td>{resp.cant}</td>
                                    <td>{resp.total}</td>

                                    <td><a onClick={() => setDelete({ isVisible: true, id: resp.id, idProducto: resp.idProducto })} className='btn btn-danger'>Eliminar</a> </td>
                                </tr>
                            ))
                        }



                    </tbody>
                </table>


            </div>
            <div className="d-flex justify-content-between">
                <button className='btn ml-3 btn-outline-light mt-3' onClick={
                    ()=>  setIsVisible(true)

                }>Guardar</button>
                <h2 className='text-white mr-3 mt-3'>Total:{Detalle.reduce((total, obj) => total + Number(obj.total), 0).toLocaleString('es')}</h2>
            </div>

            <div className="modal-container" id='modal-container' onClick={closeModal}>
                <div className="modal-person" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-input ml-3 mr-3 mt-3 mb-3">
                        <div className="modal-label">
                            
                            <input className='form-control' placeholder='Buscar' onChange={(e) => buscar(e.target.value)} type="text" />
                        </div>
                        <div className="d-flex  justify-content-between w-25">
                            <button onClick={insertDetalleVenta} className='btn btn-outline-light'>Agregar</button>
                            <button className='btn btn-danger' onClick={closeModal}>&times;</button>
                        </div>

                    </div>

                    <div className=' mt-1 '>



                        <table className="table table-dark table-hover ">
                            <thead>
                                <tr>
                                    <th scope="col">Codigo</th>
                                    <th scope="col">Producto</th>
                                    <th scope="col">Precio</th>
                                    <th scope="col">Existencia</th>



                                </tr>
                            </thead>
                            <tbody >

                                {
                                    filterProducto.map((item, index) => (
                                        <tr key={index} onClick={() => Select(item.id)} tabIndex={index} className={(item.isSelected) ? 'pointer bg-success' : 'pointer'} >
                                            <th scope="row">{item.codigo}</th>
                                            <td>{item.description}</td>
                                            <td>{item.precio}</td>
                                            <td>{item.existencia}</td>



                                            <td>
                                                <input onChange={(e) => more(item.id, Number(e.target.value))} onClick={(e) => e.stopPropagation()} value={(item.cant) ? item.cant : 1} width={'20px'} min={1} type="number" />
                                            </td>

                                        </tr>

                                    ))
                                }



                            </tbody>
                        </table>

                    </div>


                </div>
            </div>


            {
                (IsVisible) &&

                <div className="modal-report-container" id='modal-report-container' onClick={() => {

                    cerrarVenta();


                }}>
                    <div className="modal-report">
                        <div className="modal-report-header" onClick={(e) => e.stopPropagation()}>
                            <h6>Reporte</h6>
                            <a onClick={() => {
                               cerrarVenta();

                            }} className="btn btn-danger">&times;</a>
                        </div>
                        <Reporte detalle={Detalle} noFact={'0'} cliente={ClientName} subTotal={Detalle.reduce((total, obj) => total + Number(obj.total), 0)} total={Detalle.reduce((total, obj) => total + Number(obj.total), 0)} date='21/12/2022' />
                    </div>
                </div>

            }







            {
                (Delete.isVisible) && <div className="modal-container-delete" id='modal-container-delete' onClick={() => {
                    setDelete({ isVisible: false, id: '', idProducto: '' })
                }}>
                    <div className="modal-delete" onClick={(e) => e.stopPropagation()}>
                        <div className="d-flex justify-content-end header-modal">
                            <button onClick={() => setDelete({ isVisible: false, id: '', idProducto: '' })} className='btn bg-white f5'>&times;</button>
                        </div>
                        <h5 className='display-5 text-center mt-2'>Realmente deceas eliminar este item</h5>
                        <div className="d-flex justify-content-between p-3">
                            <button className='btn btn-color' onClick={() => deleteItem(Delete.id)} >Si</button>
                            <button className='btn btn-color' onClick={() => setDelete({ isVisible: false, id: '', idProducto: '' })}>No</button>
                        </div>
                    </div>

                </div>
            }






        </div>
    )
}
