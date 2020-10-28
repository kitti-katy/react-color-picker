import React, { useState, useEffect } from 'react';
import Color from 'cpg-color/Color';

var styles = {"input-boxes":"_8cgVJ","hex-and-square-inputs":"_5cpV-","hex-input":"_24MSC","number-input":"_5iG-P","color-picker-input-label":"_3vnK1","color-picker-input-label-hex":"_1DDfA","color-picker-input":"_1U93g"};

var getScaler = function getScaler() {
  return window.innerWidth > 500 ? 1 : window.innerWidth > 340 ? 0.75 : window.innerWidth > 300 ? 0.6 : 0.55;
};
var getScaledHueWidth = function getScaledHueWidth() {
  return 360 * getScaler();
};
var getScaledHeight = function getScaledHeight() {
  return 200 * getScaler();
};
var getMainCanvas = function getMainCanvas(id) {
  return document.getElementById("main-canvas-color-picker" + id);
};
var getSaturationCanvas = function getSaturationCanvas(id) {
  return document.getElementById("saturation-canvas-color-picker" + id);
};
var drawHueCanvas = function drawHueCanvas(baseColor, id) {
  var scaler = getScaler();
  var sat = baseColor.hsl.sat;
  var canvas = getMainCanvas(id);
  var ctx = canvas.getContext("2d");
  var scaledWidth = getScaledHueWidth();
  var scaledHeight = getScaledHeight();
  canvas.setAttribute("width", scaledWidth);
  canvas.setAttribute("height", scaledHeight);

  for (var i = 0; i < scaledWidth; i += scaler) {
    var gradient = ctx.createLinearGradient(i, 0, i, scaledHeight);
    var scaledBackHue = Math.round(i * 360 / scaledWidth);
    gradient.addColorStop(0, "hsl(" + scaledBackHue + "," + sat + "%,0%)");
    gradient.addColorStop(0.5, "hsl(" + scaledBackHue + "," + sat + "%,50%)");
    gradient.addColorStop(1, "hsl(" + scaledBackHue + "," + sat + "%,100%)");
    ctx.fillStyle = gradient;
    ctx.fillRect(i, 0, i, scaledHeight);
  }

  setSaturationPickerStyle(baseColor, id);
};
var drawSaturationCanvas = function drawSaturationCanvas(baseColor, id) {
  var scaler = getScaler();
  var hue = baseColor.hsl.hue;
  var light = baseColor.hsl.light;
  var canvas = getSaturationCanvas(id);
  var scaledHeight = getScaledHeight();
  canvas.setAttribute("height", scaledHeight);
  var ctx = canvas.getContext("2d");

  for (var j = 0; j < 202 * scaler; j += 2) {
    var scaledBackSat = Math.round(j * 200 / scaledHeight);

    for (var i = 0; i < 10; i += 1) {
      ctx.fillStyle = "hsl(" + hue + ", " + scaledBackSat / 2 + "%, " + light + "%)";
      ctx.fillRect(i, j, i, j + 2);
    }
  }

  setHuePickerStyle(baseColor, id);
};

var getValueAdjustedIntoBoundaries = function getValueAdjustedIntoBoundaries(val, min, max) {
  return val < min ? min : val > max ? max : val;
};

var getColorFromHueCanvas = function getColorFromHueCanvas(clientX, clientY, baseColor, id) {
  var rect = getMainCanvasRectangle(id);
  var x = clientX - rect.left;
  var y = clientY - rect.top;
  var scaledBackX = Math.round(x * 360 / getScaledHueWidth());
  var scaledBackY = Math.round(y * 200 / getScaledHeight());
  scaledBackX = getValueAdjustedIntoBoundaries(scaledBackX, 0, 360);
  scaledBackY = getValueAdjustedIntoBoundaries(scaledBackY, 0, 200);
  var hue = Math.round(scaledBackX);
  var sat = baseColor.hsl.sat;
  var light = Math.round(scaledBackY / 2);
  var color = new Color({
    hue: hue,
    sat: sat,
    light: light
  }, "HSL");
  return color;
};
var getColorFromSaturationCanvas = function getColorFromSaturationCanvas(clientY, baseColor, id) {
  var rect = getSaturationCanvasRectangle(id);
  var y = clientY - rect.top;
  var scaledBackY = Math.round(y * 200 / getScaledHeight());
  scaledBackY = getValueAdjustedIntoBoundaries(scaledBackY, 0, 200);
  var _baseColor$hsl = baseColor.hsl,
      hue = _baseColor$hsl.hue,
      light = _baseColor$hsl.light;
  var sat = Math.round(scaledBackY / 2);
  var color = new Color({
    hue: hue,
    sat: sat,
    light: light
  }, "HSL");
  return color;
};

