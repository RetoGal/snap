const SNAP_THRESH = 10
export const MAX_MOUSE_SPEED = 3
export const VERTICAL_LINE = "vertical"
export const HORIZONTAL_LINE = "horizontal"

export const getLayerCoordsOfPoints = (x, y, width, height) => {
  x = Math.round(x)
  y = Math.round(y)
  width = Math.round(width)
  height = Math.round(height)
  const v1 = {
    x,
    y,
  }
  const v2 = {
    x: x + width,
    y: y + height,
  }

  const center = {
    x: x + width / 2,
    y: y + height / 2,
  }
  return [v1, v2, center]
}

const removeGuideLine = (directionLine, coord) => {
  const lines = document.querySelectorAll(`.${directionLine}`)
  lines.forEach((line) => {
    if (directionLine + coord !== line.id) {
      document.getElementById(line.id).remove()
    }
  })
}

const drawGuideLineCanvasCenter = (directionLine, coord, canvasDimentions) => {
  if (document.getElementById(directionLine + coord)) {
    return
  }
  const root = document.getElementById("root")
  const line = document.createElement("div")
  line.style.position = "absolute"
  line.className = directionLine
  line.id = directionLine + coord
  line.style.top =
    directionLine === VERTICAL_LINE ? 0 : `${canvasDimentions.height / 2}px`
  line.style.left =
    directionLine === VERTICAL_LINE ? `${canvasDimentions.width / 2}px` : 0
  line.style.height =
    directionLine === VERTICAL_LINE ? `${canvasDimentions.height}px` : 0
  line.style.width =
    directionLine === VERTICAL_LINE ? 0 : `${canvasDimentions.width}px`
  line.style.border = "1px dashed #FF9B7B "
  root.append(line)
}

const drawGuideLineLayers = (directionLine, coord, canvasDimentions) => {
  if (document.getElementById(directionLine + coord)) {
    return
  }
  const root = document.getElementById("root")
  const line = document.createElement("div")
  line.style.position = "absolute"
  line.className = directionLine
  line.id = directionLine + coord
  line.style.top = directionLine === VERTICAL_LINE ? 0 : `${coord}px`
  line.style.left = directionLine === VERTICAL_LINE ? `${coord}px` : 0
  line.style.height =
    directionLine === VERTICAL_LINE ? `${canvasDimentions.height}px` : 0
  line.style.width =
    directionLine === VERTICAL_LINE ? 0 : `${canvasDimentions.width}px`
  line.style.border = "1px dashed #777AFF"
  root.append(line)
}

const drawGuideLineCanvasStart = (directionLine, coord, canvasDimentions) => {
  if (document.getElementById(directionLine + coord)) {
    return
  }
  const root = document.getElementById("root")
  const line = document.createElement("div")
  line.style.position = "absolute"
  line.className = directionLine
  line.id = directionLine + coord
  line.style.top = 0
  line.style.left = 0
  line.style.height =
    directionLine === VERTICAL_LINE ? `${canvasDimentions.height}px` : 0
  line.style.width =
    directionLine === VERTICAL_LINE ? 0 : `${canvasDimentions.width}px`
  line.style.border = "1px solid #900C3F"
  root.append(line)
}

const drawGuideLineCanvasEnd = (directionLine, coord, canvasDimentions) => {
  if (document.getElementById(directionLine + coord)) {
    return
  }
  const root = document.getElementById("root")
  const line = document.createElement("div")
  line.style.position = "absolute"
  line.className = directionLine
  line.id = directionLine + coord
  line.style.top = VERTICAL_LINE ? 0 : `${canvasDimentions.width}px`
  line.style.left = VERTICAL_LINE ? `${canvasDimentions.width - 2}px` : 0
  line.style.height =
    directionLine === VERTICAL_LINE ? `${canvasDimentions.height - 2}px` : 0
  line.style.width =
    directionLine === VERTICAL_LINE ? 0 : `${canvasDimentions.width}px`
  line.style.border = "1px solid #900C3F"
  root.append(line)
}

