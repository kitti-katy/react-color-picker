
import React, { useState } from "react";
import styles from '../ColorPicker.module.css'

export default function HexInput(props) {

  const [localValue, setLocalValue] =  useState(props.value);
  const [focused, setFocused] =  useState(false);

  const handleInputChange = evt => {
    let newValue = evt.target.value
      if (newValue.length == 6 || newValue.length == 3 ) {
      
        var re = /^[0-9A-Fa-f]+$/g;
        
        if (re.test(newValue)) {
          props.onChange(newValue)
        }
      }
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
  <div className={styles["hex-input"]}>
    <span className={styles["color-picker-input-label-hex"]}>Hex: # </span>
    <input
      id={'hex-input-txt-box'+props.id} 
      value = {focused ? localValue : props.value}
      onChange={handleInputChange}
      onFocus = {handleOnFocus}      
      onBlur = {handleOnBlur}
      className={props.className + " " + styles["color-picker-input"]}
    />
  </div>
)
}
