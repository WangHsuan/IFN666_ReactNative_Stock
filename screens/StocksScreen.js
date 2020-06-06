import React, { useState, useEffect } from 'react';
import { StyleSheet, View ,Text, TouchableOpacity, ScrollView /* include other react-native components here as needed */ } from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';


// FixMe: implement other components and functions used in StocksScreen here (don't just put all the JSX in StocksScreen below)


const Stock = (props) => {
  let colorToggle;
  (props.close>props.open)?colorToggle={backgroundColor:'#33cc33',textAlign:'center',borderRadius:10}:colorToggle={backgroundColor:'#ff0000',paddingLeft:2, textAlign:'center',borderRadius:10};
  return (
    <TouchableOpacity
      style={styles.Stock}
      onPress={()=>
       {
        props.bottom({high:props.high, low:props.low, open:props.open, close:props.close, volume:props.volume,name:props.name})
        props.sethigh(props.name)
       }
        
      }
    >
      
        <View  style={props.name === props.checkhighlight?styles.highlighted:styles.StockItem}>
        <View style={styles.left}><Text style={{color:"#ffffff"}}>{props.symbol} </Text></View>
        <View style={styles.middle}><Text style={{color:"#ffffff"}}>{props.close}</Text></View>
        <View style={styles.right}><Text style={colorToggle}>{`${props.close>props.open?'':'-'}${(props.close/props.open).toFixed(2)}%`}</Text></View>
      </View>
      
    </TouchableOpacity>
  );
}




export default function StocksScreen({route}) {
  const { ServerURL, watchList } = useStocksContext();
  const [state, setState] = useState([]);
  const [stockinfo, setStockinfo] = useState({open:'',close:'',high:'',low:'',volume:'',name:''})
  const [highligh, setHighligh] = useState('')
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

  const sHighLight = (value) => {
   
    setHighligh(value)
  }

  
  return (
   
    <View style={{
      height:'100%',
      flex:1,
      alignItems:'center',
      justifyContent:'flex-start'}}>
       <View  style={styles.scroll}>
        <ScrollView >
        {state.map(i=><Stock symbol={i.symbol} key={i.name} name={i.name} close={i.close} open={i.open} high={i.high} low={i.low} volume={i.volumes} bottom={value} sethigh={sHighLight} checkhighlight={highligh} />)} 
        </ScrollView>
      </View> 
      <View style={styles.panel}>
        <View style={styles.panelTitle}><Text style={styles.panelText}>{stockinfo.name}</Text></View>

        <View style={styles.panelContent}>
            <View style={styles.Textbox}>
                <Text style={styles.contentText}>OPEN</Text>
                <Text style={styles.Infocolor}>{stockinfo.open}</Text>
              </View>
              <View style={styles.Textbox}>
                <Text style={styles.contentText}>CLOSE</Text>
                <Text style={styles.Infocolor}>{stockinfo.close}</Text>
              </View>
            
        </View>

        <View style={styles.panelContent}>
              <View style={styles.Textbox}>
                <Text style={styles.contentText}>HIGH</Text>
                <Text style={styles.Infocolor}>{stockinfo.high}</Text>
              </View>
              <View style={styles.Textbox}>
                <Text style={styles.contentText}>LOW</Text>
                <Text style={styles.Infocolor}>{stockinfo.low}</Text>
              </View>
        </View>
        <View style={styles.panelContent}>
              <View style={styles.Textbox}>
                <Text style={styles.contentText}>VOLUME</Text>
                <Text style={styles.Infocolor}>{stockinfo.volume}</Text>
              </View>
              <View style={styles.Textbox}>
                <Text style={styles.contentText}></Text>
                <Text style={styles.Textcolor}></Text>
              </View>
        </View>
       </View> 
      
      
      </View>
     
  );
}

const styles = StyleSheet.create({
  // FixMe: add styles here ...
  // use scaleSize(x) to adjust sizes for small/large screens
  scroll:{
    height:scaleSize(400)
  },
  Textcolor:{
    color:'#ffffff'
  },
  Textbox:{
    width:scaleSize(150),
    padding:2,
    marginLeft:3,
    flex:1,
    flexDirection: 'row',
    justifyContent:'space-between'
  },
  finalText:{
    width:scaleSize(375),
    color:'#ffffff'
  },
  panelTitle:{
    padding:1,
    borderBottomColor:'#ffffff',
    borderBottomWidth:1,
    padding:5,
    width:scaleSize(375)
  },
  panel:{
    width:scaleSize(375),
    height:scaleSize(110),
    backgroundColor:"#3f3f40",
    justifyContent:'center',
    alignItems:'center',
    position:'absolute',
    bottom:0,
    borderTopWidth: 2,
    zIndex: 1
  },
  panelContent:{
    flex: 1,
    flexDirection: 'row', 
    borderBottomColor:'gray',
    borderBottomWidth:1,
    marginTop:1,
    marginBottom:1,
    paddingTop:1,
    width:scaleSize(375)
  },
  panelText:{
    textAlign:'center',
    color:'#ffffff',
    fontSize:16
  },
  contentText:{
    color:'gray',
    fontSize:10
  },
  Infocolor:{
    color:'white',
    fontSize:10
  },
  Stock:{
    
   borderBottomWidth:1,
   borderBottomColor:"gray",
    alignItems: "flex-start", 
    justifyContent: "center", 
    height:scaleSize(50)
  },
  StockItem:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding:5
  },
  highlighted: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: 'gray',
    padding:5
  },
  left:{
    width:scaleSize(190)
  },
  middle:{
    width:scaleSize(90)
  },
  right:{
    width:scaleSize(75),
    borderRadius:10,
   
  }

  });