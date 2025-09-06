from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from django.utils import timezone
from decimal import Decimal
from .models import Purchase, PurchaseItem
from products.models import Product
from cart.models import Cart
from .serializers import (
    PurchaseListSerializer, PurchaseDetailSerializer, CreatePurchaseSerializer
)

class PurchasePagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_purchase(request):
    serializer = CreatePurchaseSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        # Validate items and check availability
        items_data = request.data.get('items', [])
        total_calculated = 0
        
        for item_data in items_data:
            try:
                product = Product.objects.get(id=item_data['product_id'], is_sold=False)
                total_calculated += product.price * item_data['quantity']
            except Product.DoesNotExist:
                return Response({
                    'message': f'Product {item_data["product_id"]} not found or already sold'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verify total amount
        total_from_request = Decimal(str(request.data.get('total_amount', 0)))
        if abs(total_calculated - total_from_request) > Decimal('0.01'):
            return Response({
                'message': 'Total amount mismatch'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create purchase
        purchase = serializer.save()
        
        # Mark products as sold
        for item_data in items_data:
            product = Product.objects.get(id=item_data['product_id'])
            product.is_sold = True
            product.save()
        
        # Clear cart if cart_id provided
        cart_id = request.data.get('cart_id')
        if cart_id:
            try:
                cart = Cart.objects.get(id=cart_id, user=request.user)
                cart.items.all().delete()
            except Cart.DoesNotExist:
                pass
        
        response_serializer = PurchaseDetailSerializer(purchase)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def purchase_history(request):
    purchases = Purchase.objects.filter(buyer=request.user)
    
    # Apply filters
    status_filter = request.GET.get('status')
    if status_filter:
        purchases = purchases.filter(status=status_filter)
    
    date_from = request.GET.get('date_from')
    if date_from:
        purchases = purchases.filter(created_at__date__gte=date_from)
    
    date_to = request.GET.get('date_to')
    if date_to:
        purchases = purchases.filter(created_at__date__lte=date_to)
    
    # Pagination
    paginator = PurchasePagination()
    page = paginator.paginate_queryset(purchases, request)
    serializer = PurchaseListSerializer(page, many=True)
    
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def purchase_detail(request, id):
    purchase = get_object_or_404(Purchase, id=id, buyer=request.user)
    serializer = PurchaseDetailSerializer(purchase)
    return Response(serializer.data, status=status.HTTP_200_OK)
