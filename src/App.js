import { useState, useEffect } from "react"
import {
  getSnapPointsCoords,
  getDraggingPointsCoords,
  drawGuidLinesHorizontal,
  getSnappedCoords,
  VERTICAL_LINE,
  HORIZONTAL_LINE,
  MAX_MOUSE_SPEED,
  removeGuideLine,
  drawGuidLinesVertical
} from "./functions"
import * as Styled from "./styled"
import "./App.css"
import { NewLayers } from "./layers"

function App() {
  const [layers, setLayers] = useState([])
  const createNewLayers = () => setLayers([...layers, layers.length + 1])

  function mouseDown(e) {
    window.addEventListener("mousemove", mouseMove, false)
    window.addEventListener("mouseup", mouseUp, false)

    const element = e.target

    let clickX = e.clientX
    let clickY = e.clientY

    let iinitialX = e.clientX
    let iinitialY = e.clientY
    const list = element.classList
    list.add("draggingLayer")

    const { top: initialTop, left: initialLeft } = element.style

    function mouseMove(e) {
      const deltaX = clickX - e.clientX
      const deltaY = clickY - e.clientY

      const mouseSpeedX = iinitialX - e.clientX
      const mouseSpeedY = iinitialY - e.clientY

      const rect = element.getBoundingClientRect()
      const snapPoints = getSnapPointsCoords()
      const dragPoints = getDraggingPointsCoords(rect)

      const draggineElementCoords = {
        x: Math.round(rect.left),
        y: Math.round(rect.top),
      }

      const { x, y } = draggineElementCoords

      iinitialX = e.clientX
      iinitialY = e.clientY

      const canvasDimention = {
        width: parseInt(window.screen.width),
        height: parseInt(window.screen.height),
      }
   
      drawGuidLinesHorizontal(
        dragPoints,
        snapPoints,
        canvasDimention,
        HORIZONTAL_LINE,
        y
      )

      drawGuidLinesVertical(
        dragPoints,
        snapPoints,
        canvasDimention,
        VERTICAL_LINE,
        x
      )

      let top = null
      let left = null

      if (Math.abs(mouseSpeedX) < MAX_MOUSE_SPEED) {
        left = getSnappedCoords(
          dragPoints.x,
          snapPoints.x,
          canvasDimention,
          rect.left,
          VERTICAL_LINE
        )
      }

      if (Math.abs(mouseSpeedY) < MAX_MOUSE_SPEED) {
        top = getSnappedCoords(
          dragPoints.y,
          snapPoints.y,
          canvasDimention,
          rect.top,
          HORIZONTAL_LINE
        )
      }

      element.style.left = `${left ? left : parseInt(initialLeft) - deltaX}px`
      element.style.top = `${top ? top : parseInt(initialTop) - deltaY}px`
    }

    function mouseUp() {
      removeGuideLine(HORIZONTAL_LINE)
      removeGuideLine(VERTICAL_LINE)

      const allLayers = document.querySelectorAll(".layer")
      allLayers.forEach((layer) => {
        layer.classList.remove("draggingLayer")
      })

      window.removeEventListener("mousemove", mouseMove)
      window.removeEventListener("mouseup", mouseUp)
    }
  }

  useEffect(() => {
    layers.map((id) => {
      const element = document.getElementById(`l-${id}`)
      element.addEventListener("mousedown", mouseDown)
    })
  })

  return (
    <>
      <Styled.Button onClick={createNewLayers}> addNewLayer </Styled.Button>

      {layers.map((layer) => {
        return <NewLayers id={`l-${layer}`} key={layer} className={"layer"} />
      })}
    </>
  )
}

export default App
