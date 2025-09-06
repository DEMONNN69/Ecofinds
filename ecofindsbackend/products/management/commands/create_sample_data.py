from django.core.management.base import BaseCommand
from products.models import Category
from django.utils.text import slugify

class Command(BaseCommand):
    help = 'Create sample categories'

    def handle(self, *args, **options):
        categories = [
            {'name': 'Electronics', 'description': 'Phones, laptops, gadgets and electronic devices', 'icon': '📱'},
            {'name': 'Clothing & Fashion', 'description': 'Clothes, shoes, accessories and fashion items', 'icon': '👕'},
            {'name': 'Home & Garden', 'description': 'Furniture, home decor and garden equipment', 'icon': '🏠'},
            {'name': 'Books & Media', 'description': 'Books, movies, music and educational materials', 'icon': '📚'},
            {'name': 'Sports & Outdoors', 'description': 'Sports equipment, outdoor gear and fitness items', 'icon': '⚽'},
            {'name': 'Toys & Games', 'description': 'Toys, board games, video games and collectibles', 'icon': '🎮'},
            {'name': 'Vehicles', 'description': 'Cars, bikes, motorcycles and vehicle parts', 'icon': '🚗'},
            {'name': 'Health & Beauty', 'description': 'Cosmetics, skincare, health and wellness products', 'icon': '💄'},
        ]

        for cat_data in categories:
            category, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={
                    'slug': slugify(cat_data['name']),
                    'description': cat_data['description'],
                    'icon': cat_data['icon']
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created category: {category.name}'))
            else:
                self.stdout.write(self.style.WARNING(f'Category already exists: {category.name}'))
