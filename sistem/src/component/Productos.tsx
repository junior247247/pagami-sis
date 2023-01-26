import React, { useContext, useEffect, useState } from 'react'
import { context } from '../hooks/AppContext'
import { addDoc, collection, orderBy, getFirestore, query, onSnapshot, updateDoc, doc, deleteDoc, where } from 'firebase/firestore';
import { app } from '../Firebase/conexion';
import { useForm } from '../hooks/useForm';
import { Producto } from '../entidades/Producto';
import { PDFViewer } from '@react-18-pdf/renderer';

export const Productos = () => {
    const { onChange,state } = useContext(context);
    const {idLoca} =state;
    const [producto, setProducto] = useState<Producto[]>([]);
    const [getProdById, setGetProdById] = useState<Producto>();
    const { onChange: onChangeUpdate, code, desc, price, exits } = useForm({ code: '', desc: '', price: '', exits: '' });

    const { onChange: onChangeForm, codigo, description, precio, existencia, PIva,clear } = useForm({ codigo: '', description: '', precio: '', existencia: '', PIva: '' });
    useEffect(() => {

        onChange('Productos')
        return () => {

        }
    }, [])

  

    const getById = (id: string) => {
        setGetProdById(producto.find(res => res.id == id));
        const Prodcst: Producto | undefined = producto.find(res => res.id == id);

        onChangeUpdate(Prodcst?.codigo, 'code');
        onChangeUpdate(Prodcst?.existencia, 'exits');
        onChangeUpdate(Prodcst?.precio, 'price');
        onChangeUpdate(Prodcst?.description, 'desc');
    }

    useEffect(() => {
        const db = getFirestore(app);
        const coll = collection(db, 'Producto');
        const items = query(coll, orderBy('timestamp', 'desc') ,where('idLocal','==',idLoca));
        onSnapshot(items, (snap) => {
            const Productos: Producto[] = snap.docs.map(data => {
                return {
                    id: data.id,
                    codigo: data.get('codigo'),
                    description: data.get('description'),
                    precio: data.get('precio'),
                    existencia: data.get('existencia'),

                }
            })
            setProducto(Productos);
        })


        return () => {

        }
    }, [])
   
    const Eliminar=(id:string)=>{
        const db = getFirestore(app);
        const coll = doc(db, 'Producto', id);
        deleteDoc(coll);
    }
    const updateProd = (id: string) => {
        const db = getFirestore(app);
        const coll = doc(db, 'Producto', id);
        updateDoc(coll, {
            codigo: code,
            description: desc,
            precio: price,
            existencia: exits,
        })
    }

    const createProd = () => {
        const db = getFirestore(app);
        const coll = collection(db, 'Producto');
        addDoc(coll, {
            codigo,
            description,
            precio,
            existencia,
            timestamp: new Date().getTime(),
            idLocal:idLoca
        })
        clear();
    }


    return (
        <div className='hidden'>

       
            <div className=' mr-3 ml-3 mt-4 border hidden '>
                <h6 className='title-prod p-2'>Registrar Productos</h6>
                <div className="row align-items-center p-2 bg-main">

                    <div className="col-2">
                        <p className='text-white'>Codigo</p>
                        <form action="" className='form-group'>
                            <input value={codigo} onChange={(e) => onChangeForm(e.target.value, 'codigo')} className='form-control' type="text" />
                        </form>
                    </div>

                    <div className="col-4">
                        <p className='text-white'>Descripciopn</p>
                        <form action="" className='form-group'>
                            <input value={description.toUpperCase()} onChange={(e) => onChangeForm(e.target.value, 'description')} className='form-control' type="text" />
                        </form>
                    </div>
                    <div className="col-2">
                        <p className='text-white'>Precio</p>
                        <form action="" className='form-group'>
                            <input value={precio} onChange={(e) => onChangeForm(e.target.value, 'precio')} className='form-control' type="number" />
                        </form>
                    </div>
                    <div className="col-1">
                        <p className='text-white'>Existencia</p>
                        <form action="" className='form-group'>
                            <input value={existencia} onChange={(e) => onChangeForm(e.target.value, 'existencia')} className='form-control' type="number" />
                        </form>
                    </div>


                    <div className="col">
                        <button onClick={createProd} className='btn btn btn-outline-light bg-main'>Guardar</button>
                    </div>

                </div>




            </div>





            <div className='ml-3 mr-3 mt-5  table-container'>







                <table className="table table-dark table-hover ">
                    <thead>
                        <tr>
                            <th scope="col">Codigo</th>
                            <th scope="col">Producto</th>
                            <th scope="col">Precio</th>
                            <th scope="col">Existencia</th>
                            <th scope="col">Editar</th>
                            <th scope="col">Eliminar</th>
                        </tr>
                    </thead>
                    <tbody >
                        {
                            producto.map((resp,index) => (
                                <tr key={index}>
                                    <th scope="row">{resp.codigo}</th>
                                    <td>{resp.description.toUpperCase()}</td>
                                    <td>{Number(resp.precio).toLocaleString('es')}</td>
                                    <td>{resp.existencia}</td>
                                    <td><a href="#" onClick={() => getById(resp.id)} className='btn btn-success' data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo">Editar</a></td>
                                    <td><a href="#" onClick={() => Eliminar(resp.id)}  className='btn btn-danger'>Eliminar</a></td>
                                </tr>

                            ))
                        }









                    </tbody>
                </table>

            </div>

            <div className="modal fade" id="exampleModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Editar Producto</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-group">
                                    <label className="col-form-label">Codigo</label>
                                    <input value={code} onChange={(e) => onChangeUpdate(e.target.value, 'code')} type="text" className="form-control" id="recipient-name" />
                                </div>
                                <div className="form-group">
                                    <label className="col-form-label">Descripcion</label>
                                    <input value={desc} onChange={(e) => onChangeUpdate(e.target.value, 'desc')} type="text" className="form-control" id="recipient-name" />
                                </div>
                                <div className="form-group">
                                    <label className="col-form-label">Precio</label>
                                    <input value={price} onChange={(e) => onChangeUpdate(e.target.value, 'price')} type="text" className="form-control" id="recipient-name" />
                                </div>
                                <div className="form-group">
                                    <label className="col-form-label">Existencia</label>
                                    <input value={'exits'} onChange={(e) => onChangeUpdate(e.target.value, 'exits')} type="text" className="form-control" id="recipient-name" />
                                </div>


                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={() => updateProd(getProdById!.id)} data-dismiss="modal">Guardar</button>
                        </div>
                    </div>
                </div>
            </div>

      
        </div>
    )
}
