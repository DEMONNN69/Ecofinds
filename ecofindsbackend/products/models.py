from django.db import models
from django.conf import settings

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

    @property
    def product_count(self):
        return self.products.count()

class Product(models.Model):
    CONDITION_CHOICES = [
        ('new', 'New'),
        ('like_new', 'Like New'),
        ('good', 'Good'),
        ('fair', 'Fair'),
        ('poor', 'Poor'),
    ]

    # Basic Information
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, default='good')
    
    # Product Details
    year_of_manufacture = models.PositiveIntegerField(blank=True, null=True, help_text="Year of manufacture if applicable")
    brand = models.CharField(max_length=100, blank=True)
    model = models.CharField(max_length=100, blank=True)
    
    # Physical Properties
    length = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True, help_text="Length in cm")
    width = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True, help_text="Width in cm")
    height = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True, help_text="Height in cm")
    weight = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True, help_text="Weight in kg")
    material = models.CharField(max_length=100, blank=True)
    color = models.CharField(max_length=50, blank=True)
    
    # Package and Documentation
    original_packaging = models.BooleanField(default=False, help_text="Original packaging included")
    manual_instructions = models.BooleanField(default=False, help_text="Manual/Instructions included")
    working_condition_description = models.TextField(blank=True, help_text="Detailed working condition description")
    
    # Media and Location (keep main image for backward compatibility)
    image = models.ImageField(upload_to='product_images/', blank=True, null=True)
    location = models.CharField(max_length=200, blank=True)
    
    # Seller and Status
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='products')
    is_sold = models.BooleanField(default=False)
    view_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    @property
    def image_url(self):
        # First try to get main image from ProductImage model
        main_image = self.images.filter(is_main=True).first()
        if main_image and main_image.image:
            return main_image.image.url
        # Fallback to the original image field
        if self.image:
            return self.image.url
        return None

    @property
    def all_images(self):
        """Get all product images ordered by main image first"""
        return self.images.all().order_by('-is_main', 'order')

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='product_images/')
    is_main = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    alt_text = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.product.title} - Image {self.order}"

    @property
    def image_url(self):
        if self.image:
            return self.image.url
        return None

    def save(self, *args, **kwargs):
        # Ensure only one main image per product
        if self.is_main:
            ProductImage.objects.filter(product=self.product, is_main=True).update(is_main=False)
        super().save(*args, **kwargs)
