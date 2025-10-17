import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import StatisticsSection from '../components/StatisticsSection';
import FeaturedResources from '../components/FeaturedResources';
import CategoriesOverview from '../components/CategoriesOverview';
import RecentDiscussions from '../components/RecentDiscussions';
import CallToActionSection from '../components/CallToActionSection';
import Footer from '../components/Footer';

const Homepage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse-resources?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <HeroSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />
      <StatisticsSection />
      <FeaturedResources />
      <CategoriesOverview />
      <RecentDiscussions />
      {/* <CallToActionSection /> */}
      <Footer />
    </div>
  );
};

export default Homepage;
