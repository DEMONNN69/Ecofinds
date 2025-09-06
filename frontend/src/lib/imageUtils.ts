// Helper function to get full image URL
export const getFullImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return "/placeholder.svg?height=600&width=600"
  
  // If it's already a full URL (starts with http), return as is
  if (imagePath.startsWith('http')) return imagePath
  
  // If it's a relative path, prepend the Django server URL
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || "http://localhost:8000"
  return `${baseUrl}${imagePath}`
}

// Helper function for product images with custom placeholder size
export const getProductImageUrl = (imagePath: string | null | undefined, size = "600x600"): string => {
  if (!imagePath) return `/placeholder.svg?height=${size.split('x')[1]}&width=${size.split('x')[0]}`
  
  // If it's already a full URL (starts with http), return as is
  if (imagePath.startsWith('http')) return imagePath
  
  // If it's a relative path, prepend the Django server URL
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || "http://localhost:8000"
  return `${baseUrl}${imagePath}`
}