var setHuePickerStyle = function setHuePickerStyle(color, id) {
  var circle = document.getElementById('pickerCircle' + id);
  var scaler = getScaler();
  var scaledPositionTop = color.hsl.light * 2 * scaler - 8;
  circle.style.marginTop = scaledPositionTop + "px";
  var scaledPositionLeft = color.hsl.hue * scaler - 8;
  circle.style.marginLeft = scaledPositionLeft + "px";
};

var setSaturationPickerStyle = function setSaturationPickerStyle(color, id) {
  var circle = document.getElementById('saturationCircle' + id);
  var scaledPositionTop = color.hsl.sat * 2 * getScaler() - 3.5;
  circle.style.marginTop = scaledPositionTop + "px";
};

var getMainCanvasRectangle = function getMainCanvasRectangle(id) {
  return getMainCanvas(id).getBoundingClientRect();
};
var getSaturationCanvasRectangle = function getSaturationCanvasRectangle(id) {
  return getSaturationCanvas(id).getBoundingClientRect();
};

var styles$1 = {"saturation-canvas":"_2WITp"};

var mouseEventAttributes = {
  onMove: "mousemove",
  onEnd: "mouseup",
  getX: function getX(evt) {
    return evt.clientX;
  },
  getY: function getY(evt) {
    return evt.clientY;
  }
};
var touchEventAttributes = {
  onMove: "touchmove",
  onEnd: "touchend",
  getX: function getX(evt) {
    return evt.touches[0].clientX;
  },
  getY: function getY(evt) {
    return evt.touches[0].clientY;
  }
};
function Canases(props) {
  var _useState = useState(false),
      mounted = _useState[0],
      setMounted = _useState[1];

  var id = props.id;
  var baseColor = props.baseColor;
  var onChange = props.onChange;
  useEffect(function () {
    if (!mounted) {
      drawHueCanvas(baseColor, id);
      drawSaturationCanvas(baseColor, id);
      setMounted(true);
    }
  });

  var handleCanvasStart = function handleCanvasStart(evt, eventAttributes, setColor) {
    var onMove = eventAttributes.onMove,
        onEnd = eventAttributes.onEnd,
        getX = eventAttributes.getX,
        getY = eventAttributes.getY;
    setColor(getX(evt), getY(evt));
    setColorChangeEventListeners(onMove, onEnd, function (evt) {
      return setColor(getX(evt), getY(evt));
    });
  };

  var setColorChangeEventListeners = function setColorChangeEventListeners(onMove, onEnd, handleColorChange) {
    window.addEventListener(onMove, handleColorChange);
    window.addEventListener(onEnd, function () {
      window.removeEventListener(onMove, handleColorChange);
    }, {
      once: true
    });
  };

  var handleMouseDownMain = function handleMouseDownMain(evt) {
    return setMainCanvasDown(evt, mouseEventAttributes);
  };

  var handleTouchStartMain = function handleTouchStartMain(evt) {
    return setMainCanvasDown(evt, touchEventAttributes);
  };

  var setMainCanvasDown = function setMainCanvasDown(evt, eventAttributes) {
    return handleCanvasStart(evt, eventAttributes, setColorFromMainCanvas);
  };

  var setColorFromMainCanvas = function setColorFromMainCanvas(x, y) {
    var color = getColorFromHueCanvas(x, y, baseColor, id);
    onChange(color);
    drawSaturationCanvas(color, id);
  };

  var handleMouseDownSat = function handleMouseDownSat(evt) {
    return setSatCanvasDown(evt, mouseEventAttributes);
  };

  var handleTouchStartSat = function handleTouchStartSat(evt) {
    return setSatCanvasDown(evt, touchEventAttributes);
  };

  var setSatCanvasDown = function setSatCanvasDown(evt, eventAttributes) {
    return handleCanvasStart(evt, eventAttributes, setColorFromSatCanvas);
  };

  var setColorFromSatCanvas = function setColorFromSatCanvas(x, y) {
    var color = getColorFromSaturationCanvas(y, baseColor, id);
    onChange(color);
    drawHueCanvas(color, id);
  };

  return /*#__PURE__*/React.createElement("div", {
    id: "canvases-container" + id
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    id: "pickerCircle" + id,
    style: {
      borderColor: baseColor.hsl.light > 50 ? "#757575" : "white",
      backgroundColor: baseColor.HEXString
    }
  }), /*#__PURE__*/React.createElement("canvas", {
    height: "200",
    width: getScaledHueWidth(),
    id: "main-canvas-color-picker" + id,
    onMouseDown: handleMouseDownMain,
    onTouchStart: handleTouchStartMain
  })), /*#__PURE__*/React.createElement("div", {
    className: styles$1["saturation-canvas"],
    onMouseDown: handleMouseDownSat,
    onTouchStart: handleTouchStartSat
  }, /*#__PURE__*/React.createElement("div", {
    id: "saturationCircle" + id,
    style: {
      backgroundColor: baseColor.HEXString
    }
  }), /*#__PURE__*/React.createElement("canvas", {
    id: "saturation-canvas-color-picker" + id,
    height: "200",
    width: "10"
  })));
}

