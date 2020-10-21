import React from 'react'
import styles from './styles.css'
import ColorPicker_ from './ColorPicker_'

export const ColorPicker = ({ baseColor, onChange, id, className }) => {
  return <ColorPicker_ baseColor = {baseColor} onChange = {onChange} id={id} className={className}/>
}
