

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { apiClient, Category } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Upload, ArrowLeft } from "lucide-react"

export default function AddProductPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id

  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    quantity: "1",
    condition: "good",
    year_of_manufacture: "",
    brand: "",
    model: "",
    length: "",
    width: "",
    height: "",
    weight: "",
    material: "",
    color: "",
    original_packaging: false,
    manual_instructions: false,
    working_condition_description: "",
    location: "",
  })
  const [images, setImages] = useState<File[]>([])
  const [mainImageIndex, setMainImageIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
    if (isEditing && id) {
      fetchProduct()
    }
  }, [isEditing, id])

  const fetchCategories = async () => {
    try {
      const categoriesData = await apiClient.getCategories()
      setCategories(categoriesData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      })
    } finally {
      setCategoriesLoading(false)
    }
  }

  const fetchProduct = async () => {
    if (!id) return
    
    try {
      const productData = await apiClient.getProduct(Number(id))
      
      // Pre-fill form with existing product data
      setFormData({
        title: productData.title || "",
        description: productData.description || "",
        category: productData.category?.toString() || "",
        price: productData.price || "",
        quantity: productData.quantity?.toString() || "1",
        condition: productData.condition || "good",
        year_of_manufacture: productData.year_of_manufacture?.toString() || "",
        brand: productData.brand || "",
        model: productData.model || "",
        length: productData.length?.toString() || "",
        width: productData.width?.toString() || "",
        height: productData.height?.toString() || "",
        weight: productData.weight?.toString() || "",
        material: productData.material || "",
        color: productData.color || "",
        original_packaging: productData.original_packaging || false,
        manual_instructions: productData.manual_instructions || false,
        working_condition_description: productData.working_condition_description || "",
        location: productData.location || "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load product for editing",
        variant: "destructive",
      })
      navigate("/my-products")
    }
  }

  if (!user) {
    navigate("/login")
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files)
      setImages(prevImages => [...prevImages, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setImages(prevImages => {
      const newImages = prevImages.filter((_, i) => i !== index)
      // Adjust main image index if necessary
      if (mainImageIndex >= newImages.length && newImages.length > 0) {
        setMainImageIndex(newImages.length - 1)
      } else if (mainImageIndex === index && newImages.length > 0) {
        setMainImageIndex(0)
      }
      return newImages
    })
  }

  const setAsMainImage = (index: number) => {
    setMainImageIndex(index)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Only validate required fields for new products
    // For editing, allow partial updates
    if (!isEditing) {
      if (!formData.title || !formData.description || !formData.price || !formData.category) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields including category",
          variant: "destructive",
        })
        return
      }
    } else {
      // For editing, only check if at least one field has a value
      const hasAnyValue = Object.values(formData).some(value => {
        if (typeof value === 'boolean') return true // Boolean fields are always valid
        return value && value.toString().trim() !== ''
      })
      
      if (!hasAnyValue) {
        toast({
          title: "No Changes",
          description: "Please modify at least one field",
          variant: "destructive",
        })
        return
      }
    }

    setLoading(true)

    try {
      const productFormData = new FormData()
      
      // For editing, only append fields that have values
      // For new products, append all required fields
      if (formData.title) productFormData.append("title", formData.title)
      if (formData.description) productFormData.append("description", formData.description)
      if (formData.category) productFormData.append("category", formData.category)
      if (formData.price) productFormData.append("price", formData.price)
      if (formData.quantity) productFormData.append("quantity", formData.quantity)
      if (formData.condition) productFormData.append("condition", formData.condition)
      if (formData.location) productFormData.append("location", formData.location)
      
      // Optional fields - only append if they have values
      if (formData.year_of_manufacture) productFormData.append("year_of_manufacture", formData.year_of_manufacture)
      if (formData.brand) productFormData.append("brand", formData.brand)
      if (formData.model) productFormData.append("model", formData.model)
      if (formData.length) productFormData.append("length", formData.length)
      if (formData.width) productFormData.append("width", formData.width)
      if (formData.height) productFormData.append("height", formData.height)
      if (formData.weight) productFormData.append("weight", formData.weight)
      if (formData.material) productFormData.append("material", formData.material)
      if (formData.color) productFormData.append("color", formData.color)
      if (formData.working_condition_description) productFormData.append("working_condition_description", formData.working_condition_description)
      
      // Boolean fields
      productFormData.append("original_packaging", formData.original_packaging.toString())
      productFormData.append("manual_instructions", formData.manual_instructions.toString())

      // Multiple images
      if (images.length > 0) {
        images.forEach((image) => {
          productFormData.append("images", image)
        })
        productFormData.append("main_image_index", mainImageIndex.toString())
      }

      if (isEditing && id) {
        await apiClient.updateProduct(Number(id), productFormData)
        toast({
          title: "Success", 
          description: "Product updated successfully!",
        })
      } else {
        await apiClient.createProduct(productFormData)
        toast({
          title: "Success",
          description: "Product added successfully!",
        })
      }

      navigate("/my-products")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to add product",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">
            {isEditing ? "Edit Product" : "Add New Product"}
          </CardTitle>
          {isEditing && (
            <p className="text-sm text-muted-foreground">
              You only need to fill in the fields you want to change. Leave other fields as they are.
            </p>
          )}
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">
                Product Title {!isEditing && "*"}
              </Label>
              <Input
                id="title"
                name="title"
                required={!isEditing}
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter product title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description {!isEditing && "*"}
              </Label>
              <Textarea
                id="description"
                name="description"
                required={!isEditing}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your product"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">
                  Category {!isEditing && "*"}
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesLoading ? (
                      <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                    ) : categories.length > 0 ? (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-categories" disabled>No categories available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">
                  Price ($) {!isEditing && "*"}
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  required={!isEditing}
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) => setFormData({ ...formData, condition: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="like_new">Like New</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="1"
                />
              </div>
            </div>

            {/* Product Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Product Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="e.g., Apple, Samsung"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="e.g., iPhone 13, Galaxy S21"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year_of_manufacture">Year of Manufacture</Label>
                  <Input
                    id="year_of_manufacture"
                    name="year_of_manufacture"
                    type="number"
                    min="1900"
                    max="2025"
                    value={formData.year_of_manufacture}
                    onChange={handleChange}
                    placeholder="2023"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="material">Material</Label>
                  <Input
                    id="material"
                    name="material"
                    value={formData.material}
                    onChange={handleChange}
                    placeholder="e.g., Plastic, Metal, Wood"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="e.g., Black, White, Blue"
                  />
                </div>
              </div>
            </div>

            {/* Dimensions Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Dimensions & Weight</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="length">Length (cm)</Label>
                  <Input
                    id="length"
                    name="length"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.length}
                    onChange={handleChange}
                    placeholder="0.0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="width">Width (cm)</Label>
                  <Input
                    id="width"
                    name="width"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.width}
                    onChange={handleChange}
                    placeholder="0.0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    name="height"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="0.0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Package & Documentation Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Package & Documentation</h3>
              
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="original_packaging"
                    checked={formData.original_packaging}
                    onCheckedChange={(checked) => handleCheckboxChange('original_packaging', checked as boolean)}
                  />
                  <Label htmlFor="original_packaging">Original Packaging Included</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manual_instructions"
                    checked={formData.manual_instructions}
                    onCheckedChange={(checked) => handleCheckboxChange('manual_instructions', checked as boolean)}
                  />
                  <Label htmlFor="manual_instructions">Manual/Instructions Included</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="working_condition_description">Working Condition Description</Label>
                <Textarea
                  id="working_condition_description"
                  name="working_condition_description"
                  value={formData.working_condition_description}
                  onChange={handleChange}
                  placeholder="Describe the working condition, any defects, or special notes..."
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, State"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="images">Product Images</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground mb-2">
                    Click to upload images (you can select multiple)
                  </div>
                  <Input 
                    id="images" 
                    type="file" 
                    accept="image/*" 
                    multiple
                    onChange={handleImageChange} 
                    className="hidden" 
                  />
                  <Button type="button" variant="outline" onClick={() => document.getElementById("images")?.click()}>
                    Choose Images
                  </Button>
                </div>
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Selected Images ({images.length})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        
                        {/* Main image indicator */}
                        {mainImageIndex === index && (
                          <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                            Main
                          </div>
                        )}
                        
                        {/* Actions */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                          {mainImageIndex !== index && (
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              onClick={() => setAsMainImage(index)}
                              className="text-xs px-2 py-1"
                            >
                              Set Main
                            </Button>
                          )}
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => removeImage(index)}
                            className="text-xs px-2 py-1"
                          >
                            Remove
                          </Button>
                        </div>
                        
                        <div className="absolute bottom-1 right-1 bg-black/75 text-white text-xs px-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Click "Set Main" to choose which image appears first in listings. 
                    Current main image: {mainImageIndex + 1}
                  </p>
                </div>
              )}
            </div>

            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading 
                ? (isEditing ? "Updating Product..." : "Adding Product...") 
                : (isEditing ? "Update Product" : "Add Product")
              }
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}
