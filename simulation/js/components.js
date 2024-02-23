function Furnace(canvas, ctx) {
  let assetPath = "images/utm/";
  let itemsToLoad = 3;
  let itemsLoaded = 0;
  let imgFurnace1 = new Image();
  let imgFurnace2 = new Image();
  //let imgUTM3 = new Image();
  let imgUTMPiller1 = new Image();
  let imgUTMPiller2 = new Image();
  let sample = new Image();
  //let sampleNecked = new Image();
  //let sampleCracked = new Image();
  let arrow = new Image();
  let xOffset = 30;
  let yOffset = 100;
  let yMovement = 0; /* 0 to 1 */
  let dragMode = 1; /* 0 = no drag, 1 = drag machine, */
  let isFixed = 0; /* 0=draggable; 1=not draggable */
  let sampleLoaded = false;
  let menuPinText = ["Pin", "Unpin"];
  let menuPinIcon = [ContextMenu.pinIcon, ContextMenu.unpinIcon];
  let utmPlayRef = null;
  let currentSampleState = 0; //0: no crack; 1: necked; 2:cracked
  let currentDialReading = 0;
  let currentLoad = 0;
  let config = {
    yield_point: 0.7,
    breaking_point: 0.9,
    finish_point: 1,
  };

  let scale = 1;
  let flashArrow = true;

  // let startX = 0;
  // let startY = 0;

  let isActive = false;

  // imgUTM1.src = assetPath + "utm1.png";
  // imgUTM1.onload = itemsLoaded++;

  // imgUTM2.src = assetPath + "utm2.png";
  // imgUTM2.onload = itemsLoaded++;

  // imgUTMPiller1.src = assetPath + "utm3.png";
  // imgUTMPiller1.onload = itemsLoaded++;
  // imgUTMPiller2.src = assetPath + "utm3.png";
  // imgUTMPiller2.onload = itemsLoaded++;

  imgFurnace1.src = assetPath + "closedfurnace.png";
  imgFurnace1.onload = itemsLoaded++;

  imgFurnace2.src = assetPath + "openfurnace.png";
  imgFurnace2.onload = itemsLoaded++;

  //imgUTM3.src = assetPath + "utm5.png";
  //imgUTM3.onload = itemsLoaded++;

  sample.src = assetPath + "aluminium-specimen.png";
  sample.onload = itemsLoaded++;

  /*sampleNecked.src = assetPath + "sample1-necked.png";
    sampleNecked.onload = itemsLoaded++;*/

  /*sampleCracked.src = assetPath + "sample1-cracked.png";
    sampleCracked.onload = itemsLoaded++;*/

  arrow.src = assetPath + "arrow-h.png";
  arrow.onload = itemsLoaded++;

  var contextMenu;
  var contextMenuInstance = null;

  const init = () => {
    isActive = true;
    xOffset = 100;
    yOffset = 60;

    if (itemsLoaded >= itemsToLoad) {
      ctx.refresh();
    }

    contextMenu = new ContextMenu();
  };

  const paint = () => {
    if (!isActive) return;
    flashArrow = !flashArrow;
    ctx.fillStyle = "black";
    ctx.font = "9pt sans-serif";

    /*x = (xOffset + 105) * scale;
      y = (yOffset + 180) * scale;*/
    // ctx.drawImage(imgUTMPiller1, x, y, imgUTMPiller1.width * scale, imgUTMPiller1.height * scale);

    // x = (xOffset + 295) * scale;
    // y = (yOffset + 180) * scale;
    // ctx.drawImage(imgUTMPiller2, x, y, imgUTMPiller2.width * scale, imgUTMPiller2.height * scale);

    // x = (xOffset + 68) * scale;
    // let shift = yMovement * 90 - 120;
    // y = (yOffset - shift) * scale;
    //ctx.drawImage(imgFurnace1, x, y, imgFurnace1.width * scale, imgFurnace1.height * scale);

    let _x = xOffset * scale;
    let _y = (yOffset + 100) * scale;
    //ctx.drawImage(imgFurnace1, _x, _y, imgFurnace1.width * scale, imgFurnace1.height * scale);

    /*_x = (xOffset + 40) * scale;
      //_x = (xOffset ) * scale;
      _y = (yOffset + 190) * scale;*/
    if (!sampleLoaded) {
      ctx.drawImage(imgFurnace2, _x, _y, imgFurnace2.width * scale, imgFurnace2.height * scale);
    }

    if (sampleLoaded) {
      _x = xOffset * scale;
      _y = (yOffset + 100) * scale;

      ctx.drawImage(imgFurnace1, _x, _y, imgFurnace1.width * scale, imgFurnace1.height * scale);
    } else if (flashArrow) {
      let x = (xOffset + 80) * scale;
      let y = (yOffset + 250) * scale;
      ctx.fillText("Drag sample here", x - 75, y + 62);
      ctx.drawImage(arrow, x + 30, y + 50, arrow.width / 2.5, arrow.height / 2.5);
    }

    ctx.save();
  };

  const start = (speed, direction) => {
    // speed 0 to 1
    // direction -1:down, 1: up

    if (direction == -1) {
      utmPlayRef = setInterval(() => {
        step = speed * 0.05;
        yMovement -= step;

        if (yMovement <= 0) {
          clearInterval(utmPlayRef);
          return;
        }

        ctx.refresh();
      }, 100);
    } else {
      utmPlayRef = setInterval(() => {
        step = speed * 0.05;
        yMovement += step;
        currentLoad += 0.5;
        currentDialReading = currentLoad * Math.round(5 * yMovement);

        if (yMovement >= config.finish_point) {
          clearInterval(utmPlayRef);
          utmPlayRef = null;
          return;
        }

        ctx.refresh();
      }, 100);
    }
  };

  const stop = () => {
    if (utmPlayRef) {
      clearInterval(utmPlayRef);
      utmPlayRef = null;
    }
  };

  const isInside = ({ x, y }) => {
    boundary = {
      xmin: (xOffset + 20) * scale,
      xmax: (xOffset + 430) * scale,
      ymin: (yOffset + 85) * scale,
      ymax: (yOffset + 600) * scale,
    };

    // ctx.fillRect(boundary.xmin, boundary.ymin, boundary.xmax - boundary.xmin, boundary.ymax - boundary.ymin);

    if (x > boundary.xmin && x < boundary.xmax && y > boundary.ymin && y < boundary.ymax) {
      return true;
    }
  };

  const getMouseCoords = (event) => {
    let rect = canvas.getBoundingClientRect();
    let x = (event.clientX - rect.left) * devicePixelRatio;
    let y = (event.clientY - rect.top) * devicePixelRatio;
    return { x: x, y: y };
  };

  const getCanvasCoords = (x, y) => {
    let rect = canvas.getBoundingClientRect();
    let cx = x / devicePixelRatio + rect.left;
    let cy = y / devicePixelRatio + rect.top;
    return { x: cx, y: cy };
  };

  function drawLine(point1, point2) {
    ctx.beginPath();
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.stroke();
  }

  const onClickHandler = (event) => {
    if (contextMenuInstance) {
      contextMenu.closeMenu(contextMenuInstance);
    }
  };

  const onMouseDownHandler = (event) => {
    if (isFixed == 0 && isInside(getMouseCoords(event))) {
      dragMode = 1;
      return;
    }
  };

  const onMouseUpHandler = (event) => {
    // if(dragMode == 0){
    //   return;
    // }
    dragMode = 0;
  };

  const onMouseMoveHandler = (event) => {
    if (dragMode == 0) return;
    const rect = canvas.getBoundingClientRect();
    // let x = event.clientX - rect.left;
    // let y = event.clientY - rect.top;
    let { x, y } = getMouseCoords(event);

    // ctx.fillRect(x, y, 5, 5);
    // // ctx.refresh();
    // return;

    // let dx = (x - startX)/scale;
    // let dy = (y - startY)/scale;

    if (dragMode == 1) {
      // xOffset += dx;
      // yOffset += dy;
      xOffset = (x - 100 * scale) / scale;
      yOffset = (y - 300 * scale) / scale;

      ctx.refresh();

      // startX = x;
      // startY = y;
    }
  };

  const onMouseWheelHandler = (event) => {
    if (isActive && isInside(getMouseCoords(event))) {
      let { deltaY } = event;
      if (deltaY > 0) {
        // scale down the image
        scale = Math.max(0.5, scale - 0.05);
      } else {
        // scale up (zoom)
        scale = Math.min(2.5, scale + 0.05);
      }
      ctx.refresh();
    }
  };

  const onContextMenuHandler = (event) => {
    if (contextMenuInstance) {
      contextMenu.closeMenu(contextMenuInstance);
    }

    if (isActive && isInside(getMouseCoords(event))) {
      let menuItems = [
        // {
        //   content: `${ContextMenu.deleteIcon}Delete`,
        //   divider: "top", // top, bottom, top-bottom
        //   events: {
        //     click: destory,
        //   },
        // },
        {
          content: `${menuPinIcon[isFixed]}${menuPinText[isFixed]}`,
          divider: "top", // top, bottom, top-bottom
          events: {
            click: () => {
              if (contextMenuInstance) {
                contextMenu.closeMenu(contextMenuInstance);
              }

              // toggle
              isFixed = isFixed ? 0 : 1;
              ctx.refresh();
            },
          },
        },
      ];

      if (sampleLoaded) {
        menuItems.push({
          content: `${ContextMenu.deleteIcon}Unload Sample`,
          divider: "top", // top, bottom, top-bottom
          events: {
            click: () => {
              if (contextMenuInstance) {
                contextMenu.closeMenu(contextMenuInstance);
              }

              sampleLoaded = 0;
              sample1.init();
              ctx.refresh();
            },
          },
        });
      }

      contextMenu.setMenuItems(menuItems);
      let dx = (xOffset + 350) * scale;
      let dy = (yOffset + 120) * scale;
      contextMenuInstance = contextMenu.show(getCanvasCoords(dx, dy));
    }
    return true;
  };

  const destory = () => {
    if (contextMenuInstance) {
      contextMenu.closeMenu(contextMenuInstance);
    }

    isActive = false;
    ctx.refresh();
  };

  return {
    init: init,
    start: start,
    stop: stop,
    isActive: () => isActive,
    isInside: isInside,
    setConfig: (conf) => {
      config = conf;
    },
    isRunning: () => (utmPlayRef ? true : false),
    loadSample1: () => {
      sampleLoaded = true;
      yMovement = 0.55;
    },
    getLoad: () => currentLoad,
    getDialReading: () => currentDialReading,
    isSampleLoaded: () => sampleLoaded,
    getSampleState: () => currentSampleState,
    onMouseDownHandler: onMouseDownHandler,
    onMouseUpHandler: onMouseUpHandler,
    onMouseMoveHandler: onMouseMoveHandler,
    onContextMenuHandler: onContextMenuHandler,
    onClickHandler: onClickHandler,
    onMouseWheelHandler: onMouseWheelHandler,
    paint: paint,
    destory: destory,
  };
}

