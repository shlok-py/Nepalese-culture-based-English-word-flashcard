import React, { useState } from "react";

const HeartButton = () =>{
const [liked,setliked] = useState(false);
  return (
    <button
      onClick={() => setliked(!liked)}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        fontSize: "24px"
      }}
    >
      {liked ? (
        <i className="fa-solid fa-heart" style={{ color: "red" }}></i>
      ) : (
        <i className="fa-regular fa-heart"></i>
      )}
    </button>
  );
};


export default HeartButton