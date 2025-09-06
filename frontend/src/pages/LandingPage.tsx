import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Leaf, Sparkles, Star, ShoppingBag, Users, Shield, Recycle, Heart } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FDF8] via-[#FFF8DC] to-[#B7E4C7]/20 relative overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <Leaf className="absolute top-20 left-[10%] w-8 h-8 text-[#52B788]/20 animate-pulse" />
        <Sparkles className="absolute top-32 right-[15%] w-6 h-6 text-[#2D5016]/30 animate-bounce" />
        <Recycle className="absolute bottom-40 left-[20%] w-10 h-10 text-[#52B788]/15 animate-pulse" style={{ animationDelay: '1s' }} />
        <Star className="absolute bottom-60 right-[25%] w-5 h-5 text-[#2D5016]/25 animate-pulse" style={{ animationDelay: '2s' }} />
        <Heart className="absolute top-1/2 left-[5%] w-6 h-6 text-[#52B788]/20 animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center py-16 md:py-24">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-[#52B788] to-[#2D5016] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Leaf className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-[#1B4332] mb-6 leading-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-[#52B788] to-[#2D5016] bg-clip-text text-transparent">
                EcoFinds
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-[#2D5016]/70 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover a sustainable marketplace where pre-loved items find new homes. 
              Join our eco-friendly community and make a difference, one purchase at a time.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              asChild
              className="bg-gradient-to-r from-[#52B788] to-[#2D5016] hover:from-[#2D5016] hover:to-[#52B788] text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-4 group"
              size="lg"
            >
              <Link to="/signup">
                <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                Get Started
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline"
              className="border-[#52B788]/30 text-[#2D5016] hover:bg-[#52B788]/10 hover:border-[#52B788] transition-all duration-300 text-lg px-8 py-4"
              size="lg"
            >
              <Link to="/login">
                Already have an account? Sign In
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg ring-1 ring-white/20 hover:shadow-xl hover:ring-white/30 transition-all duration-300 group">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#52B788]/20 to-[#2D5016]/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag className="w-8 h-8 text-[#52B788]" />
              </div>
              <h3 className="text-xl font-bold text-[#1B4332] mb-4">Sustainable Shopping</h3>
              <p className="text-[#2D5016]/70 leading-relaxed">
                Discover amazing pre-owned items and give them a second life while reducing environmental impact.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg ring-1 ring-white/20 hover:shadow-xl hover:ring-white/30 transition-all duration-300 group">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#52B788]/20 to-[#2D5016]/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-[#52B788]" />
              </div>
              <h3 className="text-xl font-bold text-[#1B4332] mb-4">Community Driven</h3>
              <p className="text-[#2D5016]/70 leading-relaxed">
                Join a community of like-minded individuals who care about sustainability and responsible consumption.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg ring-1 ring-white/20 hover:shadow-xl hover:ring-white/30 transition-all duration-300 group">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#52B788]/20 to-[#2D5016]/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-[#52B788]" />
              </div>
              <h3 className="text-xl font-bold text-[#1B4332] mb-4">Trusted & Secure</h3>
              <p className="text-[#2D5016]/70 leading-relaxed">
                Shop with confidence knowing that all transactions are secure and users are verified.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Section */}
        <div className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg ring-1 ring-white/20 mb-16">
          <h2 className="text-3xl font-bold text-[#1B4332] mb-8">Join Our Growing Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-[#52B788] to-[#2D5016] bg-clip-text text-transparent mb-2">
                10,000+
              </div>
              <p className="text-[#2D5016]/70 font-medium">Happy Users</p>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-[#52B788] to-[#2D5016] bg-clip-text text-transparent mb-2">
                50,000+
              </div>
              <p className="text-[#2D5016]/70 font-medium">Items Sold</p>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-[#52B788] to-[#2D5016] bg-clip-text text-transparent mb-2">
                500kg+
              </div>
              <p className="text-[#2D5016]/70 font-medium">Waste Reduced</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center py-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1B4332] mb-6">
            Ready to Start Your Sustainable Journey?
          </h2>
          <p className="text-lg text-[#2D5016]/70 mb-8 max-w-2xl mx-auto">
            Create your account today and become part of the sustainable shopping revolution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              className="bg-gradient-to-r from-[#52B788] to-[#2D5016] hover:from-[#2D5016] hover:to-[#52B788] text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-4 group"
              size="lg"
            >
              <Link to="/signup">
                <Heart className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                Join EcoFinds Today
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
