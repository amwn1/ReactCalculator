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
      if(state.overwrite){
        return{
          ...state,
          currentOperand:payload.digit,
          overwrite : false
        }
      }
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
      
      case ACTIONS.EVALUATE :
        if(
          state.Operation == null ||
           state.currentOperand == null ||
            state.previousOperand == null
            ){
          return state
        }
      return {
        ...state,
        overwrite : true, // using this overwrite value as generally in normal calculators after evalution the first input we give overwrites the evaluation thus referring back to the case of "ADD_DIGITS" we will then give the value false
        previousOperand:null,
        Operation:null,
        currentOperand:evaluate(state)
      }

      case ACTIONS.DELETE_DIGIT:
        if(state.overwrite)
      return{
          ...state,
          currentOperand: null,
          overwrite: false
        }
        if(state.currentOperand == null) return state
        if(state.currentOperand.length === 1) {
          return{
            ...state,
            currentOperand: null
          }
        }
        return {
          ...state,
          currentOperand:state.currentOperand.slice(0,-1)
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
    case "%":
    result = prev / curr
    break
    case "*":
    result = prev * curr
    break
    
  }
  return result.toString(); // using this toString function to change the result to string as from the start we were dealing with strigs.

} 

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us",{
  maximumFractionDigits : 0,
})

function formatOperand(operand){
  if(operand==null) return
  const[integer,decimal] = operand.split(".")
  if(decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}` // final formating so that we can place the decimal digits also
}

export default function App() {
  const [{currentOperand, previousOperand, Operation } ,dispatch] = useReducer(reducer,{})
    
  return (
    <div className="calculator-grid">
      <div className='output'>
        <div className='previous-operand'>{formatOperand(previousOperand)} {Operation}</div>
        <div className='current-operand'>{formatOperand(currentOperand)}</div>
      </div>
      <button className='span-two'onClick={() => dispatch({type : ACTIONS.CLEAR})} >AC</button>
      <button onClick={() => dispatch({type : ACTIONS.DELETE_DIGIT})}>DEL</button>
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
      <button className='span-two' onClick={() => dispatch({type : ACTIONS.EVALUATE})}>=</button>
    </div>
  )
}