function Sample1(canvas, ctx) {
  let assetPath = "images/sample/";
  if (typeof SAMPLE_ASSETS_PATH !== "undefined") {
    assetPath = SAMPLE_ASSETS_PATH;
  }

  let itemsToLoad = 1;
  let itemsLoaded = 0;
  let sample1 = new Image();
  //let sample1Cracked = new Image();
  //let sample1Necked = new Image();
  let xOffset = 40;
  let yOffset = 120;
  let yMovement = 0; /* 0 to 1 */
  let dragMode = 0; /* 0 = no drag, 1 = drag machine, */
  let isFixed = 0; /* 0=draggable; 1=not draggable */
  let rotate = 0; /* 0=horizontal; 1=vertical */
  let menuPinText = ["Pin", "Unpin"];
  let menuPinIcon = [ContextMenu.pinIcon, ContextMenu.unpinIcon];
  let menuRotateText = ["Rotate", "Rotate back"];
  let menuRotateIcon = [ContextMenu.rotateRight, ContextMenu.rotateLeft];

  let scale = 0.5;

  let isActive = false;

  sample1.src = assetPath + "aluminium-specimen.png";
  sample1.onload = itemsLoaded++;
  /*sample1Necked.src = assetPath + "sample1-necked.png";
    sample1Necked.onload = itemsLoaded++;
    sample1Cracked.src = assetPath + "sample1-cracked.png";
    sample1Cracked.onload = itemsLoaded++;*/

  var contextMenu;
  var contextMenuInstance = null;

  const init = () => {
    isActive = true;
    xOffset = 40;
    yOffset = 70;

    if (itemsLoaded >= itemsToLoad) {
      ctx.refresh();
    }

    contextMenu = new ContextMenu();
  };

  const paint = () => {
    if (!isActive) return;

    ctx.save();

    x = xOffset * scale;
    y = yOffset * scale;

    if (rotate) {
      x = -x;
      y = -y;
      ctx.rotate((90 * Math.PI) / 180);
    }

    let currentSample = sample1;
    /*if (utm) {
        if (utm.getSampleState() == 1) {
          currentSample = sample1Necked;
        } else if (utm.getSampleState() == 2) {
          currentSample = sample1Cracked;
        }
      }*/

    ctx.drawImage(currentSample, x, y, sample1.width * scale, sample1.height * scale);
    ctx.restore();
  };

  const start = (speed, direction) => {
    // speed 0 to 1
    // direction -1:down, 1: up

    if (direction == -1) {
      let ref = setInterval(() => {
        step = speed * 0.05;
        yMovement -= step;

        if (yMovement <= 0) {
          clearInterval(ref);
          return;
        }

        ctx.refresh();
      }, 100);
    } else {
      let ref = setInterval(() => {
        step = speed * 0.05;
        yMovement += step;

        if (yMovement >= 1) {
          clearInterval(ref);
          return;
        }

        ctx.refresh();
      }, 100);
    }
  };

  const isInside = ({ x, y }) => {
    if (rotate) {
      boundary = {
        ymin: (-xOffset + 10) * scale,
        ymax: (-xOffset + 750) * scale,
        xmin: (yOffset - 100) * scale,
        xmax: (yOffset + 5) * scale,
      };
    } else {
      boundary = {
        xmin: (xOffset + 10) * scale,
        xmax: (xOffset + 250) * scale,
        ymin: yOffset * scale,
        ymax: (yOffset + 140) * scale,
      };
    }

    // ctx.fillRect(boundary.xmin, boundary.ymin, boundary.xmax - boundary.xmin, boundary.ymax - boundary.ymin);

    if (x > boundary.xmin && x < boundary.xmax && y > boundary.ymin && y < boundary.ymax) {
      return true;
    }
  };

  const getMouseCoords = (event) => {
    let rect = canvas.getBoundingClientRect();
    let x = (event.clientX - rect.left) * devicePixelRatio;
    let y = (event.clientY - rect.top) * devicePixelRatio;
    return { x: x, y: y };
  };

  const getCanvasCoords = (x, y) => {
    let rect = canvas.getBoundingClientRect();
    let cx = x / devicePixelRatio + rect.left;
    let cy = y / devicePixelRatio + rect.top;
    return { x: cx, y: cy };
  };

  const onClickHandler = (event) => {
    if (contextMenuInstance) {
      contextMenu.closeMenu(contextMenuInstance);
    }
  };

  const onMouseDownHandler = (event) => {
    if (isFixed == 0 && isInside(getMouseCoords(event))) {
      dragMode = 1;
      return;
    }
  };

  const onMouseUpHandler = (event) => {
    if (dragMode == 1) {
      if (furnace && furnace.isActive() && furnace.isInside(getMouseCoords(event))) {
        furnace.loadSample1();
        destory();
      } else if (vickers && vickers.isActive() && vickers.isInside(getMouseCoords(event))) {
        vickers.loadSample1(rotate + 1);
        destory();
      }
      ctx.refresh();
    }

    dragMode = 0;
  };

  const onMouseMoveHandler = (event) => {
    if (dragMode == 0) return;

    let { x, y } = getMouseCoords(event);

    if (dragMode == 1) {
      if (rotate) {
        xOffset = -(y - 20 * scale) / scale;
        yOffset = (x + 50 * scale) / scale;
      } else {
        xOffset = (x - 100 * scale) / scale;
        yOffset = (y + 10 * scale) / scale;
      }
      ctx.refresh();
    }
  };

  const onMouseWheelHandler = (event) => {
    if (isActive && isInside(getMouseCoords(event))) {
      let { deltaY } = event;
      if (deltaY > 0) {
        // scale down the image
        scale = Math.max(0.1, scale - 0.05);
      } else {
        // scale up (zoom)
        scale = Math.min(2, scale + 0.05);
      }
      ctx.refresh();
    }
  };

  const onContextMenuHandler = (event) => {
    if (contextMenuInstance) {
      contextMenu.closeMenu(contextMenuInstance);
    }

    if (isActive && isInside(getMouseCoords(event))) {
      contextMenu.setMenuItems([
        // {
        //   content: `${ContextMenu.deleteIcon}Delete`,
        //   divider: "top", // top, bottom, top-bottom
        //   events: {
        //     click: destory,
        //   },
        // },
        {
          content: `${menuPinIcon[isFixed]}${menuPinText[isFixed]}`,
          divider: "top", // top, bottom, top-bottom
          events: {
            click: () => {
              if (contextMenuInstance) {
                contextMenu.closeMenu(contextMenuInstance);
              }

              // toggle
              isFixed = isFixed ? 0 : 1;
              ctx.refresh();
            },
          },
        },
        {
          content: `${menuRotateIcon[rotate]}${menuRotateText[rotate]}`,
          divider: "top", // top, bottom, top-bottom
          events: {
            click: () => {
              if (contextMenuInstance) {
                contextMenu.closeMenu(contextMenuInstance);
              }

              rotate = rotate == 0 ? 1 : 0;

              xOffset = -rotate * 30 + 10;
              yOffset = 120;

              ctx.refresh();
            },
          },
        },
      ]);

      if (rotate) {
        let dx = yOffset * scale;
        let dy = -xOffset * scale;
        contextMenuInstance = contextMenu.show(getCanvasCoords(dx, dy));
      } else {
        let dx = (xOffset + 200) * scale;
        let dy = (yOffset - 10) * scale;
        contextMenuInstance = contextMenu.show(getCanvasCoords(dx, dy));
      }
    }
    return true;
  };

  const destory = () => {
    if (contextMenuInstance) {
      contextMenu.closeMenu(contextMenuInstance);
    }

    isActive = false;
    ctx.refresh();
  };

  return {
    init: init,
    start: start,
    isActive: () => isActive,
    setAssetsPath: (path) => {
      assetPath = path;
    },
    onMouseDownHandler: onMouseDownHandler,
    onMouseUpHandler: onMouseUpHandler,
    onMouseMoveHandler: onMouseMoveHandler,
    onContextMenuHandler: onContextMenuHandler,
    onClickHandler: onClickHandler,
    onMouseWheelHandler: onMouseWheelHandler,
    paint: paint,
    destory: destory,
  };
}

