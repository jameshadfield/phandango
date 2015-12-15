
export function initCanvasXY() {
  this.canvas.setAttribute('width', window.getComputedStyle(this.canvas).width);
  this.canvas.setAttribute('height', window.getComputedStyle(this.canvas).height);
}

export function clearCanvas() {
  this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);
}
