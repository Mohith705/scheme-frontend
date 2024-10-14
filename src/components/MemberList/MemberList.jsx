"use client";

import Sidebar from '@/components/Navbar/Navbar';
import React, { useEffect, useState } from 'react';
import XLSX from "xlsx/dist/xlsx.full.min.js";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { useRouter } from 'next/navigation';

const MemberList = () => {

  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem("tenantName")) {
      router.push("/");
    }
  }, []);

  const [memberList, setMemberList] = useState([]);
  const [filteredMemberList, setFilteredMemberList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isOpen, setIsOpen] = useState(true);

  const [settled, setSettled] = useState(false);
  const [discontinue, setDiscontinue] = useState(false);

  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);

  const [searchSchemeName, setSearchSchemeName] = useState("");
  const [searchSchemeType, setSearchSchemeType] = useState("");
  const [searchMemberName, setSearchMemberName] = useState("");
  const [searchMobileNo, setSearchMobileNo] = useState("");
  const [searchCity, setSearchCity] = useState("");

  const [uniqueSchemeNames, setUniqueSchemeNames] = useState([]);
  const [uniqueSchemeTypes, setUniqueSchemeTypes] = useState([]);

  const headings = ["Sno", "Scheme Type", "Scheme Name", "Card No", "Member Name", "Contact No", "Location", "Joining Date"];

  const fetchMemberList = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (settled) params.append('settled', 'true');
      if (discontinue) params.append('discontinue', 'true');

      const response = await fetch(`https://scheme-purchase-backend.vercel.app/api/memberlist?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMemberList(data);

      // Extract unique values for SchemeName and SchemeType
      const schemeNames = [...new Set(data.map(item => item.SchemeName))];
      const schemeTypes = [...new Set(data.map(item => item.SchemeType))];

      setUniqueSchemeNames(schemeNames);
      setUniqueSchemeTypes(schemeTypes);

      filterData(data, fromDate, toDate, searchSchemeName, searchSchemeType, searchMemberName, searchMobileNo, searchCity);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberList();
  }, [settled, discontinue]);

  const filterData = (data, from, to, schemeName, schemeType, memberName, mobileNo, city) => {
    let filteredData = data;

    if (schemeName) {
      filteredData = filteredData.filter(member => member.SchemeName.toLowerCase().includes(schemeName.toLowerCase()));
    }
    if (schemeType) {
      filteredData = filteredData.filter(member => member.SchemeType.toLowerCase().includes(schemeType.toLowerCase()));
    }
    if (memberName) {
      filteredData = filteredData.filter(member => member.MemberName.toLowerCase().includes(memberName.toLowerCase()));
    }
    if (mobileNo) {
      filteredData = filteredData.filter(member => member.MobileNo.toLowerCase().includes(mobileNo.toLowerCase()));
    }
    if (city) {
      filteredData = filteredData.filter(member => member.City.toLowerCase().includes(city.toLowerCase()));
    }

    setFilteredMemberList(filteredData);
  };

  useEffect(() => {
    filterData(memberList, fromDate, toDate, searchSchemeName, searchSchemeType, searchMemberName, searchMobileNo, searchCity);
  }, [fromDate, toDate, searchSchemeName, searchSchemeType, searchMemberName, searchMobileNo, searchCity, memberList]);

  const handleSettledChange = () => {
    setSettled(!settled);
    if (!settled) {
      setDiscontinue(false);
    }
  };

  const handleDiscontinueChange = () => {
    setDiscontinue(!discontinue);
    if (!discontinue) {
      setSettled(false);
    }
  };

  return (
    <div className="flex w-full max-h-screen overflow-y-auto custom-scrollbar2">
      <div className={`w-full transition-all duration-300 p-[20px]`}>
        <div className='w-full flex flex-col gap-[10px]'>
          <div
            className="w-full h-full px-[15px] sm:px-[30px] lg:px-[25px] py-[10px] sm:py-[15px] lg:py-[15px] rounded-md flex items-center gap-[5px] sm:gap-[8px] lg:gap-[12px] mb-[10px]"
            style={{
              background:
                "linear-gradient(270deg, #0A0E16 5.64%, #182456 97.55%)",
            }}
          >
            <div className="basis-[60%] flex items-center justify-between w-full h-full">
              <h1 className="text-[#fff] text-[20px] sm:text-[24px] lg:text-[20px] font-semibold pl-[10px] border-l-8 rounded-s-md border-[#52BD91]">
                Member List
              </h1>
            </div>
          </div>

          <div className='w-full flex items-center justify-center'>
            <div className="flex gap-[10px] items-center justify-center">
              <label className='flex items-center justify-center gap-[5px] text-[20px] font-semibold'>
                <input type="checkbox" checked={settled} onChange={handleSettledChange} />
                Settled
              </label>
              <label className='flex items-center justify-center gap-[5px] text-[20px] font-semibold'>
                <input type="checkbox" checked={discontinue} onChange={handleDiscontinueChange} />
                Discontinue
              </label>
            </div>
          </div>

          <div className='w-full grid grid-cols-5 items-center justify-center gap-[10px] pt-[20px]'>

            <label>
              <select value={searchSchemeName} className='border w-full border-black focus:outline-none p-2' onChange={(e) => setSearchSchemeName(e.target.value)}>
                <option value="">Search Scheme Name</option>
                {uniqueSchemeNames.map((name, index) => (
                  <option key={index} value={name}>{name}</option>
                ))}
              </select>
            </label>
            <label>
              <select value={searchSchemeType} className='border w-full border-black focus:outline-none p-2' onChange={(e) => setSearchSchemeType(e.target.value)}>
                <option value="">Search Scheme Type</option>
                {uniqueSchemeTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </label>
            <label>

              <input type="text" className='border border-black w-full focus:outline-none p-2' placeholder='Search Member Name' value={searchMemberName} onChange={(e) => setSearchMemberName(e.target.value)} />
            </label>
            <label>

              <input type="text" className='border border-black w-full focus:outline-none p-2' placeholder='Search Mobile No' value={searchMobileNo} onChange={(e) => setSearchMobileNo(e.target.value)} />
            </label>
            <label>

              <input type="text" className='border border-black w-full focus:outline-none p-2' placeholder='Search City' value={searchCity} onChange={(e) => setSearchCity(e.target.value)} />
            </label>
          </div>



          <div className="w-full max-h-full overflow-y-auto custom-scrollbar2 py-[20px] text-[14px]">
            <table className="w-full table-auto text-center max-w-[1350px] mx-auto ">
              <thead className="w-full ">
                <tr className='bg-[#172561]'>
                  {headings.map((heading, index) => (
                    <th key={index} className="text-white p-2">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="w-full ">
                {filteredMemberList.map((type, index) => (
                  <tr key={index} className=" bg-[#EAFFF6] text-[#172561]">
                    <td className=" p-2">{index + 1}</td>
                    <td className=" p-2">{type?.SchemeType}</td>
                    <td className=" p-2">{type?.SchemeName}</td>
                    <td className=" p-2">{type?.CardNo}</td>
                    <td className=" p-2">{type?.MemberName}</td>
                    <td className=" p-2">{type?.MobileNo}</td>
                    <td className=" p-2">{type?.City}</td>
                    <td className=" p-2">{type?.JoinDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberList;
