
import RoleSelect from "./Roleselect";
import { useState } from "react";
import "../style/chat.css"

const ChatView =() =>{
  const scenario = scenarios[selectedRole];
  const currentScenario =scenario.steps[currentstep]
  const progress  = ((currentStep +1) / scenario.steps.length) * 100;
const [goback, setGoback] = useState();
const handleSubmit = ((onNavigate) =>{
      const goBack  = () =>{
onNavigate('role')
    }
})
return (
  <div className="min-h-screen" style={{background:scenario.background}}>
<div className="back-to-role">
              <button className="role-button" onClick={goBack}> ←Back to Roles </button>
                 <div className="chat-header">
      <h3> Ason Bazaar Shopping</h3>
     </div>
</div>

  </div>

  
    );
  };

  export default ChatView