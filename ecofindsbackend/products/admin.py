from django.contrib import admin
from .models import Category, Product

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'product_count', 'created_at')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'description')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'price', 'condition', 'seller', 'is_sold', 'view_count', 'created_at')
    list_filter = ('category', 'condition', 'is_sold', 'created_at')
    search_fields = ('title', 'description', 'seller__username', 'seller__email')
    readonly_fields = ('view_count', 'created_at', 'updated_at')
    list_editable = ('is_sold',)
