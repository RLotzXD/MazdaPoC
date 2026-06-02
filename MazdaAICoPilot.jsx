import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  MessageSquare,
  Shield,
  Sliders,
  Zap,
  Send,
  X,
  ChevronDown,
} from 'lucide-react';

// 2026 Mazda Fleet Dataset
const MAZDA_FLEET = [
  {
    id: 'cx5-2026',
    name: '2026 Mazda CX-5',
    type: 'All-New Redesign',
    price: 31000,
    category: 'Crossovers & SUVs',
    attributes: ['gas', 'family', 'practical', 'daily-commute', 'spacious', 'redesigned'],
    specs: { engine: '2.5L Skyactiv-G', seats: 5, highlight: 'Stretched 4.5" Wheelbase, Google Built-In' }
  },
  {
    id: 'cx50-hybrid',
    name: '2026 Mazda CX-50 Hybrid',
    type: 'Rugged Hybrid Crossover',
    price: 34750,
    category: 'Electrified',
    attributes: ['hybrid', 'efficient', 'outdoor', 'rugged', 'all-wheel-drive'],
    specs: { engine: '2.5L Hybrid (38 MPG)', seats: 5, highlight: '551-mile total range, off-road drive modes' }
  },
  {
    id: 'cx90-phev',
    name: '2026 Mazda CX-90 PHEV',
    type: 'Premium 3-Row Plug-In Hybrid',
    price: 50695,
    category: 'Electrified',
    attributes: ['phev', 'electric-mode', 'luxury', 'family', '3-row', 'large'],
    specs: { engine: 'e-Skyactiv PHEV (56 MPGe)', seats: 7, highlight: 'All-electric short commutes, premium Kakenui stitching' }
  },
  {
    id: 'cx70-inline6',
    name: '2026 Mazda CX-70',
    type: 'Athletic Premium 2-Row SUV',
    price: 42750,
    category: 'Crossovers & SUVs',
    attributes: ['gas', 'mild-hybrid', 'performance', 'cargo', 'luxury', 'sporty'],
    specs: { engine: '3.3L Turbo Inline-6', seats: 5, highlight: '340 HP, massive rear cargo footprint' }
  },
  {
    id: 'mazda3-hatch',
    name: '2026 Mazda3 Hatchback',
    type: 'Premium Compact Hatch',
    price: 25650,
    category: 'Cars',
    attributes: ['gas', 'budget', 'compact', 'commuter', 'agile'],
    specs: { engine: '2.5L Naturally Aspirated', seats: 5, highlight: 'Premium cabin feel, urban parking friendly' }
  },
  {
    id: 'miata-mx5',
    name: '2026 Mazda MX-5 Miata',
    type: 'Pure Lightweight Roadster',
    price: 30430,
    category: 'Cars',
    attributes: ['gas', 'performance', 'sporty', 'convertible', 'fun'],
    specs: { engine: '2.0L Skyactiv-G', seats: 2, highlight: 'Perfect 50:50 weight balance, soft-top driving joy' }
  },
];

// AI Query Pills for Testing
const QUERY_PILLS = [
  {
    text: 'I need an outdoor-friendly SUV with excellent fuel economy.',
    keywords: ['outdoor', 'suv', 'efficient', 'fuel', 'economy', 'rugged', 'hybrid']
  },
  {
    text: 'Show me a spacious family vehicle with 3 rows of seats.',
    keywords: ['family', 'spacious', '3-row', 'seats', 'large', 'practical', 'phev']
  },
  {
    text: 'I want an affordable, fun weekend car with sports car handling.',
    keywords: ['affordable', 'fun', 'performance', 'sporty', 'convertible', 'agile', 'lightweight']
  }
];

