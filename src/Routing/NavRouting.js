import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLogin from '../Components/AdminLogin';
import AdminRegister from '../Components/AdminRegister';
import Department from '../Components/Department';
import Role from '../Components/Role';
import Branch from '../Components/Branch';
import Team from '../Components/Team';
import AddTeamMember from '../Components/AddTeamMember';
import Project from '../Components/Project';
import AddTask from '../Components/AddTask';
import ForgetPassword from '../Components/ForgetPassword';
import AddTeamLeader from '../Components/AddTeamLeader';
import Menu from '../Components/Menu';
import AdminDashboard from '../Components/AdminDashboard';
import ProfileSetting from '../Components/ProfileSetting';
import TeamSetting from '../Components/TeamSetting'
import MainLayout from '../Components/MainLayout';
import Tasklist from '../Components/Tasklist';
// import ProtectedRoute from './ProtectedRoute';
// import LeaderDashboard from '../ComponentsLeader/GetAssignedTask';
import TodaysTask from '../ComponentsLeader/TodaysTask';
import LeaderDashboard from '../ComponentsLeader/LeaderDashboard';
import GetAssignedTask from '../ComponentsLeader/GetAssignedTask';
import GetAllTask from '../ComponentsLeader/GetAllTask';
import TaskForMember from '../ComponentsLeader/TaskForMember';
// import Unauthorized from '../ComponentsLeader/Unauthorized';

const NavRouting = () => {
  return (
    
    <Routes>
      <Route path='/' element={<Navigate to="/project/itupgrad-admin" replace />}/>
      <Route path='/project/itupgrad-admin/register' element={<AdminRegister />} />
      <Route path='/project/itupgrad-admin' element={<AdminLogin />} />
      {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}
      <Route path='/project/itupgrad-admin/*' element={<MainLayout />}>
          <Route path="admin-dashboard" element={<AdminDashboard/>} />
          <Route path="team-leader-dashboard" element={<LeaderDashboard/>} />
          <Route path='forgetpassword' element={<ForgetPassword />} />
          <Route path='department' element={<Department />} />
          <Route path='roles' element={<Role />} />
          <Route path='branch' element={<Branch />} />
          <Route path='menu' element={<Menu />} />
          <Route path='profile' element={<ProfileSetting />} />
          <Route path='teamsetting' element={<TeamSetting />} />
          <Route path='team' element={<Team />} />
          <Route path='team-member' element={<AddTeamMember />} />
          <Route path='team-leader' element={<AddTeamLeader />} />
          <Route path="update-member/:id" element={<AddTeamMember />} />
          <Route path='project' element={<Project />} />
          <Route path="create" element={<AddTask />} />
          <Route path="update-task/:taskId" element={<AddTask />} />
          <Route path="tasks/:name" element={<AddTask />} />
          <Route path="assign-task" element={<AddTask />} />
          <Route path='tasklist' element={<Tasklist />}/>
          <Route path='todays-tasks' element={<TodaysTask />}/>
          <Route path='leader-tasks' element={<GetAssignedTask />}/>
          <Route path='alltask' element={<GetAllTask />}/>
          <Route path='taskToMember' element={<TaskForMember />}/>
      </Route>
    </Routes>
  );
};

export default NavRouting;
