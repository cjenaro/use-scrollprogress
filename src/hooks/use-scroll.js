import React from "react"

function calculateProgress(htmlElement) {
  if (!htmlElement) return 0

  return (
    (htmlElement.scrollTop /
      (htmlElement.scrollHeight - htmlElement.clientHeight)) *
    100
  ).toFixed(2)
}
const FORWARDS = 1
const BACKWARDS = -1
const ScrollContext = React.createContext(0)
export function ScrollProvider({ children, scrollRef, debounceFunction }) {
  const [progress, setProgress] = React.useState(
    calculateProgress(scrollRef ? scrollRef.current : null)
  )
  const [direction, setDirection] = React.useState(FORWARDS)

  React.useLayoutEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return

    const debounce =
      debounceFunction ||
      function (fn) {
        return fn
      }
    const listenOn = scrollRef && scrollRef.current ? scrollRef.current : window
    const element =
      scrollRef && scrollRef.current
        ? scrollRef.current
        : document.scrollingElement

    const handleScroll = debounce(() => {
      const newProgress = calculateProgress(element)
      setProgress(oldProgress => {
        setDirection(oldDir => {
          if (newProgress === oldProgress) return oldDir

          return newProgress > oldProgress ? FORWARDS : BACKWARDS
        })
        return newProgress
      })
    })

    handleScroll()
    listenOn.addEventListener("scroll", handleScroll)

    return function callback() {
      listenOn.removeEventListener("scroll", handleScroll)
    }
  }, [scrollRef, debounceFunction])

  return (
    <ScrollContext.Provider value={[progress, direction]}>
      {children}
    </ScrollContext.Provider>
  )
}

export function useScroll() {
  const context = React.useContext(ScrollContext)

  if (!context)
    throw new Error("useScroll needs to be used within ScrollProvider")

  return context
}
