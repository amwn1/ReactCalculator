import React, { useReducer } from 'react'
import "./styles.css"
import DigitButton from './DigitButton'
import OperationButton from './OperationButton'
export const ACTIONS = {
  ADD_DIGIT: 'add-digits',
  CLEAR:'clear',
  EVALUATE: 'evaluate',
  DELETE_DIGIT:'delete-digit',
  CHOOSE_OPERATION:'choose-operation'
}

function reducer(state , {type, payload}){
 switch(type){
    case  ACTIONS.ADD_DIGIT :
      if(payload.digit === "0" && state.currentOperand === "0" ){
        return state
      }
      if(payload.digit === "." && state.currentOperand.includes(".")){
        return state
      }
      return{
        ...state,
        currentOperand:`${state.currentOperand || ""}${payload.digit}`
      }
  
     case ACTIONS.CLEAR : 
     return {} 
    
     case ACTIONS.CHOOSE_OPERATION : 
      if(state.currentOperand == null && state.previousOperand == null ){
        return {}
      }
       
      if(state.currentOperand == null) // this function is regarding when you accidently hit the wrong operation and wants to change it 
      {
        return{
        ...state,
        Operation:payload.operation
        }
      }


      if (state.previousOperand == null)
      return{
        ...state,
        Operation : payload.operation,
        previousOperand : state.currentOperand,
        currentOperand : null,
      }

      return {
        ...state,
        previousOperand : evaluate(state),
        currentOperand:null,
        Operation:payload.operation
      }
     default :
     return{}
 }

}

function evaluate({currentOperand, previousOperand, Operation }){
  const prev = parseFloat(previousOperand)// converting strings to numbers
  const curr = parseFloat(currentOperand)// converting strings to numbers
  if (isNaN(prev) || isNaN(curr)) return {}
  let result = ""
  switch(Operation){
    case "+":
    result = prev + curr
    break
    case "-":
    result = prev - curr
    break
    case "/":
    result = prev / curr
    break
    case "*":
    result = prev * curr
    break
  }
  return result.toString(); // using this toString function to change the result to string as from the start we were dealing with strigs.

} 

export default function App() {
  const [{currentOperand, previousOperand, Operation } ,dispatch] = useReducer(reducer,{})
    
  return (
    <div className="calculator-grid">
      <div className='output'>
        <div className='previous-operand'>{previousOperand} {Operation}</div>
        <div className='current-operand'>{currentOperand}</div>
      </div>
      <button className='span-two'onClick={() => dispatch({type : ACTIONS.CLEAR})} >AC</button>
      <button>DEL</button>
      <OperationButton operation="%" dispatch={dispatch}/>
      <DigitButton digit="1" dispatch={dispatch}/>
      <DigitButton digit="2" dispatch={dispatch}/>
      <DigitButton digit="3" dispatch={dispatch}/>
      <OperationButton operation="*" dispatch={dispatch}/>
      <DigitButton digit="4" dispatch={dispatch}/>
      <DigitButton digit="5" dispatch={dispatch}/>
      <DigitButton digit="6" dispatch={dispatch}/>
      <OperationButton operation="+" dispatch={dispatch}/>
      <DigitButton digit="7" dispatch={dispatch}/>
      <DigitButton digit="8" dispatch={dispatch}/>
      <DigitButton digit="9" dispatch={dispatch}/>
      <OperationButton operation="-" dispatch={dispatch}/>
      <DigitButton digit="." dispatch={dispatch}/>
      <DigitButton digit="0" dispatch={dispatch}/>
      <button className='span-two'>=</button>
    </div>
  )
}

