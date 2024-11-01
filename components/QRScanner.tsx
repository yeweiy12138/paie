import { useRef, useState, useCallback } from 'react'
import jsQR from 'jsqr'

export default function QRScanner({ onScan }: { onScan: (result: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScanning, setIsScanning] = useState(false)

  const startScanning = useCallback(() => {
    if (isScanning) return
    setIsScanning(true)
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
          requestAnimationFrame(scan)
        }
      })
  }, [isScanning])

  const scan = useCallback(() => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      if (canvasRef.current) {
        canvasRef.current.height = videoRef.current.videoHeight
        canvasRef.current.width = videoRef.current.videoWidth

        const context = canvasRef.current.getContext('2d')
        if (context) {
          context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
          const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          })

          if (code) {
            onScan(code.data)
            setIsScanning(false)
            if (videoRef.current.srcObject instanceof MediaStream) {
              videoRef.current.srcObject.getTracks().forEach(track => track.stop())
            }
            return
          }
        }
      }
    }
    if (isScanning) {
      requestAnimationFrame(scan)
    }
  }, [onScan, isScanning])

  return (
    <div className="relative">
      <button 
        onClick={startScanning}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        {isScanning ? '扫描中...' : '开始扫描'}
      </button>
      <video ref={videoRef} className="w-full max-w-sm mx-auto" hidden={!isScanning} />
      <canvas ref={canvasRef} className="w-full max-w-sm mx-auto" hidden />
    </div>
  )
}