import React from "react"
import { ScrollProvider, useScroll } from "../hooks/use-scroll"
import "./global.css"

export default function Home() {
  return (
    <ScrollProvider>
      <ScrollContainer />
    </ScrollProvider>
  )
}

const ScrollContainer = () => {
  const scrollRef = React.useRef(null)
  const [progress, direction] = useScroll()
  return (
    <div>
      <div className="stats">
        <p>Progress: {progress}</p>
        <p>Direction: {direction}</p>
      </div>
      <ScrollProvider scrollRef={scrollRef}>
        <div className="inner-container" ref={scrollRef}>
          <PinkScroll />
        </div>
      </ScrollProvider>
      <div style={{ minHeight: "100vh" }} />
      <div
        className="celebration"
        style={{
          backgroundSize: `${progress}% 100%`,
        }}
      />
    </div>
  )
}

const PinkScroll = () => {
  const [progress] = useScroll()

  return (
    <div
      className="inner"
      style={{
        backgroundColor: `hsl(${progress * 10}, 50%, 50%)`,
      }}
    >
      <p
        style={{
          position: "sticky",
          top: "50%",
          margin: "0 auto",
          textAlign: "center",
          fontSize: Math.min(Math.max(progress / 2, 16), 50),
        }}
      >
        {progress}
      </p>
    </div>
  )
}
