import React from 'react'
import '../App.css'
import { SideData } from './SideData'

function Sidebar() {
  return (
    <div className='Sidebar'>
        <ul className='SideList'>
            {SideData.map((val, key) => {
                return (
                    <li
                        key={key}
                        className='row'
                        id={window.location.pathname === val.link ? "active" : ""}
                        onClick={() => {
                            window.location.pathname = val.link;
                        }}
                    >
                        <div id='title'>{val.title}</div>
                    </li>
                )
            })}
        </ul>
    </div>
  )
}
export default Sidebar