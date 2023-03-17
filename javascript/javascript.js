document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState === "complete") {
    init();
  }
});

const init = () => {
  const canvas = document.getElementById("canvas");
  const createCanvasButton = document.getElementById("generate-canvas");
  const colorPicker = document.getElementById("color-picker");
  const colorsUsedPanel = document.getElementById("colors-used-panel");
  let userAgentString = navigator.userAgent;
  let chromeAgent = userAgentString.indexOf("Chrome") > -1;
  let firefoxAgent = userAgentString.indexOf("Firefox") > -1;
  let browserVariable = 0;
  let color = "#000000";
  let canvasColor = "#fefefe";
  let colorUsedCounter = [];
  let size = 16;

  let drawing = false;
  const nowDrawing = () => {
    drawing = true;
  };

  const notDrawing = () => {
    drawing = false;
  };

  const getSize = () => {
    const reg = new RegExp(/^[1-9][0-9]?$|^100$|/);
    do {
      size = window.prompt(
        `Please, enter a number between 1 and 100, it will be your canvas size `
      );
      if (reg.test(size) === false) {
        window.alert(
          `That is an invalid input, please select a number between 1 and 100`
        );
      }
    } while (reg.test(size) === false || size === null);
    return size;
  };

  const createCanvas = () => {
    while (canvas.firstChild) {
      canvas.removeChild(canvas.firstChild);
    }

    getSize();

    canvas.style.cssText = `grid-template-rows: repeat(${size}, 1fr); grid-template-columns: repeat(${size}, 1fr)`;
    for (i = 0; i < size * size; i++) {
      let cell = document.createElement("div");
      cell.style.backgroundColor = `${canvasColor}`;
      cell.style.border = "1px solid black";
      cell.addEventListener("mousedown", draw);
      cell.addEventListener("mouseover", draw);
      canvas.append(cell);
    }
  };

  const draw = (e) => {
    if (e.type === "mouseover" && drawing === false) return;
    else {
      e.target.style.backgroundColor = color;
    }
  };

  const addColor = (e) => {
    let colorUsedCounter = [];
    color = e.target.value;
    if (colorUsedCounter.length < 25) {
      createColorCell();
    } else {
      colorsUsedPanel.removeChild(colorsUsedPanel.lastChild);
      colorUsedCounter.splice(-1);
      createColorCell();
    }
  };

  const createColorCell = () => {
    let colorUsed = document.createElement("div");
    colorUsed.style.backgroundColor = color;
    colorUsed.setAttribute("class", `${color}`);
    colorsUsedPanel.prepend(colorUsed);
    colorUsedCounter.unshift(color);
  };

  const checkBrowser = () => {
    if (chromeAgent === true) {
      browserVariable = 0;
    } else if (firefoxAgent === true) {
      browserVariable = 1;
    }
  };

  const pickUsedColor = (e) => {
    checkBrowser();
    if (e.target.attributes[`${browserVariable}`].nodeValue[0] === "#") {
      color = e.target.attributes[`${browserVariable}`].nodeValue;
      colorPicker.value = color;
    } else return;
  };

  createCanvasButton.addEventListener("click", createCanvas);
  canvas.addEventListener("mousedown", nowDrawing);
  canvas.addEventListener("mouseup", notDrawing);
  colorPicker.addEventListener("change", addColor);
  colorsUsedPanel.addEventListener("click", pickUsedColor);
};

//TODO add function to change the canvas color
//TODO add a function to clear the canvas without having to reload
//TODO maybe a dark mode
//TODO maybe custom promps
