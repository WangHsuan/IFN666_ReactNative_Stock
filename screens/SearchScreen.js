import React, { useState, useEffect } from 'react';
import {Text, StyleSheet, View, TouchableWithoutFeedback, Keyboard ,TextInput,TouchableOpacity} from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';
import { Ionicons } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';

// FixMe: implement other components and functions used in SearchScreen here (don't just put all the JSX in SearchScreen below)


const SearchBar = (props) =>{

  const [value, onChangeText] = React.useState('');

  return (
    
    <View style={{flexDirection: 'row',width:'100%',justifyContent:'flex-start',marginTop:5}}>
      <EvilIcons name="search" size={24} color="white" style={styles.searchIcon} />
      <TextInput
        style={styles.searchBar}
        onChangeText={text => {
          onChangeText(text)
          props.search(text)
        } }
        value={value}
        
      />
    
    </View>
    
  );
}

const AddStockToList = (props) => {
  return (
    <TouchableOpacity
      style={styles.addStockList}
      onPress={() => props.onPress(props.symbol)}
    >
      <Text style={styles.StockText}>{props.symbol}</Text>
      <Text style={styles.StockText}>{props.name}</Text>
    </TouchableOpacity>
  );
}




export default function SearchScreen({ navigation }) {
  const { ServerURL, addToWatchlist,watchList } = useStocksContext();
  const [stocklist, setStocklist] = useState([]);

  //me
 
  const [SourceStockList, setSourceStockList] = useState([]);
  const [shownull, setShownull] = useState('');
  // can put more code here

  const searchFilter = text =>{
    // console.log(text);
    if( text === ''){
      setStocklist([])
    }else{
      setShownull(text);
      let _stocklist =[...SourceStockList];
      _stocklist = _stocklist.filter(i=>{
        const matchFilter = i.symbol.match(new RegExp(text,'gi')) || i.name.match(new RegExp(text,'gi'));
        return !!matchFilter
      })
      setStocklist(_stocklist)
    }
   
  }


  useEffect(() => {
    // FixMe: fetch symbol names from the server and save in local SearchScreen state
    fetch(`http://131.181.190.87:3001/all`)
    .then(res => res.json())
    .then(data =>
     {
      setStocklist(data)
      setSourceStockList(data);
     })
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
      <SearchBar search={searchFilter}/>
       
       {shownull ===''?<Text></Text>:
           stocklist.map(i => 
                 < AddStockToList 
                     symbol={i.symbol} 
                     name={i.name} 
                     key={i.symbol} 
                     onPress={text => 
                         {
                           
                           if(watchList.indexOf(text)<0){
                            addToWatchlist(text);
                             navigation.navigate('Stocks');
                           }else{
                             alert('The stock already in watchlist')
                           }
                           
                       }}
                      />)}
     
      </View>
    </TouchableWithoutFeedback>    
  )
}

const styles = StyleSheet.create({
// FixMe: add styles here ...
// use scaleSize(x) to adjust sizes for small/large screens
searchIcon: {
  padding: 10,
},
searchBar:{
  color:"#ffffff", 
  height: scaleSize(40), 
  borderColor: 'gray', 
  borderWidth: scaleSize(1),
  width:scaleSize(300),
  borderRadius:10
},

addStockList:{
  paddingHorizontal: scaleSize(17), 
  paddingVertical: scaleSize(12), 
  borderRadius: scaleSize(4), 
  alignItems: "flex-start", 
  justifyContent: "center", 
  marginBottom: scaleSize(4)
},
StockText:{
  color:"#ffffff"
}
});