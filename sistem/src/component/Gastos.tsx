import { Firestore,getFirestore,addDoc,onSnapshot,orderBy,collection,query,doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import React, { useEffect, useContext,useState } from 'react'
import { app } from '../Firebase/conexion';
import { context } from '../hooks/AppContext'
import { ParseToDate } from '../hooks/ParseDate';
import { useForm } from '../hooks/useForm';
import { async } from '@firebase/util';

interface Gasto{
    id:string;
    motivo:string;
    timestamp:Date;
    monto:string;
}
export const Gastos = () => {

    const { onChange,state } = useContext(context);

    const [Gasto, setGasto] = useState<Gasto[]>([]);
    const  {onChange:onChangeForm,monto,motivo,clear} =  useForm({monto:'',motivo:''});
    const [Dinero, setDinero] = useState(0);

    useEffect(() => {
        onChange('Gastos')

    }, [])


    useEffect(() => {
      const db=getFirestore(app);
      const coll=collection(db,"Caja");
      const docs=doc(coll,state.idLoca);
      getDoc(docs).then(resp=>{
        setDinero(Number(resp.get('money')));
      })
    
      
    }, [])
    

    useEffect(() => {
        const db=getFirestore(app);
        const coll=collection(db,'Gastos');
        const Q=query(coll,orderBy('timestamp','desc'));
        onSnapshot(Q,(resp)=>{
            const data:Gasto[]=resp.docs.map(res=>{
                return{
                    id:res.id,
                    motivo:res.get('motivo'),
                    timestamp:new Date(res.get('timestamp')),
                    monto:res.get('monto')
                }
            })
            setGasto(data);
        })
    }, [])
    



    const DisminuirCaja= async ()=>{
        const db=getFirestore(app);
        const coll=collection(db,"Caja");

        const document=doc(coll,state.idLoca);
        const snap= await getDoc(document);
        if(snap.exists()){
            let money=Number(snap.get('money'));
            money-=Number(monto);
            updateDoc(document,{
                money
            })

        }
        
    }

    const create= async ()=>{
        if(monto==='' && motivo==='')return alert('Completa todos los campos');
        if(Number(monto) > Dinero)return alert('El monto supera el saldo en caja')
        const db=getFirestore(app);
        const coll=collection(db,'Gastos');

        const document=doc(coll,state.idLoca);
        const snap= await getDoc(document);

        if(snap.exists()){
            updateDoc(document,{
                monto,
                motivo,
                timestamp:new Date().getTime(),
                cierre:'SIN CIERRE',
                idLocal:state.idLoca
            })
        }else{

            
            setDoc(doc(db,'Gastos',state.idLoca),{
                monto,
                motivo,
                timestamp:new Date().getTime(),
                cierre:'SIN CIERRE',
                idLocal:state.idLoca
            })

        }
        DisminuirCaja();
     
        clear();
    }

    return (
        <div>
            <div className="container-fluid mt-3">
                <div className="row align-items-center">
                  
                    <div className="col-md-4">
                        <div className="form-group">
                        <p className='text-white '>Gastos</p>
                            <input type="number" onChange={(e)=>onChangeForm(e.target.value,'monto')} placeholder='Monto' className='form-control' />
                        </div>

                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                        <p className='text-white '>Motivo</p>
                            <input type="text" onChange={(e)=>onChangeForm(e.target.value,'motivo')} placeholder='Motivo' className='form-control' />
                        </div>
                    </div>

                    <div className="col-md-auto ">
                    <p className='text-white '></p>
                        <button onClick={create} className="btn btn-outline-light">Guardar</button>
                    </div>
                </div>
            </div>
            <div className="container-fluid mobile-margin">
                <div className="row ">
                    <div className="col ">
                        <h5 className='text-white '>Disponible en caja:{Dinero.toLocaleString('es')}</h5>
                    </div>
                </div>
            </div>

            <div className="table-container col-sm-12 col-md-8 mt-3  mr-3">
        <table className="table  table-dark table-hover ">
          <thead>
            <tr>
            
              <th className='text-mobie text-table' scope="col th-sm">Monto</th>
              
              <th className='text-mobie text-table' scope="col th-sm">Motivo</th>
              <th className='text-mobie text-table' scope="col th-sm">Fecha</th>
            </tr>
          </thead>
          <tbody >
            {
              (Gasto.map((resp, index) => (

                <tr key={index} className={'pointer'} >
                  <th className='text-mobile text-table' scope="row">{Number(resp.monto).toLocaleString('es')}</th>
                  <th className='text-mobile text-table' scope="row">{resp.motivo}</th>
                  <th className='text-mobile text-table' scope="row">{ParseToDate(resp.timestamp)}</th>
                </tr>
              )))
            }
          </tbody>
        </table>

      </div>

        </div>
    )
}
