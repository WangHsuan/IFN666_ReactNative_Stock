import React, { useState, useEffect } from 'react';
import { StyleSheet, View ,Text, TouchableOpacity/* include other react-native components here as needed */ } from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';


// FixMe: implement other components and functions used in StocksScreen here (don't just put all the JSX in StocksScreen below)


const Stock = (props) => {
  let colorToggle;
  (props.close>props.open)?colorToggle={backgroundColor:'#33cc33',textAlign:'center',borderRadius:10}:colorToggle={backgroundColor:'#ff0000',paddingLeft:2, textAlign:'center',borderRadius:10};
  return (
    <TouchableOpacity
      style={styles.Stock}
      onPress={()=>props.bottom({high:props.high, low:props.low, open:props.open, close:props.close, volume:props.volume,name:props.name})}
    >
        <View  style={styles.StockItem}>
        <View style={{width:'50%'}}><Text style={{color:"#ffffff"}}>{props.symbol} </Text></View>
        <View style={{width:'20%'}}><Text style={{color:"#ffffff"}}>{props.close}</Text></View>
        <View style={{width:'30%',borderRadius:10,paddingLeft:'5%'}}><Text style={colorToggle}>{`${props.close>props.open?'':'-'}${(props.close/props.open).toFixed(2)}%`}</Text></View>
      </View>
        
      
    </TouchableOpacity>
  );
}




export default function StocksScreen({route}) {
  const { ServerURL, watchList } = useStocksContext();
  const [state, setState] = useState([]);
  const [stockinfo, setStockinfo] = useState({open:'',close:'',high:'',low:'',volume:'',name:''})

  // can put more code here

  useEffect(() => {
    // FixMe: fetch stock data from the server for any new symbols added to the watchlist and save in local StocksScreen state  
   
    
    Promise.all( watchList.map(url=>
      fetch(`http://131.181.190.87:3001/history?symbol=${url}`)
      .then(res=>res.json())
      .then(data=> {
        return data[0]
      })
    )).then(values =>{
      // console.warn(values);
      setState(values)
    });
    
  
    
  }, [watchList]);

  const value = (stock) => {

    setStockinfo({
      open:stock.open,
      close:stock.close,
      high:stock.high,
      low:stock.low,
      volume:stock.volume,
      name:stock.name
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
        <View style={styles.panelTitle}><Text style={styles.Textcolor}>{stockinfo.name}</Text></View>
         <View style={{flex: 1, flexDirection: 'row', borderTopColor:'#ffffff',borderTopWidth:1,borderBottomColor:'#ffffff',borderBottomWidth:1,marginTop:1,marginBottom:1,paddingTop:1}}>
            <View style={styles.Textbox}><Text style={styles.Textcolor}>Open: {stockinfo.open}</Text></View>
            <View style={styles.Textbox}><Text style={styles.Textcolor}>Close: {stockinfo.close}</Text></View>
          </View>
          <View style={{flex: 1, flexDirection: 'row', borderBottomColor:'#ffffff',borderBottomWidth:1,marginTop:1,marginBottom:1}}>
          <View style={styles.Textbox}><Text style={styles.Textcolor}>High: {stockinfo.high}</Text></View>
          <View style={styles.Textbox}><Text style={styles.Textcolor}>Low: {stockinfo.low}</Text></View>
        </View>
        <Text style={styles.finalText}>Volume: {stockinfo.volume}</Text>
          
       </View> 
      
      
      </View>
  );
}

const styles = StyleSheet.create({
  // FixMe: add styles here ...
  // use scaleSize(x) to adjust sizes for small/large screens
  Textcolor:{
    color:'#ffffff'
  },
  Textbox:{
    width:scaleSize(150),
    marginLeft:5
  },
  finalText:{
    width:scaleSize(310),
    paddingLeft:5,
    marginTop:2,
    marginBottom:2,
    color:'#ffffff'
  },
  panelTitle:{
    padding:1
  },
  panel:{
    width:scaleSize(375),
    height:scaleSize(100),
    backgroundColor:"#000000",
    justifyContent:'center',
    alignItems:'center',
    position:'absolute',
    bottom:0,
    borderTopWidth: 2,
  },
  Stock:{
    paddingHorizontal: scaleSize(17), 
    paddingVertical: scaleSize(12), 
    borderRadius: 4, 
    alignItems: "flex-start", 
    justifyContent: "center", 
    marginBottom: 4,
    height:scaleSize(50)
  },
  StockItem:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  }

  });