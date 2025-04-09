import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminLogin from '../Components/AdminLogin'
import AdminRegister from '../Components/AdminRegister'
import Sidebar from '../Components/Sidebar'
import Department from '../Components/Department'
import Role from '../Components/Role'
import Branch from '../Components/Branch'
import Team from '../Components/Team'
import AddTeamMember from '../Components/AddTeamMember'
import Project from '../Components/Project';
import AddTask from '../Components/AddTask'
import Dashboard from '../Components/Dashboard'

const NavRouting = () => {
  return (
    <>
       <Routes>
        <Route path='/' element={<AdminRegister/>}/>
        <Route path='/login' element={<AdminLogin/>}/>
        <Route path='/admin-dashboard' element={<Dashboard/>}/>
        <Route path='/sidebar' element={<Sidebar/>}/>
        <Route path='/department' element={<Department/>}/>
        <Route path='/roles' element={<Role/>}/>
        <Route path='/branch' element={<Branch/>}/>
        <Route path='/team' element={<Team/>}/>
        <Route path='/team-member' element={<AddTeamMember/>}/>
        <Route path="/update-member/:id" element={<AddTeamMember />} />
        <Route path='/project' element={<Project/>}/>
        <Route path="/create" element={<AddTask />} />
        <Route path="/update-task/:taskId" element={<AddTask />} />
      </Routes>
    </>
  )
}

export default NavRouting
