"use client";

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaRegEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

const SchemeMember = () => {

    const router = useRouter();

    const [schemeTypes, setSchemeTypes] = useState([]);
    const [schemeNames, setSchemeNames] = useState([]);

    // Form Data
    const [schemeType, setSchemeType] = useState('');
    const [schemeName, setSchemeName] = useState('');
    const [memberName, setMemberName] = useState('');
    const [cardNo, setCardNo] = useState('');
    const [gender, setGender] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [pincode, setPincode] = useState(null);
    const [state, setState] = useState('');
    const [district, setDistrict] = useState('');
    const [landline, setLandline] = useState('');
    const [mobile1, setMobile1] = useState('');
    const [mobile2, setMobile2] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState('');
    const [anniversary, setAnniversary] = useState('');
    const [nominee, setNominee] = useState('');
    const [mobile, setMobile] = useState('');
    const [incharge, setIncharge] = useState('');
    const [joindate, setJoindate] = useState(new Date().toISOString().split("T")[0]);
    const [collectionPoint, setCollectionPoint] = useState('');

    const [schemeMembers, setSchemeMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nextDateToPay, setNextDateToPay] = useState('');

    const [editing, setEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const calculateDate = () => {
        if (joindate) {
            const date = new Date(joindate);
            date.setDate(date.getDate() + 30);
            setNextDateToPay(date.toISOString().split('T')[0]);
        }
    };

    useEffect(() => {
        calculateDate();
    }, [])

    useEffect(() => {
        const fetchSchemeMembers = async () => {
            try {
                const response = await fetch('https://scheme-purchase-backend.vercel.app/api/schememember/getmembers', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setSchemeMembers(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSchemeMembers();
    }, []);

    console.log(schemeMembers);

    const handleDelete = async (cardNo) => {
        try {
            const response = await fetch(`https://scheme-purchase-backend.vercel.app/api/schememember/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cardNo }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error);  // Show the error message
                return;
            }

            // Remove the deleted item from the state
            setSchemeMembers(schemeMembers.filter((type) => type.CardNo !== cardNo));
            alert('Scheme Member deleted successfully');

            // Reset state variables
            setSchemeType('');
            setSchemeName('');
            setMemberName('');
            setCardNo('');
            setGender('');
            setCity('');
            setAddress('');
            setPincode(null);
            setState('');
            setDistrict('');
            setLandline('');
            setMobile1('');
            setMobile2('');
            setEmail('');
            setDob('');
            setAnniversary('');
            setNominee('');
            setMobile('');
            setIncharge('');
            setJoindate(new Date().toISOString().split("T")[0]);
            setCollectionPoint('');
            setNextDateToPay('');
        } catch (error) {
            console.error('Error deleting scheme member:', error);
            alert('An error occurred while deleting the scheme member. Please try again.');
        }
    };

    const fetchData = async () => {
        try {
            const response = await fetch('https://scheme-purchase-backend.vercel.app/api/schemetype/gettypes');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();

            setSchemeTypes(data);

            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    };

    const fetchNames = async () => {
        try {
            const response = await fetch('https://scheme-purchase-backend.vercel.app/api/schemename/getnames');
            if (!response.ok) {
                throw new Error('Failed to fetch data in Scheme Names at member entry');
            }

            const data = await response.json();

            setSchemeNames(data);

            return data;
        } catch (error) {
            console.error('Error fetching data: ', error);
            return null;
        }
    }

    const handleEdit = (type) => {
        setEditing(true);
        setEditingId(type.id);
        setSchemeType(type.SchemeType);
        setSchemeName(type.SchemeName);
        setMemberName(type.MemberName);
        setCardNo(type.CardNo);
        setAddress(type.Address);
        setCity(type.City);
        setPincode(type.Pincode);
        setState(type.State);
        setDistrict(type.District);
        setLandline(type.LandLine);
        setMobile1(type.Mobile1);
        setMobile2(type.Mobile2);
        setEmail(type.Email);
        setDob(type.Dob);
        setAnniversary(type.Anniversary);
        setNominee(type.Nominee);
        setMobile(type.MobileNo);
        setIncharge(type.Incharge);
        setJoindate(type.JoinDate);
        setCollectionPoint(type.CollectionPoint);
    }

    const postSchemeMember = async () => {
        if (!schemeType || !schemeName || !memberName || !cardNo || !mobile || !dob) {
            alert("Please fill all the fields");
            return;
        }

        const data = {
            schemetype: schemeType,
            schemename: schemeName,
            membername: memberName,
            cardno: cardNo,
            gender: gender,
            city: city,
            address: address,
            pincode: parseFloat(pincode),
            state: state,
            district: district,
            landline: landline,
            mobile1: mobile1,
            mobile2: mobile2,
            email: email,
            dob: dob,
            anniversary: anniversary,
            nominee: nominee,
            mobileno: mobile,
            incharge: incharge,
            joindate: joindate,
            collectionpoint: collectionPoint,
            lastdatepaid: '',
            actualdatetopay: joindate,
            nextdatetopay: nextDateToPay
        }

        try {
            let response;
            if (editing) {
                response = await fetch("https://scheme-purchase-backend.vercel.app/api/schememember/update", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ ...data, id: editingId }),
                });
            } else {
                response = await fetch("https://scheme-purchase-backend.vercel.app/api/schememember/createmember", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });
            }

            if (!response.ok) {
                throw new Error("Network response is not ok in scheme member");
            }

            const ans = await response.json();
            alert(ans?.message);

            // Reset state variables
            setSchemeType('');
            setSchemeName('');
            setMemberName('');
            setCardNo('');
            setGender('');
            setCity('');
            setAddress('');
            setPincode(null);
            setState('');
            setDistrict('');
            setLandline('');
            setMobile1('');
            setMobile2('');
            setEmail('');
            setDob('');
            setAnniversary('');
            setNominee('');
            setMobile('');
            setIncharge('');
            setJoindate(new Date().toISOString().split("T")[0]);
            setCollectionPoint('');
            setNextDateToPay('');
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Unable to add");
        }
    };

    const generateCardNo = async () => {
        const response = await fetch('https://scheme-purchase-backend.vercel.app/api/schememember/generatecardno', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ schemeName }),
        });

        const data = await response.json();

        if (response.ok) {
            setCardNo(data.cardNo);
        } else {
            console.error(data.error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchNames();
    }, []);

    const inputRefs = {
        schemeType: useRef(null),
        joindate: useRef(null),
        schemeName: useRef(null),
        memberName: useRef(null),
        cardNo: useRef(null),
        male: useRef(null),
        female: useRef(null),
        city: useRef(null),
        address: useRef(null),
        pincode: useRef(null),
        state: useRef(null),
        district: useRef(null),
        incharge: useRef(null),
        landline: useRef(null),
        mobile1: useRef(null),
        mobile2: useRef(null),
        email: useRef(null),
        dob: useRef(null),
        anniversary: useRef(null),
        nominee: useRef(null),
        mobile: useRef(null),
        saveButton: useRef(null),
        cancelButton: useRef(null),
    };

    const handleKeyDown = (e, nextField) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (inputRefs[nextField]) {
                inputRefs[nextField].current.focus();
            }
        }
    };

    useEffect(() => {

    }, [schemeType, schemeName, memberName, cardNo, state, district, city, address, pincode, landline, mobile1, mobile2, email, dob, anniversary, nominee, mobile, incharge, joindate, collectionPoint])

    useEffect(() => {

    }, [cardNo])

    return (
        <div className='w-full min-h-screen' style={{ background: "url(/banner.png) lightgray 50% / cover no-repeat" }}>
            <div className='w-full h-full'>
                <div className="px-[10px] sm:px-[20px] lg:px-[40px] py-[5px] sm:py-[10px] lg:py-[15px]">
                    <div
                        className="w-full h-full px-[15px] sm:px-[30px] lg:px-[45px] py-[10px] sm:py-[15px] lg:py-[15px] rounded-md flex items-center gap-[10px] sm:gap-[15px] lg:gap-[20px]"
                        style={{
                            background:
                                "linear-gradient(270deg, #0A0E16 5.64%, #182456 97.55%)",
                        }}
                    >
                        <div className="basis-[60%] flex items-center justify-between w-full h-full">
                            <h1 className="flex-1 text-[#fff] text-[20px] sm:text-[24px] lg:text-[20px] font-semibold pl-[10px] border-l-8 rounded-s-md border-[#52BD91]">
                                Scheme Member
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="w-full pb-[10px] flex flex-col gap-[10px] sm:gap-[15px] lg:gap-[20px] items-center justify-center">
                    <div className="max-w-[1050px] bg-white w-full flex flex-col m-auto max-h-full border border-[#182456] rounded-xl overflow-hidden">
                        <div
                            className="w-full h-[80px] flex flex-col gap-[10px] sm:gap-[15px] lg:gap-[20px] items-center justify-center bg-center bg-no-repeat bg-cover"
                            style={{
                                background: "url(/receiptbanner.png)"
                            }}
                        >
                            {/* <div className="flex items-center justify-center gap-[2px] sm:gap-[4px] lg:gap-[6px]">
                                <img src="/tlogo.png" alt="" />
                                <img src="/textLogo.png" alt="" className="max-w-[170px]" />
                            </div> */}

                            <div className='flex w-full items-center justify-center gap-[20px] px-[20px]'>

                                <div className="basis-[33%] w-full flex items-center justify-center gap-[5px] sm:gap-[10px]">
                                    <p className="font-semibold text-[14px] sm:text-[16px] lg:text-[14px]">
                                        Scheme Type:
                                    </p>
                                    <select name="schemetype" value={schemeType} id="" className='p-[10px] sm:p-[5px] text-[14px] rounded-lg focus:outline-none border border-black' onChange={(e) => setSchemeType(e.target.value)} onKeyDown={(e) => handleKeyDown(e, 'joindate')}
                                        ref={inputRefs.schemeType}
                                    >
                                        <option value="">Select Scheme Type</option>
                                        {
                                            schemeTypes?.map((type) => (
                                                <option key={type?.id} value={type?.SchemeType}>{type?.SchemeType}</option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div className='basis-[33%] flex items-center justify-between'>
                                    <p className='basis-[50%] text-[14px] sm:text-[16px] lg:text-[14px] text-[#182456] font-semibold'>Joining Date</p>
                                    <input type='date' value={joindate} onChange={(e) => setJoindate(e.target.value)} id="" className=' w-full p-[5px] text-[14px] rounded-lg focus:outline-none border border-black' placeholder='Enter Join Date' onKeyDown={(e) => handleKeyDown(e, 'mobile')}
                                        ref={inputRefs.joindate}>
                                    </input>
                                </div>

                                <div className='basis-[33%] flex items-center justify-between'>
                                    <p className='basis-[40%] text-[14px] sm:text-[16px] lg:text-[14px] text-[#182456] font-semibold'>Mobile No</p>
                                    <input type='text' id="" value={mobile} onChange={(e) => setMobile(e.target.value)} onKeyDown={(e) => handleKeyDown(e, 'schemeName')}
                                        ref={inputRefs.mobile} className='basis-[60%] w-full p-[5px] text-[14px] rounded-lg focus:outline-none border border-black' placeholder='Enter Mobile No'>
                                    </input>
                                </div>

                            </div>

                        </div>

                        <div className='flex flex-col px-[20px] py-[20px] gap-[10px]'>
                            <div className='flex items-center justify-center gap-[20px]'>
                                <div className='basis-[40%] flex items-center justify-between'>
                                    <p className='basis-[30%] text-[14px] sm:text-[16px] lg:text-[14px] text-[#182456] font-semibold'>Scheme Name</p>
                                    <select value={schemeName} onChange={(e) => setSchemeName(e.target.value)} name="" id="" className='basis-[70%] w-full p-[5px] text-[14px] rounded-lg focus:outline-none border border-black' onKeyDown={(e) => handleKeyDown(e, 'memberName')}
                                        ref={inputRefs.schemeName}>
                                        <option value="">Select Name</option>
                                        {
                                            schemeNames?.map((type) => (
                                                <option key={type?.id} value={type?.SchemeName}>{type?.SchemeName}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className='basis-[20%] flex items-center justify-between'>
                                    <button onClick={generateCardNo} className='border border-black px-[20px] py-[5px] rounded-lg hover:bg-black bg-[#182456] text-white'>Generate Card No</button>
                                </div>
                                <div className='basis-[40%] flex items-center justify-start'>
                                    <p className='basis-[20%] text-[14px] sm:text-[16px] lg:text-[14px] text-[#182456] font-semibold'>Card No</p>
                                    <input type='text' value={cardNo}
                                        ref={inputRefs.cardNo} id="" className='basis-[80%] max-w-[120px] w-full p-[5px] text-[14px] rounded-lg focus:outline-none border border-black text-center bg-[#52BD91] text-white' placeholder='Enter Card No' onChange={(e) => setCardNo(e.target.value)} readOnly>
                                    </input>
                                </div>


                            </div>

                            <div className='flex items-center justify-center gap-[20px]'>

                                <div className='basis-[33%] flex items-center justify-between'>
                                    <p className='basis-[35%] text-[14px] sm:text-[16px] lg:text-[14px] text-[#182456] font-semibold'>Member Name</p>
                                    <input type='text' value={memberName} onKeyDown={(e) => handleKeyDown(e, 'city')}
                                        ref={inputRefs.memberName} id="" className='basis-[65%] w-full p-[5px] text-[14px] rounded-lg focus:outline-none border border-black' placeholder='Enter Member Name' onChange={(e) => setMemberName(e.target.value)}>
                                    </input>
                                </div>

                                <div className='basis-[33%] flex items-center justify-between'>
                                    <p className='basis-[30%] text-[14px] sm:text-[16px] lg:text-[14px] text-[#182456] font-semibold'>City</p>
                                    <input type='text' value={city} id="" className='basis-[70%] w-full p-[5px] text-[14px] rounded-lg focus:outline-none border border-black' placeholder='Enter City' onChange={(e) => setCity(e.target.value)} onKeyDown={(e) => handleKeyDown(e, 'address')}
                                        ref={inputRefs.city}>
                                    </input>
                                </div>

                                <div className='basis-[33%] flex items-center justify-between'>
                                    <p className='basis-[35%] text-[14px] sm:text-[16px] lg:text-[14px] text-[#182456] font-semibold'>Address</p>
                                    <textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)} onKeyDown={(e) => handleKeyDown(e, 'pincode')}
                                        ref={inputRefs.address} type='text' id="" className='basis-[65%] w-full p-[5px] text-[14px] rounded-lg focus:outline-none border border-black' placeholder='Enter Your Address'>
                                    </textarea>
                                </div>
                            </div>

                            <div className='flex items-center justify-center gap-[20px]'>
                                <div className='basis-[33%] flex items-center justify-between'>
                                    <p className='basis-[35%] text-[14px] sm:text-[16px] lg:text-[14px] text-[#182456] font-semibold'>Pincode</p>
                                    <input type='text' value={pincode} onChange={(e) => setPincode(e.target.value)} onKeyDown={(e) => handleKeyDown(e, 'district')}
                                        ref={inputRefs.pincode} id="" className='basis-[65%] w-full p-[5px] text-[14px] rounded-lg focus:outline-none border border-black' placeholder='Enter Pincode'>
                                    </input>
                                </div>
                                <div className='basis-[33%] flex items-center justify-between'>
                                    <p className='basis-[30%] text-[14px] sm:text-[16px] lg:text-[14px] text-[#182456] font-semibold'>District</p>
                                    <input type='text' id="" value={district} onChange={(e) => setDistrict(e.target.value)} onKeyDown={(e) => handleKeyDown(e, 'state')}
                                        ref={inputRefs.district} className='basis-[70%] w-full p-[5px] text-[14px] rounded-lg focus:outline-none border border-black' placeholder='Enter District'>
                                    </input>
                                </div>
                                <div className='basis-[33%] flex items-center justify-between'>
                                    <p className='basis-[35%] text-[14px] sm:text-[16px] lg:text-[14px] text-[#182456] font-semibold'>State</p>
                                    <input type='text' value={state} onChange={(e) => setState(e.target.value)} onKeyDown={(e) => handleKeyDown(e, 'incharge')}
                                        ref={inputRefs.state} id="" className='basis-[65%] w-full p-[5px] text-[14px] rounded-lg focus:outline-none border border-black' placeholder='Enter State'>
                                    </input>
                                </div>
                            </div>

                            <div className='flex items-center justify-center gap-[20px]'>
                                <div className='basis-[33%] flex items-center justify-between'>
                                    <p className='basis-[35%] text-[14px] sm:text-[16px] lg:text-[14px] text-[#182456] font-semibold'>Incharge</p>
                                    <input type='text' id="" value={incharge} onChange={(e) => setIncharge(e.target.value)} onKeyDown={(e) => handleKeyDown(e, 'landline')}
                                        ref={inputRefs.incharge} className='basis-[65%] w-full p-[5px] text-[14px] rounded-lg focus:outline-none border border-black' placeholder='Enter Incharge'>
                                    </input>
                                </div>
                                <div className='basis-[33%] flex items-center justify-between'>
                                    <p className='basis-[30%] text-[14px] sm:text-[16px] lg:text-[14px] text-[#182456] font-semibold'>Land No</p>
                                    <input type='text' value={landline} onChange={(e) => setLandline(e.target.value)} onKeyDown={(e) => handleKeyDown(e, 'mobile1')}
                                        ref={inputRefs.landline} id="" className='basis-[70%] w-full p-[5px] text-[14px] rounded-lg focus:outline-none border border-black' placeholder='Enter Land No'>
                                    </input>
                                </div>
                                <div className='basis-[33%] flex items-center justify-between'>
                                    <p className='basis-[35%] text-[14px] sm:text-[16px] lg:text-[14px] text-[#182456] font-semibold'>Mobile No1</p>
                                    <input type='text' id="" value={mobile1} onChange={(e) => setMobile1(e.target.value)} onKeyDown={(e) => handleKeyDown(e, 'mobile2')}
                                        ref={inputRefs.mobile1} className='basis-[65%] w-full p-[5px] text-[14px] rounded-lg focus:outline-none border border-black' placeholder='Enter Mobile No1'>
                                    </input>
                                </div>
                            </div>

                            <div className='flex items-center justify-center gap-[20px]'>
                                <div className='basis-[33%] flex items-center justify-between'>
                                    <p className='basis-[35%] text-[14px] sm:text-[16px] lg:text-[14px] text-[#182456] font-semibold'>Mobile No2</p>
                                    <input type='text' id="" value={mobile2} onKeyDown={(e) => handleKeyDown(e, 'email')}
                                        ref={inputRefs.mobile2} onChange={(e) => setMobile2(e.target.value)} className='basis-[65%] w-full p-[5px] text-[14px] rounded-lg focus:outline-none border border-black' placeholder='Enter Mobile No2'>
                                    </input>
                                </div>
                                <div className='basis-[33%] flex items-center justify-between'>
                                    <p className='basis-[30%] text-[14px] sm:text-[16px] lg:text-[14px] text-[#182456] font-semibold'>Email</p>
                                    <input type='email' id="" value={email} onKeyDown={(e) => handleKeyDown(e, 'dob')}
                                        ref={inputRefs.email} onChange={(e) => setEmail(e.target.value)} className='basis-[70%] w-full p-[5px] text-[14px] rounded-lg focus:outline-none border border-black' placeholder='Enter Email'>
                                    </input>
                                </div>
                                <div className='basis-[33%] flex items-center justify-between'>
                                    <p className='basis-[35%] text-[14px] sm:text-[16px] lg:text-[14px] text-[#182456] font-semibold'>DOB</p>
                                    <input type='date' id="" value={dob} onKeyDown={(e) => handleKeyDown(e, 'anniversary')}
                                        ref={inputRefs.dob} onChange={(e) => setDob(e.target.value)} className='basis-[65%] w-full p-[5px] text-[14px] rounded-lg focus:outline-none border border-black' placeholder='Enter Dob'>
                                    </input>
                                </div>
                            </div>

                            <div className='flex items-center justify-center gap-[20px]'>
                                <div className='basis-[33%] flex items-center justify-between'>
                                    <p className='basis-[35%] text-[14px] sm:text-[16px] lg:text-[14px] text-[#182456] font-semibold'>Anniversary</p>
                                    <input type='date' id="" value={anniversary} onKeyDown={(e) => handleKeyDown(e, 'nominee')}
                                        ref={inputRefs.anniversary} onChange={(e) => setAnniversary(e.target.value)} className='basis-[65%] w-full p-[5px] text-[14px] rounded-lg focus:outline-none border border-black' placeholder='Enter Anniversary'>
                                    </input>
                                </div>
                                <div className='basis-[33%] flex items-center justify-between'>
                                    <p className='basis-[30%] text-[14px] sm:text-[16px] lg:text-[14px] text-[#182456] font-semibold'>Nominee</p>
                                    <input type='text' id="" value={nominee} onChange={(e) => setNominee(e.target.value)} onKeyDown={(e) => handleKeyDown(e, 'male')}
                                        ref={inputRefs.nominee} className='basis-[70%] w-full p-[5px] text-[14px] rounded-lg focus:outline-none border border-black' placeholder='Enter Nominee'>
                                    </input>
                                </div>
                                <div className='basis-[33%] flex items-center justify-between text-[14px] sm:text-[16px] lg:text-[14px] text-[#182456] font-semibold'>
                                    <p className='basis-[35%] text-[14px] sm:text-[16px] lg:text-[14px] text-[#182456] font-semibold'>Gender</p>
                                    <div className="basis-[65%] flex items-center justify-center gap-[2px] sm:gap-[4px] lg:gap-[6px]">
                                        <input
                                            type="radio"
                                            name="male"
                                            id="male"
                                            value="Male"
                                            onKeyDown={(e) => handleKeyDown(e, 'female')}
                                            ref={inputRefs.male}
                                            onChange={(e) => setGender(e.target.value)}
                                        />
                                        <label htmlFor="male" className="font-semibold">
                                            Male
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-center gap-[2px] sm:gap-[4px] lg:gap-[6px]">
                                        <input
                                            type="radio"
                                            name="female"
                                            id="female"
                                            onKeyDown={(e) => handleKeyDown(e, 'saveButton')}
                                            ref={inputRefs.female}
                                            value="Female"
                                            onChange={(e) => setGender(e.target.value)}
                                        />
                                        <label htmlFor="female" className="font-semibold">
                                            Female
                                        </label>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="w-full flex items-center justify-center gap-[10px] sm:gap-[15px] lg:gap-[20px]">
                        <button onClick={() => postSchemeMember()}
                            onKeyDown={(e) => handleKeyDown(e, 'cancelButton')}
                            ref={inputRefs.saveButton}
                            className="px-[20px] w-[120px] sm:px-[30px] rounded-md py-[5px] sm:py-[5px] bg-[#52BD91] text-white font-semibold flex items-center justify-center cursor-pointer"
                        >
                            {editing ? "UPDATE" : "SAVE"}
                        </button>

                        <Link href={"/"}
                            ref={inputRefs.cancelButton} className="px-[20px] sm:px-[30px] w-[120px] rounded-md py-[5px] sm:py-[5px] bg-[#182456] text-white font-semibold flex items-center justify-center cursor-pointer">
                            CANCEL
                        </Link>
                    </div>
                </div>


                <div className="w-full max-h-full overflow-y-auto custom-scrollbar2 p-[20px]">
                    <table className="w-full table-auto text-center max-w-[1350px] mx-auto border border-black">
                        <thead className="w-full border border-black text-[12px] bg-[#4FC997]">
                            <tr>
                                <th className="border border-black p-1">ID</th>
                                <th className="border border-black p-1">Scheme Code</th>
                                <th className="border border-black p-1">Scheme Type</th>
                                <th className="border border-black p-1">Scheme Name</th>
                                <th className="border border-black p-1">Member Name</th>
                                <th className="border border-black p-1">Card No</th>
                                <th className="border border-black p-1">Mobile No</th>
                                <th className="border border-black p-1">DOB</th>
                                <th className="border border-black p-1">Anniversary</th>
                                <th className="border border-black p-1">Join Date</th>
                                <th className="border border-black p-1">Gender</th>
                                <th className="border border-black p-1">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="w-full border border-black">
                            {schemeMembers.map((type, index) => (
                                <tr key={type.id} className={`px-1 text-[12px] ${(index % 2 == 0) ? "bg-white" : "bg-gray-100"} font-medium`}>
                                    <td className="border border-black p-1">{type.id}</td>
                                    <td className="border border-black p-1">{type.SchemeCode}</td>
                                    <td className="border border-black p-1">{type.SchemeType}</td>
                                    <td className="border border-black p-1">{type.SchemeName}</td>
                                    <td className="border border-black p-1">{type.MemberName}</td>
                                    <td className="border border-black p-1">{type.CardNo}</td>
                                    <td className="border border-black p-1">{type.MobileNo}</td>
                                    <td className="border border-black p-1">{type.Dob}</td>
                                    <td className="border border-black p-1">{type.Anniversary}</td>
                                    <td className="border border-black p-1">{type.JoinDate}</td>
                                    <td className="border border-black p-1">{type.Gender}</td>
                                    <td className="border border-black p-1 text-[14px]">
                                        <button className="text-blue-700 " onClick={() => handleEdit(type)}><FaRegEdit /></button>
                                        <button className="text-red-700" onClick={() => handleDelete(type.CardNo)}><MdDelete /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default SchemeMember