function Vickers(canvas, ctx) {
  let assetPath = "images/vickers/";
  let itemsToLoad = 3;
  let itemsLoaded = 0;
  let imgVickers1 = new Image();
  let imgVickers2 = new Image();
  //let imgUTM3 = new Image();
  //let imgUTMPiller1 = new Image();
  //let imgUTMPiller2 = new Image();
  let sample = new Image();
  //let sampleNecked = new Image();
  //let sampleCracked = new Image();
  let arrow = new Image();
  let xOffset = 30;
  let yOffset = 100;
  let yMovement = 0; /* 0 to 1 */
  let dragMode = 1; /* 0 = no drag, 1 = drag machine, */
  let isFixed = 0; /* 0=draggable; 1=not draggable */
  let sampleLoaded = false;
  let menuPinText = ["Pin", "Unpin"];
  let menuPinIcon = [ContextMenu.pinIcon, ContextMenu.unpinIcon];
  let VickersPlayRef = null;
  let currentSampleState = 0; //0: no crack; 1: necked; 2:cracked
  let currentDialReading = 0;
  let currentLoad = 0;
  let config = {
    yield_point: 0.7,
    breaking_point: 0.9,
    finish_point: 1,
  };

  let scale = 1;
  let flashArrow = true;

  // let startX = 0;
  // let startY = 0;

  let isActive = false;

  // imgUTM1.src = assetPath + "utm1.png";
  // imgUTM1.onload = itemsLoaded++;

  // imgUTM2.src = assetPath + "utm2.png";
  // imgUTM2.onload = itemsLoaded++;

  // imgUTMPiller1.src = assetPath + "utm3.png";
  // imgUTMPiller1.onload = itemsLoaded++;
  // imgUTMPiller2.src = assetPath + "utm3.png";
  // imgUTMPiller2.onload = itemsLoaded++;

  imgVickers1.src = assetPath + "vickers1.png";
  imgVickers1.onload = itemsLoaded++;

  imgVickers2.src = assetPath + "vickers2.png";
  imgVickers2.onload = itemsLoaded++;

  /*imgUTM3.src = assetPath + "utm5.png";
    imgUTM3.onload = itemsLoaded++;*/

  sample.src = assetPath + "aluminium-specimen.png";
  sample.onload = itemsLoaded++;

  /*sampleNecked.src = assetPath + "sample1-necked.png";
    sampleNecked.onload = itemsLoaded++;*/

  /*sampleCracked.src = assetPath + "sample1-cracked.png";
    sampleCracked.onload = itemsLoaded++;*/

  arrow.src = assetPath + "arrow-h.png";
  arrow.onload = itemsLoaded++;

  var contextMenu;
  var contextMenuInstance = null;

  const init = () => {
    isActive = true;
    xOffset = 100;
    yOffset = 60;

    if (itemsLoaded >= itemsToLoad) {
      ctx.refresh();
    }

    contextMenu = new ContextMenu();
  };

  const paint = () => {
    if (!isActive) return;
    flashArrow = !flashArrow;
    ctx.fillStyle = "black";
    ctx.font = "9pt sans-serif";

    // x = (xOffset + 105) * scale;
    // y = (yOffset + 180) * scale;
    // ctx.drawImage(imgUTMPiller1, x, y, imgUTMPiller1.width * scale, imgUTMPiller1.height * scale);

    // x = (xOffset + 295) * scale;
    // y = (yOffset + 180) * scale;
    // ctx.drawImage(imgUTMPiller2, x, y, imgUTMPiller2.width * scale, imgUTMPiller2.height * scale);

    // x = (xOffset + 68) * scale;
    // let shift = yMovement * 90 - 120;
    // y = (yOffset - shift) * scale;
    // ctx.drawImage(imgUTM2, x, y, imgUTM2.width * scale, imgUTM2.height * scale);

    let _x = (xOffset + 600) * scale;
    let _y = yOffset * scale;
    ctx.drawImage(imgVickers1, _x, _y, imgVickers1.width * scale, imgVickers1.height * scale);

    /*_x = (xOffset + 40) * scale;
      _y = (yOffset + 190) * scale;
      if (!sampleLoaded) {
        ctx.drawImage(imgVickers1, _x, _y, imgVickers1.width  * scale, imgVickers1.height * scale);
      }*/

    if (sampleLoaded) {
      _x = (xOffset + 600) * scale;
      _y = yOffset * scale;

      ctx.drawImage(imgVickers2, _x, _y, imgVickers2.width * scale, imgVickers2.height * scale);
    } else if (flashArrow) {
      let x = (xOffset + 740) * scale;
      let y = (yOffset + 295) * scale;
      ctx.fillText("Drag sample here", x - 110, y + 12);
      ctx.drawImage(arrow, x, y, arrow.width / 2.5, arrow.height / 2.5);
    }

    ctx.save();
  };

  const start = (speed, direction) => {
    // speed 0 to 1
    // direction -1:down, 1: up

    if (direction == -1) {
      VickersPlayRef = setInterval(() => {
        step = speed * 0.05;
        yMovement -= step;

        if (yMovement <= 0) {
          clearInterval(VickersPlayRef);
          return;
        }

        ctx.refresh();
      }, 100);
    } else {
      VickersPlayRef = setInterval(() => {
        step = speed * 0.05;
        yMovement += step;
        currentLoad += 0.5;
        currentDialReading = currentLoad * Math.round(5 * yMovement);

        if (yMovement >= config.finish_point) {
          clearInterval(VickersPlayRef);
          VickersPlayRef = null;
          return;
        }

        ctx.refresh();
      }, 100);
    }
  };

  const stop = () => {
    if (VickersPlayRef) {
      clearInterval(VickersPlayRef);
      VickersPlayRef = null;
    }
  };

  const isInside = ({ x, y }) => {
    boundary = {
      xmin: (xOffset + 650) * scale,
      xmax: (xOffset + 980) * scale,
      ymin: (yOffset + 50) * scale,
      ymax: (yOffset + 600) * scale,
    };

    // ctx.fillRect(boundary.xmin, boundary.ymin, boundary.xmax - boundary.xmin, boundary.ymax - boundary.ymin);

    if (x > boundary.xmin && x < boundary.xmax && y > boundary.ymin && y < boundary.ymax) {
      return true;
    }
  };

  const getMouseCoords = (event) => {
    let rect = canvas.getBoundingClientRect();
    let x = (event.clientX - rect.left) * devicePixelRatio;
    let y = (event.clientY - rect.top) * devicePixelRatio;
    return { x: x, y: y };
  };

  const getCanvasCoords = (x, y) => {
    let rect = canvas.getBoundingClientRect();
    let cx = x / devicePixelRatio + rect.left;
    let cy = y / devicePixelRatio + rect.top;
    return { x: cx, y: cy };
  };

  function drawLine(point1, point2) {
    ctx.beginPath();
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.stroke();
  }

  const onClickHandler = (event) => {
    if (contextMenuInstance) {
      contextMenu.closeMenu(contextMenuInstance);
    }
  };

  const onMouseDownHandler = (event) => {
    if (isFixed == 0 && isInside(getMouseCoords(event))) {
      dragMode = 1;
      return;
    }
  };

  const onMouseUpHandler = (event) => {
    // if(dragMode == 0){
    //   return;
    // }
    dragMode = 0;
  };

  const onMouseMoveHandler = (event) => {
    if (dragMode == 0) return;
    const rect = canvas.getBoundingClientRect();
    // let x = event.clientX - rect.left;
    // let y = event.clientY - rect.top;
    let { x, y } = getMouseCoords(event);

    // ctx.fillRect(x, y, 5, 5);
    // // ctx.refresh();
    // return;

    // let dx = (x - startX)/scale;
    // let dy = (y - startY)/scale;

    if (dragMode == 1) {
      // xOffset += dx;
      // yOffset += dy;
      xOffset = (x - 750 * scale) / scale;
      yOffset = (y - 300 * scale) / scale;

      ctx.refresh();

      // startX = x;
      // startY = y;
    }
  };

  const onMouseWheelHandler = (event) => {
    if (isActive && isInside(getMouseCoords(event))) {
      let { deltaY } = event;
      if (deltaY > 0) {
        // scale down the image
        scale = Math.max(0.5, scale - 0.05);
      } else {
        // scale up (zoom)
        scale = Math.min(2.5, scale + 0.05);
      }
      ctx.refresh();
    }
  };

  const onContextMenuHandler = (event) => {
    if (contextMenuInstance) {
      contextMenu.closeMenu(contextMenuInstance);
    }

    if (isActive && isInside(getMouseCoords(event))) {
      let menuItems = [
        // {
        //   content: `${ContextMenu.deleteIcon}Delete`,
        //   divider: "top", // top, bottom, top-bottom
        //   events: {
        //     click: destory,
        //   },
        // },
        {
          content: `${menuPinIcon[isFixed]}${menuPinText[isFixed]}`,
          divider: "top", // top, bottom, top-bottom
          events: {
            click: () => {
              if (contextMenuInstance) {
                contextMenu.closeMenu(contextMenuInstance);
              }

              // toggle
              isFixed = isFixed ? 0 : 1;
              ctx.refresh();
            },
          },
        },
      ];

      if (sampleLoaded) {
        menuItems.push({
          content: `${ContextMenu.deleteIcon}Unload Sample`,
          divider: "top", // top, bottom, top-bottom
          events: {
            click: () => {
              if (contextMenuInstance) {
                contextMenu.closeMenu(contextMenuInstance);
              }

              sampleLoaded = 0;
              sample1.init();
              ctx.refresh();
            },
          },
        });
      }

      contextMenu.setMenuItems(menuItems);
      let dx = (xOffset + 850) * scale;
      let dy = (yOffset + 40) * scale;
      contextMenuInstance = contextMenu.show(getCanvasCoords(dx, dy));
    }
    return true;
  };

  const destory = () => {
    if (contextMenuInstance) {
      contextMenu.closeMenu(contextMenuInstance);
    }

    isActive = false;
    ctx.refresh();
  };

  return {
    init: init,
    start: start,
    stop: stop,
    isActive: () => isActive,
    isInside: isInside,
    setConfig: (conf) => {
      config = conf;
    },
    isRunning: () => (VickersPlayRef ? true : false),
    loadSample1: () => {
      sampleLoaded = true;
      yMovement = 0.55;
    },
    getLoad: () => currentLoad,
    getDialReading: () => currentDialReading,
    isSampleLoaded: () => sampleLoaded,
    getSampleState: () => currentSampleState,
    onMouseDownHandler: onMouseDownHandler,
    onMouseUpHandler: onMouseUpHandler,
    onMouseMoveHandler: onMouseMoveHandler,
    onContextMenuHandler: onContextMenuHandler,
    onClickHandler: onClickHandler,
    onMouseWheelHandler: onMouseWheelHandler,
    paint: paint,
    destory: destory,
  };
}
