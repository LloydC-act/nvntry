import React from 'react'
import '../styles/Dashboard.css'
import DashTable from '../components/DashTable'
import ItemSummary from '../components/ItemSummary'

const Dashboard = () => {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="greeting">
          <h2>Hello Mathins 👋</h2>
          <p>Good Morning</p>
        </div>
        <div className="search-container">
          <input type="text" placeholder="Search..." className="search-input" />
          <button className="search-button">🔍</button>
        </div>
      </header>
      <h1>Dashboard</h1>
      <DashTable />
      <ItemSummary />
    </div>
  );
}

export default Dashboard