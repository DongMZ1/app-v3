import React from 'react'
import './Canvas.scss'
import { DesignCanvas } from '@fulhaus/react.ui.design-canvas'
type CanvasState = {
    tabState: string;
}
const Canvas = ({ tabState }: CanvasState) => {
    return <div className={`${tabState !== "Canvas" && 'canvas-display-none-important'} bg-red h-full canvas`}>
        <DesignCanvas canvasWidth={90} designItems={[
            {
                type: "image",
                name: "Pedro Mid-century Dining Table Pedro Mid-century Dining Table",
                value: "https://dl.airtable.com/.attachments/dc4a9a9663b09fbc526cb3e5de67c0be/31ff5715/Imagefromsafavieh.comon2022-03-07at4.26.25PM.jpeg",
            },
            {
                type: "image",
                name: "Lucius Outdoor Stool",
                value: "https://files.plytix.com/api/v1.1/file/public_files/pim/assets/a1/ae/d4/5c/5cd4aea1a3dec0046811d88f/images/55/24/f8/5c/5cf82455e5e4ad046c385538/BQ-1006-25.jpg",
            },
            {
                type: "image",
                name: "Vintage Bench Large Grey",
                value: "https://files.plytix.com/api/v1.1/file/public_files/pim/assets/a1/ae/d4/5c/5cd4aea1a3dec0046811d88f/images/ac/26/f8/5c/5cf826acde06fd046b578d68/BT-1001-37.jpg",
            },
        ]} />
    </div>
}

export default Canvas