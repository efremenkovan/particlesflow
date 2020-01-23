const SimplexNoise = require('simplex-noise')
const canvasSketch = require('canvas-sketch');

const simplex = new SimplexNoise()

const settings = {
  dimensions: [ 1080, 1920 ],
  fps: 36,
  animate: true,
  duration: 12
};


const sketch = ({width,height}) => {
  const cols = 60,
      rows = 107,
      size = width / cols,
      grid = []

  class Dot {
    constructor(row, col) {
      this.x = col*size
      this.y = row*size
      this.originalX = this.x
      this.originalY = this.y
      this.vx = 0
      this.vy = 0
      this.random = Math.random()
      this.size = size * this.random

      this.gravity = 2
      this.friction = 0.7
      this.acceleration = 1.5
    }

    draw(context, playhead) {
      this.move(playhead)
      context.save()
      context.fillStyle = "#fff"
      context.beginPath()
      context.arc(this.x + this.size/2, this.y  + this.size/2, this.size/2, 0, Math.PI*2)
      context.fill()
      context.restore()
    }

    move(playhead) {
      let angle = simplex.noise2D(this.x/1000, this.y/600, playhead)*Math.PI*2

      this.vx += Math.cos(angle)*this.acceleration
      this.vy += Math.sin(angle)*this.acceleration

      this.vx *= this.friction
      this.vy *= this.friction

      this.x += this.vx
      this.y += this.vy
    }
  }

  for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) {
      grid.push(new Dot(i, j))
    }
  }

  
  const render = ({ context, width, height, playhead }) => {
    context.clearRect(0,0, width, height)
    context.fillStyle = "#000"
    context.fillRect(0,0, width, height)
    grid.forEach(cell => cell.draw(context, playhead))

    
  };

  return render
}

canvasSketch(sketch, settings);
