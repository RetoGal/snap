const SNAP_THRESH = 5
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

export const removeGuideLine = (directionLine) => {
  const lines = document.querySelectorAll(`.${directionLine}`)
  lines.forEach((guideLine) => guideLine.remove())
}

const getGuideLineNode = (top, left, height, width, border, className) => {
  const root = document.getElementById("root")
  const line = document.createElement("div")
  line.style.position = "absolute"
  line.className = `${className} guideline`

  line.style.top = `${top}px`
  line.style.left = `${left}px`
  line.style.height = `${height}px`
  line.style.width = `${width}px`

  line.style.border = border

  root.append(line)
}

const drawGuideLineCanvasCenter = (directionLine, coord, canvasDimentions) => {
  getGuideLineNode(
    directionLine === VERTICAL_LINE ? 0 : canvasDimentions.height / 2,
    directionLine === VERTICAL_LINE ? canvasDimentions.width / 2 : 0,
    directionLine === VERTICAL_LINE ? canvasDimentions.height : 0,
    directionLine === VERTICAL_LINE ? 0 : canvasDimentions.width,
    "1px dashed #FF9B7B",
    directionLine
  )
}

const drawGuideLineLayers = (
  directionLine,
  coord,
  canvasDimentions,
  snapMin,
  dragMax
) => {
  getGuideLineNode(
    directionLine === VERTICAL_LINE
      ? dragMax > snapMin
        ? snapMin
        : dragMax
      : coord,
    directionLine === VERTICAL_LINE
      ? coord
      : dragMax > snapMin
      ? snapMin
      : dragMax,
    directionLine === VERTICAL_LINE ? Math.abs(dragMax - snapMin) : 0,

    directionLine === VERTICAL_LINE ? 0 : Math.abs(dragMax - snapMin),
    "1px dashed #777AFF",
    directionLine
  )
}

const drawGuideLineCanvasStart = (directionLine, coord, canvasDimentions) => {
  getGuideLineNode(
    0,
    0,
    directionLine === VERTICAL_LINE ? canvasDimentions.height : 0,
    directionLine === VERTICAL_LINE ? 0 : canvasDimentions.width,
    "1px solid #900C3F",
    directionLine
  )
}

const drawGuideLineCanvasEnd = (directionLine, coord, canvasDimentions) => {
  getGuideLineNode(
    directionLine === VERTICAL_LINE ? 0 : canvasDimentions.width,
    directionLine === VERTICAL_LINE ? canvasDimentions.width - 2 : 0,
    directionLine === VERTICAL_LINE ? canvasDimentions.height - 2 : 0,
    directionLine === VERTICAL_LINE ? 0 : canvasDimentions.width,
    "1px solid #900C3F",
    directionLine
  )
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
  for (let dragAxes of dragPointsArr) {
    for (let snapAxes of snapPointsArr) {
      if (Math.abs(dragAxes - snapAxes) < SNAP_THRESH) {
        return rectAxes - (dragAxes - snapAxes)
      }
    }

    if (canvasDimention.width - dragAxes < SNAP_THRESH) {
      return rectAxes - (dragAxes - canvasDimention.width)
    }

    if (dragAxes < SNAP_THRESH) {
      return 0
    }

    if (Math.abs(dragAxes - canvasDimention.width / 2) < SNAP_THRESH) {
      if (lineDirection === VERTICAL_LINE) {
        return rectAxes - (dragAxes - canvasDimention.width / 2)
      }
    }

    if (Math.abs(dragAxes - canvasDimention.height / 2) < SNAP_THRESH) {
      if (lineDirection === HORIZONTAL_LINE) {
        return rectAxes - (dragAxes - canvasDimention.height / 2)
      }
    }
  }

  return null
}

export const drawGuidLinesHorizontal = (
  dragPointsArr,
  snapPointsArr,
  canvasDimention,
  lineDirection,
  coordAxes
) => {
  removeGuideLine(lineDirection)

  dragPointsArr.y.forEach((dragAxes) => {
    if (
      lineDirection === VERTICAL_LINE &&
      Math.abs(dragAxes - canvasDimention.width / 2) < SNAP_THRESH
    ) {
      drawGuideLineCanvasCenter(lineDirection, coordAxes, canvasDimention)
    }

    if (
      lineDirection === HORIZONTAL_LINE &&
      Math.abs(dragAxes - canvasDimention.height / 2) < SNAP_THRESH
    ) {
      drawGuideLineCanvasCenter(lineDirection, coordAxes, canvasDimention)
    }

    if (dragAxes < SNAP_THRESH) {
      drawGuideLineCanvasStart(lineDirection, coordAxes, canvasDimention)
    }

    if (canvasDimention.width - dragAxes < SNAP_THRESH) {
      drawGuideLineCanvasEnd(lineDirection, coordAxes, canvasDimention)
    }

    snapPointsArr.y.forEach((snapAxes) => {
      if (Math.abs(dragAxes - snapAxes) < SNAP_THRESH) {
        const snapXmin = Math.min(...snapPointsArr.x)
        const dragXmax = Math.max(...dragPointsArr.x)

        drawGuideLineLayers(
          lineDirection,
          snapAxes,
          canvasDimention,
          snapXmin,
          dragXmax
        )
      }
    })
  })
}

export const drawGuidLinesVertical = (
  dragPointsArr,
  snapPointsArr,
  canvasDimention,
  lineDirection,
  coordAxes
) => {
  removeGuideLine(lineDirection)

  dragPointsArr.x.forEach((dragAxes) => {
    if (
      lineDirection === VERTICAL_LINE &&
      Math.abs(dragAxes - canvasDimention.width / 2) < SNAP_THRESH
    ) {
      drawGuideLineCanvasCenter(lineDirection, coordAxes, canvasDimention)
    }

    if (
      lineDirection === HORIZONTAL_LINE &&
      Math.abs(dragAxes - canvasDimention.height / 2) < SNAP_THRESH
    ) {
      drawGuideLineCanvasCenter(lineDirection, coordAxes, canvasDimention)
    }

    if (dragAxes < SNAP_THRESH) {
      drawGuideLineCanvasStart(lineDirection, coordAxes, canvasDimention)
    }

    if (canvasDimention.width - dragAxes < SNAP_THRESH) {
      drawGuideLineCanvasEnd(lineDirection, coordAxes, canvasDimention)
    }

    snapPointsArr.x.forEach((snapAxes) => {
      if (Math.abs(dragAxes - snapAxes) < SNAP_THRESH) {
        const snapYMax = Math.min(...snapPointsArr.y)
        const dragYMin = Math.max(...dragPointsArr.y)
        drawGuideLineLayers(
          lineDirection,
          snapAxes,
          canvasDimention,
          snapYMax,
          dragYMin
        )
      }
    })
  })
}
