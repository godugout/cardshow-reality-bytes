
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Initialize with undefined to prevent hydration mismatches
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  const [isInitialized, setIsInitialized] = React.useState(false)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const onChange = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT
      setIsMobile(mobile)
      if (!isInitialized) {
        setIsInitialized(true)
      }
    }
    
    // Set initial value
    onChange()
    
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [isInitialized])

  // Return false during SSR/initial render to prevent hydration issues
  return isInitialized ? !!isMobile : false
}
