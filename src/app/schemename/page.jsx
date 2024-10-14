"use client";

import Sidebar from '@/components/Navbar/Navbar'
import SchemeName from '@/components/SchemeName/SchemeName'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Page = () => {

    const [isOpen, setIsOpen] = useState(true);

    const router = useRouter();
    useEffect(() => {
        if (!localStorage.getItem("tenantName")) {
            router.push("/");
        }
    }, [])

    return (

        <div className="flex w-full max-h-screen overflow-y-auto custom-scrollbar2 ">
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            <div className={`flex-1 w-full transition-all duration-300 ${isOpen ? 'ml-52' : 'ml-16'}`}>
                <div className='w-full flex flex-col gap-[10px]'>
                    <SchemeName />
                </div>
            </div>
        </div>

    )
}

export default Page
