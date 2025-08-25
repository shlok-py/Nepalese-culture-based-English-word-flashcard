
import React from "react";
import Role from "../Roleplay/Roleselect";

const RolePlay = ({onNavigate}) =>{
      const goBack  = () =>{
onNavigate('role')
    }
return(
    <>
    <div> HI i am roleplay</div>
            <button className="role-button" onClick={goBack}> Back to roleselection </button>
    </>
)
}

export default RolePlay