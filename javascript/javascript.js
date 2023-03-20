const init = () => {
  const canvas = document.getElementById("canvas");
  const createCanvasButton = document.getElementById("generate-canvas");
  const colorPicker = document.getElementById("color-picker");
  const colorsUsedPanel = document.getElementById("colors-used-panel");
  const pencilButton = document.getElementById("pencil");
  const eraserButton = document.getElementById("eraser");
  const rainbowButton = document.getElementById("rainbow");
  const gridButton = document.getElementById("grid-btn");
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
    console.log(getComputedStyle(e.target).backgroundColor);
    if (e.type === "mouseover" && drawing === false) return;
    else if (mode === "pencil") {
      e.target.style.backgroundColor = color;
    } else if (mode === "eraser") {
      e.target.style.backgroundColor = canvasColor;
    } else if (mode === "rainbow") {
      e.target.style.backgroundColor = getRandomColor();
    }
  };

  createCanvas(size);

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

  const selectMode = () => {
    if (pencilButton.checked) {
      mode = "pencil";
    } else if (eraserButton.checked) {
      mode = "eraser";
    } else if (rainbowButton.checked) {
      mode = "rainbow";
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

  createCanvasButton.addEventListener("click", removeCanvas);
  canvas.addEventListener("mousedown", nowDrawing);
  canvas.addEventListener("mouseup", notDrawing);
  colorPicker.addEventListener("change", addColor);
  colorsUsedPanel.addEventListener("click", pickUsedColor);
  pencilButton.addEventListener("change", selectMode);
  eraserButton.addEventListener("change", selectMode);
  rainbowButton.addEventListener("change", selectMode);
  gridButton.addEventListener("change", gridControl);
};

document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState === "complete") {
    init();
  }
});

//TODO add a function to clear the canvas without having to reload
//TODO add a function to ligten and darken the color
//TODO maybe add custom cursor
