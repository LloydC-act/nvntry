import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Management from './pages/Management';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import PrivateRoute from './components/PrivateRoute';
import { useState } from 'react';
import StockIn from './pages/StockIn';
import ProductCreation from './pages/ProductCreation';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    alert("Logged out successfully!");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="app-container" style={{ display: 'flex' }}>
        {isAuthenticated && <Sidebar onLogout={handleLogout} />}
        <div className="content" style={{ marginLeft: isAuthenticated ? '250px' : '0', padding: '20px', flexGrow: 1 }}>
          <Routes>
            <Route 
              path="/" 
              element={<Login setIsAuthenticated={setIsAuthenticated} />} 
            />
            <Route 
              path="/dashboard" 
              element={<PrivateRoute element={<Dashboard />} isAuthenticated={isAuthenticated} />} 
            />
            <Route 
              path="/inventory" 
              element={<PrivateRoute element={<Inventory />} isAuthenticated={isAuthenticated} />} 
            />
            <Route 
              path="/management" 
              element={<PrivateRoute element={<Management />} isAuthenticated={isAuthenticated} />} 
            />
            <Route 
              path="/stock-in" 
              element={<PrivateRoute element={<StockIn />} isAuthenticated={isAuthenticated} />} 
            />
            <Route 
              path="/product" 
              element={<PrivateRoute element={<ProductCreation />} isAuthenticated={isAuthenticated} />} 
            />         
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;