import React, { useContext, useEffect } from 'react'
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

export const MainComponent = () => {

 
  
  const closeMenu = () => {

  
    if(document.getElementById('transp')?.style.display=='block'){
      document.getElementById('transp')!.style.display = 'none';
      document.getElementById('lateral')!.style.width = '0';
    }
 

  }

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

      <div className='container-fluid h-100 '>
        <div className="row">
          <div className="col-lg-2 barra-lateral p-0 justify-content-center bg-main d-lg-block " id='lateral'>
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

            <nav className="menu  d-flex  d-sm-block p-0  flex-wrap">
              <Link onClick={closeMenu} className='enlace active col-sm-12   ' to={'/Local'}><span>Local</span></Link>
        
              <Link onClick={closeMenu} className='enlace col-sm-12 disable' to={'/entrada'}><span>Ingreso</span></Link>
              <Link onClick={closeMenu} className='enlace col-sm-12 disable' to={'/EnReparacion'}><span>En reparacion</span></Link>
              <Link onClick={closeMenu} className='enlace col-sm-12 disable' to={'/salida'}><span>Listo para entregar</span></Link>
              <Link onClick={closeMenu} className='enlace col-sm-12 disable' to={'/Historial'}><span>Historial</span></Link>
              <Link onClick={closeMenu} className='enlace col-sm-12 disable' to={'/Venta'}><span>Venta</span></Link>

              <Link onClick={closeMenu} className={'enlace  col-sm-12 disable'} to={'/Productos'}><span>Productos</span></Link>

              <Link onClick={closeMenu} className='enlace col-sm-12 disable' to={'/Tecnicos'}><span>Tecnicos</span></Link>
              <Link onClick={closeMenu} className='enlace col-sm-12   disable' to={'/Gastos'}><span>Gastos</span></Link>


              <Link onClick={closeMenu} className='enlace col-sm-12 disable' to={'/Caja'}><span>Caja</span></Link>


            </nav>





          </div>
          <div className="col-10  p-0">




            <div className='pl-3 pt-3 sticky  bg-main '>

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
                  <Route path='/Local' element={<Local />} />
                  <Route path='/Caja' element={<Caja />} />
                  <Route path='/Gastos' element={<Gastos />} />
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
