import React, { useState } from "react";
import styles from '../ColorPicker.module.css'
export default function NumberInput(props) {
  
  const [localValue, setLocalValue] =  useState(props.value);
  const [focused, setFocused] =  useState(false);


  const handleInputChange = evt => {
    let newValue = evt.target.value
    if (newValue >=0 && newValue <= props.max)
      props.onChange(newValue)
    setLocalValue(newValue)
  }
  const handleOnBlur = evt => {
    handleInputChange(evt)
    setLocalValue(props.value)
    setFocused(false)
  }
  const handleOnFocus = () => {
    setLocalValue(props.value)
    setFocused(true)
  }

return(
  <div>
    <span className={styles["color-picker-input-label"]}>{props.id}: </span>

    <input
      value = {focused? localValue : props.value}
      onChange = {handleInputChange}
      onFocus = {handleOnFocus}
      onBlur = {handleOnBlur}
      type="number"
      id={props.id}
      min="0"
      max={props.max}
      className={props.className + " " + styles["color-picker-input"]}

    />
  </div>
)
}

