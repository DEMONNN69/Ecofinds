from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem
from products.models import Product
from .serializers import CartSerializer, AddToCartSerializer, UpdateCartItemSerializer

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def cart_list_add(request):
    # Get or create cart for user
    cart, created = Cart.objects.get_or_create(user=request.user)
    
    if request.method == 'GET':
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        serializer = AddToCartSerializer(data=request.data)
        if serializer.is_valid():
            product_id = serializer.validated_data['product_id']
            quantity = serializer.validated_data['quantity']
            
            try:
                product = Product.objects.get(id=product_id, is_sold=False)
            except Product.DoesNotExist:
                return Response({
                    'message': 'Product not found or already sold'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Check if item already exists in cart
            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product=product,
                defaults={'quantity': quantity}
            )
            
            if not created:
                cart_item.quantity += quantity
                cart_item.save()
            
            return Response({
                'message': 'Item added to cart successfully',
                'cart_item': {
                    'id': cart_item.id,
                    'product_id': product.id,
                    'quantity': cart_item.quantity,
                    'added_at': cart_item.added_at
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def cart_item_update_remove(request, id):
    cart_item = get_object_or_404(CartItem, id=id, cart__user=request.user)
    
    if request.method == 'PATCH':
        serializer = UpdateCartItemSerializer(cart_item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'id': cart_item.id,
                'product_id': cart_item.product.id,
                'quantity': cart_item.quantity,
                'updated_at': cart_item.cart.updated_at
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        cart_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def cart_clear(request):
    try:
        cart = Cart.objects.get(user=request.user)
        cart.items.all().delete()
        return Response({
            'message': 'Cart cleared successfully'
        }, status=status.HTTP_200_OK)
    except Cart.DoesNotExist:
        return Response({
            'message': 'Cart is already empty'
        }, status=status.HTTP_200_OK)
