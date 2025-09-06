from django.core.management.base import BaseCommand
from django.utils.text import slugify
from products.models import Category

class Command(BaseCommand):
    help = 'Create initial categories for the EcoFinds platform'

    def handle(self, *args, **options):
        categories = [
            {
                'name': 'Electronics',
                'description': 'Second-hand electronics, gadgets, and tech accessories',
                'icon': 'fas fa-laptop'
            },
            {
                'name': 'Fashion & Clothing',
                'description': 'Pre-owned clothing, shoes, and fashion accessories',
                'icon': 'fas fa-tshirt'
            },
            {
                'name': 'Home & Garden',
                'description': 'Furniture, home decor, and garden equipment',
                'icon': 'fas fa-home'
            },
            {
                'name': 'Books & Media',
                'description': 'Used books, DVDs, CDs, and other media',
                'icon': 'fas fa-book'
            },
            {
                'name': 'Sports & Outdoor',
                'description': 'Sports equipment, outdoor gear, and fitness items',
                'icon': 'fas fa-dumbbell'
            },
            {
                'name': 'Toys & Games',
                'description': 'Pre-owned toys, board games, and collectibles',
                'icon': 'fas fa-gamepad'
            },
            {
                'name': 'Automotive',
                'description': 'Car accessories, parts, and automotive equipment',
                'icon': 'fas fa-car'
            },
            {
                'name': 'Musical Instruments',
                'description': 'Used musical instruments and audio equipment',
                'icon': 'fas fa-music'
            },
            {
                'name': 'Art & Crafts',
                'description': 'Art supplies, handmade items, and craft materials',
                'icon': 'fas fa-paint-brush'
            },
            {
                'name': 'Other',
                'description': 'Miscellaneous items that don\'t fit other categories',
                'icon': 'fas fa-box'
            }
        ]

        for category_data in categories:
            category, created = Category.objects.get_or_create(
                name=category_data['name'],
                defaults={
                    'slug': slugify(category_data['name']),
                    'description': category_data['description'],
                    'icon': category_data['icon']
                }
            )
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully created category: {category.name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Category already exists: {category.name}')
                )

        self.stdout.write(
            self.style.SUCCESS('Finished creating initial categories!')
        )
