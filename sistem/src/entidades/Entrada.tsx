
export interface Entrada{
    id:string;
    name:string;
    phone:string;
    identiifcation:string;
    correo:string;
    observacion:string;
    fecha:Date;
    costoReparacion:string;
    costoRepuesto:string;
    total:string;
    equipo:string;
    serial:string;
    estado:string;

}

export interface Caracteristicas{
    encendido:boolean;
    description?:string;
    observacion?:string;
    pantalla:boolean;
    audio:boolean;
    microfono:boolean;
    senal:boolean;
    wifi:boolean;
    camara1:boolean;
    camara2:boolean;
    carga:boolean;
    auricular:boolean;
    altavoz:boolean;
    sensores:boolean;
    bateria:boolean;
    flash:boolean;
    botones:boolean;
    software:boolean;
    recalentamiento:boolean;
    malware:boolean;
    piezas:boolean;
    reportado:boolean;
    costoReparacion?:number;
    costoRepuesto?:number;
    total?:number;
    equipo?:string;
    serial?:string;
    noFact?:string;
    cliente?:string;
    fecha:Date;
    


}
