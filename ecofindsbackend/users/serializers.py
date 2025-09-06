from rest_framework import serializers
from .models import CustomUser

class UserProfileSerializer(serializers.ModelSerializer):
    profile_image_url = serializers.ReadOnlyField()

    class Meta:
        model = CustomUser
        fields = (
            'id', 'email', 'username', 'first_name', 'last_name',
            'phone', 'address', 'city', 'state', 'zip_code',
            'profile_image', 'profile_image_url', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'email', 'created_at', 'updated_at')

class UserDashboardSerializer(serializers.ModelSerializer):
    profile_image_url = serializers.ReadOnlyField()
    total_listings = serializers.SerializerMethodField()
    active_listings = serializers.SerializerMethodField()
    sold_items = serializers.SerializerMethodField()
    total_purchases = serializers.SerializerMethodField()
    cart_items_count = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = (
            'id', 'username', 'email', 'profile_image_url',
            'total_listings', 'active_listings', 'sold_items',
            'total_purchases', 'cart_items_count'
        )

    def get_total_listings(self, obj):
        return obj.products.count()

    def get_active_listings(self, obj):
        return obj.products.filter(is_sold=False).count()

    def get_sold_items(self, obj):
        return obj.products.filter(is_sold=True).count()

    def get_total_purchases(self, obj):
        return obj.purchases.count()

    def get_cart_items_count(self, obj):
        return getattr(obj.cart, 'total_items', 0) if hasattr(obj, 'cart') else 0
