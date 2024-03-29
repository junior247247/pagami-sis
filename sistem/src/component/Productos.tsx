import React, { useContext, useEffect, useState } from 'react'
import { context } from '../hooks/AppContext'
import { addDoc, collection, orderBy, getFirestore, query, onSnapshot, updateDoc, doc, deleteDoc, where } from 'firebase/firestore';
import { app } from '../Firebase/conexion';
import { useForm } from '../hooks/useForm';
import { Producto } from '../entidades/Producto';
import { PDFViewer } from '@react-18-pdf/renderer';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

interface fileImg {
    fileUri: string;
    error: string;

}
interface Img{
    name:string
}

export const Productos = () => {
    const { onChange, state } = useContext(context);
    const { idLoca } = state;
    const [file, setfile] = useState<FileList>();
    const [producto, setProducto] = useState<Producto[]>([]);
    const [getProdById, setGetProdById] = useState<Producto>();
    const { onChange: onChangeUpdate, code, desc, price, exits, priceCompra } = useForm({ code: '', desc: '', price: '', exits: '', priceCompra: '' });
    var reader = new FileReader();
    const { onChange: onChangeForm, codigo, description, precio, existencia, PIva, clear } = useForm({ codigo: '', description: '', precio: '', existencia: '', PIva: '' });
    
    function get(event:FileList) {
        const file = event[0];
        const reader = new FileReader();
        reader.onload = function() {
          const base64Content = reader.result;
          // El contenido del archivo en Base64 estará disponible en la variable "base64Content"
        }
        return reader.readAsDataURL(file);
      }

    useEffect(() => {

        onChange('Productos')
        

    }, [])
    useEffect(() => {

      //  onChange('Productos')
        
     

    }, [file])



    const getFile = async (files: FileList): Promise<fileImg> => {
        const fi = files[0];
 
        const storage = getStorage(app);
        const storageRef = ref(storage, `/files/${fi.name}`)
        const uploadTask = uploadBytesResumable(storageRef, fi);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const percent = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );

                    // update progress
                    //setPercent(percent);
                    console.log(percent);
                },
                (err) => {
                    reject({
                        error: err
                    })
                },
                () => {

                    getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                        resolve({
                            fileUri: url,
                            error: ''
                        })
                    });
                }
            );

        })

    }

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
        const items = query(coll, orderBy('timestamp', 'desc'), where('idLocal', '==', idLoca));
        onSnapshot(items, (snap) => {
            const Productos: Producto[] = snap.docs.map(data => {
                return {
                    id: data.id,
                    codigo: data.get('codigo'),
                    description: data.get('description'),
                    precio: data.get('precio'),
                    existencia: data.get('existencia'),
                    pCompra: data.get('priceCompra'),
                    img:data.get('img')
                }
            })
            setProducto(Productos);
        })
    }, [])

    const Eliminar = (id: string) => {
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
            priceCompra: priceCompra
        })
    }

    const createProd = async () => {
        const db = getFirestore(app);
        const coll = collection(db, 'Producto');
        if(file){
       

            addDoc(coll, {
                codigo,
                description,
                precio,
                existencia,
                priceCompra,
                timestamp: new Date().getTime(),
                idLocal: idLoca,
                img:''
            })
     
        }else{
            addDoc(coll, {
                codigo,
                description,
                precio,
                existencia,
                priceCompra,
                timestamp: new Date().getTime(),
                idLocal: idLoca,
                img:''
            })

        }
     
        clear();
    }


    return (
        <div className='hidden'>
            

            <div className=' mr-4 ml-4 mt-4 border hidden '>
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
                        <p className='text-white'>Precio Venta</p>
                        <form action="" className='form-group'>
                            <input value={precio} onChange={(e) => onChangeForm(e.target.value, 'precio')} className='form-control' type="number" />
                        </form>
                    </div>

                    <div className="col-2">
                        <p className='text-white'>Precio Compra</p>
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







                </div>

                <div className="row ml-1 mb-3">
                    <div className="col">
                        <button onClick={createProd} className='btn btn btn-outline-light bg-main'>Guardar</button>
                    </div>

                    <div className="col-auto mr-4">
                        <input type="file" onChange={(e) => setfile(e.target.files!)} accept='image/*' className='text-color' />
                    </div>
                </div>





            </div>





            <div className='ml-3 mr-3 mt-5  table-container'>







                <table className="table table-dark table-hover ">
                    <thead>
                        <tr>
                            <th className='text-mobile text-table' scope="col">Codigo</th>
                            <th className='text-mobile text-table' colSpan={2} scope="col">Producto</th>
                            <th className='text-mobile text-table' scope="col">Precio de Compra</th>
                            <th className='text-mobile text-table' scope="col">Precio de venta</th>
                            <th className='text-mobile text-table' scope="col">Existencia</th>
                            <th className='text-mobile text-table' scope="col">Editar</th>
                            <th className='text-mobile text-table' scope="col">Eliminar</th>
                        </tr>
                    </thead>
                    <tbody >
                        {
                            producto.map((resp, index) => (
                                <tr key={index}>
                                    <th className='text-mobile text-table' scope="row"><a className='code-link' >{resp.codigo}</a></th>

                                    <td className='text-mobile text-table' ><img src={resp.img} className='table-img' /></td>
                                    <td className='text-mobile text-table' >{resp.description.toUpperCase()}</td>
                                    <td className='text-mobile text-table' >{Number(resp.pCompra).toLocaleString('es')}</td>
                                    <td className='text-mobile text-table' >{Number(resp.precio).toLocaleString('es')}</td>
                                    <td className='text-mobile text-table' >{resp.existencia}</td>
                                    <td className='text-mobile text-table' ><a href="#" onClick={() => getById(resp.id)} className='btn btn-success' data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo">Editar</a></td>
                                    <td className='text-mobile text-table' ><a href="#" onClick={() => Eliminar(resp.id)} className='btn btn-danger'>Eliminar</a></td>
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
