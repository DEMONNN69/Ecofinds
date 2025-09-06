

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
import { Upload, ArrowLeft, Leaf, ImagePlus, CheckCircle, Info, Package, Ruler, FileText, MapPin, Star, Sparkles } from "lucide-react"

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
    <div className="min-h-screen bg-gradient-to-br from-[#F8FDF8] via-[#FFF8DC] to-[#B7E4C7]/20 relative overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <Leaf className="absolute top-20 left-[10%] w-8 h-8 text-[#52B788]/20 animate-pulse" />
        <Sparkles className="absolute top-32 right-[15%] w-6 h-6 text-[#2D5016]/30 animate-bounce" />
        <Leaf className="absolute bottom-40 left-[20%] w-10 h-10 text-[#52B788]/15 animate-pulse" style={{ animationDelay: '1s' }} />
        <Star className="absolute bottom-60 right-[25%] w-5 h-5 text-[#2D5016]/25 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6 group hover:bg-white/60 backdrop-blur-sm border border-white/20 transition-all duration-300"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
          Back
        </Button>

        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#52B788] to-[#2D5016] rounded-full mb-4 shadow-lg">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[#1B4332] mb-2">
            {isEditing ? "Edit Your Product" : "List Your Product"}
          </h1>
          <p className="text-[#2D5016]/70 text-lg max-w-2xl mx-auto">
            {isEditing 
              ? "Update your product details to keep your listing fresh and accurate"
              : "Share your items with our sustainable community and give them a new life"
            }
          </p>
        </div>

        <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-xl ring-1 ring-white/20">
          <CardHeader className="bg-gradient-to-r from-[#52B788]/10 to-[#B7E4C7]/10 border-b border-[#52B788]/20">
            <CardTitle className="text-2xl text-[#1B4332] flex items-center gap-3">
              <Leaf className="w-6 h-6 text-[#52B788]" />
              Product Information
            </CardTitle>
            {isEditing && (
              <p className="text-sm text-[#2D5016]/60 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                You only need to fill in the fields you want to change. Leave other fields as they are.
              </p>
            )}
          </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-8 p-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-[#52B788] to-[#2D5016] rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#1B4332]">Basic Information</h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title" className="text-[#1B4332] font-medium flex items-center gap-2">
                  Product Title {!isEditing && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id="title"
                  name="title"
                  required={!isEditing}
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Give your product an appealing title..."
                  className="border-[#52B788]/30 focus:border-[#52B788] focus:ring-[#52B788]/20 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-white/90"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-[#1B4332] font-medium flex items-center gap-2">
                  Description {!isEditing && <span className="text-red-500">*</span>}
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  required={!isEditing}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell buyers what makes your product special..."
                  rows={4}
                  className="border-[#52B788]/30 focus:border-[#52B788] focus:ring-[#52B788]/20 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-white/90 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-[#1B4332] font-medium flex items-center gap-2">
                    Category {!isEditing && <span className="text-red-500">*</span>}
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="border-[#52B788]/30 focus:border-[#52B788] focus:ring-[#52B788]/20 bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all duration-300">
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-sm border-[#52B788]/30">
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
                  <Label htmlFor="price" className="text-[#1B4332] font-medium flex items-center gap-2">
                    Price ($) {!isEditing && <span className="text-red-500">*</span>}
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
                    className="border-[#52B788]/30 focus:border-[#52B788] focus:ring-[#52B788]/20 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-white/90"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="condition" className="text-[#1B4332] font-medium">Condition</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => setFormData({ ...formData, condition: value })}
                  >
                    <SelectTrigger className="border-[#52B788]/30 focus:border-[#52B788] focus:ring-[#52B788]/20 bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all duration-300">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-sm border-[#52B788]/30">
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="like_new">Like New</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-[#1B4332] font-medium">Quantity</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="1"
                    className="border-[#52B788]/30 focus:border-[#52B788] focus:ring-[#52B788]/20 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-white/90"
                  />
                </div>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-[#52B788] to-[#2D5016] rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#1B4332]">Product Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand" className="text-[#1B4332] font-medium">Brand</Label>
                  <Input
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="e.g., Apple, Samsung"
                    className="border-[#52B788]/30 focus:border-[#52B788] focus:ring-[#52B788]/20 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-white/90"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model" className="text-[#1B4332] font-medium">Model</Label>
                  <Input
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="e.g., iPhone 13, Galaxy S21"
                    className="border-[#52B788]/30 focus:border-[#52B788] focus:ring-[#52B788]/20 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-white/90"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year_of_manufacture" className="text-[#1B4332] font-medium">Year of Manufacture</Label>
                  <Input
                    id="year_of_manufacture"
                    name="year_of_manufacture"
                    type="number"
                    min="1900"
                    max="2025"
                    value={formData.year_of_manufacture}
                    onChange={handleChange}
                    placeholder="2023"
                    className="border-[#52B788]/30 focus:border-[#52B788] focus:ring-[#52B788]/20 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-white/90"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="material" className="text-[#1B4332] font-medium">Material</Label>
                  <Input
                    id="material"
                    name="material"
                    value={formData.material}
                    onChange={handleChange}
                    placeholder="e.g., Plastic, Metal, Wood"
                    className="border-[#52B788]/30 focus:border-[#52B788] focus:ring-[#52B788]/20 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-white/90"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color" className="text-[#1B4332] font-medium">Color</Label>
                  <Input
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="e.g., Black, White, Blue"
                    className="border-[#52B788]/30 focus:border-[#52B788] focus:ring-[#52B788]/20 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-white/90"
                  />
                </div>
              </div>
            </div>

            {/* Dimensions Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-[#52B788] to-[#2D5016] rounded-lg flex items-center justify-center">
                  <Ruler className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#1B4332]">Dimensions & Weight</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="length" className="text-[#1B4332] font-medium">Length (cm)</Label>
                  <Input
                    id="length"
                    name="length"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.length}
                    onChange={handleChange}
                    placeholder="0.0"
                    className="border-[#52B788]/30 focus:border-[#52B788] focus:ring-[#52B788]/20 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-white/90"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="width" className="text-[#1B4332] font-medium">Width (cm)</Label>
                  <Input
                    id="width"
                    name="width"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.width}
                    onChange={handleChange}
                    placeholder="0.0"
                    className="border-[#52B788]/30 focus:border-[#52B788] focus:ring-[#52B788]/20 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-white/90"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height" className="text-[#1B4332] font-medium">Height (cm)</Label>
                  <Input
                    id="height"
                    name="height"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="0.0"
                    className="border-[#52B788]/30 focus:border-[#52B788] focus:ring-[#52B788]/20 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-white/90"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-[#1B4332] font-medium">Weight (kg)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="border-[#52B788]/30 focus:border-[#52B788] focus:ring-[#52B788]/20 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-white/90"
                  />
                </div>
              </div>
            </div>

            {/* Package & Documentation Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-[#52B788] to-[#2D5016] rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#1B4332]">Package & Documentation</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3 p-4 bg-[#52B788]/5 rounded-lg border border-[#52B788]/20 hover:bg-[#52B788]/10 transition-colors duration-300">
                  <Checkbox
                    id="original_packaging"
                    checked={formData.original_packaging}
                    onCheckedChange={(checked) => handleCheckboxChange('original_packaging', checked as boolean)}
                    className="border-[#52B788]/50 data-[state=checked]:bg-[#52B788] data-[state=checked]:border-[#52B788]"
                  />
                  <Label htmlFor="original_packaging" className="text-[#1B4332] font-medium cursor-pointer">
                    Original Packaging Included
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-[#52B788]/5 rounded-lg border border-[#52B788]/20 hover:bg-[#52B788]/10 transition-colors duration-300">
                  <Checkbox
                    id="manual_instructions"
                    checked={formData.manual_instructions}
                    onCheckedChange={(checked) => handleCheckboxChange('manual_instructions', checked as boolean)}
                    className="border-[#52B788]/50 data-[state=checked]:bg-[#52B788] data-[state=checked]:border-[#52B788]"
                  />
                  <Label htmlFor="manual_instructions" className="text-[#1B4332] font-medium cursor-pointer">
                    Manual/Instructions Included
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="working_condition_description" className="text-[#1B4332] font-medium">
                  Working Condition Description
                </Label>
                <Textarea
                  id="working_condition_description"
                  name="working_condition_description"
                  value={formData.working_condition_description}
                  onChange={handleChange}
                  placeholder="Describe the working condition, any defects, or special notes..."
                  rows={3}
                  className="border-[#52B788]/30 focus:border-[#52B788] focus:ring-[#52B788]/20 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-white/90 resize-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-[#1B4332] font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#52B788]" />
                Location
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, State"
                className="border-[#52B788]/30 focus:border-[#52B788] focus:ring-[#52B788]/20 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-white/90"
              />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-[#52B788] to-[#2D5016] rounded-lg flex items-center justify-center">
                  <ImagePlus className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#1B4332]">Product Images</h3>
              </div>

              <div className="border-2 border-dashed border-[#52B788]/30 rounded-xl p-8 bg-gradient-to-br from-[#52B788]/5 to-[#B7E4C7]/10 hover:border-[#52B788]/50 transition-all duration-300 group">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#52B788] to-[#2D5016] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-lg font-medium text-[#1B4332] mb-2">
                    Upload Product Images
                  </div>
                  <div className="text-sm text-[#2D5016]/60 mb-4">
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
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => document.getElementById("images")?.click()}
                    className="bg-white/80 backdrop-blur-sm border-[#52B788]/30 text-[#1B4332] hover:bg-[#52B788]/10 hover:border-[#52B788] transition-all duration-300"
                  >
                    <ImagePlus className="mr-2 h-4 w-4" />
                    Choose Images
                  </Button>
                </div>
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-[#1B4332] flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-[#52B788]" />
                      Selected Images ({images.length})
                    </h4>
                    <div className="text-sm text-[#2D5016]/60 bg-[#52B788]/10 px-3 py-1 rounded-full">
                      Main image: {mainImageIndex + 1}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="relative overflow-hidden rounded-lg border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover"
                          />
                          
                          {/* Main image indicator */}
                          {mainImageIndex === index && (
                            <div className="absolute top-2 left-2 bg-gradient-to-r from-[#52B788] to-[#2D5016] text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                              <Star className="w-3 h-3" />
                              Main
                            </div>
                          )}
                          
                          {/* Actions overlay */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                            {mainImageIndex !== index && (
                              <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                onClick={() => setAsMainImage(index)}
                                className="text-xs px-3 py-1 bg-white/90 text-[#1B4332] hover:bg-white"
                              >
                                <Star className="w-3 h-3 mr-1" />
                                Set Main
                              </Button>
                            )}
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={() => removeImage(index)}
                              className="text-xs px-3 py-1"
                            >
                              Remove
                            </Button>
                          </div>
                          
                          <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded-full">
                            {index + 1}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-[#2D5016]/60 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                    💡 Click "Set Main" to choose which image appears first in listings. The main image helps buyers quickly understand your product.
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-gradient-to-r from-[#52B788] to-[#2D5016] hover:from-[#2D5016] hover:to-[#52B788] text-white font-medium py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
                size="lg"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isEditing ? "Updating Product..." : "Adding Product..."}
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    {isEditing ? "Update Product" : "List Your Product"}
                    <Sparkles className="w-5 h-5 group-hover:-rotate-12 transition-transform duration-300" />
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  </div>
  )
}
