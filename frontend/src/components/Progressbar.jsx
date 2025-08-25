import React from "react";
import { scenarios } from "../Roleplay/rolecomponents/scenarios";

 export const ProgressBar =({current,total}) => {

return (
<div style={progresscontainer}>
<div style={progressheader}>
    <span> Scene {current+1}/{total}</span>
</div>
<div style={progresstrack}>
<div style={progressfill}>
</div>
</div>
 </div>
);

 }

const progresscontainer ={
    padding:'16px',
    backgroundColor: '#6b7280'

 };

 const progressheader ={
    display: 'flex',
    alignItems:'center',
    justifyContent: 'space-between',
    fontSize : '14px',
    color: '#4b5563',
    marginBottom: '8px'
 };

 const progresstrack ={
width: '100%',
backgroundColor:'e5e7eb',
borderRadius : '9999px',
height:'8px'
 };

 const progressfill = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    height:'8px',
    borderRadius:'9999px',
    transition: 'all 0.3s ease',
    width:`${((current+1) / total) * 100}%`
 }