export const getDraggingPointsCoords = (rect) => {
  const horizontal = []
  const vertical = []

  const coordsPointsDragLayers = getLayerCoordsOfPoints(
    rect.left,
    rect.top,
    rect.width,
    rect.height
  )
  coordsPointsDragLayers.forEach((coords) => {
    horizontal.push(coords.x)
    vertical.push(coords.y)
  })

  return {
    x: horizontal,
    y: vertical,
  }
}

export const getSnapPointsCoords = () => {
  const allLayers = document.querySelectorAll(".layer")
  const horizontal = []
  const vertical = []

  allLayers.forEach((layer) => {
    if (layer.className.includes("draggingLayer") === false) {
      const el = layer.getBoundingClientRect()
      const layersCoordsOfPoints = getLayerCoordsOfPoints(
        el.left,
        el.top,
        el.width,
        el.height
      )
      layersCoordsOfPoints.forEach((coords) => {
        horizontal.push(coords.x)
        vertical.push(coords.y)
      })
    }
  })

  return {
    x: horizontal,
    y: vertical,
  }
}
export const getSnappedCoords = (
  dragPointsArr,
  snapPointsArr,
  canvasDimention,
  rectAxes,
  lineDirection
) => {
  let left = null
  let top = null
  dragPointsArr.forEach((dragAxes) => {
    if (Math.abs(dragAxes - canvasDimention.height / 2) < SNAP_THRESH) {
      if (lineDirection === HORIZONTAL_LINE) {
        top = `${rectAxes - (dragAxes - canvasDimention.height / 2)}px`
      }
    }

    if (Math.abs(dragAxes - canvasDimention.width / 2) < SNAP_THRESH) {
      if (lineDirection === VERTICAL_LINE) {
        left = `${rectAxes - (dragAxes - canvasDimention.width / 2)}px`
      }
    }

    if (dragAxes < SNAP_THRESH) {
      if (lineDirection === VERTICAL_LINE) {
        left = "0px"
      } else {
        top = "0px"
      }
    }

    if (canvasDimention.width - dragAxes < SNAP_THRESH) {
      if (lineDirection === VERTICAL_LINE) {
        left = `${rectAxes - (dragAxes - canvasDimention.width)}px`
      } else {
        top = `${rectAxes - (dragAxes - canvasDimention.width)}px`
      }
    }
    snapPointsArr.forEach((snapAxes) => {
      if (Math.abs(dragAxes - snapAxes) < SNAP_THRESH) {
        console.log(Math.abs(dragAxes - snapAxes),"Math.abs(dragAxes - snapAxes)")
        if (lineDirection === VERTICAL_LINE) {
          left = `${rectAxes - (dragAxes - snapAxes)}px`
        } else {
          top = `${rectAxes - (dragAxes - snapAxes)}px`
        }
      }
    })
  })

  return {
    left,
    top,
  }
}

export const drawGuidLines = (
  dragPointsArr,
  snapPointsArr,
  canvasDimention,
  lineDirection,
  coordAxes
) => {
  removeGuideLine(lineDirection, coordAxes)

  dragPointsArr.forEach((dragAxes) => {
    if (Math.abs(dragAxes - canvasDimention.width / 2) < SNAP_THRESH) {
      drawGuideLineCanvasCenter(lineDirection, coordAxes, canvasDimention)
    }

    if (Math.abs(dragAxes - canvasDimention.height / 2) < SNAP_THRESH) {
      drawGuideLineCanvasCenter(lineDirection, coordAxes, canvasDimention)
    }

    if (dragAxes < SNAP_THRESH) {
      drawGuideLineCanvasStart(lineDirection, coordAxes, canvasDimention)
    }

    if (canvasDimention.width - dragAxes < SNAP_THRESH) {
      drawGuideLineCanvasEnd(lineDirection, coordAxes, canvasDimention)
    }

    snapPointsArr.forEach((snapAxes) => {
      if (Math.abs(dragAxes - snapAxes) < SNAP_THRESH) {
        drawGuideLineLayers(lineDirection, snapAxes, canvasDimention)
      }
    })
  })
}
