const csv = require('csvtojson');
const models = require('./models.json');

async function readBills(params){

    try{
        var data = await csv().fromFile('data/' + models[params.dataType]);
    }
    catch(err){
       return err.message; 
    }

    data.sort(function(a,b){

        a.year = Number(a.year);
        a.month = Number(a.month);
        if(a.k_wh_consumption){a.k_wh_consumption = Number(a.k_wh_consumption)};
        if(a.g_j_consumption){a.g_j_consumption = Number(a.g_j_consumption)};
        if(a.m_3_consumption){a.m_3_consumption = Number(a.m_3_consumption)};

        if(a.year === b.year){
            return a.month - b.month;
        }

        else{
            return a.year - b.year;
        }
        
    });


    return {
        responses:{
            '200':{
                description:"Array of ElectricityConsumption model instances",
                content:{
                    'application/json':{
                        schema:{
                            type:"array",
                            items:data
                        }
                    }
                }
            }
        }
    };
}

module.exports = {
    readBills:readBills
}