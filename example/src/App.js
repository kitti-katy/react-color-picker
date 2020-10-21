import React, {useState} from 'react'

import { ColorPicker } from 'react-color-picker'
import 'react-color-picker/dist/index.css'
import Color from 'cpg-color/Color'

const App = () => {
  const [baseColor, setBaseColor] =  useState(new Color({hue:170, sat:100, light:37}, 'HSL'));

  return <div>
    <h1 style={{textAlign:'center'}}>Color Picker Example</h1>
    <ColorPicker baseColor={baseColor} onChange={setBaseColor} id="cp"/> 
    </div> 
}

export default App
