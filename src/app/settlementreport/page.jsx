"use client";

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Navbar/Navbar';
import XLSX from 'xlsx/dist/xlsx.full.min.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useRouter } from 'next/navigation';

const Page = () => {

    const router = useRouter();
    useEffect(() => {
        if (!localStorage.getItem("tenantName")) {
            router.push("/");
        }
    }, [])

    const [settlements, setSettlements] = useState([]);
    const [filteredSettlements, setFilteredSettlements] = useState([]);
    const [schemeTypes, setSchemeTypes] = useState([]);
    const [schemeNames, setSchemeNames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(true);

    // State variables for filters
    const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
    const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
    const [schemeType, setSchemeType] = useState('');
    const [schemeName, setSchemeName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchMember, setSearchMember] = useState('');
    const [searchMobile, setSearchMobile] = useState('');

    const headings = ['Sno', 'Scheme Type', 'Scheme Name', 'Card No', "Member Name", "Contact No", 'Settlement Date', 'Voucher No', 'Paid Amount', 'Balance Amount', 'Gold Wt', 'Gold Amt'];

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredSettlements);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
        XLSX.writeFile(workbook, 'SchemeSettlements.xlsx');
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF('l', 'pt');

        const tableData = filteredSettlements.map((type, index) => [
            index + 1,
            type.SchemeType,
            type.SchemeName,
            type.CardNo,
            type.MemberName,
            type.MobileNo,
            type.Date,
            type.VoucherNo,
            type.PaidAmount,
            type.BalanceAmount,
            type.GoldWt,
            type.GoldAmt,
        ]);

        const tableHeaders = headings.map((heading) => ({ title: heading }));

        const header = 'Scheme Settlements';
        const printDate = 'Print Date & Time: ' + new Date().toLocaleString();

        doc.setFont('bold');
        const headerWidth = doc.getTextDimensions(header).w;
        const headerX = (doc.internal.pageSize.width - headerWidth) / 2;
        const headerY = 15;
        doc.text(header, headerX, headerY);
        doc.setLineWidth(0.5);
        doc.line(headerX, headerY + 2, headerX + headerWidth, headerY + 2);

        doc.setFont('normal');
        doc.text(printDate, 45, 65);

        doc.autoTable({
            head: [tableHeaders],
            body: tableData,
            theme: 'plain',
            startY: 80,
            styles: {
                lineWidth: 0.3,
                lineColor: [0, 0, 0],
            },
            didDrawPage: function (data) {
                var str = 'Page ' + doc.internal.getNumberOfPages();
                doc.setFontSize(10);
                doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 10);
            },
        });

        doc.save('SchemeSettlements.pdf');
    };

    const fetchOptions = (settlements) => {
        const uniqueSchemeTypes = [...new Set(settlements.map(settlement => settlement.SchemeType))];
        const uniqueSchemeNames = [...new Set(settlements.map(settlement => settlement.SchemeName))];
        setSchemeTypes(uniqueSchemeTypes);
        setSchemeNames(uniqueSchemeNames);
    };

    useEffect(() => {
        const fetchSettlements = async () => {
            try {
                const response = await fetch('https://scheme-purchase-backend.vercel.app/api/settlementslist', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setSettlements(data);
                fetchOptions(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSettlements();
    }, []);

    useEffect(() => {
        // Filter settlements based on fromDate, toDate, schemeType, schemeName, and searchTerm
        let filteredData = settlements.filter((settlement) => {
            // Filter by fromDate and toDate
            if (fromDate && toDate) {
                const settlementDate = new Date(settlement.Date);
                const fromDateObj = new Date(fromDate);
                const toDateObj = new Date(toDate);
                return settlementDate >= fromDateObj && settlementDate <= toDateObj;
            }
            return true;
        });

        // Filter by schemeType
        if (schemeType) {
            filteredData = filteredData.filter((settlement) => settlement.SchemeType === schemeType);
        }

        // Filter by schemeName
        if (schemeName) {
            filteredData = filteredData.filter((settlement) => settlement.SchemeName === schemeName);
        }

        // Filter by searchTerm (Card No)
        if (searchTerm) {
            filteredData = filteredData.filter((settlement) => settlement.CardNo.includes(searchTerm));
        }

        // Filter by searchMember (Member Name)
        if (searchMember) {
            filteredData = filteredData.filter((settlement) => settlement.MemberName.includes(searchMember));
        }

        // Filter by searchMobile (Mobile No)
        if (searchMobile) {
            filteredData = filteredData.filter((settlement) => settlement.MobileNo.includes(searchMobile));
        }

        setFilteredSettlements(filteredData);
    }, [settlements, fromDate, toDate, schemeType, schemeName, searchTerm, searchMember, searchMobile]);

    return (
        <div className="flex w-full h-full overflow-y-auto custom-scrollbar2">
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
                                Settlement Report
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
                        <select value={schemeType} onChange={(e) => setSchemeType(e.target.value)} className='border border-black focus:outline-none p-2'>
                            <option value="">Select Scheme Type</option>
                            {schemeTypes.map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                            ))}
                        </select>
                        <select value={schemeName} onChange={(e) => setSchemeName(e.target.value)} className='border border-black focus:outline-none p-2'>
                            <option value="">Select Scheme Name</option>
                            {schemeNames.map((name, index) => (
                                <option key={index} value={name}>{name}</option>
                            ))}
                        </select>
                        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search Card No" className='border border-black focus:outline-none p-2' />
                        <input type="text" value={searchMember} onChange={(e) => setSearchMember(e.target.value)} placeholder="Search Member Name" className='border border-black focus:outline-none p-2' />
                        <input type="text" value={searchMobile} onChange={(e) => setSearchMobile(e.target.value)} placeholder="Search Mobile No" className='border border-black focus:outline-none p-2' />
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
                                {filteredSettlements.map((type, index) => (
                                    <tr key={type.id} className="border border-black">
                                        <td className="border border-black p-2">{index + 1}</td>
                                        <td className="border border-black p-2">{type.SchemeType}</td>
                                        <td className="border border-black p-2">{type.SchemeName}</td>
                                        <td className="border border-black p-2">{type.CardNo}</td>
                                        <td className="border border-black p-2">{type.MemberName}</td>
                                        <td className="border border-black p-2">{type.MobileNo}</td>
                                        <td className="border border-black p-2">{type.Date}</td>
                                        <td className="border border-black p-2">{type.VoucherNo}</td>
                                        <td className="border border-black p-2">{type.PaidAmount}</td>
                                        <td className="border border-black p-2">{type.BalanceAmount}</td>
                                        <td className="border border-black p-2">{type.GoldWt}</td>
                                        <td className="border border-black p-2">{type.GoldAmt}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page;
