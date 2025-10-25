
import './App.css';
import { useEffect, useState} from 'react'
import MapComponents from './components/MapComponents'
import axios from "axios";


function App() {
  //setting up the initial state variables
  const [ipDetails, setIpDetails]=useState([]);
  const [lat, setLat]=useState(22.57260);
  const [lon,setLon]=useState(88.3832);

  //Fetching the API once when the component is mounted
  useEffect(() => {
    axios.get("https://ipwho.is/")
      .then((res) => {
        setIpDetails(res.data);
        setLat(Number(res.data.latitude));
        setLon(Number(res.data.longitude));
      })
      .catch((err) => console.error(err));
  }, []);
  

  return (
   <>
   <h1 className='heading'>IP Address Finder</h1>
   <div className='App'>
     <div className='left'>
      <h3>What is my IP4 address</h3>
      <h1 id='ip'>{ipDetails.ip}</h1>
      <h4>Approximate location:</h4>

      <p>{ipDetails.city}, {ipDetails.region}, {ipDetails.country_name}.</p>

      <h4>Internet Service Provider(ISP):</h4>
      <p>{ipDetails.connection?.isp || "Not available"}</p>
      <h4>Timezone: {ipDetails.timezone?.id}</h4>


     </div>
     {lat && lon && <MapComponents lat={lat} lon={lon} />}
   </div>
    </>
  );
}

export default App;
