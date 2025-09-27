import React from 'react';
import EarningsDashboard from '../../components/EarningsDashboard';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const EarningsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <EarningsDashboard />
      <Footer />
    </div>
  );
};

export default EarningsPage;