// AI Response Templates
const AI_RESPONSES = {
  default: 'Welcome to Mazda. Tell me about your lifestyle, family needs, or daily commute, and I will tailor the 2026 lineup to you.',
  analyzing: 'AI is analyzing the fleet...',
  responses: {
    0: 'Perfect! I\'ve found our best outdoor-friendly SUVs with exceptional fuel efficiency. The CX-50 Hybrid is an excellent match—it combines rugged capability with 38 MPG and 551-mile range. The CX-5 is also a great choice for daily driving.',
    1: 'Excellent choice! The CX-90 PHEV is our premium 3-row family vehicle with electric-only commuting capability and luxury features. It seats 7 and offers an electric-first experience for your daily needs.',
    2: 'Great! The MX-5 Miata is perfect for weekend adventures—it\'s affordable, lightweight, and engineered for pure driving joy with that iconic 50:50 weight balance. It\'s a weekend enthusiast\'s dream!'
  }
};

// Calculate AI Match Score
const calculateMatchScore = (vehicle, keywords) => {
  if (!keywords || keywords.length === 0) return 30;

  let matches = 0;
  const vehicleAttributesStr = vehicle.attributes.join(' ').toLowerCase();

  keywords.forEach(keyword => {
    if (vehicleAttributesStr.includes(keyword.toLowerCase())) {
      matches++;
    }
  });

  const baseScore = (matches / keywords.length) * 100;
  let finalScore = Math.min(99, Math.max(20, baseScore));

  return Math.round(finalScore);
};

