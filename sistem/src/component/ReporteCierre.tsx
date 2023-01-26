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

interface Props{
    gastos:number;
    ventas:number;
    dineroCaja:number;
    fondo:number;
}

export const ReporteCierre = ({gastos,ventas,dineroCaja,fondo}:Props) => {
  return (
   

    <PDFViewer style={{ width: '100%', height: '100%' }}>


    <Document>
        <Page size='A9'>
            <View style={style.header}>
                <Image style={style.img} source={require('../img/logo-factura.png')} />
                <View>


                    <Text style={style.title}>FACTURA</Text>
                    <Text style={style.subTitle}></Text>
                    <Text style={style.subTitle}>NO:</Text>
                </View>


            </View>
            <View>
                <Text style={style.text}>Parque berrio Centro Comercial Metro</Text>
                <Text style={style.text}>Boyaca Local 111,CL. 51 #51-40</Text>
                <Text style={style.text}>Medellin ,Antioquia Colombia</Text>
                <Text style={style.text}>Contacto: +57 3105102274</Text>

            </View>
      
            

          
            
              
              
            
        


            <View style={{ ...style.line }} />
            <View style={style.contianerTotal}>
                <Text style={style.textDesct}>INGRESOS:{ventas}</Text>
                <Text style={style.textDesct}>RETIROS:{gastos}</Text>
                <Text style={style.textDesct}>RETIROS MENOS INGRESOS:{ventas-ventas}</Text>
                <Text style={style.textDesct}>TOTAL:{dineroCaja}</Text>
             
            </View>
            <View style={{ ...style.line }} />
         

        </Page>
    </Document>
</PDFViewer>


  )
}





const style = StyleSheet.create({
    contianerTotal: {
        alignItems: 'flex-end',
        marginTop: 5

    },
    prod: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 5,
        marginVertical: 2
    },
    textDesct: {
        fontSize: 4,
        width: 100,

    },
    description: {

        flexDirection: 'row',
        marginLeft: 5,
        marginRight: 5,
        borderBottomWidth: .5,
        borderTopWidth: .5,
        marginBottom: 5,
        paddingTop: 2,
        paddingBottom: 2,
        marginTop: 3,
        borderStyle: 'dashed',

        justifyContent: 'space-between'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
        alignItems: 'center'
    },
    img: {
        width: 30,
        height: 10,


    },
    mt: {

    },
    title: {
        fontSize: 4
    },
    subTitle: {
        fontSize: 2,
        marginTop: 1
    },
    text: {
        fontSize: 5,
        textAlign: 'left',
        marginLeft: 5
    },
    line: {

        borderTopWidth: .5,
        height: 1,
        width: '88%',
        borderStyle: 'dashed',
        borderTopColor: 'black',
        marginLeft: 5,
        marginTop: 5
    }
})