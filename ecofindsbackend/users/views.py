from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import CustomUser
from .serializers import UserProfileSerializer, UserDashboardSerializer

@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    
    if request.method == 'GET':
        serializer = UserProfileSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method in ['PUT', 'PATCH']:
        partial = request.method == 'PATCH'
        serializer = UserProfileSerializer(user, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    user = request.user
    user_serializer = UserDashboardSerializer(user)
    
    # Mock recent activity data - you can implement actual activity tracking
    recent_activity = [
        {
            'type': 'listing_created',
            'description': 'New product listed',
            'timestamp': '2025-09-06T10:00:00Z'
        },
        {
            'type': 'purchase_made',
            'description': 'Purchase completed',
            'timestamp': '2025-09-05T15:30:00Z'
        }
    ]
    
    return Response({
        'user_info': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'profile_image_url': user.profile_image_url
        },
        'statistics': {
            'total_listings': user_serializer.data['total_listings'],
            'active_listings': user_serializer.data['active_listings'],
            'sold_items': user_serializer.data['sold_items'],
            'total_purchases': user_serializer.data['total_purchases'],
            'cart_items_count': user_serializer.data['cart_items_count']
        },
        'recent_activity': recent_activity
    }, status=status.HTTP_200_OK)
