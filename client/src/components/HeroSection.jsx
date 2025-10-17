import { Link } from 'react-router-dom';

const HeroSection = ({ searchQuery, setSearchQuery, handleSearch }) => {
  return (
    <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      
      {/* Animated Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Main Heading */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                  DevVault
                </span>
              </h1>
              <p className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-4 text-white">
                Developer Resource Vault
              </p>
              <p className="text-xl md:text-2xl text-blue-200 font-light max-w-2xl leading-relaxed">
                Your centralized, community-driven hub for discovering and sharing developer resources
              </p>
            </div>

            {/* Divider */}
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mb-12 rounded-full lg:mx-0 mx-auto" />

            {/* Description Text */}
            <div className="max-w-2xl mb-12">
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
                Curate, discover, and share the best development resources — tutorials, documentation, 
                YouTube channels, API references, and tools — all organized by technology and category.
              </p>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 text-sm text-blue-200">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Trusted by 10,000+ Developers
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  5,000+ Curated Resources
                </div>
              </div>
            </div>

            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mb-8">
              <form onSubmit={handleSearch} className="relative group">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search frameworks, tutorials, APIs, tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-4 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 shadow-xl border border-gray-200 backdrop-blur-sm bg-white/95 transition-all duration-300 placeholder-gray-500"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Search
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-start items-start lg:items-center mb-8">
              <Link
                to="/browse-resources"
                className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 flex items-center gap-3 min-w-[180px] justify-center"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Browse Resources
              </Link>
              <Link
                to="/contribute"
                className="group border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-gray-900 transition-all duration-200 backdrop-blur-sm bg-white/10 hover:shadow-2xl transform hover:scale-105 focus:ring-4 focus:ring-white focus:ring-opacity-50 flex items-center gap-3 min-w-[180px] justify-center"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Contribute Resource
              </Link>
            </div>
          </div>

          {/* Right Side - Image/Illustration */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg">
              {/* Main Image Container */}
              <div className="relative bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl p-8 backdrop-blur-sm border border-white/10 shadow-2xl">
                {/* Mockup Browser Window */}
                <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
                  {/* Browser Header */}
                  <div className="bg-gray-900 px-4 py-3 flex items-center gap-2">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 bg-gray-700 rounded px-3 py-1 mx-4">
                      <div className="text-xs text-gray-300 text-center">devvault.com/resources</div>
                    </div>
                  </div>
                  
                  {/* Browser Content */}
                  <div className="bg-gray-800 p-6">
                    {/* Resource Cards Mockup */}
                    <div className="space-y-4">
                      {/* Card 1 */}
                      <div className="bg-gray-700 rounded-lg p-4 border-l-4 border-blue-500">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-semibold text-sm">React Documentation</h4>
                            <p className="text-gray-400 text-xs mt-1">Official React docs and tutorials</p>
                            <div className="flex gap-2 mt-2">
                              <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">React</span>
                              <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">Beginner</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card 2 */}
                      <div className="bg-gray-700 rounded-lg p-4 border-l-4 border-purple-500">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-semibold text-sm">Node.js Crash Course</h4>
                            <p className="text-gray-400 text-xs mt-1">Complete Node.js tutorial series</p>
                            <div className="flex gap-2 mt-2">
                              <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">Node.js</span>
                              <span className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded text-xs">Intermediate</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card 3 */}
                      <div className="bg-gray-700 rounded-lg p-4 border-l-4 border-green-500">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-semibold text-sm">REST API Guide</h4>
                            <p className="text-gray-400 text-xs mt-1">Building RESTful APIs best practices</p>
                            <div className="flex gap-2 mt-2">
                              <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded text-xs">API</span>
                              <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">Advanced</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Features Grid */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Curated Resources</h3>
            <p className="text-gray-300 text-center">Carefully selected and organized development resources</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Community Driven</h3>
            <p className="text-gray-300 text-center">Share and discover resources with developers worldwide</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-green-500/30 transition-all duration-300">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Always Updated</h3>
            <p className="text-gray-300 text-center">Fresh content with community ratings and reviews</p>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default HeroSection;