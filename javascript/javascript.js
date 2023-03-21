const init = () => {
  const canvas = document.getElementById("canvas");
  const createCanvasButton = document.getElementById("generate-canvas");
  const colorPicker = document.getElementById("color-picker");
  const colorsUsedPanel = document.getElementById("colors-used-panel");
  const pencilButton = document.getElementById("pencil");
  const eraserButton = document.getElementById("eraser");
  const rainbowButton = document.getElementById("rainbow");
  const brightenButton = document.getElementById("brighten");
  const darkenButton = document.getElementById("darken");
  const gridButton = document.getElementById("grid-btn");
  const clearButton = document.getElementById("clear-canvas");
  let userAgentString = navigator.userAgent;
  let chromeAgent = userAgentString.indexOf("Chrome") > -1;
  let firefoxAgent = userAgentString.indexOf("Firefox") > -1;
  let browserVariable = 0;
  let color = "#000000";
  let canvasColor = "#FDFFFC";
  let colorUsedCounter = [];
  let size = 16;
  let mode = "pencil";
  let drawing = false;

  const nowDrawing = () => {
    drawing = true;
  };

  const notDrawing = () => {
    drawing = false;
  };

  const getSize = () => {
    const reg = new RegExp(/^[1-9][0-9]?$|^100$/);
    do {
      size = window.prompt(
        `Please, enter a number between 1 and 100, it will be your canvas size `
      );
      if (reg.test(size) === false) {
        window.alert(
          `That is an invalid input, please select a number between 1 and 100`
        );
      }
    } while (reg.test(size) === false);
    return size;
  };

  const removeCanvas = () => {
    while (canvas.firstChild) {
      canvas.removeChild(canvas.firstChild);
    }
    getSize();
    createCanvas(size);
  };

  const createCanvas = () => {
    canvas.style.cssText = `grid-template-rows: repeat(${size}, 1fr); grid-template-columns: repeat(${size}, 1fr)`;
    for (i = 0; i < size * size; i++) {
      let cell = document.createElement("div");
      cell.style.backgroundColor = `${canvasColor}`;
      cell.classList.add("cell-grid");
      cell.addEventListener("mousedown", draw);
      cell.addEventListener("mouseover", draw);
      canvas.append(cell);
    }
  };

  const draw = (e) => {
    if (e.type === "mouseover" && drawing === false) return;
    else if (mode === "pencil") {
      e.target.style.backgroundColor = color;
    } else if (mode === "eraser") {
      e.target.style.backgroundColor = canvasColor;
    } else if (mode === "rainbow") {
      e.target.style.backgroundColor = getRandomColor();
    } else if (mode === "brighten") {
      e.target.style.backgroundColor = getShade(
        getComputedStyle(e.target).backgroundColor,
        30
      );
    } else if (mode === "darken") {
      e.target.style.backgroundColor = getShade(
        getComputedStyle(e.target).backgroundColor,
        -30
      );
    }
  };

  /*
this is opacity the challenge states darkness, going to leave it here maybe I will use it for something

  const lighten = (thisColor) => {
    let values = thisColor.match(/[\d\.]+/g);
    let r = values[0];
    let g = values[1];
    let b = values[2];
    let a = Number(values[3]);
    if (a && a !== 0.1) {
      a = a - 0.1;
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    } else if (a === 0.1) {
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    } else {
      a = 0.9;
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
  };

  const darken = (thisColor) => {
    let values = thisColor.match(/[\d\.]+/g);
    let r = values[0];
    let g = values[1];
    let b = values[2];
    let a = Number(values[3]);
    if (a && a !== 1) {
      a = a + 0.1;
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    } else if (a === 1) {
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
  };
*/
  createCanvas(size);

  const addColor = (e) => {
    pencilButton.checked = true;
    mode = "pencil";
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
      pencilButton.checked = true;
      mode = "pencil";
    } else return;
  };

  const selectMode = () => {
    if (pencilButton.checked) {
      mode = "pencil";
    } else if (eraserButton.checked) {
      mode = "eraser";
    } else if (rainbowButton.checked) {
      mode = "rainbow";
    } else if (brightenButton.checked) {
      mode = "brighten";
    } else if (darkenButton.checked) {
      mode = "darken";
    }
  };

  const getRandomColor = () => {
    var letters = "0123456789ABCDEF";
    var randomColor = "#";
    for (var i = 0; i < 6; i++) {
      randomColor += letters[Math.floor(Math.random() * 16)];
    }
    return randomColor;
  };

  const getShade = (thisColor, shadeValue) => {
    let min = 0;
    let max = 256;
    let colorToShade = thisColor.match(/\d+/g);
    let value = colorToShade.map((individualColor) => {
      const shade = Number(individualColor) + shadeValue;
      return Math.min(Math.max(shade, min), max);
    });
    return `rgb(${value})`;
  };

  const gridControl = () => {
    if (gridButton.checked === false) {
      removeGrid();
    } else addGrid();
  };

  const removeGrid = () => {
    canvas.childNodes.forEach((cell) => {
      cell.classList.remove("cell-grid");
    });
  };

  const addGrid = () => {
    canvas.childNodes.forEach((cell) => {
      cell.classList.add("cell-grid");
    });
  };

  const clearCanvas = (e) => {
    canvas.childNodes.forEach((cell) => {
      cell.style.backgroundColor = canvasColor;
    });
  };

  createCanvasButton.addEventListener("click", removeCanvas);
  canvas.addEventListener("mousedown", nowDrawing);
  window.addEventListener("mouseup", notDrawing);
  clearButton.addEventListener("click", clearCanvas);
  colorPicker.addEventListener("change", addColor);
  colorsUsedPanel.addEventListener("click", pickUsedColor);
  pencilButton.addEventListener("change", selectMode);
  eraserButton.addEventListener("change", selectMode);
  rainbowButton.addEventListener("change", selectMode);
  brightenButton.addEventListener("change", selectMode);
  darkenButton.addEventListener("change", selectMode);
  gridButton.addEventListener("change", gridControl);
};

document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState === "complete") {
    init();
  }
});

//TODO color picker
//TODO maybe add custom cursor
