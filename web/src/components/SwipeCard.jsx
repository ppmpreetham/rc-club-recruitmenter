import { useState, useEffect, useRef } from 'react'

const SwipeCard = ({ children, onSwipe, disabled }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef(null)
  
  const SWIPE_THRESHOLD = 150
  const MIN_DRAG_DISTANCE = 20

  const getRotation = (translateX) => {
    const maxRotation = 15
    const rotation = (translateX / window.innerWidth) * maxRotation
    return Math.max(-maxRotation, Math.min(maxRotation, rotation))
  }

  const getOpacity = (translateX) => {
    const maxDistance = window.innerWidth * 0.3
    return Math.max(0.3, 1 - Math.abs(translateX) / maxDistance)
  }

  const handleMouseDown = (e) => {
    if (disabled) return
    setIsDragging(true)
    setStartPosition({ x: e.clientX, y: e.clientY })
    e.preventDefault()
  }

  const handleTouchStart = (e) => {
    if (disabled) return
    setIsDragging(true)
    setStartPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY })
    e.preventDefault()
  }

  const handleMouseMove = (e) => {
    if (!isDragging || disabled) return
    
    const deltaX = e.clientX - startPosition.x
    const deltaY = e.clientY - startPosition.y
    
    if (Math.abs(deltaX) > MIN_DRAG_DISTANCE && Math.abs(deltaX) > Math.abs(deltaY)) {
      setDragPosition({ x: deltaX, y: deltaY * 0.1 })
    }
  }

  const handleTouchMove = (e) => {
    if (!isDragging || disabled) return
    
    const deltaX = e.touches[0].clientX - startPosition.x
    const deltaY = e.touches[0].clientY - startPosition.y
    
    if (Math.abs(deltaX) > MIN_DRAG_DISTANCE && Math.abs(deltaX) > Math.abs(deltaY)) {
      setDragPosition({ x: deltaX, y: deltaY * 0.1 })
    }
  }

  const handleEnd = () => {
    if (!isDragging || disabled) return
    
    setIsDragging(false)
    
    if (Math.abs(dragPosition.x) > SWIPE_THRESHOLD) {
      const direction = dragPosition.x > 0 ? 'right' : 'left'
      setDragPosition({ 
        x: direction === 'right' ? window.innerWidth * 1.5 : -window.innerWidth * 1.5, 
        y: dragPosition.y 
      })
      
      setTimeout(() => {
        onSwipe(direction)
        setDragPosition({ x: 0, y: 0 })
      }, 300)
    } else {
      setDragPosition({ x: 0, y: 0 })
    }
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleEnd)
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleEnd)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleEnd)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleEnd)
      }
    }
  }, [isDragging, dragPosition, startPosition])

  const cardStyle = {
    transform: `translateX(${dragPosition.x}px) translateY(${dragPosition.y}px) rotate(${getRotation(dragPosition.x)}deg)`,
    opacity: getOpacity(dragPosition.x),
    transition: isDragging ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out',
    cursor: disabled ? 'default' : (isDragging ? 'grabbing' : 'grab'),
    userSelect: 'none',
  }

  const overlayStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '4rem',
    fontWeight: 'bold',
    opacity: Math.abs(dragPosition.x) > 50 ? Math.min(1, Math.abs(dragPosition.x) / SWIPE_THRESHOLD) : 0,
    transition: 'opacity 0.1s ease-out',
    pointerEvents: 'none',
    zIndex: 10,
  }

  return (
    <div className="relative w-full h-full">
      <div
        ref={cardRef}
        className="absolute w-full h-full rounded-3xl shadow-2xl overflow-hidden bg-gray-900 transform-gpu"
        style={cardStyle}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {children}
        
        {dragPosition.x > 50 && (
          <div style={{ ...overlayStyle, color: '#10B981' }}>
            ✓
          </div>
        )}
        {dragPosition.x < -50 && (
          <div style={{ ...overlayStyle, color: '#EF4444' }}>
            ✗
          </div>
        )}
      </div>
    </div>
  )
}

export default SwipeCard