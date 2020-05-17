import React, { useState, useEffect } from 'react';
import { StyleSheet, View ,Text, TouchableOpacity/* include other react-native components here as needed */ } from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';


// FixMe: implement other components and functions used in StocksScreen here (don't just put all the JSX in StocksScreen below)


const Stock = (props) => {
  let colorToggle;
  (props.open/props.close)>0?colorToggle={backgroundColor:'#33cc33',textAlign:'center',borderRadius:5}:colorToggle={backgroundColor:'#ff0000',paddingLeft:2, textAlign:'center',borderRadius:5};
  return (
    <TouchableOpacity
      style={{  paddingHorizontal: 17, paddingVertical: 12, borderRadius: 4, alignItems: "flex-start", justifyContent: "center", marginBottom: 4,height:50 }}
      onPress={()=>props.bottom({high:props.high, low:props.low, open:props.open, close:props.close, volume:props.volume})}
    >
        <View  style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
        <View style={{width:'50%'}}><Text style={{color:"#ffffff"}}>{props.symbol} </Text></View>
        <View style={{width:'25%'}}><Text style={{color:"#ffffff"}}>{props.close}</Text></View>
        <View style={{width:'25%',paddingLeft:'5%'}}><Text style={colorToggle}>{`${(props.open/props.close).toFixed(2)}%`}</Text></View>
      </View>
        
      
    </TouchableOpacity>
  );
}




export default function StocksScreen({route}) {
  const { ServerURL, watchList } = useStocksContext();
  const [state, setState] = useState([]);
  const [stockinfo, setStockinfo] = useState({open:'',close:'',high:'',low:'',volume:''})

  // can put more code here

  useEffect(() => {
    // FixMe: fetch stock data from the server for any new symbols added to the watchlist and save in local StocksScreen state  
    let SymbolArray=[];
    //console.warn(watchList)

    // Promise.all(watchList.map(url =>fetch(`http://131.181.190.87:3001/history?symbol=${url}`)))
    // .then(responses => Promise.all(responses.map(res => res.json())))
    // .then(texts => {
    //   setState(texts[0])
    // })

    Promise.all( watchList.map(url=>
      fetch(`http://131.181.190.87:3001/history?symbol=${url}`)
      .then(res=>res.json())
      .then(data=> {
        SymbolArray.push(data[0])
      })
    )).then(values =>setState(SymbolArray));
    
  
    
  }, [watchList]);

  const value = (stock) => {
   
    setStockinfo({
      open:stock.open,
      close:stock.close,
      high:stock.high,
      low:stock.low,
      volume:stock.volume
    })

  }

  return (
    <View style={{
      height:'100%',
      flex:1,
      alignItems:'center',
      justifyContent:'flex-start'}}>
      {state.map(i=><Stock symbol={i.symbol} key={i.name} name={i.name} close={i.close} open={i.open} high={i.high} low={i.low} volume={i.volumes} bottom={value}/>)} 
      <View style={styles.panel}>
         <View style={{flex: 1, flexDirection: 'row', borderBottomColor:'#ffffff',borderBottomWidth:'2em',marginTop:'2.5%',marginBottom:'2.5%'}}>
            <View style={{width:'45%',marginLeft:'5%'}}><Text style={{color:'#ffffff'}}>Open: {stockinfo.open}</Text></View>
            <View style={{width:'45%',marginLeft:'5%'}}><Text style={{color:'#ffffff'}}>Close: {stockinfo.close}</Text></View>
          </View>
          <View style={{flex: 1, flexDirection: 'row', borderBottomColor:'#ffffff',borderBottomWidth:'2em',marginTop:'2.5%',marginBottom:'2.5%'}}>
          <View style={{width:'45%',marginLeft:'5%'}}><Text style={{color:'#ffffff'}}>High: {stockinfo.high}</Text></View>
          <View style={{width:'45%',marginLeft:'5%'}}><Text style={{color:'#ffffff'}}>Low: {stockinfo.low}</Text></View>
        </View>
        <Text style={{width:'100%',paddingLeft:'5%',marginTop:'2.5%',marginBottom:'2.5%',color:'#ffffff'}}>Volume: {stockinfo.volume}</Text>
          
       </View>
     
      
      </View>
  );
}

const styles = StyleSheet.create({
  // FixMe: add styles here ...
  // use scaleSize(x) to adjust sizes for small/large screens
  panel:{
    width:'100%',
    height:'25%',
    backgroundColor:"#000000",
    justifyContent:'center',
    alignItems:'center',
    position:'absolute',
    bottom:0,
    borderTopWidth: 2,
    borderTopColor: '#ffffff'

  }

  });