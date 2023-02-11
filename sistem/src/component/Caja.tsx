import { async } from "@firebase/util";
import {
  Firestore,
  getFirestore,
  where,
  collection,
  getDocs,
  query,
  onSnapshot,
  setDoc,
  doc,
  getDoc,
  addDoc,
  Query,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useContext, useState } from "react";
import { app } from "../Firebase/conexion";
import { context } from "../hooks/AppContext";
import { ReporteCierre } from "./ReporteCierre";
import { Gastos } from "./Gastos";
/*
  total: total,
            idLocal: idLoca,
            cierre: 'SIN CIERRE',
            tipo: 'VENTA'
*/

interface CajaDiaria {
  tipo: string;
  total: string;
}
interface Money {
  monto: number;
}

export const Caja = () => {
  const { onChange, state } = useContext(context);

  const { idLoca } = state;
  const [IsVisible, setIsVisible] = useState(false);
  const [CajaDiaria, setCajaDiaria] = useState<CajaDiaria[]>([]);
  const [IsVisibleReport, setIsVisibleReport] = useState(false);
  const [DineroEnCaja, setDineroEnCaja] = useState<number>(0);
  const [IsVisibleFondo, setIsVisibleFondo] = useState(false);
  const [fondoCaja, setfondoCaja] = useState("");
  const [fondoEnBase, setfondoEnBase] = useState("0");

  const [Retiros, setRetiros] = useState<Money[]>([]);
  const [monto, setmonto] = useState<Money[]>([]);

  useEffect(() => {
    onChange("Caja");
  }, []);

  useEffect(() => {
    const db = getFirestore(app);
    const coll = collection(db, "CajaDiaria");
    const Q = query(
      coll,
      where("cierre", "==", "SIN CIERRE"),
      where("idLocal", "==", idLoca)
    );
    onSnapshot(Q, (resp) => {
      const data: Money[] = resp.docs.map((res) => {
        return {
          monto: res.get("total"),
        };
      });
      setmonto(data);
    });
  }, []);

  useEffect(() => {
    const db = getFirestore(app);
    const coll = collection(db, "CajaDiaria");
    const Q = query(
      coll,
      where("cierre", "==", "SIN CIERRE"),
      where("idLocal", "==", idLoca)
    );
    onSnapshot(Q, (resp) => {
      const data: CajaDiaria[] = resp.docs.map((res) => {
        return {
          tipo: res.get("tipo"),
          total: res.get("total"),
        };
      });
      setCajaDiaria(data);
    });
  }, []);

  useEffect(() => {
    const db = getFirestore(app);
    const coll = collection(db, "Gastos");
    const Q = query(
      coll,
      where("cierre", "==", "SIN CIERRE"),
      where("idLocal", "==", idLoca)
    );

    onSnapshot(Q, (res) => {
      const data: Money[] = res.docs.map((resp) => {
        return {
          monto: resp.get("monto"),
        };
      });

      setRetiros(data);
    });
  }, []);

  useEffect(() => {
    const db = getFirestore(app);
    const coll = collection(db, "Caja");

    const document = doc(coll, idLoca);
    const getD = getDoc(document);
    getD.then((resp) => {
      if (resp.exists()) {
        const dineri: number = Number(resp.get("money"));
        setDineroEnCaja(dineri);
      }
    });
  }, []);

  useEffect(() => {
    const db = getFirestore(app);
    const coll = collection(db, "FondoCaja");
    const document = doc(coll, idLoca);

    getDoc(document).then((resp) => {
      if (resp.exists()) {
        setfondoEnBase(resp.get("fondo"));
      }
    });
  }, []);

  const IngresarFondo = async () => {
    const db = getFirestore(app);
    const coll = collection(db, "FondoCaja");
    const dument = doc(coll, idLoca);
    const getDocument = await getDoc(dument);
    if (getDocument.exists()) {
      updateDoc(dument, {
        idLocal: idLoca,
        fondo: fondoCaja,
      });
    } else {
      setDoc(doc(db, "FondoCaja", idLoca), {
        idLocal: idLoca,
        fondo: fondoCaja,
      });
    }

    setIsVisibleFondo(false);
  };

  const cerrarTurno = async () => {
    setIsVisibleReport(false);
    const db = getFirestore(app);
    const coll = collection(db, "CierreCaja");
    const totalVenta = CajaDiaria.reduce(
      (total, monto) => total + Number(monto.total),
      0
    );
    const totalCaja = DineroEnCaja;
    addDoc(coll, {
      totalVenta,
      totalCaja,
      idLoca: idLoca,
      timestamp: new Date().getTime(),
    });

    const collectionCajaDiaria = collection(db, "CajaDiaria");

    const Q = query(
      collectionCajaDiaria,
      where("idLocal", "==", idLoca),
      where("cierre", "==", "SIN CIERRE")
    );
    const snapShop = await getDocs(Q);
    snapShop.docs.map((resp) => {
      const id = resp.id;
      const document = doc(collectionCajaDiaria, id);
      updateDoc(document, {
        cierre: "CIERRE DE CAJA",
      });
    });

    const collCaja = collection(db, "Caja");
    const QueryCaja = query(collCaja, where("idLocal", "==", idLoca));


    //const snapCaja = await getDocs(QueryCaja);
  
      //const id = resp.id;
      const documents = doc(collCaja, idLoca);
      updateDoc(documents, {
        money: "0",
      });


    const collFondo = collection(db, "FondoCaja");
    const document = doc(collFondo, idLoca);
    updateDoc(document, {
      fondo: "0",
    });
  };

  return (
    <div>
      <div className="d-flex justify-content-between ml-2 mr-2 mt-3">
        <div className="col-4 border rounded">
          <h4 className="text-color mt-2">
            Total ingresos:
            {monto
              .reduce((total, obj) => total + Number(obj.monto), 0)
              .toLocaleString("es")}
          </h4>

          <h4 className="text-color">Dinero en caja:{DineroEnCaja}</h4>

          <h4 className="text-color">
            Gastos:{Retiros.reduce((total, monto) => total + monto.monto, 0)}
          </h4>
        </div>
        <div className="col-4 border rounded">
          <h4 className="text-color mt-2">
            Fondo en caja:{Number(fondoEnBase).toLocaleString("es")}
          </h4>
          <div className="d-flex  justify-content-between mt-3">
            <button
              onClick={() => setIsVisibleFondo(true)}
              className="btn btn-outline-light"
            >
              Fondo de Caja
            </button>
            <button
              className="btn btn-outline-light "
              onClick={() => setIsVisible(true)}
            >
              Cerrar Turno
            </button>
          </div>
        </div>
      </div>

      <div className="table-container ml-3 mr-3 mt-5">
        <table className="table table-dark table-hover ">
          <thead>
            <tr>
              <th scope="col">Tipo</th>
              <th scope="col">Total</th>
            </tr>
          </thead>
          <tbody>
            {CajaDiaria.map((resp, index) => (
              <tr key={index}>
                <th scope="row">{resp.tipo}</th>
                <td>{resp.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {IsVisible && (
        <div
          className="modal-container-delete"
          id="modal-container-delete"
          onClick={() => setIsVisible(false)}
        >
          <div className="modal-delete " onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between header-modal  align-items-center">
              <p className="ml-2 mt-3 ">Cerrar Turno</p>
              <button
                onClick={() => setIsVisible(false)}
                className="btn bg-white f5"
              >
                &times;
              </button>
            </div>
            <hr />
            <h5 className="display-5 text-center mt-1">Dinero en caja</h5>
            <div className="form-group mr-3 ml-3">
              <input
                type="text"
                className="form-control bg-main"
                placeholder="0.00"
              />
            </div>
            <div className="d-flex justify-content-between ">
              <button
                className="btn btn-color w-75 m-auto"
                onClick={() => {
                  setIsVisibleReport(true);
                  setIsVisible(false);
                }}
              >
                Cerrar Turno
              </button>
            </div>
          </div>
        </div>
      )}

      {IsVisibleReport && (
        <div
          className="modal-report-container"
          id="modal-report-container"
          onClick={() => {
            setIsVisibleReport(false);
            cerrarTurno();
          }}
        >
          <div className="modal-report">
            <div
              className="modal-report-header"
              onClick={(e) => e.stopPropagation()}
            >
              <h6>Reporte</h6>
              <a
                onClick={() => {
                  setIsVisibleReport(false);
                  cerrarTurno();
                }}
                className="btn btn-danger"
              >
                &times;
              </a>
            </div>
            <ReporteCierre
              ventas={monto.reduce((total, monto) => total + monto.monto, 0)}
              gastos={Retiros.reduce((total, monto) => total + monto.monto, 0)}
              fondo={Number(fondoEnBase)}
              dineroCaja={DineroEnCaja}
            />
          </div>
        </div>
      )}

      {IsVisibleFondo && (
        <div
          className="modal-report-container"
          onClick={() => setIsVisibleFondo(false)}
        >
          <div className="modal-fondo" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between  ">
              <h3>Fondo de caja</h3>
              <a className="btn" onClick={() => setIsVisibleFondo(false)}>
                X
              </a>
            </div>
            <hr />
            <div className="container">
              <div className="row">
                <div className="col form-group">
                  <input
                    value={fondoCaja}
                    onChange={(e) => setfondoCaja(e.target.value)}
                    type="text"
                    placeholder="Fondo de caja"
                    className="form-control"
                  />
                </div>
              </div>
              <button onClick={IngresarFondo} className="btn btn-color">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
