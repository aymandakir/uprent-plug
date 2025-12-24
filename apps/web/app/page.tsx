'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function HomePage() {
  const featuresRef = useRef<HTMLDivElement>(null);
  const useCasesRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('opacity-0', 'translate-y-8');
          entry.target.classList.add('opacity-100', 'translate-y-0');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Small delay to ensure DOM is ready
    setTimeout(() => {
      const elements: Element[] = [];
      
      if (featuresRef.current) {
        Array.from(featuresRef.current.children).forEach((child) => {
          if (child instanceof Element) {
            elements.push(child);
          }
        });
      }
      
      if (useCasesRef.current) {
        Array.from(useCasesRef.current.children).forEach((child) => {
          if (child instanceof Element) {
            elements.push(child);
          }
        });
      }
      
      if (statsRef.current) {
        Array.from(statsRef.current.children).forEach((child) => {
          if (child instanceof Element) {
            elements.push(child);
          }
        });
      }

      elements.forEach((el) => {
        if (el instanceof Element) {
          observer.observe(el);
        }
      });
    }, 100);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white/95 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🏠 RentFusion
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/login"
                className="text-gray-700 hover:text-gray-900 font-medium px-4 py-2 transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link 
                href="/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-28 pb-40">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 mb-8 leading-tight animate-fade-in-up">
              Find Your Dream Rental
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mt-2">
                in the Netherlands
              </span>
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 mb-6 max-w-3xl mx-auto font-medium animate-fade-in-up animate-delay-200">
              AI-powered rental assistant that monitors 1,500+ sources and alerts you in 15 seconds
            </p>
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto animate-fade-in-up animate-delay-300">
              Perfect for finding apartments, studios, and houses in Amsterdam, Rotterdam, Utrecht, and more
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animate-delay-400">
              <Link 
                href="/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 w-full sm:w-auto text-center"
              >
                Get Started
              </Link>
              <Link 
                href="/pricing"
                className="bg-white border-2 border-gray-300 text-gray-700 px-10 py-5 rounded-xl font-bold text-lg hover:border-gray-400 hover:shadow-xl hover:scale-105 transition-all duration-300 w-full sm:w-auto text-center"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Everything you need
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Powerful features to find and secure your perfect rental property
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" ref={featuresRef}>
            {/* Feature 1 */}
            <div className="group bg-gradient-to-br from-blue-50 to-white rounded-3xl p-10 border-2 border-gray-100 hover:border-blue-300 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 opacity-0 translate-y-8">
              <div className="text-6xl mb-6 transform group-hover:scale-125 transition-transform duration-500">⚡</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">15-Second Alerts</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Get notified the instant a property matches your criteria. Never miss an opportunity again.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gradient-to-br from-purple-50 to-white rounded-3xl p-10 border-2 border-gray-100 hover:border-purple-300 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 opacity-0 translate-y-8">
              <div className="text-6xl mb-6 transform group-hover:scale-125 transition-transform duration-500">🤖</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Application Letters</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                GPT-4 writes personalized application letters in Dutch & English in seconds.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-gradient-to-br from-pink-50 to-white rounded-3xl p-10 border-2 border-gray-100 hover:border-pink-300 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 opacity-0 translate-y-8">
              <div className="text-6xl mb-6 transform group-hover:scale-125 transition-transform duration-500">📱</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Mobile Apps</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Native iOS & Android apps with push notifications. Stay connected on the go.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-gradient-to-br from-green-50 to-white rounded-3xl p-10 border-2 border-gray-100 hover:border-green-300 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 opacity-0 translate-y-8">
              <div className="text-6xl mb-6 transform group-hover:scale-125 transition-transform duration-500">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Matching</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Advanced algorithms match properties to your exact preferences: budget, location, size, and more.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-gradient-to-br from-indigo-50 to-white rounded-3xl p-10 border-2 border-gray-100 hover:border-indigo-300 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 opacity-0 translate-y-8">
              <div className="text-6xl mb-6 transform group-hover:scale-125 transition-transform duration-500">🔒</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Secure & Reliable</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Enterprise-grade security with encrypted data storage and privacy protection.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-gradient-to-br from-yellow-50 to-white rounded-3xl p-10 border-2 border-gray-100 hover:border-yellow-300 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 opacity-0 translate-y-8">
              <div className="text-6xl mb-6 transform group-hover:scale-125 transition-transform duration-500">🌍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Multi-Language</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Full support for Dutch and English. Perfect for expats and locals alike.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-32 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Use Cases
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Perfect for a variety of rental needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto" ref={useCasesRef}>
            {/* Use Case 1 */}
            <div className="bg-white rounded-3xl p-10 border-2 border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 opacity-0 translate-y-8">
              <div className="text-6xl font-bold text-blue-600 mb-4">24/7</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Property Monitoring</h3>
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                Monitor 1,500+ rental sources around the clock. Get alerts for new listings instantly, even while you sleep.
              </p>
              <div className="text-base text-gray-500 font-semibold">Availability: 24/7</div>
            </div>

            {/* Use Case 2 */}
            <div className="bg-white rounded-3xl p-10 border-2 border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 opacity-0 translate-y-8">
              <div className="text-6xl font-bold text-purple-600 mb-4">90%</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Time Savings</h3>
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                Automate your property search. Spend less time browsing and more time viewing properties that actually match.
              </p>
              <div className="text-base text-gray-500 font-semibold">Time Saved: 90%</div>
            </div>

            {/* Use Case 3 */}
            <div className="bg-white rounded-3xl p-10 border-2 border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 opacity-0 translate-y-8">
              <div className="text-6xl font-bold text-pink-600 mb-4">5x</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Faster Applications</h3>
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                AI-generated application letters help you apply faster than competitors. Get your application in first.
              </p>
              <div className="text-base text-gray-500 font-semibold">Efficiency: 5x faster</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center" ref={statsRef}>
            <div className="opacity-0 translate-y-8 transition-all duration-700">
              <div className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                1,500+
              </div>
              <div className="text-gray-600 font-semibold text-lg">Rental Sources</div>
            </div>
            <div className="opacity-0 translate-y-8 transition-all duration-700">
              <div className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                15s
              </div>
              <div className="text-gray-600 font-semibold text-lg">Alert Speed</div>
            </div>
            <div className="opacity-0 translate-y-8 transition-all duration-700">
              <div className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent mb-4">
                4x
              </div>
              <div className="text-gray-600 font-semibold text-lg">Faster Results</div>
            </div>
            <div className="opacity-0 translate-y-8 transition-all duration-700">
              <div className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
                24/7
              </div>
              <div className="text-gray-600 font-semibold text-lg">Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full filter blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
              Ready to get started?
            </h2>
            <p className="text-xl md:text-2xl mb-12 opacity-95 max-w-2xl mx-auto">
              Find your perfect rental property in minutes. No credit card required.
            </p>
            <Link 
              href="/register"
              className="inline-block bg-white text-purple-600 px-12 py-5 rounded-xl font-bold text-xl hover:bg-gray-100 hover:scale-110 transition-all duration-300 shadow-2xl"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="text-3xl font-bold text-white mb-6">🏠 RentFusion</div>
              <p className="text-sm leading-relaxed text-gray-400">
                AI-powered rental assistant for the Netherlands
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6 text-lg">Product</h4>
              <ul className="space-y-4 text-sm">
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/search" className="hover:text-white transition-colors">Search</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6 text-lg">Company</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6 text-lg">Legal</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2025 RentFusion. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
