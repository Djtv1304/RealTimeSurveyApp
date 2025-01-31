import { useEffect, useCallback } from "react"

export default function useSSE(url: string) {
  useEffect(() => {
    const eventSource = new EventSource(url)

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      // Handle incoming SSE data here
      console.log("Received SSE data:", data)
    }

    eventSource.onerror = (error) => {
      console.error("SSE error:", error)
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [url])

  const sendEvent = useCallback(
    (data: any) => {
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
    },
    [url],
  )

  return { sendEvent }
}