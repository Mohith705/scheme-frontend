"use client";

import Sidebar from '@/components/Navbar/Navbar';
import React, { useEffect, useState } from 'react';
import XLSX from "xlsx/dist/xlsx.full.min.js";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { useRouter } from 'next/navigation';

const Page = () => {

    const router = useRouter();
    useEffect(() => {
        if (!localStorage.getItem("tenantName")) {
            router.push("/");
        }
    }, [])

    const [dailyCollections, setDailycollections] = useState([]);
    const [filteredCollections, setFilteredCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isOpen, setIsOpen] = useState(true);

    // State variables for filters
    const [schemeType, setSchemeType] = useState('');
    const [schemeName, setSchemeName] = useState('');
    const [cardNo, setCardNo] = useState('');
    const [memberName, setMemberName] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
    const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);

    const headings = ["Sno", "Scheme Type", "Scheme Name", "Card No", "Receipt Date", "Receipt No", "Member Name", "Contact No", "Paid Amount", "Cash", "Card", "Online", "UPI"];

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredCollections);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
        XLSX.writeFile(workbook, "DailyCollections.xlsx");
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF("l", "pt");

        const tableData = filteredCollections.map((type, index) => [
            index + 1,
            type.SchemeType,
            type.SchemeName,
            type.CardNo,
            type.ReceiptDate,
            type.ReceiptNo,
            type.MemberName,
            type.MobileNo,
            type.PaidAmount,
            type.CashAmount,
            type.CardAmount,
            type.OnlineAmount,
            type.UPIAmount,
        ]);

        const tableHeaders = headings.map((heading) => ({ title: heading }));

        const header = "Daily Collections";
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

        doc.save("DailyCollections.pdf");
    };

    useEffect(() => {
        const fetchDailyCollections = async () => {
            try {
                const response = await fetch('https://scheme-purchase-backend.vercel.app/api/receipt/getallreceipts', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setDailycollections(data);
                setFilteredCollections(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDailyCollections();
    }, []);

    useEffect(() => {
        let filteredData = dailyCollections;

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
        if (fromDate) {
            filteredData = filteredData.filter((item) => new Date(item.ReceiptDate) >= new Date(fromDate));
        }
        if (toDate) {
            filteredData = filteredData.filter((item) => new Date(item.ReceiptDate) <= new Date(toDate));
        }

        setFilteredCollections(filteredData);
    }, [schemeType, schemeName, cardNo, memberName, mobileNo, fromDate, toDate, dailyCollections]);

    return (
        <div className="flex w-full max-h-screen overflow-y-auto custom-scrollbar2">
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            <div className={`flex-1 w-full transition-all duration-300 ${isOpen ? 'ml-52' : 'ml-16'} p-[20px]`}>
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
                                Receipt Report
                            </h1>


                        </div>
                    </div>

                    <div className='w-full flex items-center justify-between'>
                        <div className='flex items-center gap-[5px] justify-center'>
                            <div className='flex flex-col items-start justify-center'>
                                <p className='text-[12px]'>From Date</p>
                                <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className=' border border-black focus:outline-none p-1' />
                            </div>
                            <div className='flex flex-col items-start justify-center'>
                                <p className='text-[12px]'>To Date</p>
                                <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className=' border border-black focus:outline-none p-1' />
                            </div>


                        </div>
                        <div className='flex items-center justify-center gap-[10px]'>
                            <button className="bg-green-400 px-[10px] text-white py-[10px]" onClick={exportToExcel}>
                                Export to Excel
                            </button>
                            <button className="bg-red-400 px-[10px] text-white py-[10px]" onClick={handleDownloadPDF}>
                                Export to PDF
                            </button>
                        </div>
                    </div>

                    <div className='w-full grid grid-cols-5 items-center justify-center gap-[10px] pt-[20px]'>
                        <select onChange={(e) => setSchemeType(e.target.value)} value={schemeType} className='border border-black p-2 focus:outline-none'>
                            <option value="">Select Scheme Type</option>
                            {[...new Set(dailyCollections.map(item => item.SchemeType))].map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                            ))}
                        </select>
                        <select onChange={(e) => setSchemeName(e.target.value)} value={schemeName} className='border border-black p-2 focus:outline-none'>
                            <option value="">Select Scheme Name</option>
                            {[...new Set(dailyCollections.map(item => item.SchemeName))].map((name, index) => (
                                <option key={index} value={name}>{name}</option>
                            ))}
                        </select>
                        <input type="text" placeholder="Search Card No" className='border border-black p-2 focus:outline-none' value={cardNo} onChange={(e) => setCardNo(e.target.value)} />
                        <input type="text" placeholder="Search Member Name" className='border border-black p-2 focus:outline-none' value={memberName} onChange={(e) => setMemberName(e.target.value)} />
                        <input type="text" placeholder="Search Mobile No" className='border border-black p-2 focus:outline-none' value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} />
                    </div>

                    <div className="w-full max-h-full overflow-y-auto custom-scrollbar2 p-[20px] text-[14px]">
                        <table className="w-full table-auto text-center max-w-[1350px] mx-auto border border-black">
                            <thead className="w-full border border-black">
                                <tr>
                                    {headings.map((heading, index) => (
                                        <th key={index} className="border border-black p-2">{heading}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="w-full border border-black">
                                {filteredCollections.map((type, index) => (
                                    <tr key={type.id} className="border border-black">
                                        <td className="border border-black p-2">{index + 1}</td>
                                        <td className="border border-black p-2">{type.SchemeType}</td>
                                        <td className="border border-black p-2">{type.SchemeName}</td>
                                        <td className="border border-black p-2">{type.CardNo}</td>
                                        <td className="border border-black p-2">{type.ReceiptDate}</td>
                                        <td className="border border-black p-2">{type.ReceiptNo}</td>
                                        <td className="border border-black p-2">{type.MemberName}</td>
                                        <td className="border border-black p-2">{type.MobileNo}</td>
                                        <td className="border border-black p-2">{type.Amount}</td>
                                        <td className="border border-black p-2">{type.CashAmount}</td>
                                        <td className="border border-black p-2">{type.CardAmount}</td>
                                        <td className="border border-black p-2">{type.OnlineAmount}</td>
                                        <td className="border border-black p-2">{type.UPIAmount}</td>
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

export default Page;
