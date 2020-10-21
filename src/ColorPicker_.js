
import React from "react";
import Color from "cpg-color/Color";
import styles from './ColorPicker.module.css'
import Canvases from './canvas/Canvases'
import { drawHueCanvas, drawSaturationCanvas } from './canvas/CanvasFunctions'
import NumberInput from "./inputs/NumberInput";
import HexInput from "./inputs/HexInput";

const HUE = "hue", SAT = "sat", LIGHT = "light", R = "r", G = "g", B = "b"
const schemes = Object.freeze({HSL:{ name: "HSL", mainKey: 'hsl'}, RGB: { name: "RGB", mainKey: 'rgb'}})

export default function ColorPicker_(props) {
  
  const baseColor = props.baseColor
  const onChange = props.onChange
  const id = props.id
  let getNumberInput = (id, max, value, onChange) => <NumberInput id = {id} max = {max} value = {value} onChange = {onChange} className={styles["number-input"]} key={id}/>

  let handleFormInput = color => {
    onChange(color);
    drawHueCanvas(color, id);
    drawSaturationCanvas(color, id);
  };

  // INPUT HANDLERS
  let setFromNumeric = (value, scheme, keyToChange) => {
    let schemeDict = Object.assign({}, baseColor[scheme.mainKey]) 
    schemeDict[keyToChange] = value
    handleFormInput(new Color(schemeDict, scheme.name))
  }

  const { hue, sat, light } = baseColor.hsl
  const { r, g, b } = baseColor.rgb
  let hexString = baseColor.HEXString;
  let hexValue = hexString.substring(1)
  let hslInputs = [['H', 359, hue, schemes.HSL, HUE], ['S',100, sat, schemes.HSL, SAT], ['L', 100, light, schemes.HSL, LIGHT]]
  let rgbInputs = [['R',255, r, schemes.RGB, R],['G',255, g, schemes.RGB, G],['B',255,b, schemes.RGB, B]]

  let getInputs = (inputs, onChange) => <div className={styles["input-boxes"]}> {inputs.map(options => getNumberInput( ...options.slice(0, 3), (val) => onChange(val, ...options.slice(3, 5)) ))} </div>

  return (
    <div id={"color-picker-" + id} className={props.className}>
      <Canvases onChange={onChange} baseColor={baseColor} id={id} />

      <div id={"color-inputs-container-"+ id}>

          {getInputs(hslInputs, setFromNumeric)}
          {getInputs(rgbInputs, setFromNumeric)}

          <div className={styles["hex-and-square-inputs"]} >
            <HexInput id ={id} value={hexValue} onChange={(val)=>handleFormInput(new Color('#' + val, "HEX"))}  />
            <div id={'picked-color'+ id} style={{ backgroundColor: hexString }} />
          </div>
      </div>

    </div>
  );
  }
