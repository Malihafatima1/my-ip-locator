import React from "react"
const HistoryList = ({ searchHistory = [], onSelect }) => {
if(!searchHistory.length) return <p style={{opacity:0.7}}>No recent searches</p>

    return(

         <div className="history-list">
                  {searchHistory.map((h)=>(
                    <li key={h.ip} className="history-item" onClick={()=>onSelect(h)}>
                                 <div className="history-left">
                                    <strong>{h.ip}</strong>
                                    <div className="history-location">{h.city || 'unknown'},{h.region || ''} {h.country || ''}</div>
                                 </div>
                                 <div className="history-right">
                                    <small>{new Date(h.timestamp).toLocaleTimeString()}</small>
                                 </div>
                    </li>
                  ))}
        </div>
    );
};

export default HistoryList;