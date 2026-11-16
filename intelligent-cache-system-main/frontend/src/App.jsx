import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';

export default function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Home />
      </main>
      <Footer />
    </div>
  );
}