"use client";

import React, { useEffect, useState } from 'react';
import Sidebar from '../Navbar/Navbar';
import Banner from './Banner';
import Payments from './Payments';
import "./Styling.css";
import MemberList from './MemberList';

import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const logoutUser = async (router) => {
    try {
        const response = await fetch('https://scheme-purchase-backend.vercel.app/api/logout', {
            method: 'POST',
        });

        if (response.ok) {
            Cookies.remove('username'); // Clear the cookie
            localStorage.removeItem('tenantName');
            router.push("/"); // Redirect to login page
        } else {
            alert('Logout failed');
        }
    } catch (error) {
        console.error('Error logging out:', error);
        alert('An error occurred. Please try again.');
    }
};


const Dashboard = () => {
    const [isOpen, setIsOpen] = useState(true);
    const router = useRouter();

    const logout = () => {
        try {
            if (localStorage.getItem("tenantName")) {
                localStorage.removeItem("tenantName");
                alert("Logged Out!");
                router.push("/");
            } else {
                alert("Logout Failed");
            }
        } catch (error) {
            console.error("Error while logging out: ", error);
            alert("An error occurred while logging out, Please try again");
        }
    };

    useEffect(() => {
        if (!localStorage.getItem("tenantName")) {
            router.push("/");
        }
    }, [])

    return (
        <div className="flex w-full max-h-screen overflow-y-auto custom-scrollbar2 ">
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            <div className={`flex-1 w-full transition-all duration-300 ${isOpen ? 'ml-52' : 'ml-16'}`}>
                <div className='p-[20px] w-full flex flex-col gap-[10px]'>
                    {/* Header */}
                    <div className='max-h-full w-full flex justify-between items-center'>
                        <div className='flex gap-[5px] items-center justify-center'>
                            <h1 className='text-[16px] lg:text-[24px] text-[#182456] font-semibold px-[12px] border-8 border-[#52BD91] border-t-0 border-r-0 border-b-0 rounded-lg '>DASHBOARD</h1>
                        </div>

                        <div className='flex items-center justify-between gap-[15px]'>
                            <div className='h-[35px] w-[35px] bg-black rounded-full'></div>
                            <a href='/' onClick={logout} className='bg-[#172561] text-[#52BD91] py-[5px] px-[20px] rounded-md font-semibold'>Logout</a>
                        </div>
                    </div>

                    {/* Banner */}
                    <Banner />

                    {/* Payments */}
                    <Payments />

                    {/* Settlement, Duelist */}
                    <MemberList />
                </div>
            </div>
        </div>

    )
}

export default Dashboard
