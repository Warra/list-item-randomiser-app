import { useState, useEffect } from "react"

const ChangingText = ({ names, interval }) => {
  let count = 0
  const [displayedText, setText] = useState(names[count])

  useEffect(() => {
    const intervalId = setInterval(() => {
      count++
      if (count === names.length) {
        count = 0
      }
      setText(names[count])
    }, 100)

    return () => clearInterval(intervalId)
  }, [])
  return <h1>{displayedText}</h1>
}

export { ChangingText }