// Main Component
export default function MazdaAICoPilot() {
  const [selectedCategory, setSelectedCategory] = useState('All Vehicles');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: AI_RESPONSES.default, timestamp: Date.now() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [currentQuery, setCurrentQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showChatMobile, setShowChatMobile] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Filter & Score Vehicles
  const filteredAndScoredVehicles = useMemo(() => {
    let filtered = MAZDA_FLEET;

    // Category Filter
    if (selectedCategory !== 'All Vehicles') {
      filtered = filtered.filter(v => v.category === selectedCategory);
    }

    // Score & Sort
    const scored = filtered.map(vehicle => ({
      ...vehicle,
      matchScore: calculateMatchScore(vehicle, currentQuery.split(' ').filter(w => w.length > 2))
    }));

    return scored.sort((a, b) => b.matchScore - a.matchScore);
  }, [selectedCategory, currentQuery]);

  // Handle Query Pill Click
  const handleQueryPill = async (pillIndex) => {
    const pill = QUERY_PILLS[pillIndex];

    // Add user message
    setChatMessages(prev => [...prev, {
      role: 'user',
      text: pill.text,
      timestamp: Date.now()
    }]);

    // Show analyzing state
    setIsAnalyzing(true);

    // Simulate AI processing
    setTimeout(() => {
      setCurrentQuery(pill.text);
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        text: AI_RESPONSES.responses[pillIndex],
        timestamp: Date.now()
      }]);
      setIsAnalyzing(false);
    }, 1200);

    setInputValue('');
  };

  // Handle Manual Text Submission
  const handleSubmitQuery = async () => {
    if (!inputValue.trim()) return;

    setChatMessages(prev => [...prev, {
      role: 'user',
      text: inputValue,
      timestamp: Date.now()
    }]);

    setIsAnalyzing(true);

    setTimeout(() => {
      setCurrentQuery(inputValue);
      const keywords = inputValue.split(' ').filter(w => w.length > 2);
      const topMatch = filteredAndScoredVehicles[0];

      setChatMessages(prev => [...prev, {
        role: 'assistant',
        text: `Great! I've analyzed your needs. The ${topMatch.name} appears to be an excellent match for you. It offers ${topMatch.specs.highlight.toLowerCase()}. Would you like to learn more about this model or explore other options?`,
        timestamp: Date.now()
      }]);
      setIsAnalyzing(false);
    }, 1200);

    setInputValue('');
  };

  const categories = ['All Vehicles', 'Crossovers & SUVs', 'Electrified', 'Cars'];

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      {/* LEFT SIDE: Vehicle Grid (65% Desktop, Full Mobile) */}
      <div className="flex-1 lg:w-2/3 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-6 sticky top-0 z-30">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Explore the 2026 Mazda Range</h1>
            <p className="text-gray-600 text-sm mt-1">Personalized by AI</p>
          </div>

          {/* Category Quick Tabs */}
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg transition-all text-sm font-semibold ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle Grid */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredAndScoredVehicles.map((vehicle, idx) => (
              <div
                key={vehicle.id}
                className={`bg-white rounded-xl border-2 border-gray-200 overflow-hidden transition-all duration-300 transform hover:shadow-xl ${
                  vehicle.matchScore < 50 ? 'opacity-40 blur-sm' : 'opacity-100 hover:scale-105'
                }`}
              >
                {/* Vehicle Header with Match Badge */}
                <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 px-6 py-6 text-white">
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    AI Match: {vehicle.matchScore}%
                  </div>

                  <h3 className="text-xl font-bold pr-24">{vehicle.name}</h3>
                  <p className="text-sm text-gray-300">{vehicle.type}</p>
                </div>

                {/* Price */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <span className="text-2xl font-bold text-gray-900">
                    ${vehicle.price.toLocaleString()}
                  </span>
                </div>

                {/* Specs Grid */}
                <div className="px-6 py-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 text-sm">
                      <p className="text-gray-600">Engine</p>
                      <p className="font-semibold text-gray-900">{vehicle.specs.engine}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 text-sm">
                      <p className="text-gray-600">Seating</p>
                      <p className="font-semibold text-gray-900">{vehicle.specs.seats} Passengers</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Sliders className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 text-sm">
                      <p className="text-gray-600">Highlight</p>
                      <p className="font-semibold text-gray-900">{vehicle.specs.highlight}</p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="px-6 py-4 border-t border-gray-100">
                  <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredAndScoredVehicles.length === 0 && (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500">
              <MessageSquare className="w-12 h-12 mb-4 opacity-30" />
              <p>No vehicles found in this category.</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Chat Toggle Button */}
      <button
        onClick={() => setShowChatMobile(!showChatMobile)}
        className="lg:hidden fixed bottom-6 right-6 bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-all z-40"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* RIGHT SIDE: AI Chat Panel (35% Desktop, Sticky Mobile) */}
      <div
        className={`fixed lg:static inset-0 lg:inset-auto z-50 lg:z-auto lg:w-1/3 bg-white border-l border-gray-200 flex flex-col overflow-hidden transition-all duration-300 ${
          showChatMobile ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Close Button Mobile */}
        <button
          onClick={() => setShowChatMobile(false)}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg z-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Chat Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-6 flex items-center gap-3">
          <MessageSquare className="w-6 h-6" />
          <div>
            <h2 className="font-bold text-lg">Mazda AI Co-Pilot</h2>
            <p className="text-xs text-red-100">Your personal vehicle advisor</p>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {chatMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-3 rounded-lg text-sm transition-all ${
                  msg.role === 'user'
                    ? 'bg-red-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isAnalyzing && (
            <div className="flex gap-3 justify-start">
              <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg text-sm">
                <div className="flex gap-2 items-center">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Query Pills */}
        <div className="px-6 py-4 border-t border-gray-200 space-y-2">
          <p className="text-xs text-gray-600 font-semibold uppercase">Try these queries:</p>
          {QUERY_PILLS.map((pill, idx) => (
            <button
              key={idx}
              onClick={() => handleQueryPill(idx)}
              disabled={isAnalyzing}
              className="w-full text-left px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs hover:bg-gray-100 transition-colors disabled:opacity-50 font-medium text-gray-700"
            >
              {pill.text}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSubmitQuery()}
              placeholder="Tell me about your needs..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 text-sm"
              disabled={isAnalyzing}
            />
            <button
              onClick={handleSubmitQuery}
              disabled={isAnalyzing || !inputValue.trim()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