function NumberInput(props) {
  var _useState = useState(props.value),
      localValue = _useState[0],
      setLocalValue = _useState[1];

  var _useState2 = useState(false),
      focused = _useState2[0],
      setFocused = _useState2[1];

  var handleInputChange = function handleInputChange(evt) {
    var newValue = evt.target.value;
    if (newValue >= 0 && newValue <= props.max) props.onChange(newValue);
    setLocalValue(newValue);
  };

  var handleOnBlur = function handleOnBlur(evt) {
    handleInputChange(evt);
    setLocalValue(props.value);
    setFocused(false);
  };

  var handleOnFocus = function handleOnFocus() {
    setLocalValue(props.value);
    setFocused(true);
  };

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: styles["color-picker-input-label"]
  }, props.id, ": "), /*#__PURE__*/React.createElement("input", {
    value: focused ? localValue : props.value,
    onChange: handleInputChange,
    onFocus: handleOnFocus,
    onBlur: handleOnBlur,
    type: "number",
    id: props.id,
    min: "0",
    max: props.max,
    className: props.className + " " + styles["color-picker-input"]
  }));
}

function HexInput(props) {
  var _useState = useState(props.value),
      localValue = _useState[0],
      setLocalValue = _useState[1];

  var _useState2 = useState(false),
      focused = _useState2[0],
      setFocused = _useState2[1];

  var handleInputChange = function handleInputChange(evt) {
    var newValue = evt.target.value;

    if (newValue.length == 6 || newValue.length == 3) {
      var re = /^[0-9A-Fa-f]+$/g;

      if (re.test(newValue)) {
        props.onChange(newValue);
      }
    }

    setLocalValue(newValue);
  };

  var handleOnBlur = function handleOnBlur(evt) {
    handleInputChange(evt);
    setLocalValue(props.value);
    setFocused(false);
  };

  var handleOnFocus = function handleOnFocus() {
    setLocalValue(props.value);
    setFocused(true);
  };

  return /*#__PURE__*/React.createElement("div", {
    className: styles["hex-input"]
  }, /*#__PURE__*/React.createElement("span", {
    className: styles["color-picker-input-label-hex"]
  }, "Hex: # "), /*#__PURE__*/React.createElement("input", {
    id: 'hex-input-txt-box' + props.id,
    value: focused ? localValue : props.value,
    onChange: handleInputChange,
    onFocus: handleOnFocus,
    onBlur: handleOnBlur,
    className: props.className + " " + styles["color-picker-input"]
  }));
}

