"use client";

import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const CheckBox = () => {

    function getFormattedDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const date = getFormattedDate();

    const [birthdays, setBirthdays] = useState(null);
    const [anniversarys, setAnniversarys] = useState(null);

    const [todayCollection, setTodayCollection] = useState(null);
    const [todayReceipts, setTodayReceipts] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTotalSpecials = async () => {
            try {
                const response = await fetch('https://scheme-purchase-backend.vercel.app/api/schememember/fetchspecials');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setBirthdays(data.totalBirthdays);
                setAnniversarys(data.totalAnniversaries);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTotalSpecials();
    }, []);

    useEffect(() => {
        const fetchTotalAmount = async () => {
            try {
                const response = await fetch('https://scheme-purchase-backend.vercel.app/api/receipt/gettodayamount');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTodayCollection(data.totalAmount);
                setTodayReceipts(data.totalReceipts);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTotalAmount();
    }, []);

    // console.log(todayCollection);

    //if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error: {error}</p>;

    const formatRupees = (value) => {
        const roundedValue = parseFloat(value).toFixed(2);
        return roundedValue.includes('.') ? roundedValue : `${roundedValue}.00`;
    }

    const formatWeight = (value) => {
        const roundedValue = parseFloat(value).toFixed(3);
        return roundedValue.includes('.') ? roundedValue : `${roundedValue}.000`;
    }

    return (
        <div className='w-full max-h-[1000px]'>
            <div className='w-full h-full flex gap-[20px] justify-center items-start'>
                <div style={{ background: "radial-gradient(50% 50% at 50% 50%, #F9F9F9 81.83%, #F2F4FF 100%)" }} className='flex-1 w-full  rounded-2xl min-h-[180px] flex items-center justify-center relative overflow-hidden '>

                    <a href={"/"} className='flex-1 flex flex-col items-center justify-center w-full h-[60%] border border-[#000] border-t-0 border-l-0 border-b-0'>
                        <span className='flex flex-col items-center justify-center'>
                            <span className='w-[53px] h-[53px] flex items-center justify-center bg-[#D9D9D9] rounded-[50%]'>
                                <svg xmlns="https://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M18 9C18.7652 8.99996 19.5015 9.29233 20.0583 9.81728C20.615 10.3422 20.9501 11.0601 20.995 11.824L21 12V15C21 15.64 20.621 16.139 20.118 16.367L20 16.414V20C20.0002 20.5046 19.8096 20.9906 19.4665 21.3605C19.1234 21.7305 18.6532 21.9572 18.15 21.995L18 22H6C5.49542 22.0002 5.00943 21.8096 4.63945 21.4665C4.26947 21.1234 4.04284 20.6532 4.005 20.15L4 20V16.415C3.73003 16.321 3.49284 16.1512 3.31676 15.926C3.14067 15.7008 3.03314 15.4297 3.007 15.145L3 15V12C2.99996 11.2348 3.29233 10.4985 3.81728 9.94174C4.34224 9.38499 5.06011 9.04989 5.824 9.005L6 9H18ZM17.933 15.7C17.7779 15.5836 17.5922 15.5148 17.3987 15.502C17.2052 15.4892 17.0121 15.533 16.843 15.628L16.733 15.7L16.467 15.9C15.9763 16.2682 15.3845 16.4771 14.7713 16.4986C14.1582 16.5201 13.5533 16.353 13.038 16.02L12.867 15.9L12.6 15.7C12.4449 15.5836 12.2592 15.5148 12.0657 15.502C11.8722 15.4892 11.6791 15.533 11.51 15.628L11.4 15.7L11.133 15.9C10.6424 16.268 10.0508 16.4768 9.43784 16.4982C8.82492 16.5197 8.22015 16.3528 7.705 16.02L7.533 15.9L7.267 15.7C7.11187 15.5836 6.92623 15.5148 6.7327 15.502C6.53917 15.4892 6.3461 15.533 6.177 15.628L6.067 15.7L6 15.75V20H18V15.75L17.933 15.7ZM18 11H6C5.73478 11 5.48043 11.1054 5.29289 11.2929C5.10536 11.4804 5 11.7348 5 12V14.005C5.5166 13.6599 6.12759 13.4837 6.74862 13.5007C7.36965 13.5177 7.97008 13.7271 8.467 14.1L8.733 14.3C8.9061 14.4298 9.11663 14.5 9.333 14.5C9.54937 14.5 9.7599 14.4298 9.933 14.3L10.2 14.1C10.7193 13.7105 11.3509 13.5 12 13.5C12.6491 13.5 13.2807 13.7105 13.8 14.1L14.067 14.3C14.2401 14.4298 14.4506 14.5 14.667 14.5C14.8834 14.5 15.0939 14.4298 15.267 14.3L15.533 14.1C16.0299 13.7271 16.6304 13.5177 17.2514 13.5007C17.8724 13.4837 18.4834 13.6599 19 14.005V12C19 11.7348 18.8946 11.4804 18.7071 11.2929C18.5196 11.1054 18.2652 11 18 11ZM12.6 2.2C13.0134 2.52294 13.3972 2.88202 13.747 3.273C14.271 3.862 15 4.855 15 6C15 6.79565 14.6839 7.55871 14.1213 8.12132C13.5587 8.68393 12.7956 9 12 9C11.2044 9 10.4413 8.68393 9.87868 8.12132C9.31607 7.55871 9 6.79565 9 6C9 4.855 9.73 3.862 10.253 3.273C10.6028 2.88202 10.9866 2.52294 11.4 2.2C11.5731 2.07018 11.7836 2 12 2C12.2164 2 12.4269 2.07018 12.6 2.2ZM12 4.334C11.9131 4.42088 11.8287 4.51025 11.747 4.602C11.271 5.138 11 5.645 11 6C11 6.26522 11.1054 6.51957 11.2929 6.70711C11.4804 6.89464 11.7348 7 12 7C12.2652 7 12.5196 6.89464 12.7071 6.70711C12.8946 6.51957 13 6.26522 13 6C13 5.645 12.73 5.138 12.253 4.602C12.1713 4.51025 12.0869 4.42088 12 4.334Z" fill="#a2a832" />
                                </svg>
                            </span>
                            <p className='text-[14px] font-medium underline text-[#000]'>Birthdays</p>
                        </span>
                        <p className='text-[24px] font-semibold text-[#000]'>{birthdays}</p>
                        <span className='flex items-center justify-center w-full pt-[5px]'>
                            <a href={"/"} className='w-fit flex gap-[5px] px-[10px] mr-[5px] rounded-md items-center justify-center bg-[#52BD91]'>
                                <p className='text-[12px] text-black font-normal '>Check </p>
                                <svg xmlns="https://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none">
                                    <path d="M1 1L5 5L1 9" stroke="#F8F8F8" stroke-width="0.8" />
                                </svg>
                            </a>
                        </span>
                    </a>
                    <a href={"/"} className='flex-1 flex flex-col items-center justify-center w-full h-[60%] '>
                        <span className='flex flex-col items-center justify-center'>
                            <span className='w-[53px] h-[53px] flex items-center justify-center bg-[#D9D9D9] rounded-[50%]'>
                                <svg xmlns="https://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 18 18" fill="#FFC0CB">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M13 0C13.2449 3.23106e-05 13.4813 0.0899562 13.6644 0.252715C13.8474 0.415475 13.9643 0.639749 13.993 0.883L14 1V2H16C16.5046 1.99984 16.9906 2.19041 17.3605 2.5335C17.7305 2.87659 17.9572 3.34684 17.995 3.85L18 4V16C18.0002 16.5046 17.8096 16.9906 17.4665 17.3605C17.1234 17.7305 16.6532 17.9572 16.15 17.995L16 18H2C1.49542 18.0002 1.00943 17.8096 0.639452 17.4665C0.269471 17.1234 0.0428434 16.6532 0.00500021 16.15L1.00268e-07 16V4C-0.000159579 3.49542 0.190406 3.00943 0.533497 2.63945C0.876588 2.26947 1.34684 2.04284 1.85 2.005L2 2H4V1C4.00028 0.74512 4.09788 0.499968 4.27285 0.314632C4.44782 0.129296 4.68695 0.017765 4.94139 0.00282788C5.19584 -0.0121092 5.44638 0.0706746 5.64183 0.234265C5.83729 0.397855 5.9629 0.629904 5.993 0.883L6 1V2H12V1C12 0.734784 12.1054 0.48043 12.2929 0.292893C12.4804 0.105357 12.7348 0 13 0ZM16 4H2V16H16V4ZM12.166 5.876C13.278 6.524 14.032 7.818 13.999 9.298C13.958 11.134 12.589 12.642 10.561 13.898L10.315 14.047C9.912 14.287 9.485 14.555 9 14.555C8.636 14.555 8.305 14.405 7.992 14.227L7.685 14.047C5.522 12.762 4.044 11.207 4.001 9.298C3.968 7.818 4.722 6.524 5.834 5.876C6.788 5.32 7.969 5.269 9 5.913C10.03 5.269 11.212 5.32 12.166 5.876ZM11.159 7.604C10.78 7.384 10.329 7.358 9.881 7.74L9.77 7.845C9.58194 8.03473 9.33045 8.14834 9.06377 8.16403C8.79709 8.17971 8.53401 8.09637 8.325 7.93L8.23 7.845C7.746 7.355 7.251 7.365 6.841 7.605C6.38 7.873 5.983 8.475 6.001 9.253C6.018 10.033 6.619 11.033 8.469 12.183L8.707 12.327C8.804 12.385 8.901 12.444 9 12.499L9.147 12.414L9.293 12.327C11.329 11.117 11.981 10.065 11.999 9.253C12.017 8.475 11.62 7.873 11.159 7.604Z" fill="#a83297" />
                                </svg>
                            </span>
                            <p className='text-[14px] font-medium underline text-[#000]'>Anniversary</p>
                        </span>
                        <p className='text-[24px] font-semibold text-[#000]'>{anniversarys}</p>
                        <span className='flex items-center justify-center w-full pt-[5px]'>
                            <a href={"/"} className='w-fit flex gap-[5px] px-[10px] mr-[5px] rounded-md items-center justify-center bg-[#52BD91]'>
                                <p className='text-[12px] text-black font-normal'>Check </p>
                                <svg xmlns="https://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none">
                                    <path d="M1 1L5 5L1 9" stroke="#F8F8F8" stroke-width="0.8" />
                                </svg>
                            </a>
                        </span>
                    </a>

                </div>


                <div className='flex-1 max-h-[180px] w-full h-full flex flex-col rounded-xl overflow-hidden relative '>
                    {/* <div className='absolute top-0 left-0 z-20'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="53" height="67" viewBox="0 0 103 87" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M36.061 87C72.5118 87 102.061 57.4508 102.061 21C102.061 -15.4508 72.5118 -45 36.061 -45C-0.389759 -45 -29.939 -15.4508 -29.939 21C-29.939 57.4508 -0.389759 87 36.061 87ZM36.721 65.88C61.1431 65.88 80.941 46.082 80.941 21.66C80.941 -2.76203 61.1431 -22.56 36.721 -22.56C12.299 -22.56 -7.49896 -2.76203 -7.49896 21.66C-7.49896 46.082 12.299 65.88 36.721 65.88Z" fill="#fff" />
                        </svg>
                    </div> */}

                    <div className='absolute bottom-0 right-0 z-20'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="43" height="57" viewBox="0 0 77 101" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M66.061 132C102.512 132 132.061 102.451 132.061 66C132.061 29.5492 102.512 0 66.061 0C29.6102 0 0.0610352 29.5492 0.0610352 66C0.0610352 102.451 29.6102 132 66.061 132ZM66.721 110.88C91.1431 110.88 110.941 91.082 110.941 66.66C110.941 42.238 91.1431 22.44 66.721 22.44C42.299 22.44 22.501 42.238 22.501 66.66C22.501 91.082 42.299 110.88 66.721 110.88Z" fill="#fff" />
                        </svg>
                    </div>
                    <a href={"/"} style={{ background: "radial-gradient(35.46% 49.1% at 49.1% 50%, #EEF2FF 0%, #DAE2FF 100%)" }} className=' flex flex-col gap-[2px] py-[5px] px-[15px] relative'>

                        <span className='absolute top-0 right-0'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="33" viewBox="0 0 64 63" fill="none">
                                <path d="M32.3447 32.8125C29.9081 32.8125 27.5712 33.7805 25.8482 35.5035C24.1252 37.2264 23.1572 39.5633 23.1572 42C23.1572 44.4367 24.1252 46.7736 25.8482 48.4965C27.5712 50.2195 29.9081 51.1875 32.3447 51.1875C34.7814 51.1875 37.1183 50.2195 38.8413 48.4965C40.5643 46.7736 41.5322 44.4367 41.5322 42C41.5322 39.5633 40.5643 37.2264 38.8413 35.5035C37.1183 33.7805 34.7814 32.8125 32.3447 32.8125ZM28.4072 42C28.4072 40.9557 28.8221 39.9542 29.5605 39.2158C30.2989 38.4773 31.3004 38.0625 32.3447 38.0625C33.389 38.0625 34.3905 38.4773 35.129 39.2158C35.8674 39.9542 36.2822 40.9557 36.2822 42C36.2822 43.0443 35.8674 44.0458 35.129 44.7842C34.3905 45.5227 33.389 45.9375 32.3447 45.9375C31.3004 45.9375 30.2989 45.5227 29.5605 44.7842C28.8221 44.0458 28.4072 43.0443 28.4072 42Z" fill="black" />
                                <path d="M46.8505 13.4295L38.5056 1.72986L7.82198 26.2421L6.12098 26.2237V26.25H4.78223V57.75H59.9072V26.25H57.382L52.3577 11.5526L46.8505 13.4295ZM51.8354 26.25H25.5119L45.118 19.5667L49.1132 18.2884L51.8354 26.25ZM41.6635 15.1987L21.4247 22.0972L37.453 9.29248L41.6635 15.1987ZM10.0322 47.6936V36.3011C11.1397 35.9087 12.1456 35.274 12.9767 34.4434C13.8077 33.6128 14.4429 32.6072 14.836 31.5H49.8535C50.2464 32.6076 50.8815 33.6137 51.7125 34.4447C52.5436 35.2757 53.5496 35.9108 54.6572 36.3037V47.6962C53.5496 48.0891 52.5436 48.7242 51.7125 49.5553C50.8815 50.3863 50.2464 51.3923 49.8535 52.5H14.8412C14.448 51.3914 13.8121 50.3846 12.9802 49.5531C12.1482 48.7215 11.141 48.0863 10.0322 47.6936Z" fill="black" />
                            </svg>
                        </span>



                        <span className='flex gap-[3px] items-center justify-start'>

                            <p className='text-[14px] text-black font-semibold z-30 relative'>Todays Collection: </p>
                        </span>

                        <span>
                            <p className='text-[20px] text-black font-bold z-30 relative'>₹ {formatRupees(todayCollection)}</p>
                        </span>

                        <span className='flex items-center justify-end w-full pt-[5px]'>
                            <a href={"/"} className='w-fit flex gap-[5px] px-[10px] rounded-md items-center justify-end bg-[#52BD91]'>
                                <p className='text-[12px] text-black font-normal'>Check </p>
                                <svg xmlns="https://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none">
                                    <path d="M1 1L5 5L1 9" stroke="#F8F8F8" stroke-width="0.8" />
                                </svg>
                            </a>

                        </span>
                    </a>


                    <a href={"/"} style={{ background: "radial-gradient(35.46% 49.1% at 49.1% 50%, #EEF2FF 0%, #DAE2FF 100%)" }} className=' flex flex-col gap-[2px] py-[5px] px-[15px]  relative'>
                        <span className='absolute top-0 right-0 z-30'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="33" viewBox="0 0 64 63" fill="none">
                                <path d="M45.4697 21H13.9697M45.4697 21C46.1659 21 46.8336 21.2766 47.3259 21.7688C47.8182 22.2611 48.0947 22.9288 48.0947 23.625V30.45M45.4697 21L34.9697 10.5M13.9697 21C13.2735 21 12.6059 21.2766 12.1136 21.7688C11.6213 22.2611 11.3447 22.9288 11.3447 23.625V49.875C11.3447 50.5712 11.6213 51.2389 12.1136 51.7312C12.6059 52.2234 13.2735 52.5 13.9697 52.5H45.4697C46.1659 52.5 46.8336 52.2234 47.3259 51.7312C47.8182 51.2389 48.0947 50.5712 48.0947 49.875V43.05M13.9697 21L24.4697 10.5L34.9697 21M50.7197 31.5H40.2197C38.8273 31.5 37.492 32.0531 36.5074 33.0377C35.5229 34.0223 34.9697 35.3576 34.9697 36.75C34.9697 38.1424 35.5229 39.4777 36.5074 40.4623C37.492 41.4469 38.8273 42 40.2197 42H50.7197C51.4159 42 52.0836 41.7234 52.5759 41.2312C53.0682 40.7389 53.3447 40.0712 53.3447 39.375V34.125C53.3447 33.4288 53.0682 32.7611 52.5759 32.2688C52.0836 31.7766 51.4159 31.5 50.7197 31.5Z" stroke="black" stroke-width="5.25" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </span>
                        <span className='flex gap-[3px] items-center justify-start'>


                            <p className='text-[14px] text-black font-semibold z-30 relative'>Todays Receipts: </p>
                        </span>

                        <span>
                            <p className='text-[20px] text-black font-bold z-30 relative'>{todayReceipts}</p>
                        </span>

                        <span className='flex items-center justify-end w-full pt-[5px] z-30 relative'>
                            <a href={"/"} className='w-fit flex gap-[5px] px-[10px] rounded-md items-center justify-end bg-[#52BD91]'>
                                <p className='text-[12px] text-black font-normal'>Check </p>
                                <svg xmlns="https://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none">
                                    <path d="M1 1L5 5L1 9" stroke="#F8F8F8" stroke-width="0.8" />
                                </svg>
                            </a>

                        </span>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default CheckBox
