import React from 'react'
import ReceiptsBarChart from '../Chart/Chart';
import TodayJoinings from './TodayJoinings';
import "./Styling.css";
import TodayReceipts from './TodayReceipts';

const Payments = () => {
    return (
        <div className='w-full max-h-full'>
            <div className='flex min-h-[180px] w-full h-full gap-[10px] lg:gap-[25px] xl:gap-[20px] items-start justify-start'>
                <div className='basis-[38%] mt-3 w-full h-full flex flex-col'>
                    <div className='w-full p-[5px] h-full overflow-hidden rounded-2xl bg-[#EEF2FF] relative -z-30'>
                        <ReceiptsBarChart />
                    </div>
                </div>

                <div className='basis-[60%] w-full min-h-[270px] max-h-[300px] rounded-lg p-[5px] h-full grid grid-cols-6 grid-rows-1 gap-[10px] items-center justify-center'>
                    <div className=' col-span-3 w-full h-full overflow-y-auto custom-scrollbar  border border-black rounded-lg '>
                        <TodayJoinings />
                    </div>
                    <div className=' col-span-3 mt-2 w-full h-full overflow-y-auto  border border-black rounded-lg'>
                        <TodayReceipts />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Payments;
