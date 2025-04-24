import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/pages/Dashboard';
import ProgramsList from './components/pages/ProgramsList';
import ProgramDetail from './components/pages/ProgramDetail';
import ClientsList from './components/pages/ClientsList';
import ClientDetail from './components/pages/ClientDetail';
import ClientProfile from './components/pages/ClientProfile';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/programs" element={<ProgramsList />} />
            <Route path="/programs/:id" element={<ProgramDetail />} />
            <Route path="/clients" element={<ClientsList />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/clients/:id/profile" element={<ClientProfile />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;