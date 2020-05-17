import React, { useState, useContext, useEffect } from "react";
import { AsyncStorage } from "react-native";

const StocksContext = React.createContext();

export const StocksProvider = ({ children }) => {
  const [state, setState] = useState([]);

  return (
    <StocksContext.Provider value={[state, setState]}>
      {children}
    </StocksContext.Provider>
  );
};

export const useStocksContext = () => {
  const [state, setState] = useContext(StocksContext);

  // can put more code here

  async function retrieveData() {
  
    
      const value = await AsyncStorage.getItem('symbols');
     // console.warn(`value:${value}`)
      if(value === null){
        setState([])
      }
      if(value!==null){
        setState(value.split(','))
        }
          
  }

  const addToWatchlist = async (newSymbol) =>{
    //FixMe: add the new symbol to the watchlist, save it in useStockContext state and persist to AsyncStorage

    try { 

      // await AsyncStorage.removeItem("symbols");
      // setState([])
      
     //console.warn(state.concat(newSymbol).toString())
      await AsyncStorage.setItem("symbols",state.concat(newSymbol).toString());
      setState(state.concat(newSymbol))

    } catch {
      alert("There was an error saving.");
    }
    
    setState(state.concat(newSymbol))
  }

  useEffect(() => {
    // FixMe: Retrieve watchlist from persistent storage
    retrieveData()
  }, []);

  return { ServerURL: 'http://131.181.190.87:3001', watchList: state,  addToWatchlist };
};
