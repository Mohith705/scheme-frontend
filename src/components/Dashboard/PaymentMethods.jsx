"use client";

import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const PaymentMethods = () => {

    const [payments, setPayments] = useState({ cash: 0, card: 0, online: 0, upi: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await fetch('https://scheme-purchase-backend.vercel.app/api/receipt/fetchpayments');
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                const data = await response.json();
                setPayments(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    //if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error: {error}</p>;

    const formatRupees = (value) => {
        const roundedValue = parseFloat(value).toFixed(2);
        return roundedValue.includes('.') ? roundedValue : `${roundedValue}.00`;
    }

    return (
        <div>
            <div className=' w-full h-full flex flex-col gap-[3px] ' >
                <div className='w-full h-full rounded-xl px-[15px] py-[1px] flex justify-between items-center' style={{ background: "radial-gradient(35.46% 49.1% at 49.1% 50%, #EEF2FF 0%, #DAE2FF 100%)" }}>
                    <div className='flex flex-col items-start justify-start'>
                        <p className='text-[12px] font-normal'>Cash</p>
                        <p className='text-[16px] font-semibold'>₹ {formatRupees(payments?.cash)}</p>
                    </div>
                    <div className='w-[40px] h-[30px] relative'>
                        <Image src={"/cash.png"} alt='' fill className="object-contain" />
                    </div>
                </div>



                <div className='w-full h-full rounded-xl px-[15px] py-[1px] flex justify-between items-center' style={{ background: "radial-gradient(35.46% 49.1% at 49.1% 50%, #EEF2FF 0%, #DAE2FF 100%)" }}>
                    <div className='flex flex-col items-start justify-start'>
                        <p className='text-[12px] font-normal'>Card</p>
                        <p className='text-[16px] font-semibold'>₹ {formatRupees(payments?.card)}</p>
                    </div>
                    <div className='w-[40px] h-[30px] relative'>
                        <Image src={"/card.png"} alt='' fill className="object-contain" />
                    </div>
                </div>



                <div className='w-full h-full rounded-xl px-[15px] py-[1px] flex justify-between items-center' style={{ background: "radial-gradient(35.46% 49.1% at 49.1% 50%, #EEF2FF 0%, #DAE2FF 100%)" }}>
                    <div className='flex flex-col items-start justify-start'>
                        <p className='text-[12px] font-normal'>UPI</p>
                        <p className='text-[16px] font-semibold'>₹ {formatRupees(payments.upi)}</p>
                    </div>
                    <div className='w-[40px] h-[30px] relative'>
                        <Image src={"/upi.png"} alt='' fill className="object-contain" />
                    </div>
                </div>




                <div className='w-full h-full rounded-xl px-[15px] py-[1px] flex justify-between items-center' style={{ background: "radial-gradient(35.46% 49.1% at 49.1% 50%, #EEF2FF 0%, #DAE2FF 100%)" }}>
                    <div className='flex flex-col items-start justify-start'>
                        <p className='text-[12px] font-normal'>Online</p>
                        <p className='text-[16px] font-semibold'>₹ {formatRupees(payments.online)}</p>
                    </div>
                    <div className='w-[40px] h-[30px] relative'>
                        <Image src={"/online.png"} alt='' fill className="object-contain" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentMethods
