import React,{useState, useEffect} from 'react';
import ax from './utils/axios';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, ReferenceLine, ReferenceArea,
  ReferenceDot, Tooltip, CartesianGrid, Legend, Brush, ErrorBar, AreaChart, Area,
  Label, LabelList } from 'recharts';
import CheckboxAndText from './comps/CheckboxAndText';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './App.scss';


function App() {

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  //utility bill arrays
  const [eBills, setEBills] = useState([]); // Electricity bill array
  const [gBills, setGBills] = useState([]); // Gas bill array
  const [wBills, setWBills] = useState([]); // Water bill array

  //checkbox status
  const [eChecked, setEChecked] = useState(true); //checkbox usestate for electricity
  const [gChecked, setGChecked] = useState(false); //checkbox usestate for gas
  const [wChecked, setWChecked] = useState(false); //checkbox usestate for water

  //date range
  const [from, setFrom] = useState('2010-01');
  const [to, setTo] = useState('2020-07');

  var utilities = []; // checked utility array

  const getElectricityBills = async() => {
    let data = await ax("get", "/electricity-bill-data");
    setEBills(data);
  }

  const getGasBills = async() => {
    let data = await ax("get", "/gas-bill-data");
    setGBills(data);
  }

  const getWaterBills = async() => {
    let data = await ax("get", "/water-bill-data");
    setWBills(data);

  }

  const pickMonth = (month, year, type) =>{
    if(type === "from"){
      setFrom(year.toString()+"-"+(month+1).toString());
    } 
    else if(type === "to"){
      setTo(year.toString()+"-"+(month+1).toString());
    }
  }

  const loopBills = (arr, name)=>{
    // data object for the chart
    let obj = {
      name:name, data:[]
    }

    for(let i=0; i<arr.length; i++){

      if(arr[i].month != 12){
        var category = months[arr[i].month] + " - " + arr[i].year;

        if(name === "Electricity"){    
          obj.data.push({category:category, value:arr[i].k_wh_consumption});
        }
        else if(name === "Gas"){
          obj.data.push({category:category, value:arr[i].g_j_consumption});
        }
        else if(name === "Water"){
          obj.data.push({category:category, value:arr[i].m_3_consumption});
        }

      }

    } 

    return obj;
  }

  const sortBills = (arr) => {
    let filtered = arr.filter((obj)=>{
      var splitFrom = from.split('-');
      var splitTo = to.split('-');

      return splitFrom[0] +"-"+ (Number(splitFrom[1]) - 1).toString() <= obj.year+ "-" + obj.month && obj.year+ "-" + obj.month <= splitTo[0] +"-"+(Number(splitTo[1]) - 1).toString();
    });
    return filtered;
  }

  //if statements for checkboxes if they are checked
  if(eChecked){
    let obj = loopBills(sortBills(eBills), "Electricity");
    utilities.push(obj);
  }
  else{
    utilities.filter((o)=>{
      if(o.name === "Electricity"){
        return false;
      }
      else{
        return true;
      }
    });

  }

  if(gChecked){
    let obj = loopBills(sortBills(gBills), "Gas");
    utilities.push(obj);
  }
  else{
    utilities.filter((o)=>{
      if(o.name === "Gas"){
        return false;
      }
      else{
        return true;
      }
    })
  }

  if(wChecked){
    let obj = loopBills(sortBills(wBills),"Water");
    utilities.push(obj);
  }
  else{
    utilities.filter((o)=>{
      if(o.name === "Water"){
        return false;
      }
      else{
        return true;
      }
    })
  }
    
  useEffect(()=>{
    getElectricityBills();
    getGasBills();
    getWaterBills();
  },[])

  return (
    <div className="app-container">
      <div className="line-chart-wrapper">
        <ResponsiveContainer>
          <LineChart margin={{top:20, right:60, bottom:20, left:5}}>
            <XAxis dataKey="category" type="category" allowDuplicatedCategory={false} />
            <YAxis dataKey="value"/>
            <CartesianGrid strokeDasharray="3 3"/>
            <Tooltip/>
            <Legend />
            {utilities.map((o,i)=> (
              <Line dataKey="value" data={o.data} name={o.name} key={i} stroke={o.name === "Water" ? "blue" : o.name === "Gas" ? "green" : "yellow" } />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="filter-wrapper">
        <b className="title">Filters:</b> <br/><br/>
        <b>Month Range</b>
        <div className="month-filter-wrapper">
          <div className="from-wrapper">
            FROM <br/>
            <DatePicker
              selected={new Date(from)}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              onChange={(d)=>{pickMonth(d.getMonth(), d.getFullYear(), "from")}} 
            /> 
          </div>
          <div className="space-div"></div>
          <div className="to-wrapper">
            TO <br/>
            <DatePicker
              selected={new Date(to)}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              onChange={(d)=>{pickMonth(d.getMonth(), d.getFullYear(), "to")}} 
            />
          </div>
        </div>
        <br/>
        <div className="utility-filter-wrapper">
          <b>Utility Type</b>
          <CheckboxAndText name="Electricity" checked={eChecked} setChecked={setEChecked} />
          <CheckboxAndText name="Gas" checked={gChecked} setChecked={setGChecked} />
          <CheckboxAndText name="Water" checked={wChecked} setChecked={setWChecked} />
        </div>
      </div>
    </div>
  );
}

export default App;
