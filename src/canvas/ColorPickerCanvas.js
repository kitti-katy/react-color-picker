import React, { Component } from "react";
import { drawHueCanvas, drawSaturationCanvas, getColorFromSaturationCanvas, getColorFromHueCanvas, getScaledHueWidth } from './CanvasFunctions'
import styles from './ColorPickerCanvas.module.css'

const mouseEventAttributes = {onMove: "mousemove", onEnd: "mouseup", getX: (evt) => evt.clientX, getY: (evt) => evt.clientY}
const touchEventAttributes = {onMove: "touchmove", onEnd: "touchend", getX: (evt) => evt.touches[0].clientX, getY: (evt) => evt.touches[0].clientY}

class ColorPickerCanvas extends Component {

    componentDidMount = () => {
        drawHueCanvas(this.props.baseColor, this.props.id);
        drawSaturationCanvas(this.props.baseColor, this.props.id);
    }

    // Common for both canvases
    handleCanvasStart = (evt, eventAttributes, setColor) => {
        const {onMove, onEnd, getX, getY} = eventAttributes
        setColor(getX(evt), getY(evt)); 
        this.setColorChangeEventListeners(onMove, onEnd, (evt) => setColor(getX(evt), getY(evt)))
    }
    setColorChangeEventListeners = (onMove, onEnd, handleColorChange) => {
        window.addEventListener(onMove, handleColorChange)
        window.addEventListener(onEnd, () => { window.removeEventListener(onMove, handleColorChange)}, {once: true});
    }

    // Main Canvas events
    handleOnMainMouseDown = evt => this.handleStartMainCanvas(evt, mouseEventAttributes)
    handleOnMainTouchStart = evt => this.handleStartMainCanvas(evt, touchEventAttributes)

    handleStartMainCanvas = (evt, eventAttributes) => this.handleCanvasStart(evt, eventAttributes, this.setColorFromMainCanvas)

    setColorFromMainCanvas = (x, y) => {
        let color = getColorFromHueCanvas(x, y, this.props.baseColor, this.props.id)
        this.props.onChange(color);
        drawSaturationCanvas(color, this.props.id);
    };

    // Saturation Canvas events
    handleStartSatCanvas = (evt, eventAttributes) => {
        this.handleCanvasStart(evt, eventAttributes, this.setColorFromSatCanvas)
    }
    setColorFromSatCanvas = (x, y) => {
        let color = getColorFromSaturationCanvas(y, this.props.baseColor, this.props.id)
        this.props.onChange(color);
        drawHueCanvas(color, this.props.id);
    };

    render() {
        let hexString = this.props.baseColor.HEXString;
        let light = this.props.baseColor.hsl.light
        let id = this.props.id
        return (
            <div id={"canvases-container" + id}>
                <div>
                    <div id={"pickerCircle" + id} style={{ borderColor: light > 50 ? "#757575" : "white", backgroundColor: hexString }} />
                        <canvas height="200" width={getScaledHueWidth()} id={"main-canvas-color-picker" + id}
                            onMouseDown={this.handleOnMainMouseDown} onTouchStart={this.handleOnMainTouchStart}
                            />
                </div>

                <div className={styles["saturation-canvas"]}
                    onMouseDown={(evt) => this.handleStartSatCanvas(evt, mouseEventAttributes)} 
                    onTouchStart={(evt) => this.handleStartSatCanvas(evt, touchEventAttributes)}
                    >
                    <div id={"saturationCircle" + id} style={{ backgroundColor: hexString}} />
                    <canvas id={"saturation-canvas-color-picker" + id} height="200" width="10" />
                </div>

            </div>
        );
    }
}
export default ColorPickerCanvas;