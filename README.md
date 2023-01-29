# React 18 Blockies

This is a React 18 & typescript port of https://github.com/stephensprinkle-zz/react-blockies
which in turn is a port of https://github.com/alexvandesande/blockies.

# Example:

```javascript
import Blockies from 'react-18-blockies';

export const myBlockies = () => (
  <Blockies
    seed="Jeremy" {/* the only required prop; determines how the image is generated */}
    size={10} {/* number of squares wide/tall the image will be; default = 15 */}
    scale={3} {/* width/height of each square in pixels; default = 4 */}
    color="#dfe" {/* normal color; random by default */}
    bgColor="#ffe" {/* background color; random by default */}
    spotColor="#abc" {/* color of the more notable features; random by default */}
    className="identicon" {/* optional class name for the canvas element; "identicon" by default */}
  />
)
```
