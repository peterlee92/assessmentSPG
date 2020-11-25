import ax from 'axios';

export const host = "http://localhost:8000";

export default async (type, param, data) => {
    let resp;
    if(type === "get"){
        try{
            resp = await ax(host+param);
        }
        catch(e){
            resp = false;
        }   
    }
    else if(type === "post"){
        try{
            resp = await ax.post(host+param, data);
        }
        catch(e){
            resp = false;
        }
    }

    return resp.data.responses['200']['content']['application/json']['schema']['items'];
}