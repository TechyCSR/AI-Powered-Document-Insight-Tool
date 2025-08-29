import React, { useState } from 'react';
import { SignInButton, SignUpButton } from '@clerk/clerk-react';
import { FileText, Brain, Users, Zap, Sparkles, Bot, Shield, ArrowRight } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import DeveloperProfile from './DeveloperProfile';

const LandingPage = () => {
  const [showDeveloperProfile, setShowDeveloperProfile] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-400/10 dark:bg-purple-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-400/10 dark:bg-pink-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>
      {/* Modern Header */}
      <header className="relative z-50 px-6 py-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-xl border border-white/20 dark:border-gray-700/50">
                <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DocInsight AI
              </span>
              <div className="text-xs text-gray-500 dark:text-gray-400">Powered by AI</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <SignInButton mode="modal">
              <button className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:bg-white/50 dark:hover:bg-gray-800/50 backdrop-blur-sm">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Get Started</span>
              </button>
            </SignUpButton>
          </div>
        </nav>
      </header>

      {/* Modern Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Hero Content */}
        <div className="text-center mb-20">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 dark:border-gray-700/50 mb-6">
              <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Powered by Advanced AI</span>
              <Sparkles className="w-4 h-4 text-yellow-500" />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
              AI-Powered
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
              Document Insights
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Transform your documents with cutting-edge AI analysis. Get professional insights, 
            summaries, and recommendations that help you <span className="font-semibold text-blue-600 dark:text-blue-400">stand out</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <SignUpButton mode="modal">
              <button className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-10 py-5 rounded-2xl text-lg font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <Zap className="relative w-6 h-6" />
                <span className="relative">Start Analyzing</span>
                <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 px-8 py-5 rounded-2xl text-lg font-semibold border border-white/20 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Sign In
              </button>
            </SignInButton>
          </div>
        </div>

        {/* Modern Features Section */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: FileText,
              title: "Smart PDF Processing",
              description: "Advanced AI extracts and analyzes your documents with precision and speed.",
              gradient: "from-blue-500 to-cyan-500",
              delay: "0ms"
            },
            {
              icon: Brain,
              title: "Dual AI Analysis",
              description: "Choose between Sarvam AI and Gemini AI for intelligent document insights.",
              gradient: "from-purple-500 to-pink-500",
              delay: "200ms"
            },
            {
              icon: Shield,
              title: "Secure & Private",
              description: "Your documents are processed securely with enterprise-grade protection.",
              gradient: "from-green-500 to-teal-500",
              delay: "400ms"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="group relative transform hover:scale-105 transition-all duration-500"
              style={{ animationDelay: feature.delay }}
            >
              {/* Glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
              
              {/* Card */}
              <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </main>

      {/* Modern Footer */}
      <footer className="relative mt-32 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            {/* Logo */}
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl blur-lg opacity-50" />
                <div className="relative bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20">
                  <Brain className="h-8 w-8 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold text-white">DocInsight AI</span>
            </div>
            
            {/* Divider */}
            <div className="w-32 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-6" />
            
            {/* Developer Credit */}
            <p className="text-gray-300 text-lg">
              Developed by{' '}
              <button
                onClick={() => setShowDeveloperProfile(true)}
                className="font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text hover:from-blue-300 hover:to-purple-300 transition-all duration-300 underline decoration-blue-400/50 hover:decoration-blue-400 underline-offset-4 hover:scale-105 inline-block transform"
              >
                @TechyCSR
              </button>
            </p>
          </div>
        </div>
      </footer>

      {/* Developer Profile Popup */}
      <DeveloperProfile 
        isOpen={showDeveloperProfile}
        onClose={() => setShowDeveloperProfile(false)}
      />
    </div>
  );
};

export default LandingPage;
