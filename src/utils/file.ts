import type { ImageData } from '../types'

export function readImageFile(file: File): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = () => {
      const base64 = String(fileReader.result)
      const img = new Image()
      img.onload = () => {
        resolve({
          base64,
          width: img.width,
          height: img.height
        })
      }
      img.onerror = reject
      img.src = base64
    }
    fileReader.onerror = reject
    fileReader.readAsDataURL(file)
  })
}
