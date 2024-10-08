import React, { useState, useEffect } from 'react'
import { Sidebar } from "flowbite-react";
import { FaUser, FaUsers } from "react-icons/fa";
import { HiArrowRightOnRectangle, HiDocumentText } from "react-icons/hi2";
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { HiAnnotation } from 'react-icons/hi';
import { IoPieChart } from 'react-icons/io5';

function DashSidebar() {

  const location = useLocation();

  const { currentUser } = useSelector(state => state.user);

  const [tab, setTab] = useState("")

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    if (tabFromUrl) {
      setTab(tabFromUrl)
    }
  }, [location.search])

  const handleSignout = async () => {
    console.log("asd");

    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST'
      })
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess(data));
      }
      navigate('/sign-in');
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>

          {currentUser && currentUser.isAdmin && (
            <Link to='/dashboard?tab=dash'>
              <Sidebar.Item
                active={tab === "dash" || !tab}
                icon={IoPieChart}
                as="div"
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}

          <Link to='/dashboard?tab=profile'>
            <Sidebar.Item
              active={tab === "profile"}
              icon={FaUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div">
              Profile
            </Sidebar.Item>
          </Link>

          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=posts'>
              <Sidebar.Item
                active={tab === "posts"}
                icon={HiDocumentText}
                as="div"
              >
                Posts
              </Sidebar.Item>
            </Link>
          )}

          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=users'>
              <Sidebar.Item
                active={tab === "users"}
                icon={FaUsers}
                as="div"
              >
                Users
              </Sidebar.Item>
            </Link>
          )}

          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=comments'>
              <Sidebar.Item
                active={tab === "comments"}
                icon={HiAnnotation}
                as="div"
              >
                Comments
              </Sidebar.Item>
            </Link>
          )}

          <Sidebar.Item
            icon={HiArrowRightOnRectangle}
            className="cursor-pointer"
            onClick={handleSignout} >
            Sign Out
          </Sidebar.Item>

        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar