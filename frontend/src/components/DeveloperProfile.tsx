import React, { useEffect, useState } from 'react';
import { X, Github, ExternalLink, Linkedin, Star, Code, Terminal, Coffee, Cpu, Database, Globe, Layers, Zap, Award } from 'lucide-react';

interface DeveloperProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeveloperProfile: React.FC<DeveloperProfileProps> = ({ isOpen, onClose }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeSkill, setActiveSkill] = useState(0);

  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      setIsAnimating(true);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Skill rotation animation
  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setActiveSkill((prev) => (prev + 1) % 4);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const techStack = [
    { name: "Frontend", icon: <Globe className="w-5 h-5" />, tech: "React, TypeScript, Next.js" },
    { name: "Backend", icon: <Database className="w-5 h-5" />, tech: "Python, FastAPI, Node.js" },
    { name: "AI/ML", icon: <Cpu className="w-5 h-5" />, tech: "Machine Learning, LLMs" },
    { name: "DevOps", icon: <Layers className="w-5 h-5" />, tech: "Docker, AWS, CI/CD" }
  ];

  const achievements = [
    { icon: <Star className="w-4 h-4" />, text: "Full-Stack Developer" },
    { icon: <Award className="w-4 h-4" />, text: "AI Enthusiast" },
    { icon: <Zap className="w-4 h-4" />, text: "Problem Solver" },
    { icon: <Coffee className="w-4 h-4" />, text: "Code Addict" }
  ];

  const links = [
    {
      title: "This Project",
      subtitle: "AI Document Insight Tool",
      url: "https://github.com/TechyCSR/AI-Powered-Document-Insight-Tool",
      icon: <Github className="w-6 h-6" />,
      color: "from-gray-700 via-gray-800 to-black",
      bgPattern: "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900"
    },
    {
      title: "Portfolio",
      subtitle: "My Creative Works",
      url: "https://techycsr.me",
      icon: <Code className="w-6 h-6" />,
      color: "from-blue-500 via-purple-500 to-pink-500",
      bgPattern: "bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20"
    },
    {
      title: "LinkedIn",
      subtitle: "Professional Network",
      url: "https://linkedin.com/in/techycsr",
      icon: <Linkedin className="w-6 h-6" />,
      color: "from-blue-600 via-blue-700 to-blue-800",
      bgPattern: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Enhanced Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Enhanced Technical Modal */}
      <div className={`relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 w-full max-w-2xl overflow-hidden transform transition-all duration-700 ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'} hover:scale-[1.01]`}>
        {/* Technical Grid Background */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="grid grid-cols-20 grid-rows-20 w-full h-full">
            {Array.from({ length: 400 }, (_, i) => (
              <div key={i} className="border border-blue-500/20 w-full h-full" />
            ))}
          </div>
        </div>
        
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-400/5 dark:via-purple-400/5 dark:to-pink-400/5" />
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-purple-400/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-pink-400/10 to-yellow-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Enhanced Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-3 rounded-full bg-red-500/10 hover:bg-red-500/20 dark:bg-red-400/10 dark:hover:bg-red-400/20 backdrop-blur-sm border border-red-200/30 dark:border-red-700/30 shadow-lg hover:shadow-red-500/25 transition-all duration-300 group"
        >
          <X className="w-5 h-5 text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors" />
        </button>
        
        {/* Content */}
        <div className="relative p-8">
          {/* Technical Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg blur-lg opacity-60 animate-pulse" />
                <div className="relative bg-black text-green-400 px-4 py-2 rounded-lg font-mono text-sm border border-green-400/30">
                  <Terminal className="w-4 h-4 inline mr-2" />
                  ~/dev/profile $
                </div>
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  TechyCSR
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                  Senior Full-Stack Engineer
                </p>
              </div>
            </div>
            
            {/* Status Indicator */}
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-green-600 dark:text-green-400 font-mono">ONLINE</span>
            </div>
          </div>

          {/* Technical Skills Carousel */}
          <div className="mb-8 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                <Cpu className="w-5 h-5 mr-2 text-blue-500" />
                Tech Stack
              </h3>
              <div className="flex space-x-1">
                {techStack.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === activeSkill ? 'bg-blue-500 scale-125' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="relative h-16 overflow-hidden">
              {techStack.map((skill, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 flex items-center justify-between transition-all duration-500 ${
                    index === activeSkill 
                      ? 'opacity-100 transform translate-x-0' 
                      : 'opacity-0 transform translate-x-full'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white">
                      {skill.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-gray-200">{skill.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 font-mono">{skill.tech}</div>
                    </div>
                  </div>
                  <div className="text-2xl">
                    {index === 0 && '🚀'}
                    {index === 1 && '⚡'}
                    {index === 2 && '🤖'}
                    {index === 3 && '☁️'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements Grid */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-500" />
              Achievements
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-white/30 dark:border-gray-700/30 hover:scale-105 transition-transform duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-yellow-500">{achievement.icon}</div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{achievement.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Links */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-blue-500" />
              Connect & Explore
            </h3>
            <div className="space-y-3">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-white/30 dark:border-gray-700/30 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:scale-[1.02] transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`p-2.5 rounded-lg bg-gradient-to-r ${link.color} text-white mr-4 group-hover:scale-110 transition-transform duration-300`}>
                    {link.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {link.title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                      {link.subtitle}
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Technical Footer */}
          <div className="pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 blur-lg opacity-50 animate-pulse" />
                  <span className="relative text-xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent font-mono">
                    @TechyCSR
                  </span>
                </div>
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                  VERSION 2.0.1
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                  ESC to exit
                </div>
              </div>
            </div>
            
            {/* System Info Bar */}
            <div className="mt-4 p-3 bg-black/5 dark:bg-white/5 rounded-lg">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                  <span>🚀 Building the future</span>
                  <span>⚡ Always learning</span>
                  <span>🤖 AI-powered</span>
                </div>
                <div className="text-green-500">
                  ● READY
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperProfile;
