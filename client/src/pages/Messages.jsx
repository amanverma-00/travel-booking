import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MessageCenter from '../components/MessageCenter';

const Messages = () => {
  const { isAuthenticated } = useSelector(state => state.auth);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <MessageCenter />
      <Footer />
    </div>
  );
};

export default Messages;