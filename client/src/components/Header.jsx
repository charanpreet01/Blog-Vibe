import React from 'react'
import { Navbar, TextInput, Button } from "flowbite-react"
import { Link, useLocation } from "react-router-dom"
import { IoSearch } from "react-icons/io5"
import { FaMoon } from "react-icons/fa"

function Header() {

    const path = useLocation().pathname;

    return (
        <Navbar className='border-2'>
            <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
                <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Blog</span>
                Vibe
            </Link>

            <TextInput
                type='text'
                placeholder='Search...'
                rightIcon={IoSearch}
                className='hidden lg:inline'
            />
            <Button className='w-12 h-10 lg:hidden' color='gray' pill>
                <IoSearch />
            </Button>

            <div className='flex gap-3 md:order-2'>
                <Button className='w-12 h-10 hidden sm:inline' color='gray' pill>
                    <FaMoon />
                </Button>
                <Link to='/sign-in'>
                    <Button gradientDuoTone="purpleToBlue">Sign In</Button>
                </Link>
                <Navbar.Toggle />
            </div>

            <Navbar.Collapse>
                <Navbar.Link active={path === '/'} as={"div"}>
                    <Link to='/'>
                        Home
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/about'} as={"div"}>
                    <Link to='/about'>
                        About
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/projects'} as={"div"}>
                    <Link to='/projects'>
                        Projects
                    </Link>
                </Navbar.Link>
            </Navbar.Collapse>

        </Navbar>
    )
}

export default Header
