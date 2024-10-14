"use client";

import Sidebar from '@/components/Navbar/Navbar';
import React, { useEffect, useState } from 'react';
import XLSX from "xlsx/dist/xlsx.full.min.js";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { useRouter } from 'next/navigation';

const DueList = () => {

  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem("tenantName")) {
      router.push("/");
    }
  }, [])

  const [duelist, setDuelist] = useState([]);
  const [filteredDuelist, setFilteredDuelist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isOpen, setIsOpen] = useState(true);

  // State variables for filters
  const [schemeType, setSchemeType] = useState('');
  const [schemeName, setSchemeName] = useState('');
  const [cardNo, setCardNo] = useState('');
  const [memberName, setMemberName] = useState('');
  const [mobileNo, setMobileNo] = useState('');

  const headings = ["Sno", "Scheme Type", "Scheme Name", "Card No", "Member Name", "Contact No", "Due Months"];

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredDuelist);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "DueList.xlsx");
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF("l", "pt");

    const tableData = filteredDuelist.map((type, index) => [
      index + 1,
      type.SchemeType,
      type.SchemeName,
      type.CardNo,
      type.MemberName,
      type.MobileNo,
      type.monthsDue
    ]);

    const tableHeaders = headings.map((heading) => ({ title: heading }));

    const header = "Due List";
    const printDate = "Print Date & Time: " + new Date().toLocaleString();

    doc.setFont("bold");
    const headerWidth = doc.getTextDimensions(header).w;
    const headerX = (doc.internal.pageSize.width - headerWidth) / 2;
    const headerY = 15;
    doc.text(header, headerX, headerY);
    doc.setLineWidth(0.5);
    doc.line(headerX, headerY + 2, headerX + headerWidth, headerY + 2);

    doc.setFont("normal");
    doc.text(printDate, 45, 65);

    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
      theme: "plain",
      startY: 80,
      styles: {
        lineWidth: 0.3,
        lineColor: [0, 0, 0],
      },
      didDrawPage: function (data) {
        var str = "Page " + doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(
          str,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
      },
    });

    doc.save("Due List.pdf");
  };

  useEffect(() => {
    const fetchDuelist = async () => {
      try {
        const response = await fetch('https://scheme-purchase-backend.vercel.app/api/duelist', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setDuelist(data);
        setFilteredDuelist(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDuelist();
  }, []);

  useEffect(() => {
    let filteredData = duelist;

    if (schemeType) {
      filteredData = filteredData.filter((item) => item.SchemeType === schemeType);
    }
    if (schemeName) {
      filteredData = filteredData.filter((item) => item.SchemeName === schemeName);
    }
    if (cardNo) {
      filteredData = filteredData.filter((item) => item.CardNo.includes(cardNo));
    }
    if (memberName) {
      filteredData = filteredData.filter((item) => item.MemberName.includes(memberName));
    }
    if (mobileNo) {
      filteredData = filteredData.filter((item) => item.MobileNo.includes(mobileNo));
    }

    setFilteredDuelist(filteredData);
  }, [schemeType, schemeName, cardNo, memberName, mobileNo, duelist]);

  return (
    <div className="flex w-full max-h-screen overflow-y-auto custom-scrollbar2">
      <div className={`flex-1 w-full transition-all duration-300 p-[20px]`}>
        <div className="w-full flex flex-col gap-[10px]">




          <div
            className="w-full h-full px-[15px] sm:px-[30px] lg:px-[25px] py-[10px] sm:py-[15px] lg:py-[15px] rounded-md flex items-center gap-[5px] sm:gap-[8px] lg:gap-[12px] mb-[10px]"
            style={{
              background:
                "linear-gradient(270deg, #0A0E16 5.64%, #182456 97.55%)",
            }}
          >
            <div className="basis-[60%] flex items-center justify-between w-full h-full">
              <h1 className="text-[#fff] text-[20px] sm:text-[24px] lg:text-[20px] font-semibold pl-[10px] border-l-8 rounded-s-md border-[#52BD91]">
                Due List
              </h1>
            </div>
          </div>



          <div className='w-full grid grid-cols-5 items-center justify-center gap-[10px] pt-[20px]'>
            <select onChange={(e) => setSchemeType(e.target.value)} value={schemeType} className='border border-black focus:outline-none p-2'>
              <option value="">Select Scheme Type</option>
              {[...new Set(duelist.map(item => item.SchemeType))].map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
            <select onChange={(e) => setSchemeName(e.target.value)} value={schemeName} className='border border-black focus:outline-none p-2'>
              <option value="">Select Scheme Name</option>
              {[...new Set(duelist.map(item => item.SchemeName))].map((name, index) => (
                <option key={index} value={name}>{name}</option>
              ))}
            </select>
            <input type="text" placeholder="Search Card No" value={cardNo} className='border border-black focus:outline-none p-2' onChange={(e) => setCardNo(e.target.value)} />
            <input type="text" placeholder="Search Member Name" value={memberName} className='border border-black focus:outline-none p-2' onChange={(e) => setMemberName(e.target.value)} />
            <input type="text" placeholder="Search Mobile No" value={mobileNo} className='border border-black focus:outline-none p-2' onChange={(e) => setMobileNo(e.target.value)} />
          </div>



          <div className="w-full max-h-full overflow-y-auto custom-scrollbar2 py-[20px]">
            <table className="w-full table-auto text-center max-w-[1350px] mx-auto  text-[14px]">
              <thead className="w-full ">
                <tr className='bg-[#172561]'>
                  {headings.map((heading, index) => (
                    <th key={index} className="text-white  p-2">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="w-full ">
                {filteredDuelist.map((type, index) => (
                  <tr key={type.id} className=" bg-[#EAFFF6] text-[#172561]">
                    <td className=" p-2">{index + 1}</td>
                    <td className=" p-2">{type.SchemeType}</td>
                    <td className=" p-2">{type.SchemeName}</td>
                    <td className=" p-2">{type.CardNo}</td>
                    <td className=" p-2">{type.MemberName}</td>
                    <td className=" p-2">{type.MobileNo}</td>
                    <td className=" p-2">{type.monthsDue}</td>
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

export default DueList;































// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import "./Styling.css";

// const MemberDiscontinue = () => {
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);

//   useEffect(() => {
//     fetch("https://scheme-purchase-backend.vercel.app/api/duelist")
//       .then((res) => res.json())
//       .then((data) => {
//         setData(data);
//         setFilteredData(data);
//       });
//   }, []);

//   const inputRefs = {
//     schemeType: useRef(null),
//     schemeGroup: useRef(null),
//     schemeName: useRef(null),
//     cardNo: useRef(null),
//     city: useRef(null),
//     member: useRef(null),
//     mobileNo: useRef(null),
//     incharge: useRef(null),
//   };

//   const handleKeyDown = (e, nextField) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       if (inputRefs[nextField]) {
//         inputRefs[nextField].current.focus();
//       }
//     }
//   }

//   return (
//     <div className="max-w-full max-h-[98vh] overflow-y-auto custom-scrollbar2">
//       <div className="h-full flex flex-col">
//         <div className="px-[10px] sm:px-[20px] lg:px-[20px] py-[5px] sm:py-[10px] lg:py-[15px]">
//           <div
//             className="w-full h-full px-[15px] sm:px-[30px] lg:px-[45px] py-[10px] sm:py-[15px] lg:py-[15px] rounded-md flex items-center gap-[10px] sm:gap-[15px] lg:gap-[20px]"
//             style={{
//               background:
//                 "linear-gradient(270deg, #0A0E16 5.64%, #182456 97.55%)",
//             }}
//           >
//             <div className="basis-[60%] flex items-center justify-between w-full h-full">
//               <h1 className="flex-1 text-[#fff] text-[20px] sm:text-[24px] lg:text-[20px] font-semibold pl-[10px] border-l-8 rounded-s-md border-[#52BD91]">
//                 Due List
//               </h1>

//               <div className="flex-1 flex items-center text-center justify-center gap-[3px] sm:gap-[6px] lg:gap-[9px]">
//                 <p className="text-white text-[14px] sm:text-[15px] lg:text-[14px] font-semibold">
//                   Gold Rate
//                 </p>
//                 {/* <p className='text-[#52BD91] text-[16px] sm:text-[17px] lg:text-[18px] font-bold'>24-25</p> */}
//                 <div className="h-[30px] max-w-[130px] rounded-md w-full px-[5px] sm:px-[10px] lg:px-[15px] bg-white"></div>
//               </div>
//             </div>
//             {/* <div className="basis-[40%] w-full h-full flex items-center gap-[10px] sm:gap-[20px] lg:gap-[30px]">
//               <div className="grid grid-cols-3 w-full h-full items-center justify-center gap-[5px] sm:gap-[8px] lg:gap-[12px]">
//                 <div className="cursor-pointer h-[45px] w-full px-[5px] sm:px-[10px] lg:px-[15px] flex items-center justify-center gap-[5px] bg-[#52BD91] rounded-md">
//                   <p className="text-white font-bold">SHOW</p>
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="19"
//                     height="17"
//                     viewBox="0 0 19 17"
//                     fill="none"
//                   >
//                     <mask
//                       id="mask0_215_507"
//                       style={{ maskType: "luminance" }}
//                       maskUnits="userSpaceOnUse"
//                       x="0"
//                       y="0"
//                       width="19"
//                       height="17"
//                     >
//                       <path
//                         d="M7.78768 2.88939L5.90308 1.22913C5.73645 1.08242 5.51049 1 5.27488 1C5.03927 1 4.8133 1.08242 4.64667 1.22913L2.13342 3.44268C2.05088 3.51536 1.98539 3.60164 1.94072 3.69661C1.89604 3.79158 1.87305 3.89337 1.87305 3.99617C1.87305 4.09896 1.89604 4.20076 1.94072 4.29572C1.98539 4.39069 2.05088 4.47698 2.13342 4.54965L4.01847 6.20952M11.7235 13.7783L13.6081 15.4386C13.6906 15.5113 13.7886 15.569 13.8964 15.6083C14.0042 15.6477 14.1198 15.6679 14.2365 15.6679C14.3532 15.6679 14.4688 15.6477 14.5766 15.6083C14.6845 15.569 14.7824 15.5113 14.8649 15.4386L17.3782 13.225C17.5448 13.0783 17.6384 12.8793 17.6384 12.6717C17.6384 12.4642 17.5448 12.2652 17.3782 12.1185L15.4932 10.4582"
//                         stroke="white"
//                         stroke-width="1.56518"
//                         stroke-linecap="round"
//                         stroke-linejoin="round"
//                       />
//                       <path
//                         d="M17.3876 3.8258L14.8744 1.6123C14.5274 1.30668 13.9648 1.30668 13.6178 1.6123L1.68016 12.1264C1.33316 12.432 1.33316 12.9275 1.68016 13.2331L4.19335 15.4466C4.54035 15.7523 5.10294 15.7523 5.44994 15.4466L17.3876 4.93254C17.7346 4.62692 17.7346 4.13142 17.3876 3.8258Z"
//                         fill="white"
//                         stroke="white"
//                         stroke-width="1.56518"
//                         stroke-linecap="round"
//                         stroke-linejoin="round"
//                       />
//                       <path
//                         d="M9.53405 9.31209C10.0248 9.31209 10.4226 8.96172 10.4226 8.52951C10.4226 8.09729 10.0248 7.74692 9.53405 7.74692C9.04332 7.74692 8.64551 8.09729 8.64551 8.52951C8.64551 8.96172 9.04332 9.31209 9.53405 9.31209Z"
//                         fill="black"
//                       />
//                       <path
//                         d="M7.75671 10.8773C8.24744 10.8773 8.64526 10.5269 8.64526 10.0947C8.64526 9.66248 8.24744 9.3121 7.75671 9.3121C7.26598 9.3121 6.86816 9.66248 6.86816 10.0947C6.86816 10.5269 7.26598 10.8773 7.75671 10.8773Z"
//                         fill="black"
//                       />
//                       <path
//                         d="M11.3114 7.74691C11.8021 7.74691 12.1999 7.39653 12.1999 6.96432C12.1999 6.53211 11.8021 6.18173 11.3114 6.18173C10.8207 6.18173 10.4229 6.53211 10.4229 6.96432C10.4229 7.39653 10.8207 7.74691 11.3114 7.74691Z"
//                         fill="black"
//                       />
//                     </mask>
//                     <g mask="url(#mask0_215_507)">
//                       <path
//                         d="M-1.13086 -2H20.1942V16.7821H-1.13086V-2Z"
//                         fill="white"
//                       />
//                     </g>
//                   </svg>
//                 </div>

//                 <div className="cursor-pointer h-[45px] w-full px-[5px] sm:px-[10px] lg:px-[15px] flex items-center justify-center gap-[5px] bg-[#52BD91] rounded-md">
//                   <p className="text-white font-bold">PRINT</p>
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="18"
//                     height="16"
//                     viewBox="0 0 18 16"
//                     fill="none"
//                   >
//                     <path
//                       d="M7.08775 2.57143V2.85714H10.3317V2.57143C10.3317 2.19255 10.1608 1.82919 9.85666 1.56128C9.55248 1.29337 9.13992 1.14286 8.70974 1.14286C8.27956 1.14286 7.867 1.29337 7.56282 1.56128C7.25864 1.82919 7.08775 2.19255 7.08775 2.57143ZM5.79016 2.85714V2.57143C5.79016 1.88944 6.09776 1.23539 6.64529 0.753154C7.19281 0.270918 7.93542 0 8.70974 0C9.48407 0 10.2267 0.270918 10.7742 0.753154C11.3217 1.23539 11.6293 1.88944 11.6293 2.57143V2.85714H16.4953C16.6674 2.85714 16.8324 2.91735 16.9541 3.02451C17.0757 3.13167 17.1441 3.27702 17.1441 3.42857C17.1441 3.58012 17.0757 3.72547 16.9541 3.83263C16.8324 3.9398 16.6674 4 16.4953 4H15.5169L14.2894 13.4674C14.1989 14.1647 13.8202 14.8082 13.2255 15.2753C12.6308 15.7424 11.8617 16.0003 11.0649 16H6.35461C5.5578 16.0003 4.78872 15.7424 4.19402 15.2753C3.59933 14.8082 3.22061 14.1647 3.13009 13.4674L1.90257 4H0.924187C0.752115 4 0.587092 3.9398 0.465419 3.83263C0.343746 3.72547 0.275391 3.58012 0.275391 3.42857C0.275391 3.27702 0.343746 3.13167 0.465419 3.02451C0.587092 2.91735 0.752115 2.85714 0.924187 2.85714H5.79016ZM7.41215 6.57143C7.41215 6.41988 7.3438 6.27453 7.22212 6.16737C7.10045 6.0602 6.93543 6 6.76335 6C6.59128 6 6.42626 6.0602 6.30459 6.16737C6.18291 6.27453 6.11456 6.41988 6.11456 6.57143V12.2857C6.11456 12.4373 6.18291 12.5826 6.30459 12.6898C6.42626 12.7969 6.59128 12.8571 6.76335 12.8571C6.93543 12.8571 7.10045 12.7969 7.22212 12.6898C7.3438 12.5826 7.41215 12.4373 7.41215 12.2857V6.57143ZM10.6561 6C10.4841 6 10.319 6.0602 10.1974 6.16737C10.0757 6.27453 10.0073 6.41988 10.0073 6.57143V12.2857C10.0073 12.4373 10.0757 12.5826 10.1974 12.6898C10.319 12.7969 10.4841 12.8571 10.6561 12.8571C10.8282 12.8571 10.9932 12.7969 11.1149 12.6898C11.2366 12.5826 11.3049 12.4373 11.3049 12.2857V6.57143C11.3049 6.41988 11.2366 6.27453 11.1149 6.16737C10.9932 6.0602 10.8282 6 10.6561 6Z"
//                       fill="#F8F8F8"
//                     />
//                   </svg>
//                 </div>

//                 <div className="cursor-pointer h-[45px] w-full px-[5px] sm:px-[10px] lg:px-[15px] flex items-center justify-center gap-[5px] bg-[#52BD91] rounded-md">
//                   <p className="text-white font-bold">EXIT</p>
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="21"
//                     height="18"
//                     viewBox="0 0 21 18"
//                     fill="none"
//                   >
//                     <path
//                       d="M10.3875 1.875C10.7263 1.875 11.0512 1.99353 11.2907 2.2045C11.5303 2.41548 11.6649 2.70163 11.6649 3C11.6649 3.29837 11.5303 3.58452 11.2907 3.7955C11.0512 4.00647 10.7263 4.125 10.3875 4.125H6.12982C6.0169 4.125 5.9086 4.16451 5.82876 4.23484C5.74891 4.30516 5.70405 4.40054 5.70405 4.5V13.5C5.70405 13.5995 5.74891 13.6948 5.82876 13.7652C5.9086 13.8355 6.0169 13.875 6.12982 13.875H9.96178C10.3005 13.875 10.6254 13.9935 10.865 14.2045C11.1045 14.4155 11.2391 14.7016 11.2391 15C11.2391 15.2984 11.1045 15.5845 10.865 15.7955C10.6254 16.0065 10.3005 16.125 9.96178 16.125H6.12982C5.33937 16.125 4.58129 15.8484 4.02236 15.3562C3.46342 14.8639 3.14941 14.1962 3.14941 13.5V4.5C3.14941 3.80381 3.46342 3.13613 4.02236 2.64384C4.58129 2.15156 5.33937 1.875 6.12982 1.875H10.3875ZM15.5479 6.0825L17.9569 8.205C18.1961 8.41594 18.3305 8.70187 18.3305 9C18.3305 9.29813 18.1961 9.58406 17.9569 9.795L15.5488 11.9175C15.3091 12.1285 14.9841 12.2471 14.6453 12.2471C14.3064 12.2471 13.9814 12.1285 13.7418 11.9175C13.5022 11.7065 13.3675 11.4202 13.3675 11.1217C13.3675 10.8233 13.5022 10.537 13.7418 10.326L13.97 10.125H10.3875C10.0488 10.125 9.72389 10.0065 9.48435 9.7955C9.2448 9.58452 9.11023 9.29837 9.11023 9C9.11023 8.70163 9.2448 8.41548 9.48435 8.2045C9.72389 7.99353 10.0488 7.875 10.3875 7.875H13.97L13.7418 7.674C13.6232 7.5695 13.5291 7.44545 13.465 7.30894C13.4008 7.17242 13.3678 7.02611 13.3678 6.87836C13.3679 6.73061 13.401 6.58431 13.4652 6.44782C13.5294 6.31134 13.6236 6.18733 13.7422 6.08288C13.8609 5.97843 14.0017 5.89558 14.1567 5.83907C14.3117 5.78256 14.4778 5.75349 14.6456 5.75353C14.8133 5.75356 14.9794 5.7827 15.1344 5.83927C15.2894 5.89585 15.4302 5.97875 15.5488 6.08325L15.5479 6.0825Z"
//                       fill="white"
//                     />
//                   </svg>
//                 </div>
//               </div>
//             </div> */}
//           </div>
//         </div>

//         <div className="px-[10px] sm:px-[20px] lg:px-[20px] py-[5px] sm:py-[10px] lg:py-[15px] w-full max-h-full flex gap-[10px] sm:gap-[15px] lg:gap-[20px]">
//           <div className=" w-full flex flex-col gap-[5px] sm:gap-[10px] lg:gap-[15px]">
//             <div className="flex w-full gap-[5px] sm:gap-[10px] lg:gap-[15px]">
//               <div className="basis-[40%] w-full flex items-center justify-between">
//                 <p className="basis-[50%] text-[12px] sm:text-[14px] lg:text-[14px] text-[#182456] font-semibold">
//                   Scheme Type
//                 </p>
//                 <input
//                   type="text"
//                   ref={inputRefs.schemeType}
//                   onKeyDown={(e) => handleKeyDown(e, "schemeGroup")}
//                   className="h-[30px] basis-[50%] w-full focus:outline-none rounded-lg border-2 border-[#000] px-[5px] sm:px-[10px] lg:px-[15px]"
//                 />
//               </div>
//               <div className="basis-[40%] w-full flex items-center justify-between">
//                 <p className="basis-[50%] text-[12px] sm:text-[14px] lg:text-[14px] text-[#182456] font-semibold">
//                   Scheme Group
//                 </p>
//                 <input
//                   type="text"
//                   ref={inputRefs.schemeGroup}
//                   onKeyDown={(e) => handleKeyDown(e, "schemeName")}
//                   className="h-[30px] basis-[50%] w-full focus:outline-none rounded-lg border-2 border-[#000] px-[5px] sm:px-[10px] lg:px-[15px]"
//                 />
//               </div>
//               <div className="basis-[40%] w-full flex items-center justify-between">
//                 <p className="basis-[50%] text-[12px] sm:text-[14px] lg:text-[14px] text-[#182456] font-semibold">
//                   Scheme Name
//                 </p>
//                 <input
//                   type="text"
//                   ref={inputRefs.schemeName}
//                   onKeyDown={(e) => handleKeyDown(e, "cardNo")}
//                   className="h-[30px] basis-[50%] w-full focus:outline-none rounded-lg border-2 border-[#000] px-[5px] sm:px-[10px] lg:px-[15px]"
//                 />
//               </div>
//               <div className="basis-[40%] w-full flex items-center justify-between">
//                 <p className="basis-[50%] text-[12px] sm:text-[14px] lg:text-[14px] text-[#182456] font-semibold">
//                   Card No
//                 </p>
//                 <input
//                   type="text"
//                   ref={inputRefs.cardNo}
//                   onKeyDown={(e) => handleKeyDown(e, "city")}
//                   className="h-[30px] basis-[50%] w-full focus:outline-none rounded-lg border-2 border-[#000] px-[5px] sm:px-[10px] lg:px-[15px]"
//                 />
//               </div>
//             </div>

//             <div className="w-full grid grid-cols-4 gap-[7px] sm:gap-[14px] lg:gap-[20px]">
//               <div className="w-full flex items-center justify-between gap-[5px] sm:gap-[7px] lg:gap-[10px]">
//                 <p className="flex-1 text-[12px] sm:text-[14px] lg:text-[14px] text-[#182456] font-semibold">
//                   City
//                 </p>
//                 <div className="flex-1">
//                   <input
//                     type="text"
//                     ref={inputRefs.city}
//                     onKeyDown={(e) => handleKeyDown(e, "member")}
//                     className="w-full h-[30px] focus:outline-none rounded-lg border-2 border-[#000] px-[5px] sm:px-[10px] lg:px-[15px]"
//                   />
//                 </div>
//               </div>
//               <div className="w-full flex items-center justify-between gap-[5px] sm:gap-[7px] lg:gap-[10px]">
//                 <p className="flex-1 text-[12px] sm:text-[14px] lg:text-[14px] text-[#182456] font-semibold">
//                   Member
//                 </p>
//                 <div className="flex-1">
//                   <input
//                     type="text"
//                     ref={inputRefs.member}
//                     onKeyDown={(e) => handleKeyDown(e, "mobileNo")}
//                     className="w-full h-[30px] focus:outline-none rounded-lg border-2 border-[#000] px-[5px] sm:px-[10px] lg:px-[15px]"
//                   />
//                 </div>
//               </div>
//               <div className="w-full flex items-center justify-between gap-[5px] sm:gap-[7px] lg:gap-[10px]">
//                 <p className="flex-1 text-[12px] sm:text-[14px] lg:text-[14px] text-[#182456] font-semibold">
//                   Mobile No
//                 </p>
//                 <div className="flex-1">
//                   <input
//                     type="text"
//                     ref={inputRefs.mobileNo}
//                     onKeyDown={(e) => handleKeyDown(e, "incharge")}
//                     className="w-full h-[30px] focus:outline-none rounded-lg border-2 border-[#000] px-[5px] sm:px-[10px] lg:px-[15px]"
//                   />
//                 </div>
//               </div>
//               <div className="w-full flex items-center justify-between gap-[5px] sm:gap-[7px] lg:gap-[10px]">
//                 <p className="flex-1 text-[12px] sm:text-[14px] lg:text-[14px] text-[#182456] font-semibold">
//                   Incharge
//                 </p>
//                 <div className="flex-1">
//                   <input
//                     type="text"
//                     ref={inputRefs.incharge}
//                     className="w-full h-[30px] focus:outline-none rounded-lg border-2 border-[#000] px-[5px] sm:px-[10px] lg:px-[15px]"
//                   />
//                 </div>
//               </div>
//               {/* <div className="w-full">
//                 <p className="text-lg font-semibold mb-2">Select Option:</p>
//                 <div className="basis-[60%] flex w-full items-center justify-center gap-[15px] sm:gap-[20px] lg:gap-[25px]">
//                   <div className="flex items-center justify-center gap-[3px] sm:gap-[5px] lg:gap-[7px]">
//                     <input type="radio" name="option" id="shop" value="shop" />
//                     <label
//                       htmlFor="shop"
//                       className="text-[14px] sm:text-[16px] lg:text-[18px] font-semibold text-[#000]"
//                     >
//                       Shop
//                     </label>
//                   </div>
//                   <div className="flex items-center justify-center gap-[3px] sm:gap-[5px] lg:gap-[7px]">
//                     <input
//                       type="radio"
//                       name="option"
//                       id="staff"
//                       value="staff"
//                     />
//                     <label
//                       htmlFor="staff"
//                       className="text-[14px] sm:text-[16px] lg:text-[18px] font-semibold text-[#000]"
//                     >
//                       Staff
//                     </label>
//                   </div>
//                 </div>
//               </div> */}
//             </div>

//             <div className="w-full my-[10px] sm:my-[15px] lg:my-[20px] max-h-[380px] overflow-auto custom-scrollbar2">
//               <table className="table-auto w-full text-[12px] sm:text-[14px] h-full">
//                 <tr className="bg-[#172561] text-white">
//                   <th className="py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]">
//                     Sno
//                   </th>
//                   <th className="py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]">
//                     Scheme Type
//                   </th>
//                   <th className="py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]">
//                     Scheme Code
//                   </th>
//                   <th className="py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]">
//                     Scheme Name
//                   </th>
//                   <th className="py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]">
//                     Card No
//                   </th>
//                   <th className="py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]">
//                     Member Name
//                   </th>
//                   <th className="py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]">
//                     City
//                   </th>
//                   <th className="py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]">
//                     Join Date
//                   </th>
//                   <th className="py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]">
//                     Mobile No 1
//                   </th>
//                   <th className="py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]">
//                     Mobile No 2
//                   </th>
//                 </tr>
//                 {filteredData.map((item, index) => (
//                   <tr className="bg-[#EAFFF6] text-[#172561]" key={index}>
//                     <th className="py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]">
//                       {index + 1}
//                     </th>
//                     <th className="py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]">
//                       {item.SchemeType}
//                     </th>
//                     <th className="py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]">
//                       {item.SchemeCode}
//                     </th>
//                     <th className="py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]">
//                       {item.SchemeName}
//                     </th>
//                     <th className="py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]">
//                       {item.CardNo}
//                     </th>
//                     <th className="py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]">
//                       {item.MemberName}
//                     </th>
//                     <th className="py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]">
//                       {item.City}
//                     </th>
//                     <th className="py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]">
//                       {item.JoinDate}
//                     </th>
//                     <th className="py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]">
//                       {item.Mobile1}
//                     </th>
//                     <th className="py-[5px] sm:py-[10px] lg:py-[15px] px-[3px] sm:px-[6px] lg:px-[9px]">
//                       {item.Mobile2}
//                     </th>
//                   </tr>
//                 ))}
//               </table>
//             </div>

//             <div className="w-full relative grid grid-cols-4 gap-[7px] sm:gap-[14px] lg:gap-[20px]">
//               <div className="w-full flex items-center justify-center gap-[5px] sm:gap-[7px] lg:gap-[10px]">
//                 <p className="flex-1 text-[12px] sm:text-[14px] text-[#182456] font-semibold">
//                   Bal Amount
//                 </p>
//                 <div className="flex-1">
//                   <input
//                     type="text"
//                     className="w-full h-[30px] focus:outline-none rounded-lg border-2 border-[#000] px-[5px] sm:px-[10px] lg:px-[15px]"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MemberDiscontinue;
