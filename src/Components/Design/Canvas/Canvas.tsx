import React from 'react'
import './Canvas.scss'
type CanvasState = {
    tabState: string;
}
const Canvas = ({tabState} : CanvasState) => {
    return <div className={`${tabState !== "Canvas" && 'canvas-display-none-important'} flex bg-red h-full canvas`}>

    </div>
}

export default Canvas