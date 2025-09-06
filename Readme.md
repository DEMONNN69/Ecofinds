# 🌱 EcoFinds - Sustainable Marketplace

**EcoFinds** is a modern, eco-friendly marketplace platform that promotes sustainable living by facilitating the buying and selling of pre-owned, refurbished, and eco-conscious products. Built with Django REST Framework and React, it empowers users to reduce waste and contribute to a circular economy.

![EcoFinds Banner](https://via.placeholder.com/800x200/4ade80/ffffff?text=EcoFinds+-+Sustainable+Marketplace)

## 🌟 Features

### 🛍️ **Core Marketplace Features**
- **Product Listings** - Create, edit, and manage product listings with detailed information
- **Category Management** - 15+ eco-friendly categories (Electronics, Furniture, Clothing, etc.)
- **Advanced Search & Filtering** - Find products by category, price, condition, and location
- **Shopping Cart** - Add products, manage quantities, and seamless checkout
- **Purchase History** - Track all purchases with detailed order information
- **User Profiles** - Complete profile management with image upload

### 🔐 **Authentication & Security**
- **JWT Authentication** - Secure token-based authentication
- **Protected Routes** - Route-level security for authenticated content
- **Password Security** - PBKDF2-SHA256 hashing with 600,000 iterations
- **User Registration** - Complete signup with profile image support

### 📱 **User Experience**
- **Responsive Design** - Mobile-first, works on all devices
- **Modern UI** - Clean interface built with Tailwind CSS and shadcn/ui
- **Real-time Updates** - Dynamic content updates without page refresh
- **Image Management** - Product and profile image upload with optimization

### 🎯 **Eco-Friendly Focus**
- **Condition Tracking** - Product condition ratings (New, Like New, Good, Fair, Poor)
- **Sustainability Metrics** - Track environmental impact through reuse
- **Second-hand First** - Promotes reuse over new purchases
- **Circular Economy** - Facilitates product lifecycle extension

## 🛠️ Technology Stack

### **Backend**
- **Framework:** Django 4.2.24 + Django REST Framework 3.16.1
- **Authentication:** JWT (Simple JWT 5.5.1)
- **Database:** MySQL 8.0+ (with SQLite3 fallback for development)
- **Image Processing:** Pillow 11.3.0
- **API:** RESTful API with comprehensive endpoints

### **Frontend**
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + shadcn/ui components
- **Routing:** React Router v6
- **State Management:** React Context API
- **HTTP Client:** Axios

### **Development Tools**
- **Version Control:** Git
- **Package Managers:** pip (Python) + npm (Node.js)
- **Environment:** Virtual environment (venv)

## 📋 Prerequisites

Before running this project, make sure you have:

- **Python 3.9+** installed
- **Node.js 16+** and npm installed
- **MySQL 8.0+** running (or use SQLite for development)
- **Git** for version control

## 🚀 Installation & Setup

### **1. Clone the Repository**
```bash
git clone https://github.com/DEMONNN69/Ecofinds.git
cd Ecofinds
```

### **2. Backend Setup (Django)**

#### Create and activate virtual environment:
```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux  
source .venv/bin/activate
```

#### Install Python dependencies:
```bash
cd ecofindsbackend
pip install -r requirements.txt
```

#### Configure Database:
```python
# ecofindsbackend/settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'eco',
        'USER': 'root',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

#### Run Database Migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

#### Create Sample Data:
```bash
# Add categories
python manage.py shell < add_categories.py

# Add sample users  
python manage.py shell < add_users.py
```

#### Start Django Development Server:
```bash
python manage.py runserver
```
Backend will be available at: `http://localhost:8000`

### **3. Frontend Setup (React)**

#### Install Node.js dependencies:
```bash
cd ../frontend
npm install
```

#### Start Development Server:
```bash
npm run dev
```
Frontend will be available at: `http://localhost:5173`

## 📁 Project Structure

```
Ecofinds/
├── 📁 ecofindsbackend/           # Django Backend
│   ├── 📁 authentication/        # User auth (login, register, JWT)
│   ├── 📁 users/                 # User profiles and management
│   ├── 📁 products/              # Product listings and categories
│   ├── 📁 cart/                  # Shopping cart functionality
│   ├── 📁 purchases/             # Order and purchase tracking
│   ├── 📁 ecofindsbackend/       # Main Django settings
│   ├── 📄 manage.py              # Django management script
│   ├── 📄 requirements.txt       # Python dependencies
│   ├── 📄 add_categories.py      # Category setup script
│   └── 📄 add_users.py           # User setup script
│
├── 📁 frontend/                  # React Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/        # Reusable UI components
│   │   │   ├── 📁 ui/            # shadcn/ui components
│   │   │   └── 📄 ProtectedRoute.tsx
│   │   ├── 📁 pages/             # Main application pages
│   │   │   ├── 📄 HomePage.tsx
│   │   │   ├── 📄 ProductDetailPage.tsx
│   │   │   ├── 📄 AddProductPage.tsx
│   │   │   ├── 📄 CartPage.tsx
│   │   │   ├── 📄 ProfilePage.tsx
│   │   │   └── 📄 PurchaseHistoryPage.tsx
│   │   ├── 📁 contexts/          # React Context providers
│   │   │   └── 📄 AuthContext.tsx
│   │   ├── 📁 lib/               # Utilities and configurations
│   │   │   ├── 📄 api.ts         # API client and types
│   │   │   └── 📄 imageUtils.ts  # Image handling utilities
│   │   └── 📄 App.tsx            # Main app component
│   ├── 📄 package.json           # Node.js dependencies
│   └── 📄 vite.config.ts         # Vite configuration
│
├── 📁 .venv/                     # Python virtual environment
└── 📄 README.md                  # This file
```

## 🔗 API Endpoints

### **Authentication**
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/refresh/` - Refresh JWT token

### **Users**
- `GET /api/users/profile/` - Get user profile
- `PUT /api/users/profile/` - Update user profile
- `GET /api/users/dashboard/` - User dashboard stats

### **Products**
- `GET /api/products/` - List all products
- `POST /api/products/` - Create new product
- `GET /api/products/{id}/` - Get product details
- `PUT /api/products/{id}/` - Update product
- `DELETE /api/products/{id}/` - Delete product
- `GET /api/products/categories/` - List categories
- `GET /api/products/my-products/` - User's products

### **Cart & Purchases**
- `GET /api/cart/` - Get cart items
- `POST /api/cart/add/` - Add item to cart
- `PUT /api/cart/update/{id}/` - Update cart item
- `DELETE /api/cart/remove/{id}/` - Remove from cart
- `POST /api/cart/checkout/` - Process checkout
- `GET /api/purchases/` - Purchase history

## 👥 Default Users

The application comes with pre-configured users for testing:

### **Admin Account**
- **Username:** `admin`
- **Password:** `admin123`
- **Access:** Full admin panel access at `/admin/`

### **Test Users**
- **john_eco** / `ecopass123` - John Smith
- **sarah_green** / `greenlife456` - Sarah Johnson  
- **mike_recycle** / `recycle789` - Michael Brown
- **lisa_earth** / `earthlove321` - Lisa Davis
- **alex_vintage** / `vintage654` - Alex Wilson
- **emma_sustainable** / `sustain987` - Emma Taylor
- **david_reuse** / `reuse246` - David Anderson
- **sophia_green** / `greenliving135` - Sophia Martinez
- **chris_circular** / `circular468` - Christopher Garcia
- **olivia_eco** / `ecolife579` - Olivia Rodriguez

## 🏷️ Product Categories

The platform includes 15 eco-friendly categories:

1. **Electronics & Tech** - Phones, laptops, tablets, accessories
2. **Furniture & Home** - Furniture, home decor, household items
3. **Clothing & Fashion** - Second-hand clothing, shoes, accessories
4. **Books & Media** - Books, DVDs, CDs, educational materials
5. **Sports & Outdoors** - Sports equipment, outdoor gear, fitness
6. **Kitchen & Appliances** - Kitchen appliances, cookware, dining
7. **Baby & Kids** - Toys, baby gear, children's items
8. **Automotive & Parts** - Car parts, accessories, tools
9. **Garden & Plants** - Garden tools, pots, seeds, outdoor equipment
10. **Art & Collectibles** - Artwork, antiques, collectibles, vintage
11. **Musical Instruments** - Guitars, keyboards, drums, instruments
12. **Tools & Hardware** - Tools, hardware, DIY equipment
13. **Health & Beauty** - Skincare, makeup, wellness products
14. **Office & Business** - Office furniture, supplies, equipment
15. **Miscellaneous** - Other eco-friendly items

## 🔧 Configuration

### **Environment Variables**
Create a `.env` file in the backend directory:
```bash
SECRET_KEY=your-secret-key-here
DEBUG=True
DATABASE_URL=mysql://user:password@localhost/eco
ALLOWED_HOSTS=localhost,127.0.0.1
```

### **Development Settings**
- **Debug Mode:** Enabled by default
- **CORS:** Configured for `http://localhost:5173`
- **Media Files:** Served by Django development server
- **Database:** MySQL with SQLite fallback

## 📱 Usage Guide

### **For Buyers**
1. **Browse Products** - Explore categories or search for specific items
2. **View Details** - Check product condition, seller info, and specifications
3. **Add to Cart** - Select items and quantities
4. **Checkout** - Complete purchase securely
5. **Track Orders** - View purchase history and order status

### **For Sellers**
1. **Create Account** - Sign up with profile information
2. **Add Products** - List items with photos and detailed descriptions
3. **Manage Listings** - Edit, update, or remove your products
4. **Track Sales** - Monitor your sales and buyer interactions
5. **Profile Management** - Update your seller profile and contact info

### **Admin Features**
- **User Management** - View and manage all users
- **Product Moderation** - Review and moderate product listings
- **Category Management** - Add, edit, or remove categories
- **Sales Analytics** - Monitor platform usage and sales metrics

## 🧪 Testing

### **Backend Testing**
```bash
cd ecofindsbackend
python manage.py test
```

### **Frontend Testing**
```bash
cd frontend
npm run test
```

### **Manual Testing**
1. **User Registration/Login** - Test authentication flow
2. **Product CRUD** - Create, read, update, delete products
3. **Cart Operations** - Add/remove items, checkout process
4. **Profile Management** - Update user information and images
5. **Search & Filter** - Test product discovery features

## 🔒 Security Features

- **Password Hashing** - PBKDF2-SHA256 with 600,000 iterations
- **JWT Tokens** - Secure stateless authentication
- **CORS Protection** - Configured for frontend domain
- **Input Validation** - Comprehensive form validation
- **Protected Routes** - Authentication required for sensitive operations
- **SQL Injection Prevention** - Django ORM protection
- **XSS Protection** - Input sanitization and output encoding

## 🚀 Deployment

### **Backend Deployment (Production)**
1. **Environment Setup**
   ```bash
   DEBUG=False
   ALLOWED_HOSTS=your-domain.com
   SECRET_KEY=your-production-secret-key
   ```

2. **Database Configuration**
   - Use PostgreSQL or MySQL for production
   - Configure connection pooling
   - Set up database backups

3. **Static Files**
   ```bash
   python manage.py collectstatic
   ```

4. **Web Server**
   - Use Gunicorn + Nginx
   - Configure SSL certificates
   - Set up monitoring

### **Frontend Deployment**
1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Deploy to CDN**
   - Upload `dist/` folder to hosting provider
   - Configure environment variables
   - Set up domain and SSL

## 🤝 Contributing

We welcome contributions to EcoFinds! Here's how to get started:

1. **Fork the Repository**
2. **Create Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit Changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to Branch** (`git push origin feature/AmazingFeature`)
5. **Open Pull Request**

### **Contribution Guidelines**
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR
- Use meaningful commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Troubleshooting

### **Common Issues**

#### **Database Connection Error**
```bash
# Check MySQL service is running
# Verify credentials in settings.py
# Ensure database 'eco' exists
```

#### **Frontend Build Errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### **CORS Issues**
```python
# Check CORS_ALLOWED_ORIGINS in settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

### **Getting Help**
- **Issues:** [GitHub Issues](https://github.com/DEMONNN69/Ecofinds/issues)
- **Documentation:** Check this README and code comments
- **Community:** Join our discussions for support and feature requests

## 🎯 Roadmap

### **Upcoming Features**
- [ ] **Real-time Chat** - Buyer-seller communication
- [ ] **Payment Integration** - Stripe/PayPal integration
- [ ] **Mobile App** - React Native mobile application
- [ ] **Advanced Analytics** - Detailed sales and usage analytics
- [ ] **Recommendation Engine** - AI-powered product recommendations
- [ ] **Multi-language Support** - Internationalization
- [ ] **Social Features** - User reviews and ratings
- [ ] **Shipping Integration** - Shipping calculator and tracking

### **Technical Improvements**
- [ ] **Performance Optimization** - Database query optimization
- [ ] **Caching** - Redis implementation
- [ ] **Search Enhancement** - Elasticsearch integration
- [ ] **Image Optimization** - Advanced image processing
- [ ] **API Versioning** - RESTful API versioning
- [ ] **Monitoring** - Application monitoring and logging

## 📊 Project Statistics

- **Backend:** Django REST Framework with 6 apps
- **Frontend:** React with TypeScript, 10+ pages
- **Database:** 15+ models with relationships
- **API Endpoints:** 20+ RESTful endpoints
- **UI Components:** 50+ reusable components
- **Categories:** 15 eco-friendly product categories
- **Authentication:** JWT-based with profile management

## 🌟 Acknowledgments

- **Django REST Framework** - Powerful API framework
- **React Community** - Amazing frontend ecosystem
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **MySQL** - Reliable database system
- **Open Source Community** - For inspiration and tools

---

## 🌱 **Made with ❤️ for a Sustainable Future**

EcoFinds is more than just a marketplace - it's a movement towards sustainable living. Every transaction on our platform contributes to reducing waste and promoting the circular economy. Join us in making the world a greener place, one purchase at a time!

**Start your sustainable shopping journey today!** 🌍♻️

---

*Last updated: September 6, 2025*
