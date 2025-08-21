import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

const items = [
       { name: "Daily Life" },
    { name: "Food & Drink" },
    { name: "Festivals" },
    { name: "Nature" },
    { name: "Transport" }
]
const getFiltereditems = (query,items) =>{
   if(!query){
        return [];
    }
    return items.filter(item =>{
      item.name.toLowerCase().includes(query.toLowerCase()) 
    }
);
}
const Favourites =() =>{
    const [query, setQuery] = useState("")
 const filteredresult = getFiltereditems(query,items);
    return (
        <>

<div className="cat-header">
    <h1 className="header-content"> Your Favourites</h1>
    <div className="header-desc"> ..saved </div>
</div>
 <div className='input-wrapper'> 
       <FaSearch className="search-icon" />
      <input type = "text" onChange={e => setQuery(e.target.value)} />
  <ul>
    {filteredresult.map((value) =>(
        <h1 key = {value.name}>{value.name} </h1>
    ))}
  </ul>
  </div>
                <div className="stats-section">
<div className="stats-grid">
    {query && filteredresult.length === 0 && (
        <p style={{fontSize: "1.2rem", color:"#555"}}>
            No result Found
        </p>
    )}
    <div className="stat-card">
    <div className="stat-icon">
            🏠
            </div>     <div className="stat-title">
            Daily Life
        </div>
        <p className="stat-label"> Essential Words for everyday activities</p>
        <button className="start-button">  <i className="fa-solid fa-chevron-right"></i>Start Learning
            </button>
    </div>
    
    </div>
    </div> 


    </>
)
}

export default Favourites