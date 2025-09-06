from rest_framework import serializers
from .models import Product, Category
from users.serializers import UserProfileSerializer

class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.ReadOnlyField()

    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'description', 'icon', 'product_count')

class ProductListSerializer(serializers.ModelSerializer):
    image_url = serializers.ReadOnlyField()
    seller = UserProfileSerializer(read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = (
            'id', 'title', 'description', 'category', 'category_name', 'price',
            'quantity', 'condition', 'year_of_manufacture', 'brand', 'model',
            'length', 'width', 'height', 'weight', 'material', 'color',
            'original_packaging', 'manual_instructions', 'working_condition_description',
            'image_url', 'location', 'seller', 'is_sold', 'view_count', 
            'created_at', 'updated_at'
        )

class ProductDetailSerializer(serializers.ModelSerializer):
    image_url = serializers.ReadOnlyField()
    seller = UserProfileSerializer(read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = (
            'id', 'title', 'description', 'category', 'category_name', 'price',
            'quantity', 'condition', 'year_of_manufacture', 'brand', 'model',
            'length', 'width', 'height', 'weight', 'material', 'color',
            'original_packaging', 'manual_instructions', 'working_condition_description',
            'image', 'image_url', 'location', 'seller', 'is_sold', 'view_count',
            'created_at', 'updated_at'
        )

class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = (
            'title', 'description', 'category', 'price', 'quantity', 'condition',
            'year_of_manufacture', 'brand', 'model', 'length', 'width', 'height',
            'weight', 'material', 'color', 'original_packaging', 'manual_instructions',
            'working_condition_description', 'image', 'location', 'is_sold'
        )

    def create(self, validated_data):
        validated_data['seller'] = self.context['request'].user
        return super().create(validated_data)

class MyListingSerializer(serializers.ModelSerializer):
    image_url = serializers.ReadOnlyField()
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = (
            'id', 'title', 'description', 'category_name', 'price',
            'image_url', 'condition', 'location', 'is_sold',
            'view_count', 'created_at', 'updated_at'
        )
