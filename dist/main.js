"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = require("react");
var _jsxRuntime = require("react/jsx-runtime");
var Identicon = function Identicon(_ref) {
  var seed = _ref.seed,
    _ref$className = _ref.className,
    className = _ref$className === void 0 ? 'identicon' : _ref$className,
    _ref$size = _ref.size,
    size = _ref$size === void 0 ? 8 : _ref$size,
    _ref$scale = _ref.scale,
    scale = _ref$scale === void 0 ? 4 : _ref$scale,
    color = _ref.color,
    bgColor = _ref.bgColor,
    spotColor = _ref.spotColor;
  var canvasRef = (0, _react.useRef)(null);

  // Majority of this code is referenced from: https://github.com/alexvandesande/blockies
  // Mostly to ensure congruence to Ethereum Mist's Identicons

  // The random number is a js implementation of the Xorshift PRNG
  // Xorshift: [x, y, z, w] 32 bit values
  var randseed = new Array(4);
  var seedrand = function seedrand(s) {
    for (var i = 0; i < randseed.length; i++) {
      randseed[i] = 0;
    }
    for (var _i = 0; _i < s.length; _i++) {
      randseed[_i % 4] = (randseed[_i % 4] << 5) - randseed[_i % 4] + s.charCodeAt(_i);
    }
  };
  var rand = function rand() {
    // based on Java's String.hashCode(), expanded to 4 32bit values
    var t = randseed[0] ^ randseed[0] << 11;
    randseed[0] = randseed[1];
    randseed[1] = randseed[2];
    randseed[2] = randseed[3];
    randseed[3] = randseed[3] ^ randseed[3] >> 19 ^ t ^ t >> 8;
    return (randseed[3] >>> 0) / (1 << 31 >>> 0);
  };
  var createColor = function createColor() {
    // saturation is the whole color spectrum
    var h = Math.floor(rand() * 360);
    // saturation goes from 40 to 100, it avoids greyish colors
    var s = "".concat(rand() * 60 + 40, "%");
    // lightness can be anything from 0 to 100, but probabilities are a bell curve around 50%
    var l = "".concat((rand() + rand() + rand() + rand()) * 25, "%");
    return "hsl(".concat(h, ",").concat(s, ",").concat(l, ")");
  };
  var createImageData = function createImageData(size) {
    var width = size; // Only support square icons for now
    var height = size;
    var dataWidth = Math.ceil(width / 2);
    var mirrorWidth = width - dataWidth;
    var data = [];
    for (var y = 0; y < height; y++) {
      var row = [];
      for (var x = 0; x < dataWidth; x++) {
        // this makes foreground and background color to have a 43% (1/2.3) probability
        // spot color has 13% chance
        row[x] = Math.floor(rand() * 2.3);
      }
      var r = row.slice(0, mirrorWidth);
      r.reverse();
      row = row.concat(r);
      for (var i = 0; i < row.length; i++) {
        data.push(row[i]);
      }
    }
    return data;
  };
  var setCanvas = function setCanvas(imageData, color, scale, bgcolor, spotcolor) {
    var width = Math.sqrt(imageData.length);
    var size = width * scale;
    var identicon = canvasRef.current;
    if (!identicon) {
      return;
    }
    identicon.width = size;
    identicon.height = size;
    var cc = identicon.getContext('2d');
    if (!cc) {
      return;
    }
    cc.fillStyle = bgcolor;
    cc.fillRect(0, 0, identicon.width, identicon.height);
    cc.fillStyle = color;
    for (var i = 0; i < imageData.length; i++) {
      // if data is 2, choose spot color, if 1 choose foreground
      cc.fillStyle = imageData[i] === 1 ? color : spotcolor;

      // if data is 0, leave the background
      if (imageData[i]) {
        var row = Math.floor(i / width);
        var col = i % width;
        cc.fillRect(col * scale, row * scale, scale, scale);
      }
    }
  };
  var generateIdenticon = function generateIdenticon() {
    var sizeVal = size || 8;
    var scaleVal = scale || 4;
    seedrand(seed);
    var colorVal = color || createColor();
    var bgcolorVal = bgColor || createColor();
    var spotcolorVal = spotColor || createColor();
    var imageData = createImageData(sizeVal);
    setCanvas(imageData, colorVal, scaleVal, bgcolorVal, spotcolorVal);
  };
  (0, _react.useEffect)(function () {
    generateIdenticon();
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("canvas", {
    ref: canvasRef,
    className: className
  });
};
var _default = Identicon;
exports["default"] = _default;

