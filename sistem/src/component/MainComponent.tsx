import React, { useContext, useEffect,useState } from 'react'
import { Header } from './Header'
import { Link, BrowserRouter, Route, Routes } from 'react-router-dom';
import { Productos } from './Productos';
import { EntradaArticulo } from './EntradaArticulo';
import { Salida } from './Salida';
import { Ventas } from './Ventas';
import { En_Reparacion } from './En_Reparacion';
import { Historial } from './Historial';
import { Tecnicos } from './Tecnicos';
import { Horario } from './Horario';
import { Local } from './Local';
import { Caja } from './Caja';
import { Gastos } from './Gastos';
import { context } from '../hooks/AppContext';
import { Login } from './Login';
import { act } from 'react-dom/test-utils';
import { HistorialIngreso } from './HistorialIngreso';
import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import { app } from '../Firebase/conexion';
import { Categoria } from './Categoria';
import { Mensajes } from './Mensajes';

export const MainComponent = () => {

  const [Count, setCount] = useState(0);
  const [CountListo, setCountListo] = useState(0);
  const [CountRetirados, setCountRetirados] = useState(0);
    const {login,state:{idLoca}} = useContext(context)
  
  const closeMenu = () => {
    
  
    if(document.getElementById('transp')?.style.display=='block'){
      document.getElementById('transp')!.style.display = 'none';
      document.getElementById('lateral')!.style.width = '0';
    }
 

  }


  useEffect(() => {
    
    const db=getFirestore(app);
    const coll=collection(db,'Entrada');
    const Q=query(coll,where('estado','==','Listo para entregar'),where('idLoca','==',idLoca))
    onSnapshot(Q,(resp)=>{
      setCountListo(resp.size);

    })

  }, [idLoca])


  useEffect(() => {
    
    const db=getFirestore(app);
    const coll=collection(db,'Entrada');
    const Q=query(coll,where('estado','==','Retirado'),where('idLoca','==',idLoca))
    onSnapshot(Q,(resp)=>{
      setCountRetirados(resp.size);

    })

  }, [idLoca])


  useEffect(() => {
    
    const db=getFirestore(app);
    const coll=collection(db,'Entrada');
    const Q=query(coll,where('estado','==','En Reparacion'),where('idLoca','==',idLoca))
    onSnapshot(Q,(resp)=>{
      setCount(resp.size);

    })

  }, [idLoca])
  
  const disActive=()=>{
    const btn=document.querySelectorAll('.enlace');
    btn.forEach(btn=>{
      btn.classList.remove('active')
      btn.classList.add('disable')
    })
  }

  const active = () => {
    const btn = document.querySelectorAll('.enlace');
    btn.forEach(btnEl => {
      btnEl.addEventListener('click',()=>{
          disActive();
          btnEl.classList.add('active');
          btnEl.classList.remove('disable');
      })
    

    })

  }


  useEffect(() => {
   active()
  }, [])
  

  return (


    <BrowserRouter>

      <div className='container-fluid  wh '>
        <div className="row w-100">
          <div className="col-lg-2 border-l none barra-lateral p-0 justify-content-center bg-main  " id='lateral'>
            <div className="d-flex justify-content-between  ">
              <div className="logo ">
                <img src={require('../img/logo.png')} alt="" />
              </div>
              <div className="menu mt-2" onClick={closeMenu} >
                <div className="menu-line" />
                <div className="menu-line" />
                <div className="menu-line" />
              </div>
            </div>

            <nav className="menu  d-flex   p-0  flex-wrap">
              <Link onClick={closeMenu} className='enlace active col-sm-12   ' to={'/Local'}><span>Local</span></Link>
        
              <Link onClick={closeMenu} className='enlace col-sm-12 disable' to={'/entrada'}><span>Ingreso</span></Link>
              <Link onClick={closeMenu} className='enlace col-sm-12 disable' to={'/EnReparacion'}><span>En reparacion <span  className='yellow ml-1'>({Count})</span></span></Link>
              <Link onClick={closeMenu} className='enlace col-sm-12 disable' to={'/salida'}><span>Listo para entregar <span  className='yellow ml-1'>({CountListo})</span>  </span></Link>
              <Link onClick={closeMenu} className='enlace col-sm-12 disable' to={'/Historial'}><span>Historial <span  className='yellow ml-1'>({CountRetirados})</span> </span></Link>
              <Link onClick={closeMenu} className='enlace col-sm-12 disable' to={'/Venta'}><span>Venta</span></Link>
              <Link onClick={closeMenu} className={'enlace  col-sm-12 disable'} to={'/Categoria'}><span>Categoria</span></Link>

              <Link onClick={closeMenu} className={'enlace  col-sm-12 disable'} to={'/Productos'}><span>Productos</span></Link>

      
              <Link onClick={closeMenu} className='enlace col-sm-12 disable' to={'/Tecnicos'}><span>Tecnicos</span></Link>
              <Link onClick={closeMenu} className='enlace col-sm-12   disable' to={'/Gastos'}><span>Gastos</span></Link>

              <Link onClick={closeMenu} className='enlace col-sm-12 disable' to={'/HistorialIngreso'}><span>Historial Ingreso</span></Link>
              <Link onClick={closeMenu} className='enlace col-sm-12 disable' to={'/Caja'}><span>Caja</span></Link>
              <Link onClick={closeMenu} className='enlace col-sm-12 disable' to={'/Mensajes'}><span>Mensajes</span></Link>

            </nav>





          </div>
          <div className="col-md-12 mt-2 col-lg-10 m-0  p-0">




            <div className='pl-3 col-12 pt-3 sticky  bg-main '>

              <Header />
            </div>
            <Routes>
                
                
                
                  <Route index element={<Local />} />
                  <Route path='/entrada' element={<EntradaArticulo />} />
                  <Route path='/Productos' element={<Productos />} />
                  <Route path='/salida' element={<Salida />} />
                  <Route path='/Venta' element={<Ventas />} />
                  <Route path='/EnReparacion' element={<En_Reparacion />} />
                  <Route path='/Historial' element={<Historial />} />
                  <Route path='/Tecnicos' element={<Tecnicos />} />
                  <Route path='/Horario' element={<Horario />} />
                  <Route path='/Categoria' element={<Categoria/>}/>
                  <Route path='/Local' element={<Local />} />
                  <Route path='/Caja' element={<Caja />} />
                  <Route path='/Gastos' element={<Gastos />} />
                  <Route path='/HistorialIngreso' element={<HistorialIngreso/>}/>
                  <Route path='/Mensajes' element={<Mensajes/>}/>
                  <Route path='*' element={<Productos />} />
         
                 
                
           

            </Routes>

          </div>
          
      <div className='trasparent' id='transp' onClick={closeMenu}>

      </div>

        </div>

      




      </div>
    </BrowserRouter>
  )
}
