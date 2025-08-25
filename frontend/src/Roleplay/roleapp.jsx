// // import { useState } from "react";
// // import { scenarios } from "./rolecomponents/scenarios"
// // import { ProgressBar } from "../components/Progressbar";
// // const RoleApp = () =>{
// // const [currentScenario , setCurrentScenario] = useState(0);
// // const [currenScene, Setcurrentscene] = useState(0);
// // const [score,setScore] = useState(0);


// // const [gamestate, setGamestate] = useState({
// //     currentScenario: 0,
// //     currenScene: 0,
// //     score : 0,
// //     totalScenes : scenarios.length * 3

// // });

// // const handleAnswer = (correct) =>{
// //     if(correct){
// //         setGamestate(prev => ({ ...prev, score: prev.score + 1}));
// //     }
// // };

// // const handleNext = () =>{
// //     const {currentScenario, currenScene} = gamestate;
// //     const currentScenariodata = scenarios[currentScenario];

// //     if(currenScene < currentScenariodata.scenes.length -1){

// //         // NEXT SCENE
// //         setGamestate(prev => ({...prev, currenScene:prev.currenScene + 1}));
// //     }else {
// //         const nextScenario = (currentScenario +1) % scenarios.length;
// //         setGamestate(prev =>({
// //             ...prev,
// //             currentScenario: nextScenario,
// //             currenScene : 0,
// //         }));
// //     }
// // };

// // const reset = () =>{
// //     setGamestate({
// //         currentScenario:0,
// //         currenScene: 0,
// //         score:0,
// //         totalScenes: scenarios.length * 3
// //     })
// // }

// // return (
// //     <div className="roleapp">
// //   <ProgressBar current={currenScene} total={3} />
// //   <ScenenarioCard scene = {scenarios[currentScenario].scenes[currenScene]}
// //   onAnswer = {handleAnswer}
// //   onNext = {handleNext} 
// //   />
// //     </div>
// // )
// // }

// // export default RoleApp


// import { useState } from "react";
// import { ScenarioCard } from "./Scenarios";   // ✅ fixed name
// import { scenarios } from "./rolecomponents/scenarios";
// import { ProgressBar } from "../components/Progressbar";

// const RoleApp = ({selectedRole}) => {

//     // const rolescenario = {
//     //     market : 0,
//     //     festival : 1,
//     //     greeting: 2,
//     // };
//   const [gamestate, setGamestate] = useState({
//     currentScenario: rolescenario[selectedRole] ?? 0,
//     currentScene: 0,
//     score: 0,
//     totalScenes: scenarios.reduce((sum, s) => sum + s.scenes.length, 0),
//   });

//   const handleAnswer = (correct) => {
//     if (correct) {
//       setGamestate((prev) => ({ ...prev, score: prev.score + 1 }));
//     }
//   };

//   const handleNext = () => {
//     const { currentScenario, currentScene } = gamestate;
//     const currentScenarioData = scenarios[currentScenario];

//     if (currentScene < currentScenarioData.scenes.length - 1) {
//       // go to next scene in same scenario
//       setGamestate((prev) => ({ ...prev, currentScene: prev.currentScene + 1 }));
//     } else {
//       // move to next scenario
//       const nextScenario = (currentScenario + 1) % scenarios.length;
//       setGamestate((prev) => ({
//         ...prev,
//         currentScenario: nextScenario,
//         currentScene: 0,
//       }));
//     }
//   };

//   const reset = () => {
//     setGamestate({
//       currentScenario: 0,
//       currentScene: 0,
//       score: 0,
//       totalScenes: scenarios.reduce((sum, s) => sum + s.scenes.length, 0),
//     });
//   };

//   const { currentScenario, currentScene, score } = gamestate;

//   return (
//     <div className="roleapp">
//       <ProgressBar current={currentScene} total={scenarios[currentScenario].scenes.length} />
//       <ScenarioCard
//         scene={scenarios[currentScenario].scenes[currentScene]}
//         score={score}
//         onAnswer={handleAnswer}
//         onNext={handleNext}
//       />
//     </div>
//   );
// };

// export default RoleApp;

import { useState } from "react";
import { ScenarioCard } from "./Scenarios"; // ✅ Fixed import name
import { scenarios } from "./rolecomponents/scenarios";
import { ProgressBar } from "../components/Progressbar";
import "../style/roleapp.css"
const RoleApp = ({ selectedRole }) => {
  // ✅ Fixed: Define rolescenario mapping
  const rolescenario = {
    market: 0,
    festival: 1,
    greeting: 2,
  };

  const [gamestate, setGamestate] = useState({
    currentScenario: rolescenario[selectedRole] ?? 0,
    currentScene: 0,
    score: 0,
    totalScenes: scenarios.reduce((sum, s) => sum + s.scenes.length, 0),
  });

  const handleAnswer = (correct) => {
    if (correct) {
      setGamestate((prev) => ({ ...prev, score: prev.score + 1 }));
    }
  };

  const handleNext = () => {
    const { currentScenario, currentScene } = gamestate;
    const currentScenarioData = scenarios[currentScenario];

    if (currentScene < currentScenarioData.scenes.length - 1) {
      // go to next scene in same scenario
      setGamestate((prev) => ({ ...prev, currentScene: prev.currentScene + 1 }));
    } else {
      // move to next scenario
      const nextScenario = (currentScenario + 1) % scenarios.length;
      setGamestate((prev) => ({
        ...prev,
        currentScenario: nextScenario,
        currentScene: 0,
      }));
    }
  };

  const reset = () => {
    setGamestate({
      currentScenario: rolescenario[selectedRole] ?? 0,
      currentScene: 0,
      score: 0,
      totalScenes: scenarios.reduce((sum, s) => sum + s.scenes.length, 0),
    });
  };

  const { currentScenario, currentScene, score } = gamestate;

  // ✅ Add safety check
  if (!scenarios[currentScenario] || !scenarios[currentScenario].scenes[currentScene]) {
    return <div>Loading scenario...</div>;
  }

  return (
    <div className="roleapp">
      <ProgressBar 
        current={currentScene} 
        total={scenarios[currentScenario].scenes.length} 
      />
      <ScenarioCard
        scene={scenarios[currentScenario].scenes[currentScene]}
        score={score}
        onAnswer={handleAnswer}
        onNext={handleNext}
      />
      
      {/* ✅ Add debug info and reset button */}
      <div className="debug-info" style={{ padding: '1rem', background: '#f0f0f0', margin: '1rem' }}>
        <p>Selected Role: {selectedRole}</p>
        <p>Current Scenario: {currentScenario}</p>
        <p>Current Scene: {currentScene}</p>
        <p>Score: {score}</p>
        <button onClick={reset} style={{ marginTop: '0.5rem', padding: '0.5rem 1rem' }}>
          Reset Game
        </button>
      </div>
    </div>
  );
};

export default RoleApp;
