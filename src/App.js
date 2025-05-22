import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Management from './pages/Management';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <div className="App">
        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/management" element={<Management />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
