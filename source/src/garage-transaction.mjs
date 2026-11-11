// Aplica uma operação da Oficina Farol em uma cópia, sem arriscar os créditos do save original.
export function commitGarageMutation(current,mutate,storage,key='carga-pesada-v1'){
 let staged;
 try{staged=JSON.parse(JSON.stringify(current));}
 catch{return {ok:false,reason:'invalid',save:current};}
 try{
  if(mutate(staged)!==true||!Number.isFinite(staged.money)||staged.money<0)
   return {ok:false,reason:'rejected',save:current};
 }catch{return {ok:false,reason:'rejected',save:current};}
 try{storage.setItem(key,JSON.stringify(staged));}
 catch{return {ok:false,reason:'storage',save:current};}
 return {ok:true,reason:null,save:staged};
}
