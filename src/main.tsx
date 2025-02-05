import { FC, useEffect, useRef } from 'react'

export interface IdenticonProps {
  seed: string
  className?: string
  size?: number
  scale?: number
  color?: string
  bgColor?: string
  spotColor?: string
}

const Identicon: FC<IdenticonProps> = ({
  seed,
  className = 'identicon',
  size = 8,
  scale = 4,
  color,
  bgColor,
  spotColor,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Majority of this code is referenced from: https://github.com/alexvandesande/blockies
  // Mostly to ensure congruence to Ethereum Mist's Identicons

  // The random number is a js implementation of the Xorshift PRNG
  // Xorshift: [x, y, z, w] 32 bit values
  const randseed: number[] = new Array(4)

  const seedrand = (s: string): void => {
    for (let i = 0; i < randseed.length; i++) {
      randseed[i] = 0
    }

    for (let i = 0; i < s.length; i++) {
      randseed[i % 4] =
        (randseed[i % 4] << 5) - randseed[i % 4] + s.charCodeAt(i)
    }
  }

  const rand = (): number => {
    // based on Java's String.hashCode(), expanded to 4 32bit values
    const t = randseed[0] ^ (randseed[0] << 11)

    randseed[0] = randseed[1]
    randseed[1] = randseed[2]
    randseed[2] = randseed[3]
    randseed[3] = randseed[3] ^ (randseed[3] >> 19) ^ t ^ (t >> 8)

    return (randseed[3] >>> 0) / ((1 << 31) >>> 0)
  }

  const createColor = (): string => {
    // saturation is the whole color spectrum
    const h = Math.floor(rand() * 360)
    // saturation goes from 40 to 100, it avoids greyish colors
    const s = `${rand() * 60 + 40}%`
    // lightness can be anything from 0 to 100, but probabilities are a bell curve around 50%
    const l = `${(rand() + rand() + rand() + rand()) * 25}%`

    return `hsl(${h},${s},${l})`
  }

  const createImageData = (size: number): number[] => {
    const width = size // Only support square icons for now
    const height = size

    const dataWidth = Math.ceil(width / 2)
    const mirrorWidth = width - dataWidth

    const data: number[] = []

    for (let y = 0; y < height; y++) {
      let row: number[] = []

      for (let x = 0; x < dataWidth; x++) {
        // this makes foreground and background color to have a 43% (1/2.3) probability
        // spot color has 13% chance
        row[x] = Math.floor(rand() * 2.3)
      }
      const r = row.slice(0, mirrorWidth)

      r.reverse()
      row = row.concat(r)

      for (let i = 0; i < row.length; i++) {
        data.push(row[i])
      }
    }

    return data
  }

  const setCanvas = (
    imageData: number[],
    color: string,
    scale: number,
    bgcolor: string,
    spotcolor: string,
  ): void => {
    const width = Math.sqrt(imageData.length)
    const size = width * scale

    const identicon = canvasRef.current

    if (!identicon) {
      return
    }

    identicon.width = size
    identicon.height = size

    const cc = identicon.getContext('2d')

    if (!cc) {
      return
    }

    cc.fillStyle = bgcolor
    cc.fillRect(0, 0, identicon.width, identicon.height)
    cc.fillStyle = color

    for (let i = 0; i < imageData.length; i++) {
      // if data is 2, choose spot color, if 1 choose foreground
      cc.fillStyle = imageData[i] === 1 ? color : spotcolor

      // if data is 0, leave the background
      if (imageData[i]) {
        const row = Math.floor(i / width)
        const col = i % width

        cc.fillRect(col * scale, row * scale, scale, scale)
      }
    }
  }

  const generateIdenticon = (): void => {
    const sizeVal = size || 8
    const scaleVal = scale || 4

    seedrand(seed)

    const colorVal = color || createColor()
    const bgcolorVal = bgColor || createColor()
    const spotcolorVal = spotColor || createColor()
    const imageData = createImageData(sizeVal)

    setCanvas(imageData, colorVal, scaleVal, bgcolorVal, spotcolorVal)
  }

  useEffect(() => {
    generateIdenticon()
  })

  return <canvas ref={canvasRef} className={className} />
}

export default Identicon
