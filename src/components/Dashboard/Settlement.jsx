"use client";

import React, { useEffect, useState } from 'react'

const Settlement = () => {

    const [settled, setSettled] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDuelist = async () => {
            try {
                const response = await fetch('https://scheme-purchase-backend.vercel.app/api/memberdiscontinue/todaysettlements');
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                const data = await response.json();
                setSettled(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDuelist();
    }, []);

    //if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error: {error}</p>;

    return (
        <div className=''>
            <div className='flex justify-between items-center w-full p-[5px] bg-gray-200 px-[30px]'>
                <h2 className='text-center text-[14px] font-semibold'>Today Settlements</h2>
                <p className='text-[14px] font-semibold'>Total: {settled?.length}</p>
            </div>
            <table className='w-full text-left text-[12px]'>
                <thead>
                    <tr className='px-1 bg-[#4FC997]'>
                        {/* <th className='border py-2'>S.No</th> */}
                        <th className='border py-2 text-center'>Card No</th>
                        <th className='border py-2 text-center'>Scheme Type</th>
                        <th className='border py-2 text-center'  style={{ width: "100px" }}>Scheme Name</th>
                        <th className='border py-2 text-center'>Voucher No</th>
                    </tr>
                </thead>
                <tbody>
                    {settled.map((set, index) => (
                        <tr className={`px-1 text-[10px] ${(index % 2 == 0) ? "bg-white" : "bg-gray-100"}`} key={index}>
                            {/* <td className='border  py-2'>{index + 1}</td> */}
                            <td className='border  py-1 text-center'>{set.CardNo}</td>
                            <td className='border  py-1'>{set.SchemeType}</td>
                            <td className='border  py-1' style={{ width: "100px" }}>{set.SchemeName}</td>
                            <td className='border  py-1 text-center'>{set.VoucherNo}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Settlement
