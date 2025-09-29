import { useEffect } from 'react'

const useKeyboardHandler = () => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowRight') {
        document.querySelector('[data-accept]')?.click()
      } else if (event.key === 'ArrowLeft') {
        document.querySelector('[data-reject]')?.click()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])
}

export default useKeyboardHandler