var HUE = "hue",
    SAT = "sat",
    LIGHT = "light",
    R = "r",
    G = "g",
    B = "b";
var schemes = Object.freeze({
  HSL: {
    name: "HSL",
    mainKey: 'hsl'
  },
  RGB: {
    name: "RGB",
    mainKey: 'rgb'
  }
});
function ColorPicker_(props) {
  var baseColor = props.baseColor;
  var onChange = props.onChange;
  var id = props.id;

  var getNumberInput = function getNumberInput(id, max, value, onChange) {
    return /*#__PURE__*/React.createElement(NumberInput, {
      id: id,
      max: max,
      value: value,
      onChange: onChange,
      className: styles["number-input"],
      key: id
    });
  };

  var handleFormInput = function handleFormInput(color) {
    onChange(color);
    drawHueCanvas(color, id);
    drawSaturationCanvas(color, id);
  };

  var setFromNumeric = function setFromNumeric(value, scheme, keyToChange) {
    var schemeDict = Object.assign({}, baseColor[scheme.mainKey]);
    schemeDict[keyToChange] = value;
    handleFormInput(new Color(schemeDict, scheme.name));
  };

  var _baseColor$hsl = baseColor.hsl,
      hue = _baseColor$hsl.hue,
      sat = _baseColor$hsl.sat,
      light = _baseColor$hsl.light;
  var _baseColor$rgb = baseColor.rgb,
      r = _baseColor$rgb.r,
      g = _baseColor$rgb.g,
      b = _baseColor$rgb.b;
  var hexString = baseColor.HEXString;
  var hexValue = hexString.substring(1);
  var hslInputs = [['H', 359, hue, schemes.HSL, HUE], ['S', 100, sat, schemes.HSL, SAT], ['L', 100, light, schemes.HSL, LIGHT]];
  var rgbInputs = [['R', 255, r, schemes.RGB, R], ['G', 255, g, schemes.RGB, G], ['B', 255, b, schemes.RGB, B]];

  var getInputs = function getInputs(inputs, onChange) {
    return /*#__PURE__*/React.createElement("div", {
      className: styles["input-boxes"]
    }, " ", inputs.map(function (options) {
      return getNumberInput.apply(void 0, options.slice(0, 3).concat([function (val) {
        return onChange.apply(void 0, [val].concat(options.slice(3, 5)));
      }]));
    }), " ");
  };

  return /*#__PURE__*/React.createElement("div", {
    id: "color-picker-" + id,
    className: props.className
  }, /*#__PURE__*/React.createElement(Canases, {
    onChange: onChange,
    baseColor: baseColor,
    id: id
  }), /*#__PURE__*/React.createElement("div", {
    id: "color-inputs-container-" + id
  }, getInputs(hslInputs, setFromNumeric), getInputs(rgbInputs, setFromNumeric), /*#__PURE__*/React.createElement("div", {
    className: styles["hex-and-square-inputs"]
  }, /*#__PURE__*/React.createElement(HexInput, {
    id: id,
    value: hexValue,
    onChange: function onChange(val) {
      return handleFormInput(new Color('#' + val, "HEX"));
    }
  }), /*#__PURE__*/React.createElement("div", {
    id: 'picked-color' + id,
    style: {
      backgroundColor: hexString
    }
  }))));
}

var ColorPicker = function ColorPicker(_ref) {
  var baseColor = _ref.baseColor,
      onChange = _ref.onChange,
      id = _ref.id,
      className = _ref.className;
  return /*#__PURE__*/React.createElement(ColorPicker_, {
    baseColor: baseColor,
    onChange: onChange,
    id: id,
    className: className
  });
};

export { ColorPicker };
//# sourceMappingURL=index.modern.js.map
