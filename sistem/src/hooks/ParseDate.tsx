export const ParseToDate=(fecha:Date):string=>{
    let day=fecha.getMonth()+1;
    let dayAll='';
    let allMes='';
   if(day>=1  &&  day <10){
    dayAll='0'+day;
   }else{
    dayAll=String(day);
   }
   let dayNow=fecha.getDate() ;

   if(dayNow>=1 && dayNow < 10){
    allMes='0'+dayNow;
   }else{
    allMes=String(dayNow);
   }
    return  allMes + '-' + dayAll + '-' + fecha.getFullYear();
}