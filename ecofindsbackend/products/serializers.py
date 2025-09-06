from rest_framework import serializers
from .models import Product, Category, ProductImage
from users.serializers import UserProfileSerializer

class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.ReadOnlyField()

    class Meta:
        model = ProductImage
        fields = ('id', 'image', 'image_url', 'is_main', 'order', 'alt_text')

class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.ReadOnlyField()

    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'description', 'icon', 'product_count')

class ProductListSerializer(serializers.ModelSerializer):
    image_url = serializers.ReadOnlyField()
    seller = UserProfileSerializer(read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = (
            'id', 'title', 'description', 'category', 'category_name', 'price',
            'quantity', 'condition', 'year_of_manufacture', 'brand', 'model',
            'length', 'width', 'height', 'weight', 'material', 'color',
            'original_packaging', 'manual_instructions', 'working_condition_description',
            'image_url', 'images', 'location', 'seller', 'is_sold', 'view_count', 
            'created_at', 'updated_at'
        )

class ProductDetailSerializer(serializers.ModelSerializer):
    image_url = serializers.ReadOnlyField()
    seller = UserProfileSerializer(read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = (
            'id', 'title', 'description', 'category', 'category_name', 'price',
            'quantity', 'condition', 'year_of_manufacture', 'brand', 'model',
            'length', 'width', 'height', 'weight', 'material', 'color',
            'original_packaging', 'manual_instructions', 'working_condition_description',
            'image', 'image_url', 'images', 'location', 'seller', 'is_sold', 'view_count',
            'created_at', 'updated_at'
        )

class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )
    main_image_index = serializers.IntegerField(write_only=True, required=False, default=0)

    class Meta:
        model = Product
        fields = (
            'title', 'description', 'category', 'price', 'quantity', 'condition',
            'year_of_manufacture', 'brand', 'model', 'length', 'width', 'height',
            'weight', 'material', 'color', 'original_packaging', 'manual_instructions',
            'working_condition_description', 'image', 'location', 'is_sold',
            'images', 'main_image_index'
        )

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        main_image_index = validated_data.pop('main_image_index', 0)
        validated_data['seller'] = self.context['request'].user
        
        product = super().create(validated_data)
        
        # Create ProductImage instances
        for index, image in enumerate(images_data):
            is_main = (index == main_image_index)
            ProductImage.objects.create(
                product=product,
                image=image,
                is_main=is_main,
                order=index
            )
        
        return product

    def update(self, instance, validated_data):
        images_data = validated_data.pop('images', None)
        main_image_index = validated_data.pop('main_image_index', None)
        
        # Update the product instance
        instance = super().update(instance, validated_data)
        
        # Handle images update if provided
        if images_data is not None:
            # Delete existing images
            instance.images.all().delete()
            
            # Create new images
            for index, image in enumerate(images_data):
                is_main = (index == main_image_index) if main_image_index is not None else (index == 0)
                ProductImage.objects.create(
                    product=instance,
                    image=image,
                    is_main=is_main,
                    order=index
                )
        
        return instance

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
