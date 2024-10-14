"use client";

import React, { useEffect, useState } from 'react'
import "./Styling.css";

const MemberDiscontinue = () => {

    const currentDate = new Date().toISOString().split('T')[0];

    // Set initial state with current date
    const [selectedDate, setSelectedDate] = useState(currentDate);
    const [memberData, setMemberData] = useState({});
    const [CardNo, setCardNo] = useState('');
    const [schemetype, setSchemeType] = useState('');
    const [schemename, setSchemeName] = useState('');
    const [schemeAmount, setSchemeAmount] = useState('');
    const [paidamount, setPaidAmount] = useState('');
    const [balanceamount, setBalanceAmount] = useState('');
    const [goldwt, setGoldWt] = useState('');
    const [goldamt, setGoldAmt] = useState(77);
    const [settled, setSettled] = useState(false);
    const [discontinue, setDiscontinue] = useState(true);
    const [description, setDescription] = useState('');
    const [voucherNo, setVoucherNo] = useState('');

    useEffect(() => {
        const fetchNextVoucherNumber = async () => {
            try {
                const response = await fetch('https://scheme-purchase-backend.vercel.app/api/memberdiscontinue/generatevoucherno');
                if (!response.ok) {
                    throw new Error('Failed to fetch the next voucher number');
                }
                const data = await response.json();
                setVoucherNo(data.nextSettlementNumber);
            } catch (error) {
                console.error('Error fetching the next voucher number:', error);
            }
        };

        fetchNextVoucherNumber();
    }, []);

    const fetchMemberDiscontinue = async (cardno) => {
        try {
            const response = await fetch("https://scheme-purchase-backend.vercel.app/api/memberdiscontinue/getmember", {
                method: "POST",
                body: JSON.stringify({
                    cardno: cardno,
                }),
            });
            const data = await response.json();
            setMemberData(data);
        } catch (e) {
            console.error(e);
        }
    };

    const pushDiscontinueMember = async (cardno) => {
        if (!voucherNo) {
            alert('Voucher number is required');
            return;
        }

        try {
            const response = await fetch("https://scheme-purchase-backend.vercel.app/api/memberdiscontinue/postmember", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cardno: cardno,
                    schemeamount: schemeAmount,
                    paidamount: paidamount,
                    balanceamount: balanceamount,
                    goldwt: goldwt,
                    goldamt: goldamt,
                    settled: settled,
                    discontinue: discontinue,
                    description: description,
                    date: selectedDate,
                    voucherNo: voucherNo,
                    membername: memberData?.member?.MemberName,
                    mobileno: memberData?.member?.MobileNo,
                })
            });

            if (!response.ok) {
                throw new Error('Network response is not ok');
            }

            const ans = await response.json();
            alert(ans?.message);

            // Reset all the state variables to their initial values
            setSchemeAmount('');
            setPaidAmount('');
            setBalanceAmount('');
            setGoldWt('');
            setGoldAmt('');
            setSettled(false);
            setDiscontinue(true);
            setDescription('');
            setSelectedDate(currentDate); // Reset to the current date
            setVoucherNo('');
            setMemberData({ member: { MemberName: '', MobileNo: '' } });
            setCardNo('');
            setSchemeType('');
            setSchemeName('');

        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        if (memberData?.member) {
            setSchemeType(memberData.member.SchemeType || '');
            // setSchemeCode(memberData.member.SchemeCode || '');
            setSchemeName(memberData.member.SchemeName || '');
            setSchemeAmount(memberData.scheme?.SchemeAmount || '');

            const totalPaid = memberData.receipt?.reduce((acc, item) => acc + item.Amount, 0) || 0;
            setPaidAmount(totalPaid);

            const totalGoldWt = memberData.receipt?.reduce((acc, item) => acc + item.GoldWt, 0) || 0;
            setGoldWt(totalGoldWt);

            const schemeAmt = memberData.scheme?.SchemeAmount || 0;
            setBalanceAmount(schemeAmt - totalPaid);
        }
    }, [memberData]);

    return (
        <div className='w-full max-h-[98vh] overflow-auto custom-scrollbar2'>
            <div className='w-full h-full flex flex-col'>
                <div className='px-[10px] sm:px-[20px] lg:px-[20px] py-[5px] sm:py-[10px] lg:py-[10px]'>
                    <div className='w-full h-full px-[15px] sm:px-[30px] lg:px-[45px] py-[10px] sm:py-[10px] lg:py-[10px] rounded-md flex items-center gap-[10px] sm:gap-[15px] lg:gap-[20px]' style={{ background: "linear-gradient(270deg, #0A0E16 5.64%, #182456 97.55%)" }}>
                        <div className='basis-[60%] flex items-center justify-between w-full h-full'>
                            <h1 className='flex-1 text-[#fff] text-[20px] sm:text-[24px] lg:text-[20px] font-semibold pl-[10px] border-l-8 rounded-s-md border-[#52BD91]'>Member Discontinue</h1>

                            <div className='flex-1 flex items-center text-center justify-center gap-[3px] sm:gap-[6px] lg:gap-[9px]'>
                                <p className='text-white text-[14px] sm:text-[15px] lg:text-[14px] font-semibold'>Gold Rate</p>
                                {/* <p className='text-[#52BD91] text-[16px] sm:text-[17px] lg:text-[18px] font-bold'>24-25</p> */}
                                <div className='h-[30px] max-w-[130px] rounded-md w-full px-[5px] sm:px-[10px] lg:px-[15px] bg-white'></div>
                            </div>
                        </div>
                        {/* <div className='basis-[40%] w-full h-full flex items-center gap-[10px] sm:gap-[20px] lg:gap-[30px]'>
                            <div className='grid grid-cols-3 w-full h-full items-center justify-center gap-[5px] sm:gap-[8px] lg:gap-[12px]'>

                                <div className='cursor-pointer h-[45px] w-full px-[5px] sm:px-[10px] lg:px-[15px] flex items-center justify-center gap-[5px] bg-[#52BD91] rounded-md'>
                                    <p className='text-white font-bold'>SHOW</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="17" viewBox="0 0 19 17" fill="none">
                                        <mask id="mask0_215_507" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="0" y="0" width="19" height="17">
                                            <path d="M7.78768 2.88939L5.90308 1.22913C5.73645 1.08242 5.51049 1 5.27488 1C5.03927 1 4.8133 1.08242 4.64667 1.22913L2.13342 3.44268C2.05088 3.51536 1.98539 3.60164 1.94072 3.69661C1.89604 3.79158 1.87305 3.89337 1.87305 3.99617C1.87305 4.09896 1.89604 4.20076 1.94072 4.29572C1.98539 4.39069 2.05088 4.47698 2.13342 4.54965L4.01847 6.20952M11.7235 13.7783L13.6081 15.4386C13.6906 15.5113 13.7886 15.569 13.8964 15.6083C14.0042 15.6477 14.1198 15.6679 14.2365 15.6679C14.3532 15.6679 14.4688 15.6477 14.5766 15.6083C14.6845 15.569 14.7824 15.5113 14.8649 15.4386L17.3782 13.225C17.5448 13.0783 17.6384 12.8793 17.6384 12.6717C17.6384 12.4642 17.5448 12.2652 17.3782 12.1185L15.4932 10.4582" stroke="white" stroke-width="1.56518" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M17.3876 3.8258L14.8744 1.6123C14.5274 1.30668 13.9648 1.30668 13.6178 1.6123L1.68016 12.1264C1.33316 12.432 1.33316 12.9275 1.68016 13.2331L4.19335 15.4466C4.54035 15.7523 5.10294 15.7523 5.44994 15.4466L17.3876 4.93254C17.7346 4.62692 17.7346 4.13142 17.3876 3.8258Z" fill="white" stroke="white" stroke-width="1.56518" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M9.53405 9.31209C10.0248 9.31209 10.4226 8.96172 10.4226 8.52951C10.4226 8.09729 10.0248 7.74692 9.53405 7.74692C9.04332 7.74692 8.64551 8.09729 8.64551 8.52951C8.64551 8.96172 9.04332 9.31209 9.53405 9.31209Z" fill="black" />
                                            <path d="M7.75671 10.8773C8.24744 10.8773 8.64526 10.5269 8.64526 10.0947C8.64526 9.66248 8.24744 9.3121 7.75671 9.3121C7.26598 9.3121 6.86816 9.66248 6.86816 10.0947C6.86816 10.5269 7.26598 10.8773 7.75671 10.8773Z" fill="black" />
                                            <path d="M11.3114 7.74691C11.8021 7.74691 12.1999 7.39653 12.1999 6.96432C12.1999 6.53211 11.8021 6.18173 11.3114 6.18173C10.8207 6.18173 10.4229 6.53211 10.4229 6.96432C10.4229 7.39653 10.8207 7.74691 11.3114 7.74691Z" fill="black" />
                                        </mask>
                                        <g mask="url(#mask0_215_507)">
                                            <path d="M-1.13086 -2H20.1942V16.7821H-1.13086V-2Z" fill="white" />
                                        </g>
                                    </svg>
                                </div>


                                <div className='cursor-pointer h-[45px] w-full px-[5px] sm:px-[10px] lg:px-[15px] flex items-center justify-center gap-[5px] bg-[#52BD91] rounded-md'>
                                    <p className='text-white font-bold'>PRINT</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" viewBox="0 0 18 16" fill="none">
                                        <path d="M7.08775 2.57143V2.85714H10.3317V2.57143C10.3317 2.19255 10.1608 1.82919 9.85666 1.56128C9.55248 1.29337 9.13992 1.14286 8.70974 1.14286C8.27956 1.14286 7.867 1.29337 7.56282 1.56128C7.25864 1.82919 7.08775 2.19255 7.08775 2.57143ZM5.79016 2.85714V2.57143C5.79016 1.88944 6.09776 1.23539 6.64529 0.753154C7.19281 0.270918 7.93542 0 8.70974 0C9.48407 0 10.2267 0.270918 10.7742 0.753154C11.3217 1.23539 11.6293 1.88944 11.6293 2.57143V2.85714H16.4953C16.6674 2.85714 16.8324 2.91735 16.9541 3.02451C17.0757 3.13167 17.1441 3.27702 17.1441 3.42857C17.1441 3.58012 17.0757 3.72547 16.9541 3.83263C16.8324 3.9398 16.6674 4 16.4953 4H15.5169L14.2894 13.4674C14.1989 14.1647 13.8202 14.8082 13.2255 15.2753C12.6308 15.7424 11.8617 16.0003 11.0649 16H6.35461C5.5578 16.0003 4.78872 15.7424 4.19402 15.2753C3.59933 14.8082 3.22061 14.1647 3.13009 13.4674L1.90257 4H0.924187C0.752115 4 0.587092 3.9398 0.465419 3.83263C0.343746 3.72547 0.275391 3.58012 0.275391 3.42857C0.275391 3.27702 0.343746 3.13167 0.465419 3.02451C0.587092 2.91735 0.752115 2.85714 0.924187 2.85714H5.79016ZM7.41215 6.57143C7.41215 6.41988 7.3438 6.27453 7.22212 6.16737C7.10045 6.0602 6.93543 6 6.76335 6C6.59128 6 6.42626 6.0602 6.30459 6.16737C6.18291 6.27453 6.11456 6.41988 6.11456 6.57143V12.2857C6.11456 12.4373 6.18291 12.5826 6.30459 12.6898C6.42626 12.7969 6.59128 12.8571 6.76335 12.8571C6.93543 12.8571 7.10045 12.7969 7.22212 12.6898C7.3438 12.5826 7.41215 12.4373 7.41215 12.2857V6.57143ZM10.6561 6C10.4841 6 10.319 6.0602 10.1974 6.16737C10.0757 6.27453 10.0073 6.41988 10.0073 6.57143V12.2857C10.0073 12.4373 10.0757 12.5826 10.1974 12.6898C10.319 12.7969 10.4841 12.8571 10.6561 12.8571C10.8282 12.8571 10.9932 12.7969 11.1149 12.6898C11.2366 12.5826 11.3049 12.4373 11.3049 12.2857V6.57143C11.3049 6.41988 11.2366 6.27453 11.1149 6.16737C10.9932 6.0602 10.8282 6 10.6561 6Z" fill="#F8F8F8" />
                                    </svg>
                                </div>

                                <div className='cursor-pointer h-[45px] w-full px-[5px] sm:px-[10px] lg:px-[15px] flex items-center justify-center gap-[5px] bg-[#52BD91] rounded-md'>
                                    <p className='text-white font-bold'>EXIT</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="18" viewBox="0 0 21 18" fill="none">
                                        <path d="M10.3875 1.875C10.7263 1.875 11.0512 1.99353 11.2907 2.2045C11.5303 2.41548 11.6649 2.70163 11.6649 3C11.6649 3.29837 11.5303 3.58452 11.2907 3.7955C11.0512 4.00647 10.7263 4.125 10.3875 4.125H6.12982C6.0169 4.125 5.9086 4.16451 5.82876 4.23484C5.74891 4.30516 5.70405 4.40054 5.70405 4.5V13.5C5.70405 13.5995 5.74891 13.6948 5.82876 13.7652C5.9086 13.8355 6.0169 13.875 6.12982 13.875H9.96178C10.3005 13.875 10.6254 13.9935 10.865 14.2045C11.1045 14.4155 11.2391 14.7016 11.2391 15C11.2391 15.2984 11.1045 15.5845 10.865 15.7955C10.6254 16.0065 10.3005 16.125 9.96178 16.125H6.12982C5.33937 16.125 4.58129 15.8484 4.02236 15.3562C3.46342 14.8639 3.14941 14.1962 3.14941 13.5V4.5C3.14941 3.80381 3.46342 3.13613 4.02236 2.64384C4.58129 2.15156 5.33937 1.875 6.12982 1.875H10.3875ZM15.5479 6.0825L17.9569 8.205C18.1961 8.41594 18.3305 8.70187 18.3305 9C18.3305 9.29813 18.1961 9.58406 17.9569 9.795L15.5488 11.9175C15.3091 12.1285 14.9841 12.2471 14.6453 12.2471C14.3064 12.2471 13.9814 12.1285 13.7418 11.9175C13.5022 11.7065 13.3675 11.4202 13.3675 11.1217C13.3675 10.8233 13.5022 10.537 13.7418 10.326L13.97 10.125H10.3875C10.0488 10.125 9.72389 10.0065 9.48435 9.7955C9.2448 9.58452 9.11023 9.29837 9.11023 9C9.11023 8.70163 9.2448 8.41548 9.48435 8.2045C9.72389 7.99353 10.0488 7.875 10.3875 7.875H13.97L13.7418 7.674C13.6232 7.5695 13.5291 7.44545 13.465 7.30894C13.4008 7.17242 13.3678 7.02611 13.3678 6.87836C13.3679 6.73061 13.401 6.58431 13.4652 6.44782C13.5294 6.31134 13.6236 6.18733 13.7422 6.08288C13.8609 5.97843 14.0017 5.89558 14.1567 5.83907C14.3117 5.78256 14.4778 5.75349 14.6456 5.75353C14.8133 5.75356 14.9794 5.7827 15.1344 5.83927C15.2894 5.89585 15.4302 5.97875 15.5488 6.08325L15.5479 6.0825Z" fill="white" />
                                    </svg>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>

                <div className='px-[10px] sm:px-[20px] lg:px-[20px] py-[5px] sm:py-[10px] lg:py-[5px] w-full max-h-full flex gap-[10px] sm:gap-[15px] lg:gap-[20px]'>
                    <div className='basis-[75%] w-full flex flex-col gap-[5px] sm:gap-[10px] lg:gap-[15px]'>
                        <div className='flex items-center justify-center w-full gap-[5px] sm:gap-[10px] lg:gap-[15px]'>
                            <div className='basis-[40%] w-full flex items-center justify-between'>
                                <p className='text-[12px] sm:text-[14px] lg:text-[14px] text-[#182456] font-semibold'>Card No</p>
                                <input
                                    type="text"
                                    value={CardNo}
                                    className="h-full py-[2px] focus:outline-none text-[14px] rounded-md border border-[#000] px-[5px] sm:px-[10px] lg:px-[15px]"
                                    onChange={(e) => setCardNo(e.target.value)}
                                />
                            </div>
                            <button
                                className="basis-[10%] h-full py-[2px] border text-[14px] rounded-md cursor-pointer border-black flex items-center justify-center hover:bg-blue-400"
                                onClick={() => fetchMemberDiscontinue(CardNo)}
                            >
                                Submit
                            </button>
                            <div className='basis-[60%] flex w-full items-center justify-center gap-[15px] sm:gap-[20px] lg:gap-[25px]'>
                                {/* <div className='flex items-center justify-center gap-[3px] sm:gap-[5px] lg:gap-[7px]'>
                                    <input type="checkbox" name="receiptpaid" id="" />
                                    <label htmlFor="receiptpaid" className='text-[14px] sm:text-[16px] lg:text-[18px] font-semibold text-[#000]'>Receipt Paid</label>
                                </div>
                                <div className='flex items-center justify-center gap-[3px] sm:gap-[5px] lg:gap-[7px]'>
                                    <label htmlFor="droppers" className='text-[14px] sm:text-[16px] lg:text-[18px] font-semibold text-[#000]'>Droppers</label>
                                    <input type="checkbox" name="droppers" id="" />
                                </div> */}

                                <div className='flex items-center justify-center gap-[3px] sm:gap-[6px] lg:gap-[9px]'>
                                    {/* <p className='text-white text-[14px] sm:text-[15px] lg:text-[16px] font-semibold'>Gold Rate</p> */}
                                    <div className='flex items-center justify-center gap-[3px] sm:gap-[5px] lg:gap-[7px]'>
                                        <label htmlFor="voucherNo" className='text-[14px] sm:text-[16px] lg:text-[16px] font-semibold text-[#000]'>Voucher No</label>
                                        <input type="text" id="voucherNo" value={voucherNo} readOnly className='w-[100px] h-[30px] focus:outline-none rounded-lg border border-[#000] px-[5px] sm:px-[10px] lg:px-[15px]' />
                                    </div>
                                </div>

                                <div className='flex items-center justify-start text-start gap-[5px] sm:gap-[7px] lg:gap-[10px]'>
                                    <p className='flex-1 text-[12px] sm:text-[14px] text-[#182456] font-semibold'>Date</p>
                                    <div className='flex-1'>
                                        <input type="date" className='w-full h-[30px] focus:outline-none rounded-lg border border-[#000] px-[5px] sm:px-[10px] lg:px-[15px]' value={selectedDate} readOnly />
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className='w-full grid grid-cols-2 gap-[7px] sm:gap-[14px] lg:gap-[20px]'>
                            <div className='w-full flex items-center justify-between gap-[5px] sm:gap-[7px] lg:gap-[10px]'>
                                <p className='basis-[30%] text-[12px] sm:text-[14px] lg:text-[12px] text-[#182456] font-semibold'>Scheme Type</p>
                                <div className='basis-[70%]'>
                                    <input type="text" value={memberData?.member?.SchemeType} className='w-full h-full py-[2px] focus:outline-none rounded-md border border-[#000] text-[14px] px-[5px] sm:px-[10px] lg:px-[15px]' readOnly />
                                </div>
                            </div>
                            {/* <div className='w-full flex items-center justify-between gap-[5px] sm:gap-[7px] lg:gap-[10px]'>
                                <p className='basis-[35%] text-[12px] sm:text-[14px] lg:text-[14px] text-[#182456] font-semibold'>Scheme Group</p>
                                <div className='basis-[65%]'>
                                    <input type="text" value={memberData?.member?.SchemeCode} className='w-full h-[30px] focus:outline-none rounded-lg border border-[#000] text-[14px] px-[5px] sm:px-[10px] lg:px-[15px]' readOnly />
                                </div>
                            </div> */}
                            <div className='w-full flex items-center justify-between gap-[5px] sm:gap-[7px] lg:gap-[10px]'>
                                <p className='basis-[30%] text-[12px] sm:text-[14px] lg:text-[12px] text-[#182456] font-semibold'>Scheme Name</p>
                                <div className='basis-[70%]'>
                                    <input type="text" value={memberData?.member?.SchemeName} className='w-full h-full py-[2px] focus:outline-none rounded-md border border-[#000] text-[14px] px-[5px] sm:px-[10px] lg:px-[15px]' readOnly />
                                </div>
                            </div>
                        </div>


                        <div className='w-full my-[10px] sm:my-[15px] lg:my-[20px] max-h-[350px] overflow-auto custom-scrollbar2'>
                            <table className='table-auto w-full text-[12px] sm:text-[14px] h-full'>
                                <tr className='bg-[#172561] text-white'>
                                    <th className='py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]'>Sno</th>
                                    <th className='py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]'>Month</th>
                                    <th className='py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]'>Rec No</th>
                                    <th className='py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]'>Rec Date</th>
                                    <th className='py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]'>Rec Amount</th>
                                    <th className='py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]'>Gold Wt</th>
                                    <th className='py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]'>Gold(1 Gram)</th>
                                    <th className='py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]'>Mode Of Pay</th>
                                    <th className='py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]'>Balance</th>
                                </tr>
                                {
                                    memberData?.receipt?.map((item, index) => (
                                        <tr key={index} className={`text-[#172561] ${(index % 2 == 0) ? "bg-white" : "bg-[#EAFFF6]"}`} >
                                            <th className='py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]'>{index + 1}</th>
                                            <th className='py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]'>{memberData?.member?.JoinDate &&
                                                (() => {
                                                    const joinDate = new Date(
                                                        memberData?.member?.JoinDate
                                                    );
                                                    joinDate.setMonth(joinDate.getMonth() + index);
                                                    const formattedDate = `${joinDate.getDate()}-${joinDate.getMonth() + 1
                                                        }-${joinDate.getFullYear()}`;
                                                    return formattedDate;
                                                })()}</th>
                                            <th className='py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]'>{item?.ReceiptNo}</th>
                                            <th className='py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]'>{item.ReceiptDate}</th>
                                            <th className='py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]'>{item.Amount}</th>
                                            <th className='py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]'>{item.GoldWt}</th>
                                            <th className='py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]'>{item.GoldAmount}</th>
                                            <th className='py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]'>{item.PaymentMode}</th>
                                            <th className='py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]'>-</th>
                                        </tr>
                                    ))
                                }
                                {Array.from({
                                    length:
                                        (memberData?.scheme?.SchemeDuration || 0) -
                                        (Object.keys(memberData?.receipt || {})?.length || 0),
                                }).map((_, index) => (
                                    <>
                                        <tr className={`px-1 text-[12px] text-[#172561] ${(index % 2 == 0) ? "bg-white" : "bg-[#EAFFF6]"}`}>
                                            <th className="py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]">
                                                {(Object.keys(memberData?.receipt || {})?.length || 0) +
                                                    index +
                                                    1}
                                            </th>
                                            <th className="py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]">
                                                {memberData?.member?.JoinDate &&
                                                    (() => {
                                                        const joinDate = new Date(
                                                            memberData?.member?.JoinDate
                                                        );
                                                        joinDate.setMonth(
                                                            joinDate.getMonth() +
                                                            (Object.keys(memberData?.receipt || {})
                                                                ?.length || 0) +
                                                            index
                                                        );
                                                        const formattedDate = `${joinDate.getDate()}-${joinDate.getMonth() + 1}-${joinDate.getFullYear()}`;
                                                        return formattedDate;
                                                    })()}
                                            </th>
                                            <th className="py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]">
                                                -
                                            </th>
                                            <th className="py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]">
                                                -
                                            </th>
                                            <th className="py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]">
                                                -
                                            </th>
                                            <th className="py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]">
                                                -
                                            </th>
                                            <th className="py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]">
                                                -
                                            </th>
                                            <th className="py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]">
                                                -
                                            </th>
                                            <th className="py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]">
                                                {memberData?.scheme?.SchemeAmount}
                                            </th>
                                        </tr>
                                    </>
                                ))}
                            </table>
                        </div>


                        <div className='w-full grid grid-cols-4 gap-[7px] sm:gap-[14px] lg:gap-[20px]'>
                            <div className='w-full flex items-center justify-center gap-[5px] sm:gap-[7px] lg:gap-[10px]'>
                                <p className='flex-1 text-[12px] sm:text-[14px] text-[#182456] font-semibold'>Scheme Amount</p>
                                <div className='flex-1'>
                                    <input type="text" className='w-full h-full py-[2px] focus:outline-none rounded-md border border-[#000] px-[5px] sm:px-[10px] lg:px-[15px]' value={
                                        (memberData &&
                                            memberData.receipt &&
                                            Object.keys(memberData.receipt).length) *
                                        (memberData &&
                                            memberData.scheme &&
                                            memberData.scheme.SchemeAmount)
                                    } readOnly />
                                </div>
                            </div>
                            <div className='w-full flex items-center justify-center gap-[5px] sm:gap-[7px] lg:gap-[10px]'>
                                <p className='flex-1 text-[12px] sm:text-[14px] text-[#182456] font-semibold'>Total Paid</p>
                                <div className='flex-1'>
                                    <input type="number" className='w-full h-full py-[2px] focus:outline-none rounded-md border border-[#000] px-[5px] sm:px-[10px] lg:px-[15px]' value={
                                        memberData?.receipt?.reduce(
                                            (accumulator, currentItem) =>
                                                accumulator + currentItem.Amount,
                                            0
                                        ) || []
                                    } readOnly />
                                </div>
                            </div>
                            <div className='w-full flex items-center justify-center gap-[5px] sm:gap-[7px] lg:gap-[10px]'>
                                <p className='flex-1 text-[12px] sm:text-[14px] text-[#182456] font-semibold'>Bal Amount</p>
                                <div className='flex-1'>
                                    <input type="number" className='w-full h-full py-[2px] focus:outline-none rounded-md border border-[#000] px-[5px] sm:px-[10px] lg:px-[15px]' value={
                                        (memberData &&
                                            memberData.receipt &&
                                            Object.keys(memberData.receipt).length) *
                                        (memberData &&
                                            memberData.scheme &&
                                            memberData.scheme.SchemeAmount) -
                                        (memberData?.receipt?.reduce(
                                            (accumulator, currentItem) =>
                                                accumulator + currentItem.Amount,
                                            0
                                        ) || [])
                                    } readOnly />
                                </div>
                            </div>
                            <div className='w-full flex items-center justify-center gap-[5px] sm:gap-[7px] lg:gap-[10px]'>
                                <p className='flex-1 text-[12px] sm:text-[12px] text-[#182456] font-semibold'>Tot.GoldWT</p>
                                <div className='flex-1'>
                                    <input type="number" className='w-full h-full py-[2px] focus:outline-none rounded-lg border border-[#000] px-[5px] sm:px-[10px] lg:px-[15px]' value={
                                        memberData?.receipt?.reduce(
                                            (accumulator, currentItem) =>
                                                accumulator + currentItem.GoldWt,
                                            0
                                        ) || []
                                    } readOnly />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='basis-[25%] border-l-2 border-black flex flex-col gap-[10px] sm:gap-[13px] lg:gap-[7px]'>
                        <div className='flex flex-col gap-[2px] sm:gap-[4px] lg:gap-[6px]'>

                            <div className='flex flex-col gap-[3px] sm:gap-[5px] lg:gap-[7px] px-[10px]'>
                                <div className='w-full flex flex-col items-center justify-start gap-[4px] sm:gap-[7px] lg:gap-[7px]'>

                                    <div style={{ background: "radial-gradient(35.46% 49.1% at 49.1% 50%, #EEF2FF 0%, #DAE2FF 100%)" }} className="rounded-md flex flex-row items-center justify-between gap-[5px] border-gray-500 h-full w-full p-[4px]">
                                        <p className="text-[12px] font-semibold">Member Name:</p>
                                        <p className="text-[12px]">{memberData?.member?.MemberName}</p>
                                    </div>

                                    <div style={{ background: "radial-gradient(35.46% 49.1% at 49.1% 50%, #EEF2FF 0%, #DAE2FF 100%)" }} className="rounded-md flex flex-row items-center justify-between gap-[5px] border-gray-500 h-full w-full p-[4px]">
                                        <p className="text-[12px] font-semibold">Address:</p>
                                        <p className="text-[12px]">{memberData?.member?.Address}</p>
                                    </div>

                                    <div style={{ background: "radial-gradient(35.46% 49.1% at 49.1% 50%, #EEF2FF 0%, #DAE2FF 100%)" }} className="rounded-md flex flex-row items-center justify-between gap-[5px] border-gray-500 h-full w-full p-[4px]">
                                        <p className="text-[12px] font-semibold">Mobile No:</p>
                                        <p className="text-[12px]">{memberData?.member?.MobileNo}</p>
                                    </div>

                                    {/* <div className='w-full flex items-center justify-center gap-[5px] sm:gap-[7px] lg:gap-[10px]'>
                                        <p className='flex-1 text-[12px] sm:text-[14px] text-[#182456] font-semibold'>Member Name</p>
                                        <div className='flex-1'>
                                            <input type="text"
                                                value={memberData?.member?.MemberName} readOnly
                                                className='w-full h-[30px] focus:outline-none rounded-lg border border-[#000] px-[5px] sm:px-[10px] lg:px-[15px]' />
                                        </div>
                                    </div>
                                    <div className='w-full flex items-center justify-center gap-[5px] sm:gap-[7px] lg:gap-[7px]'>
                                        <p className='flex-1 text-[12px] sm:text-[14px] text-[#182456] font-semibold'>Address</p>
                                        <div className='flex-1'>
                                            <textarea value={memberData?.member?.Address} readOnly name="" id="" cols="14" rows="2" className='rounded-lg focus:outline-none border border-black px-[5px] sm:px-[10px]'></textarea>
                                            
                                        </div>
                                    </div>
                                    <div className='w-full flex items-center justify-center gap-[5px] sm:gap-[7px] lg:gap-[7px]'>
                                        <p className='flex-1 text-[12px] sm:text-[14px] text-[#182456] font-semibold'>Mobile No</p>
                                        <div className='flex-1'>
                                            <input type="text"
                                                value={memberData?.member?.MobileNo} readOnly className='w-full h-[30px] focus:outline-none rounded-lg border border-[#000] px-[5px] sm:px-[10px] lg:px-[15px]' />
                                        </div>
                                    </div> */}
                                    {/* <div className='w-full flex items-center justify-center gap-[5px] sm:gap-[7px] lg:gap-[10px]'>
                                        <p className='flex-1 text-[12px] sm:text-[14px] text-[#182456] font-semibold'>Mobile No2</p>
                                        <div className='flex-1'>
                                            <input type="text" value={memberData?.member?.Mobile2} readOnly className='w-full h-[30px] focus:outline-none rounded-lg border border-[#000] px-[5px] sm:px-[10px] lg:px-[15px]' />
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                            {/* <div className='flex items-center justify-center gap-[3px] sm:gap-[5px] lg:gap-[7px]'>
                                <label htmlFor="droppers" className='text-[14px] sm:text-[16px] lg:text-[18px] font-semibold text-[#FABBFF]'>Droppers</label>
                                <input type="checkbox" name="droppers" id="" />
                            </div> */}
                        </div>

                        <div className='flex flex-col gap-[3px] sm:gap-[5px] lg:gap-[5px] px-[10px]'>
                            <h1 className='text-[14px] sm:text-[14px] lg:text-[14px] underline font-bold text-[#182456]'>Scheme Details</h1>
                            <div className='w-full flex flex-col items-center justify-start gap-[4px] sm:gap-[7px] lg:gap-[10px]'>

                                <div style={{ background: "radial-gradient(35.46% 49.1% at 49.1% 50%, #EEF2FF 0%, #DAE2FF 100%)" }} className="rounded-md flex flex-row items-center justify-between gap-[5px] border-gray-500 h-full w-full p-[4px]">
                                    <p className="text-[12px] font-semibold">No. Of Months:</p>
                                    <p className="text-[12px]">{memberData?.scheme?.SchemeDuration}</p>
                                </div>

                                <div style={{ background: "radial-gradient(35.46% 49.1% at 49.1% 50%, #EEF2FF 0%, #DAE2FF 100%)" }} className="rounded-md flex flex-row items-center justify-between gap-[5px] border-gray-500 h-full w-full p-[4px]">
                                    <p className="text-[12px] font-semibold">Scheme Join Date:</p>
                                    <p className="text-[12px]">{memberData?.member?.JoinDate}</p>
                                </div>

                                <div style={{ background: "radial-gradient(35.46% 49.1% at 49.1% 50%, #EEF2FF 0%, #DAE2FF 100%)" }} className="rounded-md flex flex-row items-center justify-between gap-[5px] border-gray-500 h-full w-full p-[4px]">
                                    <p className="text-[12px] font-semibold">Amount:</p>
                                    <p className="text-[12px]">{memberData?.scheme?.SchemeAmount}</p>
                                </div>

                                <div style={{ background: "radial-gradient(35.46% 49.1% at 49.1% 50%, #EEF2FF 0%, #DAE2FF 100%)" }} className="rounded-md flex flex-row items-center justify-between gap-[5px] border-gray-500 h-full w-full p-[4px]">
                                    <p className="text-[12px] font-semibold">Scheme Value:</p>
                                    <p className="text-[12px]">{memberData?.scheme?.SchemeValue}</p>
                                </div>

                                <div style={{ background: "radial-gradient(35.46% 49.1% at 49.1% 50%, #EEF2FF 0%, #DAE2FF 100%)" }} className="rounded-md flex flex-row items-center justify-between gap-[5px] border-gray-500 h-full w-full p-[4px]">
                                    <p className="text-[12px] font-semibold">Total Scheme Amount:</p>
                                    <p className="text-[12px]">{memberData?.scheme?.SchemeAmount + memberData?.scheme?.BonusAmount}</p>
                                </div>

                                {/* <div className='w-full flex items-center justify-center gap-[5px] sm:gap-[7px] lg:gap-[10px]'>
                                    <p className='flex-1 text-[12px] sm:text-[14px] text-[#182456] font-semibold'>No. of Months</p>
                                    <div className='flex-1'>
                                        <input value={memberData?.scheme?.SchemeDuration} readOnly type="text" className='w-full h-[30px] focus:outline-none rounded-lg border border-[#000] px-[5px] sm:px-[10px] lg:px-[15px]' />
                                    </div>
                                </div>
                                <div className='w-full flex items-center justify-center gap-[5px] sm:gap-[7px] lg:gap-[10px]'>
                                    <p className='flex-1 text-[12px] sm:text-[14px] text-[#182456] font-semibold'>Scheme Join Date</p>
                                    <div className='flex-1'>
                                        <input value={memberData?.member?.JoinDate} readOnly type="date" className='w-full h-[30px] focus:outline-none rounded-lg border border-[#000] px-[5px] sm:px-[10px] lg:px-[15px]' />
                                    </div>
                                </div>
                                <div className='w-full flex items-center justify-center gap-[5px] sm:gap-[7px] lg:gap-[10px]'>
                                    <p className='flex-1 text-[12px] sm:text-[14px] text-[#182456] font-semibold'>Amount</p>
                                    <div className='flex-1'>
                                        <input value={memberData?.scheme?.SchemeAmount} readOnly type="text" className='w-full h-[30px] focus:outline-none rounded-lg border border-[#000] px-[5px] sm:px-[10px] lg:px-[15px]' />
                                    </div>
                                </div> */}
                                {/* <div className='w-full flex items-center justify-center gap-[5px] sm:gap-[7px] lg:gap-[10px]'>
                                    <p className='flex-1 text-[12px] sm:text-[14px] text-[#182456] font-semibold'>Scheme Value</p>
                                    <div className='flex-1'>
                                        <input value={memberData?.scheme?.SchemeValue} readOnly type="text" className='w-full h-[30px] focus:outline-none rounded-lg border border-[#000] px-[5px] sm:px-[10px] lg:px-[15px]' />
                                    </div>
                                </div>
                                <div className='w-full flex items-center justify-center gap-[5px] sm:gap-[7px] lg:gap-[10px]'>
                                    <p className='flex-1 text-[12px] sm:text-[14px] text-[#182456] font-semibold'>Total Scheme Amount</p>
                                    <div className='flex-1'>
                                        <input readOnly value={memberData?.scheme?.SchemeAmount + memberData?.scheme?.BonusAmount} type="text" className='w-full h-[30px] focus:outline-none rounded-lg border border-[#000] px-[5px] sm:px-[10px] lg:px-[15px]' />
                                    </div>
                                </div> */}
                            </div>
                        </div>

                        <div className='flex flex-col gap-[3px] sm:gap-[5px] lg:gap-[7px] px-[10px]'>
                            <h1 className='text-[14px] sm:text-[14px] lg:text-[14px] underline font-bold text-[#182456]'>Pending Dues</h1>
                            <div className='w-full flex flex-col items-center justify-start gap-[4px] sm:gap-[7px] lg:gap-[10px]'>

                                <div style={{ background: "radial-gradient(35.46% 49.1% at 49.1% 50%, #EEF2FF 0%, #DAE2FF 100%)" }} className="rounded-md flex flex-row items-center justify-between gap-[5px] border-gray-500 h-full w-full p-[4px]">
                                    <p className="text-[12px] font-semibold">Pending Dues:</p>
                                    <p className="text-[12px]">{memberData?.scheme?.SchemeDuration - memberData?.receipt?.length}</p>
                                </div>

                                <div style={{ background: "radial-gradient(35.46% 49.1% at 49.1% 50%, #EEF2FF 0%, #DAE2FF 100%)" }} className="rounded-md flex flex-row items-center justify-between gap-[5px] border-gray-500 h-full w-full p-[4px]">
                                    <p className="text-[12px] font-semibold">Balance Months:</p>
                                    <p className="text-[12px]">{memberData?.scheme?.SchemeDuration - memberData?.receipt?.length}</p>
                                </div>

                                {/* <div className='w-full flex items-center justify-center gap-[5px] sm:gap-[7px] lg:gap-[10px]'>
                                    <p className='flex-1 text-[12px] sm:text-[14px] text-[#182456] font-semibold'>Pending Dues</p>
                                    <div className='flex-1'>
                                        <input readOnly value={memberData?.scheme?.SchemeDuration - memberData?.receipt?.length} type="text" className='w-full h-[30px] focus:outline-none rounded-lg border border-[#000] px-[5px] sm:px-[10px] lg:px-[15px]' />
                                    </div>
                                </div>
                                <div className='w-full flex items-center justify-center gap-[5px] sm:gap-[7px] lg:gap-[10px]'>
                                    <p className='flex-1 text-[12px] sm:text-[14px] text-[#182456] font-semibold'>Balance Months</p>
                                    <div className='flex-1'>
                                        <input type="text" readOnly value={memberData?.scheme?.SchemeDuration - memberData?.receipt?.length} className='w-full h-[30px] focus:outline-none rounded-lg border border-[#000] px-[5px] sm:px-[10px] lg:px-[15px]' />
                                    </div>
                                </div> */}
                            </div>
                        </div>

                        <div className='flex flex-col gap-[3px] sm:gap-[5px] lg:gap-[7px] px-[10px]'>
                            {/* <h1 className='text-[14px] sm:text-[17px] lg:text-[20px] font-semibold text-[#182456]'>Settlement Detail </h1> */}

                            <div className='w-full flex flex-col items-center justify-start gap-[4px] sm:gap-[7px] lg:gap-[7px]'>
                                <div className='flex items-center justify-center gap-[3px] sm:gap-[5px] lg:gap-[7px]'>
                                    <input type="checkbox" name="droppers" id="" />
                                    <label htmlFor="droppers" onClick={() => { setSettled(false); setDiscontinue(true) }} className='text-[18px] sm:text-[22px] lg:text-[20px] font-semibold text-[#000]'>Discontinue</label>
                                </div>
                                <div className='w-full flex items-center justify-center gap-[5px] sm:gap-[7px] lg:gap-[10px]'>
                                    <p className='basis-[30%] text-[12px] sm:text-[14px] text-[#182456] font-semibold'>Cause</p>
                                    <div className='basis-[70%]'>
                                        <textarea name="" id="" value={description} onChange={(e) => setDescription(e.target.value)} cols="15" rows="10" className='w-full h-[30px] focus:outline-none rounded-lg border border-[#000] px-[5px] sm:px-[10px] lg:px-[15px]'></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='flex w-full items-center justify-center gap-[3px] sm:gap-[5px] lg:gap-[7px]'>
                            <button onClick={() => pushDiscontinueMember(CardNo)} type="submit" className='bg-[#172561] rounded-md text-[12px] sm:text-[14px] font-bold px-[15px] sm:px-[20px] lg:px-[25px] py-[5px] sm:py-[5px] text-white '>SAVE</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MemberDiscontinue
