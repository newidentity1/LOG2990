const WIDTH = 100;
const HEIGHT = 100;

const canvas = document.createElement('canvas');
canvas.width = WIDTH;
canvas.height = HEIGHT;

const drawCanvas = document.createElement('canvas');
drawCanvas.width = WIDTH;
drawCanvas.height = HEIGHT;

const selectionCanvas = document.createElement('canvas');
selectionCanvas.width = WIDTH;
selectionCanvas.height = HEIGHT;

const gridCanvas = document.createElement('canvas');
gridCanvas.width = WIDTH;
gridCanvas.height = HEIGHT;

const canvasTestHelper = { canvas, drawCanvas, selectionCanvas, gridCanvas };

export { canvasTestHelper };
