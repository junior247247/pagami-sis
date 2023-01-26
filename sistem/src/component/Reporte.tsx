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



/*const MyDocument = ({ noFact, detalle, date,subTotal,total }: Props) => {

    return (


        <Document>
            <Page size='A9'>
                <View style={style.header}>
                    <Image style={style.img} source={require('../img/logo-factura.png')} />
                    <View>


                        <Text style={style.title}>FACTURA</Text>
                        <Text style={style.subTitle}>17/12/2023</Text>
                        <Text style={style.subTitle}>NO:0</Text>
                    </View>


                </View>
                <View>
                    <Text style={style.text}>Parque berrio Centro Comercial Metro</Text>
                    <Text style={style.text}>Boyaca Local 111,CL. 51 #51-40</Text>
                    <Text style={style.text}>Medellin ,Antioquia Colombia</Text>
                    <Text style={style.text}>Contacto: +57 3105102274</Text>

                </View>
                <View style={style.line} />
                <Text style={{ ...style.text, marginTop: 5 }}>CLIENTE:JUNIOR JIMENEZ</Text>

                <View style={style.description}>
                    <View>
                        <Text style={{ ...style.textDesct }}>Description</Text>


                    </View>

                    <Text style={{ ...style.textDesct }}>Cant</Text>



                    <Text style={{ ...style.textDesct }}>Precio</Text>


                    <Text style={{ ...style.textDesct, }}>Monto</Text>



                </View>

                <View style={style.prod}>
                    <Text style={style.textDesct}>Agua </Text>
                    <Text style={style.textDesct}>10</Text>
                    <Text style={style.textDesct}>10000</Text>
                    <Text style={style.textDesct}>10000</Text>
                </View>


                <View style={{ ...style.line }} />
                <View style={style.contianerTotal}>
                    <Text style={style.textDesct}>Subtotal:0</Text>
                    <Text style={style.textDesct}>Tasa de impuesto:0</Text>
                    <Text style={style.textDesct}>Impuesto:0</Text>
                    <Text style={style.textDesct}>Total:0</Text>
                </View>
                <View style={{ ...style.line }} />
                <Text style={{ ...style.textDesct, textAlign: 'center', marginTop: 3 }}>Garantia</Text>
                <Text style={{ fontSize: 3, marginHorizontal: 3, textAlign: 'center' }}>
                    Recomendamos a los clientes verificar las reparaciones realizadas a sus
                    equipos en el local una vez entregados los equipos reparados no tienen
                    garantía solo cubrimos daños menores como soldaduras o ajuste de
                    conectores o similares otro tipo de daños no tienen cobertura.
                </Text>

            </Page>
        </Document>
    )
}*/


export const Reporte = ({noFact,detalle,date,subTotal,total,cliente}:Props) => {
    return (
        <PDFViewer style={{ width: '100%', height: '100%' }}>


            <Document>
                <Page size='A9'>
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
                        <Text style={style.text}>Medellin ,Antioquia Colombia</Text>
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


                        <Text style={{ ...style.textDesct, }}>Monto</Text>



                    </View>
                    {
                        detalle.map(resp=>(
                            <View style={style.prod}>
                            <Text style={style.textDesct}>{resp.description} </Text>
                            <Text style={style.textDesct}>{resp.cant}</Text>
                            <Text style={style.textDesct}>{resp.precio}</Text>
                            <Text style={style.textDesct}>{resp.total}</Text>
                        </View>
                        ))
                    }
                


                    <View style={{ ...style.line }} />
                    <View style={style.contianerTotal}>
                        <Text style={style.textDesct}>Subtotal:{subTotal}</Text>
                        <Text style={style.textDesct}>Tasa de impuesto:0</Text>
                        <Text style={style.textDesct}>Impuesto:0</Text>
                        <Text style={style.textDesct}>Total:{total}</Text>
                    </View>
                    <View style={{ ...style.line }} />
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