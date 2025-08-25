// import React, { useState } from "react";
// import { scenarios } from "./rolecomponents/scenarios";
// import { ProgressBar } from "../components/Progressbar";
// import "../style/scenario.css"
// export const ScenenarioCard = ({scene,onAnswer,onNext,score}) =>{

//     const[showfeedback, setFeedback] = useState(false);
//     const [selectanswer, SetSelectedAnswer] = useState(null)

//     const handleAnswer = (index) =>{
//         SetSelectedAnswer(index);
//         setFeedback(true);
//         onAnswer(scene.options[index].correct);
//     }
// return (
//     <>
//     {/* SCENARIO CARD HEADER */}
//     <div className="header">
// <div className="header-left">
// <h1> नेपाली सिकौं</h1>
// <p className="header-icon">Let's Learn Nepali</p>
// </div>
// <div className="header-right">
//     <i className="fa-regular fa-star"></i>
// <span className="font-bold">{score}</span>
// </div>
//     </div>


// {/* PROGRESS BAR */}
// <ProgressBar />


// {/* Scenario situation */}
//     <div className="scene-card">
//         <div className="scene-image">{scene.image} </div>
//         <div className="scene-situation">
//        <p className="sit-english">{scene.situation}</p>
//     <p className="sit-nepali">{scene.nepali}</p>
//         </div>
//     </div>
// {showfeedback ? 
//      <FeeddbackView feedback={scene.options[selectanswer].response} 
//      correct={scene.options[selectanswer].correct}
//      onNext = {() => {setFeedback(false); onNext();}}
//      />
//   : 
//      <QuestionView scene={scene} onAnswer={{handleAnswer}} />

// } 
//     </>
// )

// }


// const QuestionView = ({scene,onAnswer}) =>{
//        {/* Sceanrio Answer */}
//        return (
//  <div className="scenario-question">
//         <h3> {scene.question} </h3>
//         <div className="options">
//             {scene.options.map((options,index) =>{
//                 <button key = {index}
//                 onClick={() => onAnswer(index)}
//                 className="answer-box">
//                     {options.text}
//                 </button>
//             })}
//         </div>
//     </div>
//        )
   
//     }

// const  FeeddbackView = ({feedback, correct, index}) =>{
//     return (
//    <div className="feed-ans">
//         <div className="ans-icon"> {correct? '🎉' : '🤗'} </div>
//    <p className="feed-response">{feedback}</p>
//      <button onClick={onNext} className="common-button">
//       NextScene  
//     </button>
//     </div>
//     )
 
   
// }

import React, { useState } from "react";
import { scenarios } from "./rolecomponents/scenarios";
import { ProgressBar } from "../components/Progressbar";
import "../style/scenario.css"

export const ScenarioCard = ({ scene, onAnswer, onNext, score }) => { // ✅ Fixed name
  const [showfeedback, setFeedback] = useState(false);
  const [selectanswer, SetSelectedAnswer] = useState(null);

  const handleAnswer = (index) => {
    SetSelectedAnswer(index);
    setFeedback(true);
    onAnswer(scene.options[index].correct);
  };

  return (
    <>
      {/* SCENARIO CARD HEADER */}
      <div className="header">
        <div className="header-left">
          <h1>नेपाली सिकौं</h1>
          <p className="header-icon">Let's Learn Nepali</p>
        </div>
        <div className="header-right">
          <i className="fa-regular fa-star"></i>
          <span className="font-bold">{score}</span>
        </div>
      </div>

      {/* Scenario situation */}
      <div className="scene-card">
        <div className="scene-image">{scene.image}</div>
        <div className="scene-situation">
          <p className="sit-english">{scene.situation}</p>
          <p className="sit-nepali">{scene.nepali}</p>
        </div>
      </div>

      {showfeedback ? (
        <FeeddbackView 
          feedback={scene.options[selectanswer].response}
          correct={scene.options[selectanswer].correct}
          onNext={() => { setFeedback(false); onNext(); }}
        />
      ) : (
        <QuestionView scene={scene} onAnswer={handleAnswer} /> // ✅ Fixed prop passing
      )}
    </>
  );
};

// ✅ Fixed QuestionView - missing return and map function
const QuestionView = ({ scene, onAnswer }) => {
  return (
    <div className="scenario-question">
      <h3>{scene.question}</h3>
      <div className="options">
        {scene.options.map((option, index) => ( // ✅ Fixed: option not options, added return
          <button 
            key={index}
            onClick={() => onAnswer(index)}
            className="answer-box"
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
};

// ✅ Fixed FeedbackView - wrong prop name
const FeeddbackView = ({ feedback, correct, onNext }) => {
  return (
    <div className="feed-ans">
      <div className="ans-icon">{correct ? '🎉' : '🤗'}</div>
      <p className="feed-response">{feedback}</p>
      <button onClick={onNext} className="common-button">
        Next Scene
      </button>
    </div>
  );
};
