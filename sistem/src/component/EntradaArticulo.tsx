import React, { useContext, useEffect, useState, useRef } from 'react'
import { context } from '../hooks/AppContext';
import { useForm } from '../hooks/useForm';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, where, onSnapshotsInSync } from 'firebase/firestore';
import { Entrada } from '../entidades/Entrada';
import { getStorage, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../Firebase/conexion';
import { Indicator } from './Indicator';
import { async } from '@firebase/util';
import { ParseToDate } from '../hooks/ParseDate';
import { setTimeout } from 'timers/promises';
import { clear } from 'console';

interface fileImg {
    fileUri: string;
    error: string;

}

interface Tecnico {
    id: string;
    name: string
}

export const EntradaArticulo = () => {

    const { onChange, state } = useContext(context);
    const { idLoca } = state;

    const [IsLoading, setIsLoading] = useState(false);

    const [file, setfile] = useState<FileList>();
    const [Count, setCount] = useState(0);
    const [Tecnico, setTecnico] = useState<Tecnico[]>([])

    const [NameSelect, setNameSelect] = useState({ name: 'Seleccion', id: '' })

    const Fecha = useRef(new Date(new Date().getTime())).current;
    const h1 = useRef();

    const {

        onChange: onChangeForm, clear, name, identification, telefono, correo,
        encendido, pantalla, audifono, microfono, senal, wifi, camara1,
        camara2, carga, audio, altavoz, sensores, bateria, flash, botones,
        software, recalentamiento, malware, piezas, reportado, observacion, estado, costoReparacion, costoRepuesto, descriptionReparacion, equipo, serial

    } = useForm({
        name: '', identification: '', telefono: '', correo: '', observacion: ''
        , encendido: false, pantalla: false, audifono: false,
        microfono: false, senal: false, wifi: false, camara1: false,
        camara2: false, carga: false, audio: false, altavoz: false,
        sensores: false, bateria: false, flash: false, botones: false,
        software: false, recalentamiento: false, malware: false, piezas: false,
        reportado: false, estado: 'En Reparacion', costoRepuesto: '', costoReparacion: '', descriptionReparacion: '', equipo: '', serial: ''
    });
    const ti = () => {
        const fechahora = new Date();

        const horaActual = new Intl.DateTimeFormat(undefined, { timeStyle: "short" }).format(new Date("2022-03-02T23:44:55"));

        return horaActual;;
    };
    useEffect(() => {

        const cl = setInterval(() => {
            document.getElementById('hora')!.innerHTML = ` Hora: ${ti()}`
        }, 1000)

        return () => clearInterval(cl);


    }, [])



    const addCajaDiaria = () => {
        const db = getFirestore(app);
        const coll = collection(db, 'CajaDiaria');
        addDoc(coll, {
            total: Number(costoReparacion) + Number(costoRepuesto),
            idLocal: idLoca,
            cierre: 'SIN CIERRE',
            tipo: 'REPARACION'
        })


    }

    

    useEffect(() => {
        const db = getFirestore(app);
        const coll = collection(db, 'Tecnicos');

        const Q = query(coll, orderBy('timestamp', 'desc'));

        onSnapshot(Q, (resp) => {
            const data: Tecnico[] = resp.docs.map(res => {
                return {
                    id: res.id,
                    name: res.get('name')
                }
            })
            setTecnico(data);

        })


    }, [])





    useEffect(() => {




        onChange('Ingreso');


    }, [])

    useEffect(() => {

        const db = getFirestore(app);
        const coll = collection(db, 'Entrada');
        const itemsQuery = query(coll, orderBy('timestamp', 'desc'));
        onSnapshot(itemsQuery, (snap) => {
            setCount(Number(snap.size + 1));

        })
    }, [])

    /* return(
         <div className="loading-content">
         <div className="loading">
             <span>Loading...</span>
         </div>
     </div>
     )*/

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



    const create = async () => {
        const db = getFirestore(app);
        const coll = collection(db, 'Entrada');

        setIsLoading(true);
        let url = '';
        if (file != null) {

            const { fileUri } = await getFile(file!);
            url = fileUri;
        }



        //    document.body.style.cursor = 'wait'


        addDoc(coll, {
            name,
            telefono,
            identification,
            correo,
            observacion,
            encendido,
            pantalla,
            audifono,
            microfono,
            senal,
            wifi,
            camara1,
            camara2,
            carga,
            audio,
            altavoz,
            sensores,
            bateria,
            flash,
            botones,
            software,
            recalentamiento,
            malware,
            piezas,
            reportado,
            entaller: true,
            timestamp: new Date().getTime(),
            estado: estado,
            fileUri: url,
            costoReparacion,
            costoRepuesto,
            total: Number(costoRepuesto) + Number(costoReparacion),
            description: descriptionReparacion,
            equipo,
            serial,
            noFact: Count,
            idTecnico: NameSelect.id,
            cierre: 'SIN CIERRE'

        })
        addCajaDiaria();
        clear();


    }


    return (
        <div>

            <div className="row mt-3 ml-2 justify-content-between">
                <div className="col">
                    <h5 className='text-color mb-5'>Nueva factura</h5>
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {NameSelect.name}
                        </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">

                            {
                                (Tecnico.map(res => (
                                    <a className="dropdown-item pointer" onClick={() => setNameSelect({ name: res.name, id: res.id })} >{res.name}</a>
                                )))
                            }


                        </div>
                    </div>
                </div>
                <div className="col">
                    <h5 className='text-color mb-5'>Fecha {ParseToDate(Fecha)} <br /> <span id='hora' >6:45 pm {ti()}</span></h5>
                    <h5 className='text-color'>#000{Count}</h5>
                </div>
            </div>

            <div className='border rounded m-3 p-3'>



                <form>
                    <div className="row justify-content-between">
                        <div className="col-auto form-group">

                            <input value={name.toUpperCase()}  placeholder='Nombre' onChange={(e) => onChangeForm(e.target.value, 'name')} type="text" className='p-2 from-control ' />
                        </div>
                        <div className="col-auto form-group">

                            <input value={identification} placeholder='Identificacion' onChange={(e) => onChangeForm(e.target.value, 'identification')} type="text" className='p-2 from-control ' />
                        </div>
                    </div>

                    <div className="row justify-content-between ">
                        <div className="col-auto form-group">

                            <input value={telefono}  placeholder='Telefono' onChange={(e) => onChangeForm(e.target.value, 'telefono')} type='number' className='p-2 from-control' />
                        </div>
                        <div className="col-auto form-group">

                            <input value={correo} placeholder='Correo' onChange={(e) => onChangeForm(e.target.value, 'correo')} type="text" className='p-2 from-control' />
                        </div>
                    </div>

                    <div className="row justify-content-between  mb-4">
                        <div className="col-auto">

                            <input value={equipo.toUpperCase()} placeholder='Equipo' onChange={(e) => onChangeForm(e.target.value, 'equipo')} type="text" className='p-2 from-control' />
                        </div>

                        <div className="col-auto">

                            <input value={serial} placeholder='Serial' onChange={(e) => onChangeForm(e.target.value, 'serial')} type="text" className='p-2 from-control' />
                        </div>
                    </div>

                    <div className="d-flex mb-3 justify-content-center mt-4">
                        <h4 className='text-color'>Describa los daños del equipo</h4>
                        <div className="col">

                        </div>
                        <div className="col">
                            <div className="d-flex w-75  ">
                                <p className='text-color mr-2'>Funciona</p>
                                <div className="check bg-white"></div>
                            </div>
                        </div>

                        <div className="col">
                            <div className="d-flex w-75 ">
                                <p className='text-color mr-2'>No Funciona</p>
                                <div className="check "></div>
                            </div>
                        </div>

                    </div>



                    <div className="row justify-content-around">
                        <div className="col-2">
                            <div className="form-check">
                                <input type="checkbox" onChange={() => (!encendido) ? onChangeForm(true, 'encendido') : onChangeForm(false, 'encendido')} checked={encendido} className="form-check-input" id="exampleCheck1" />

                                <label className="form-check-label text-white" htmlFor="exampleCheck1">Encendido</label>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="form-check">
                                <input type="checkbox" onChange={() => (!pantalla) ? onChangeForm(true, 'pantalla') : onChangeForm(false, 'pantalla')} checked={pantalla} className="form-check-input" id="Pantalla" />

                                <label className="form-check-label text-white" htmlFor="Pantalla">Pantalla</label>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="form-check">
                                <input type="checkbox" onChange={() => (!audifono) ? onChangeForm(true, 'audifono') : onChangeForm(false, 'audifono')} checked={audifono} className="form-check-input" id="Audifono" />

                                <label className="form-check-label text-white" htmlFor="Audifono">Audifono</label>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="form-check">
                                <input type="checkbox" checked={microfono} onChange={() => (!microfono) ? onChangeForm(true, 'microfono') : onChangeForm(false, 'microfono')} className="form-check-input" id="Microfono" />

                                <label className="form-check-label text-white" htmlFor="Microfono">Microfono</label>
                            </div>
                        </div>
                    </div>





                    <div className="row justify-content-around">
                        <div className="col-2">
                            <div className="form-check">
                                <input type="checkbox" checked={senal} onChange={() => (!senal) ? onChangeForm(true, 'senal') : onChangeForm(false, 'senal')} className="form-check-input" id="Señal" />

                                <label className="form-check-label text-white" htmlFor="Señal">Señal</label>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="form-check">
                                <input type="checkbox" checked={wifi} onChange={() => (!wifi) ? onChangeForm(true, 'wifi') : onChangeForm(false, 'wifi')} className="form-check-input" id="Wifi" />

                                <label className="form-check-label text-white" htmlFor="Wifi">Wifi</label>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="form-check">
                                <input type="checkbox" checked={camara1} onChange={() => (!camara1) ? onChangeForm(true, 'camara1') : onChangeForm(false, 'camara1')} className="form-check-input" id="Camara1" />

                                <label className="form-check-label text-white" htmlFor="Camara1">Camara 1</label>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="form-check">
                                <input type="checkbox" checked={camara2} onChange={() => (!camara2) ? onChangeForm(true, 'camara2') : onChangeForm(false, 'camara2')} className="form-check-input" id="Camara2" />

                                <label className="form-check-label text-white" htmlFor="Camara2">Camara 2</label>
                            </div>
                        </div>
                    </div>






                    <div className="row justify-content-around">
                        <div className="col-2">
                            <div className="form-check">
                                <input type="checkbox" checked={carga} onChange={() => (!carga) ? onChangeForm(true, 'carga') : onChangeForm(false, 'carga')} className="form-check-input" id="Carga" />

                                <label className="form-check-label text-white" htmlFor="Carga">Carga</label>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="form-check">
                                <input type="checkbox" checked={audio} onChange={() => (!audio) ? onChangeForm(true, 'audio') : onChangeForm(false, 'audio')} className="form-check-input" id="Auricular" />

                                <label className="form-check-label text-white" htmlFor="Auricular">audio</label>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="form-check">
                                <input type="checkbox" checked={altavoz} onChange={() => (!altavoz) ? onChangeForm(true, 'altavoz') : onChangeForm(false, 'altavoz')} className="form-check-input" id="Altavoz" />

                                <label className="form-check-label text-white" htmlFor="Altavoz">Altavoz</label>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="form-check">
                                <input type="checkbox" checked={sensores} onChange={() => (!sensores) ? onChangeForm(true, 'sensores') : onChangeForm(false, 'sensores')} className="form-check-input" id="Sensores" />

                                <label className="form-check-label text-white" htmlFor="Sensores">Sensores</label>
                            </div>
                        </div>
                    </div>






                    <div className="row justify-content-around">
                        <div className="col-2">
                            <div className="form-check">
                                <input type="checkbox" checked={bateria} onChange={() => (!bateria) ? onChangeForm(true, 'bateria') : onChangeForm(false, 'bateria')} className="form-check-input" id="Bateria" />

                                <label className="form-check-label text-white" htmlFor="Bateria">Bateria</label>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="form-check">
                                <input type="checkbox" checked={flash} onChange={() => (!flash) ? onChangeForm(true, 'flash') : onChangeForm(false, 'flash')} className="form-check-input" id="Flash" />

                                <label className="form-check-label text-white" htmlFor="Flash">Flash</label>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="form-check">
                                <input type="checkbox" checked={botones} onChange={() => (!botones) ? onChangeForm(true, 'botones') : onChangeForm(false, 'botones')} className="form-check-input" id="Botones" />

                                <label className="form-check-label text-white" htmlFor="Botones">Botones</label>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="form-check">
                                <input type="checkbox" checked={software} onChange={() => (!software) ? onChangeForm(true, 'software') : onChangeForm(false, 'software')} className="form-check-input" id="Software" />

                                <label className="form-check-label text-white" htmlFor="Software">Software</label>
                            </div>
                        </div>
                    </div>



                    <div className="row justify-content-around">
                        <div className="col-2">
                            <div className="form-check">
                                <input type="checkbox" checked={recalentamiento} onChange={() => (!recalentamiento) ? onChangeForm(true, 'recalentamiento') : onChangeForm(false, 'recalentamiento')} className="form-check-input" id="Recalentamiento" />

                                <label className="form-check-label text-white" htmlFor="Recalentamiento">Recalentamiento</label>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="form-check">
                                <input type="checkbox" checked={malware} onChange={() => (!malware) ? onChangeForm(true, 'malware') : onChangeForm(false, 'malware')} className="form-check-input" id="Malware" />

                                <label className="form-check-label text-white" htmlFor="Malware">Malware</label>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="form-check">
                                <input type="checkbox" checked={piezas} onChange={() => (!piezas) ? onChangeForm(true, 'piezas') : onChangeForm(false, 'piezas')} className="form-check-input" id="Piezas" />

                                <label className="form-check-label text-white" htmlFor="Piezas">Piezas</label>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="form-check">
                                <input type="checkbox" checked={reportado} onChange={() => (!reportado) ? onChangeForm(true, 'reportado') : onChangeForm(false, 'reportado')} className="form-check-input" id="Reportado" />

                                <label className="form-check-label text-white" htmlFor="Reportado">Reportado</label>
                            </div>
                        </div>


                    </div>







                </form>

                <div className="d-flex align-items-center ">


                    <div className='col-4' >
                        <h5 className='text-color'>Observaciones</h5>
                        <textarea value={observacion} onChange={({ target }) => onChangeForm(target.value, 'observacion')} className='form-control area'  ></textarea>



                    </div>


                    <div className="form-group mt-2 ml-5">
                        <input className='text-color' onChange={(e) => setfile(e.target.files!)} accept='image/*' type="file" />
                    </div>



                </div>





            </div>

            <div className="d-flex">

                <div className="col-4 mb-5">

                    <h5 className='text-color'>Descripcion de la reparacion</h5>
                    <div className="border p-3">
                        <div className="form-group">
                            <textarea onChange={(e) => onChangeForm(e.target.value, 'descriptionReparacion')} value={descriptionReparacion} placeholder='Descripcion de la reparacion' className='form-control area' />
                        </div>
                    </div>

                    <div className="border   w-75">
                        <table width="100%" cellPadding={0} cellSpacing={0} border={1}>
                            <tr>
                                <td className='text-color p-2' width={'50%'}>Costo de repustos:</td>
                                <td className='text-color p-2' width="50%">

                                    <div className="form-group">
                                        <input type="number" className='form-control' min={1} onChange={(e) => onChangeForm(e.target.value, 'costoRepuesto')} placeholder='25.000 $' />
                                    </div>

                                </td>
                            </tr>
                            <tr>
                                <td className='text-color pl-2' rowSpan={2} valign="middle" align="left">Costo de reparacion:  </td>
                            </tr>
                            <tr>
                                <td colSpan={2} className='text-color p-2'>

                                    <div className="form-group">
                                        <input type="number" min={1} className='form-control' onChange={(e) => onChangeForm(e.target.value, 'costoReparacion')} placeholder='25.000 $' />
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td rowSpan={2} className='text-color p-2' valign="middle" align="left">Costo total:  </td>
                            </tr>
                            <tr>
                                <td colSpan={2} className='text-color p-2'>{Number(Number(costoReparacion) + Number(costoRepuesto)).toLocaleString('es')} $</td>
                            </tr>
                        </table>

                    </div>



                </div>
                <div className="col ">
                    <h5 className='text-color'>Estado del equipo</h5>
                    <div className=" ml-3">
                        <label className="container-radio text-color">En reparacion
                            <input type="radio" id='radio' checked={(estado == 'En Reparacion' ? true : false)} onChange={() => onChangeForm('En Reparacion', 'estado')} name='radio' />
                            <span className="checkmark"></span>
                        </label>
                    </div>
                    <div className=" ml-3">
                        <label className="container-radio text-color">Listo para entregar
                            <input type="radio" id='radio' checked={(estado == 'Listo para entregar') ? true : false} onChange={() => onChangeForm('Listo para entregar', 'estado')} name='radio' />
                            <span className="checkmark"></span>
                        </label>
                    </div>
                    <div className=" ml-3">
                        <label className="container-radio text-color">Retirado del local
                            <input type="radio" name='radio' checked={(estado == 'Retirado' ? true : false)} onChange={() => {
                                onChangeForm('Retirado', 'estado')

                            }} />
                            <span className="checkmark"></span>
                        </label>
                    </div>

                    <a onClick={create}

                        className=' ml-5 col-2 pt-2 btn-color mt-3 text-white'>Guardar</a>
                </div>

            </div>


            {
                (IsLoading) &&

                <div className='container-indicator' onClick={() => setIsLoading(false)}>
                    <div className="body-indicator ">
                        <div className="indicator-success">
                            <h4 className='text-black'>Exito</h4>
                            <div className='gg-check'></div>
                        </div>
                    </div>
                </div>

            }








        </div>
    )
}
