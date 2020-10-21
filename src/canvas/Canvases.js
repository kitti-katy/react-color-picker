import React, { useState, useEffect } from 'react';
import { drawHueCanvas, drawSaturationCanvas, getColorFromSaturationCanvas, getColorFromHueCanvas, getScaledHueWidth } from './CanvasFunctions'
import styles from './ColorPickerCanvas.module.css'

const mouseEventAttributes = {onMove: "mousemove", onEnd: "mouseup", getX: (evt) => evt.clientX, getY: (evt) => evt.clientY}
const touchEventAttributes = {onMove: "touchmove", onEnd: "touchend", getX: (evt) => evt.touches[0].clientX, getY: (evt) => evt.touches[0].clientY}

export default function Canases(props) {

    const [mounted, setMounted] = useState(false);
    const id = props.id
    const baseColor = props.baseColor
    const onChange = props.onChange

    useEffect(() => {
        if(!mounted){
            drawHueCanvas(baseColor, id);
            drawSaturationCanvas(baseColor, id);
            setMounted(true)
        }
    })

    // Common for both canvases
    const handleCanvasStart = (evt, eventAttributes, setColor) => {
        const {onMove, onEnd, getX, getY} = eventAttributes
        setColor(getX(evt), getY(evt)); 
        setColorChangeEventListeners(onMove, onEnd, (evt) => setColor(getX(evt), getY(evt)))
    }
    const setColorChangeEventListeners = (onMove, onEnd, handleColorChange) => {
        window.addEventListener(onMove, handleColorChange)
        window.addEventListener(onEnd, () => { window.removeEventListener(onMove, handleColorChange)}, {once: true});
    }

    // Main Canvas events
    const handleMouseDownMain = evt => setMainCanvasDown(evt, mouseEventAttributes)
    const handleTouchStartMain = evt => setMainCanvasDown(evt, touchEventAttributes)

    const setMainCanvasDown = (evt, eventAttributes) => handleCanvasStart(evt, eventAttributes, setColorFromMainCanvas)

    const setColorFromMainCanvas = (x, y) => {
        let color = getColorFromHueCanvas(x, y, baseColor, id)
        onChange(color);
        drawSaturationCanvas(color, id);
    };

    // Saturation Canvas events
    const handleMouseDownSat = evt => setSatCanvasDown(evt, mouseEventAttributes)
    const handleTouchStartSat = evt => setSatCanvasDown(evt, touchEventAttributes)
    
    const setSatCanvasDown = (evt, eventAttributes) => handleCanvasStart(evt, eventAttributes, setColorFromSatCanvas)

    const setColorFromSatCanvas = (x, y) => {
        let color = getColorFromSaturationCanvas(y, baseColor, id)
        onChange(color);
        drawHueCanvas(color, id);
    };

    return (
            <div id={"canvases-container" + id}>
                <div>
                    <div id={"pickerCircle" + id} style={{ borderColor: baseColor.hsl.light > 50 ? "#757575" : "white", backgroundColor: baseColor.HEXString }} />
                    <canvas height="200" width={getScaledHueWidth()} id={"main-canvas-color-picker" + id} onMouseDown={handleMouseDownMain} onTouchStart={handleTouchStartMain}/>
                </div>

                <div className={styles["saturation-canvas"]} onMouseDown={handleMouseDownSat} onTouchStart={handleTouchStartSat}>
                    <div id={"saturationCircle" + id} style={{ backgroundColor: baseColor.HEXString}} />
                    <canvas id={"saturation-canvas-color-picker" + id} height="200" width="10" />
                </div>
            </div>
        );   
}