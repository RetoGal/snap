import React from "react"

export const NewLayers = ({ id, layerRef, className }) => {
  const x = Math.floor(Math.random() * 256)
  const y = Math.floor(Math.random() * 256)
  const z = Math.floor(Math.random() * 256)
  const RGBColor = "rgb(" + x + "," + y + "," + z + ")"


  return (
    <div
      ref={layerRef}
      id={id}
      className={className}
      style={{
      backgroundColor: RGBColor,
       imgWidth: "100%",
        width: "150px",
        height: "150px",
        position: "absolute",
        left: (Math.random() * window.screen.width) + "px",
        top: (Math.random() * window.screen.height) + "px",
      
      }}
    ></div>
  )
}
