import React from 'react'


import ReactPDF, {
    Document,
    Page,
    View,
    Text,
    Link,
    Font,
    StyleSheet,
    PDFViewer,
    Image,
    Polyline
} from '@react-pdf/renderer';
import { Detalle } from './Ventas';

interface Props {
    noFact: string;
    detalle: Detalle[];
    date: string;
    subTotal:number;
    total:number;
    cliente:string;


}





export const Reporte = ({noFact,detalle,date,subTotal,total,cliente}:Props) => {
    return (
        <PDFViewer style={{ width: '100%', height: '100%' ,backgroundColor:'red'}}>
        <Document >
          <Page size='A7' style={style.container}>
            <View style={style.header}>
              <Image style={style.img} source={require('../img/logo-factura.png')} />
              <View>
                <Text style={style.title}>FACTURA</Text>
                <Text style={style.subTitle}>{date}</Text>
                <Text style={style.subTitle}>NO:{noFact}</Text>
              </View>
            </View>
            <View>
              <Text style={style.text}>Parque berrio Centro Comercial Metro</Text>
              <Text style={style.text}>Boyaca Local 111,CL. 51 #51-40</Text>
              <Text style={style.text}>Medellin, Antioquia Colombia</Text>
              <Text style={style.text}>Contacto: +57 3105102274</Text>
            </View>
            <View style={style.line} />
            <Text style={{ ...style.text, marginTop: 5 }}>CLIENTE:{cliente.toUpperCase()}</Text>
            <View style={style.description}>
              <View>
                <Text style={{ ...style.textDesct }}>Description</Text>
              </View>
              <Text style={{ ...style.textDesct }}>Cant</Text>
              <Text style={{ ...style.textDesct }}>Precio</Text>
              <Text style={{ ...style.textDesct }}>Monto</Text>
            </View>
            {detalle.map((resp, index) => (
              <View style={style.prod} key={index}>
                <Text style={style.textDesct}>{resp.description} </Text>
                <Text style={style.textDesct}>{resp.cant}</Text>
                <Text style={style.textDesct}>{resp.precio}</Text>
                <Text style={style.textDesct}>{resp.total}</Text>
              </View>
            ))}
              {detalle.map((resp, index) => (
              <View style={style.prod} key={index}>
                <Text style={style.textDesct}>{resp.description} </Text>
                <Text style={style.textDesct}>{resp.cant}</Text>
                <Text style={style.textDesct}>{resp.precio}</Text>
                <Text style={style.textDesct}>{resp.total}</Text>
              </View>
            ))}
              {detalle.map((resp, index) => (
              <View style={style.prod} key={index}>
                <Text style={style.textDesct}>{resp.description} </Text>
                <Text style={style.textDesct}>{resp.cant}</Text>
                <Text style={style.textDesct}>{resp.precio}</Text>
                <Text style={style.textDesct}>{resp.total}</Text>
              </View>
            ))}
              {detalle.map((resp, index) => (
              <View style={style.prod} key={index}>
                <Text style={style.textDesct}>{resp.description} </Text>
                <Text style={style.textDesct}>{resp.cant}</Text>
                <Text style={style.textDesct}>{resp.precio}</Text>
                <Text style={style.textDesct}>{resp.total}</Text>
              </View>
            ))}
            <View style={style.line} />
            <View style={style.contianerTotal}>
              <Text style={style.textDesct}>Subtotal:{subTotal}</Text>
              <Text style={style.textDesct}>Tasa de impuesto:0</Text>
              <Text style={style.textDesct}>Impuesto:0</Text>
              <Text style={style.textDesct}>Total:{total}</Text>
            </View>
            <View style={style.line} />
            <Text style={{ ...style.textDesct, textAlign: 'center', marginTop: 3 }}>Garantia</Text>
            <Text style={{ fontSize: 3, marginHorizontal: 3, textAlign: 'center' }}>
              Recomendamos a los clientes verificar las reparaciones realizadas a sus
              equipos en el local una vez entregados los equipos reparados no tienen
              garantía solo cubrimos daños menores como soldaduras o ajuste de
              conectores o similares otro tipo de daños no tienen cobertura.
            </Text>
          </Page>
        </Document>
      </PDFViewer>

    )
}

const style = StyleSheet.create({
    container: {
      fontFamily: 'Helvetica',
      fontSize: 10,
      padding: 10,
      backgroundColor:'white'
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    img: {
      width: 50,
      height: 50,
      marginRight: 10,
    },
    title: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    subTitle: {
      fontSize: 10,
      marginBottom: 3,
    },
    text: {
      fontSize: 8,
      marginBottom: 3,
    },
    line: {
      borderBottomWidth: 1,
      borderBottomColor: 'black',
      marginBottom: 5,
    },
    description: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 3,
    },
    textDesct: {
      fontSize: 8,
    },
    prod: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 3,
    },
    contianerTotal: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 5,
    },
  });