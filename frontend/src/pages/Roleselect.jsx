import React, { useState } from "react";
// import RolePlay from "../pages/Roleplay";
import "../style/role.css"
import RoleApp from "../Roleplay/roleapp";

const rolecards=  [
    {
        id : "market",
        title:"Market Explorer",
        description:"Learn to shop and bargain",
        difficulty:"easy",
         color:"#EF4444"
        },
    {
     id : "festival",
     title: "Festival helper",
        description:"Celebrate dashain with your family!",
        difficulty:"medium",
         color:"#8bb8c7"
    },
    {
        id : "greeting",
        title:"Greeting",
        description:"Greet Your Parents",
        difficulty:"hard",
         color:"#3B82F6"
    },

]
    const RoleSelect = ({startRolePlay, onNavigate}) =>{
        const[selectedrole, setSelectedrole] = useState(null);

        const handleroleselect  = (roleId) =>{
            setSelectedrole(roleId)
    }

    const handleRoleSubmit = () =>{
        if(selectedrole){
            if(startRolePlay){
                startRolePlay(selectedrole);
            }
            if(onNavigate){
              onNavigate('roleapp', selectedrole)  
            }
        }else{
            alert('Please select a role first')
        }
    };

return(
    <>
    <div className="role-container">
<div className="Role-card">
        <h2> Hey! select role you want to play to learn</h2>

    <div className="role-choose">
        {rolecards.map((role) =>{
return <div 
            key = {role.id} 
            onClick={() => handleroleselect(role.id)} 
            className={`role-slot ${selectedrole === role.id ? 'selected' : ''}`}
            style={{ borderColor: selectedrole === role.id ? role.color : '#e5e7eb'}}
            > 
            <div className="role-color-indicator" style={{ backgroundColor: role.color }}>  </div>
                <h3 className="role-sub">{role.title}  </h3>
                <p className="role-desc"> {role.description} </p>
                <div className="diff-card">
                    <span className= {`difficulty ${role.difficulty}`}> {role.difficulty}</span>
                </div>
                </div>
        })}
    </div>


 
     <button className={`role-button ${selectedrole ? 'active' : 'inactive'}`} onClick={handleRoleSubmit} disabled={!selectedrole}>
        {selectedrole ? 'Start Role Play!':' Choose Your Role '}
         </button>
    </div>
       </div>
    </>
)
}

export default RoleSelect