import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center text-white">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-fade-in">
            🏠 RentFusion
          </h1>
          <p className="text-2xl md:text-3xl mb-4 opacity-90">
            Find Your Dream Rental in the Netherlands
          </p>
          <p className="text-xl mb-8 opacity-80 max-w-2xl mx-auto">
            AI-powered rental assistant that monitors 1,500+ sources and alerts you in 15 seconds
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/register"
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl"
            >
              Start Free Trial
            </Link>
            <Link 
              href="/pricing"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-all"
            >
              View Pricing
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 text-white">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">15-Second Alerts</h3>
            <p className="opacity-80">Get notified the instant a property matches your criteria</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-2">AI Application Letters</h3>
            <p className="opacity-80">GPT-4 writes personalized letters in Dutch & English</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-bold mb-2">Mobile Apps</h3>
            <p className="opacity-80">Native iOS & Android apps with push notifications</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 text-center text-white">
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div>
              <div className="text-5xl font-bold">1,500+</div>
              <div className="text-sm opacity-80 mt-2">Rental Sources</div>
            </div>
            <div>
              <div className="text-5xl font-bold">15s</div>
              <div className="text-sm opacity-80 mt-2">Alert Speed</div>
            </div>
            <div>
              <div className="text-5xl font-bold">4x</div>
              <div className="text-sm opacity-80 mt-2">Faster Results</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
