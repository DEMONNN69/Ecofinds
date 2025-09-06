from rest_framework import serializers
from .models import Purchase, PurchaseItem
from products.serializers import ProductListSerializer
from users.serializers import UserProfileSerializer

class PurchaseItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)

    class Meta:
        model = PurchaseItem
        fields = ('id', 'product', 'quantity', 'price_at_purchase')

class PurchaseListSerializer(serializers.ModelSerializer):
    items = PurchaseItemSerializer(many=True, read_only=True)

    class Meta:
        model = Purchase
        fields = (
            'id', 'order_number', 'items', 'total_amount',
            'status', 'created_at', 'completed_at'
        )

class PurchaseDetailSerializer(serializers.ModelSerializer):
    buyer = UserProfileSerializer(read_only=True)
    items = PurchaseItemSerializer(many=True, read_only=True)

    class Meta:
        model = Purchase
        fields = (
            'id', 'order_number', 'buyer', 'items', 'shipping_address',
            'payment_method', 'total_amount', 'status', 'created_at', 'completed_at'
        )

class CreatePurchaseSerializer(serializers.ModelSerializer):
    items = serializers.ListField(write_only=True)
    cart_id = serializers.IntegerField(required=False, write_only=True)

    class Meta:
        model = Purchase
        fields = (
            'cart_id', 'items', 'shipping_address', 'payment_method', 'total_amount'
        )

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        validated_data.pop('cart_id', None)
        validated_data['buyer'] = self.context['request'].user
        
        purchase = Purchase.objects.create(**validated_data)
        
        for item_data in items_data:
            PurchaseItem.objects.create(
                purchase=purchase,
                **item_data
            )
        
        return purchase
