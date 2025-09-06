from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from .models import Product, Category
from .serializers import (
    ProductListSerializer, ProductDetailSerializer, 
    ProductCreateUpdateSerializer, CategorySerializer, MyListingSerializer
)

class ProductPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

@api_view(['GET', 'POST'])
def product_list_create(request):
    if request.method == 'GET':
        products = Product.objects.select_related('seller', 'category').all()
        
        # Apply filters
        search = request.GET.get('search')
        if search:
            products = products.filter(
                Q(title__icontains=search) | Q(description__icontains=search)
            )
        
        category = request.GET.get('category')
        if category:
            products = products.filter(category__slug=category)
        
        min_price = request.GET.get('min_price')
        if min_price:
            products = products.filter(price__gte=min_price)
        
        max_price = request.GET.get('max_price')
        if max_price:
            products = products.filter(price__lte=max_price)
        
        # Apply sorting
        sort_by = request.GET.get('sort_by', 'date_desc')
        if sort_by == 'price_asc':
            products = products.order_by('price')
        elif sort_by == 'price_desc':
            products = products.order_by('-price')
        elif sort_by == 'date_asc':
            products = products.order_by('created_at')
        else:  # date_desc
            products = products.order_by('-created_at')
        
        # Pagination
        paginator = ProductPagination()
        page = paginator.paginate_queryset(products, request)
        serializer = ProductListSerializer(page, many=True)
        
        return paginator.get_paginated_response(serializer.data)
    
    elif request.method == 'POST':
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        serializer = ProductCreateUpdateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            product = serializer.save()
            response_serializer = ProductDetailSerializer(product)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
def product_detail(request, id):
    try:
        product = Product.objects.select_related('seller', 'category').get(id=id)
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        # Increment view count
        product.view_count += 1
        product.save(update_fields=['view_count'])
        
        serializer = ProductDetailSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method in ['PUT', 'PATCH', 'DELETE']:
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        if product.seller != request.user:
            return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        if request.method == 'DELETE':
            product.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        partial = request.method == 'PATCH'
        serializer = ProductCreateUpdateSerializer(product, data=request.data, partial=partial, context={'request': request})
        if serializer.is_valid():
            product = serializer.save()
            response_serializer = ProductDetailSerializer(product)
            return Response(response_serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_listings(request):
    products = Product.objects.filter(seller=request.user)
    
    status_filter = request.GET.get('status', 'all')
    if status_filter == 'active':
        products = products.filter(is_sold=False)
    elif status_filter == 'sold':
        products = products.filter(is_sold=True)
    
    # Pagination
    paginator = ProductPagination()
    page = paginator.paginate_queryset(products, request)
    serializer = MyListingSerializer(page, many=True)
    
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
def category_list(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def search_products(request):
    query = request.GET.get('q', '')
    products = Product.objects.select_related('seller', 'category').all()
    
    if query:
        products = products.filter(
            Q(title__icontains=query) | 
            Q(description__icontains=query) |
            Q(category__name__icontains=query)
        )
    
    # Apply additional filters
    category = request.GET.get('category')
    if category:
        products = products.filter(category__slug=category)
    
    min_price = request.GET.get('min_price')
    if min_price:
        products = products.filter(price__gte=min_price)
    
    max_price = request.GET.get('max_price')
    if max_price:
        products = products.filter(price__lte=max_price)
    
    condition = request.GET.get('condition')
    if condition:
        products = products.filter(condition=condition)
    
    location = request.GET.get('location')
    if location:
        products = products.filter(location__icontains=location)
    
    # Sorting
    sort_by = request.GET.get('sort_by', 'relevance')
    if sort_by == 'price_asc':
        products = products.order_by('price')
    elif sort_by == 'price_desc':
        products = products.order_by('-price')
    elif sort_by == 'date_asc':
        products = products.order_by('created_at')
    elif sort_by == 'date_desc':
        products = products.order_by('-created_at')
    
    # Pagination
    paginator = ProductPagination()
    page = paginator.paginate_queryset(products, request)
    serializer = ProductListSerializer(page, many=True)
    
    response_data = paginator.get_paginated_response(serializer.data).data
    response_data['query'] = query
    response_data['filters_applied'] = {
        'category': category,
        'price_range': {
            'min': min_price,
            'max': max_price
        } if min_price or max_price else None,
        'condition': condition
    }
    
    return Response(response_data, status=status.HTTP_200_OK)
