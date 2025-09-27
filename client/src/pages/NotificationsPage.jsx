import React from 'react';
import NotificationCenter from '../components/NotificationCenter';
import Header from '../components/Header';
import Footer from '../components/Footer';

const NotificationsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NotificationCenter />
      <Footer />
    </div>
  );
};

export default NotificationsPage;