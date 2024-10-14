"use client";

import React, { useEffect, useState } from 'react'

const Duelist = () => {

    const [duelist, setDuelist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDuelist = async () => {
            try {
                const response = await fetch('https://scheme-purchase-backend.vercel.app/api/duelist');
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                const data = await response.json();
                setDuelist(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDuelist();
    }, []);

    // if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error: {error}</p>;

    return (
        <div className=''>
            <div className='flex justify-between items-center w-full overflow-x-auto bg-gray-200 p-[5px] px-[30px]'>
                <h2 className='text-center text-[14px] font-semibold'>Today Duelists</h2>
                <p className='text-[14px] font-semibold'>Total: {duelist?.length}</p>
            </div>
            <table className='w-full text-left text-[12px]'>
                <thead>
                    <tr className='px-1 bg-orange-400'>
                        {/* <th className='border py-2'>S.No</th> */}
                        <th className='border py-2 text-center'>Card No</th>
                        <th className='border py-2 text-center'>Member Name</th>
                        <th className='border py-2 text-center' style={{ width: "100px" }}>Scheme Name</th>
                        <th className='border py-2 text-center'>Dues</th>
                    </tr>
                </thead>
                <tbody>
                    {duelist.map((due, index) => (
                        <tr className={`px-1 text-[10px] ${(index % 2 == 0) ? "bg-white" : "bg-gray-100"}`} key={index}>
                            {/* <td className='border  py-1 font-medium text-center'>{index + 1}</td> */}
                            <td className='border  py-1 font-medium text-center'>{due.CardNo}</td>
                            <td className='border  py-1 font-medium'>{due.MemberName}</td>
                            <td className='border  py-1 font-medium' style={{ width: "100px" }}>{due.SchemeName}</td>
                            <td className='border  py-1 font-medium text-center'>{due.monthsDue}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Duelist
