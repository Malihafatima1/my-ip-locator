
import './App.css';
import { useEffect, useState} from 'react'
import MapComponents from './components/MapComponents'
import axios from "axios"
import HistoryList from './components/HistoryList'


function App() {

 
  //setting up the initial state variables
  const [ipDetails, setIpDetails]=useState({});
  const [lat, setLat]=useState(22.57260);
  const [lon,setLon]=useState(88.3832);
  const [searchIP,setSearchIP]=useState('');
  const [loading,setLoading]=useState(true);
  const[error,setError]=useState('');
  const[searchHistory,setHistory]=useState([]);

  const HISTORY_KEY="ip_finder_history_v1";
  const MAX_HISTORY=5;

  //Load history from localstorage on mount
  useEffect(()=>{
    const raw=localStorage.getItem(HISTORY_KEY);
    if(raw){
      try{
        setHistory(JSON.parse(HISTORY_KEY));
      } catch(e){
        console.warn("Failed to parse history");
      }
    }
  },[]);

  //persist history whenever it changes
  useEffect(()=>{
    localStorage.setItem(HISTORY_KEY, JSON.stringify(searchHistory));
  },[searchHistory]);

  //add an item to history (most recent first , unique by IP,limit MAX_HISTROY)
  function addToHistory(item){
    setHistory(prev=>{
      const filtered=prev.filter(h=>h.ip !== item.ip);
      const newHist=[item, ...filtered].slice(0,MAX_HISTORY);
      return newHist
    });
  }

 //unified search handler using async/awit
 async function handleSearch() {
  
  const trimmed=searchIP.trim();
  if(!trimmed){
    setError("Please enter an IP address");
    setLoading(false);
    setTimeout(()=>setError(''),3000);
    return;
  }
  setLoading(true);
  setError('');

  try {
    const res=await axios.get(`https://ipwho.is/${trimmed}`);
    if(res.data.success===false){
      setError("Invalid IP address. Try again!");
      return;
    }
    setIpDetails(res.data);
    setLat(Number(res.data.latitude));
    setLon(Number(res.data.longitude));


    //add compact object to history
    addToHistory({
      ip: res.data.ip,
        city: res.data.city || '',
        region: res.data.region || '',
        country: res.data.country || '',
        latitude: Number(res.data.latitude) || 0,
        longitude: Number(res.data.longitude) || 0,
        timestamp: Date.now()

    });
    setSearchIP('');
  } catch(err){
    console.error(err);
    setError("Failed to fetch data...");
  }finally{
    setLoading(false);
  }
  
}

//handle enter key
 const handleKeyDown = (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
};


//Auto clear error
useEffect(()=>{
  if (error){
    const timer=setTimeout(()=>{
      setError('');
    },3000);
     // Cleanup timer if component unmounts or error changes

     return ()=>clearTimeout(timer);
  }
},[error]);


  //initial fetch  for user's IP on mount
  useEffect(()=>{
    async function fetchInitial() {
      setLoading(true);
      try{
        const res=await axios.get("https://ipwho.is/");
        setIpDetails(res.data);
        setLat(res.data.latitude);
        setLon(res.data.longitude);

        //add initial to history as well
        addToHistory({
          ip: res.data.ip,
          city: res.data.city || '',
          region: res.data.region || '',
          country: res.data.country || '',
          latitude: Number(res.data.latitude) || 0,
          longitude: Number(res.data.longitude) || 0,
          timestamp: Date.now()
        });
      }catch(err){
        console.log(err);
        setError("Failed to load data");
      }finally{
        setLoading(false);
      }
    }
    fetchInitial();

  },[]);

  //when user clickcs a history item:Set ipDetails + Map coords

  function handleHistorySelect(item){
    setIpDetails({
      ip: item.ip,
      city: item.city,
      region: item.region,
      country: item.country,
      flag: ipDetails.flag
    });
    setLat(item.latitude);
    setLon(item.longitude);

    //move selected item to top of history
    addToHistory(item);
  }
  

  return (
   <>
   <h1 className='heading'>IP Address Finder</h1>

   <div className="search-bar">
    <input type="text"
    placeholder='Enter an IP address' 
    value={searchIP}
    onChange={(e)=>setSearchIP(e.target.value)}
    onKeyDown={handleKeyDown} 
    autoFocus
    />
    <button onClick={handleSearch}>Search</button>
    {loading && <p>Loading data...</p>}
    {error && <p className="error-div">{error}</p>}
   </div>

   <div className='App'>
     <div className='left'>
      <h3>  My IP4 address</h3>
      <h1 id='ip'>{ipDetails.ip}</h1>

      <h4>Approximate location:</h4>

      <p>
    {ipDetails.city || "Unknown"}, {ipDetails.region || "Unknown"}, {ipDetails.country || "Unknown"}{" "}
    {ipDetails.flag?.img && <img src={ipDetails.flag.img} alt="Flag" width={25} />}
  </p>

      <h4>Internet Service Provider(ISP):</h4>
      <p>{ipDetails.connection?.isp || "Not available"}</p>
      <h4>Timezone: {ipDetails.timezone?.id}</h4>


     </div>
     {lat && lon && <MapComponents lat={lat} lon={lon} />}
   </div>

   {/*  Histroy below the map*/ }
   <div className="history-section">
    <h3>Recent searches</h3>
  <HistoryList searchHistory={searchHistory} onSelect={handleHistorySelect}/>
   </div>

   <footer className="footer">
  <p>Made with ❤️ by <strong>Maliha Fatima</strong></p>
</footer>

    </>
  );
}

export default App;
