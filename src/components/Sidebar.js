import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import '../App.css';
import { SideData } from './SideData';

function Sidebar() {
  return (
    <div className='Sidebar'>
      <ul className='SideList'>
        {SideData.map((val, key) => {
          return (
            <li
              key={key}
              className={`row ${window.location.pathname === val.link ? 'active' : ''}`} // Use class for active state
            >
              <Link to={val.link} id='title'>
                {val.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sidebar;