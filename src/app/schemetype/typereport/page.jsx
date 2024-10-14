"use client";

import Sidebar from '@/components/Navbar/Navbar';
import React, { useEffect, useState } from 'react'
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

    const [schemeTypes, setSchemeTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isOpen, setIsOpen] = useState(true);

    const headings = ["ID", "SchemeType", "SchemeMode"]

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(schemeTypes);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
        XLSX.writeFile(workbook, "SchemeTypes.xlsx");
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF("l", "pt");

        const tableData = schemeTypes.map((type, index) => [
            index + 1,
            type.SchemeType,
            type.SchemeMode
        ]);

        const tableHeaders = headings.map((heading) => ({ title: heading }));

        const header = "Scheme Types";
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

        doc.save("SchemeTypes.pdf");
    };

    useEffect(() => {
        const fetchSchemeTypes = async () => {
            try {
                const response = await fetch('https://scheme-purchase-backend.vercel.app/api/schemetype/gettypes', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setSchemeTypes(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSchemeTypes();
    }, []);

    return (

        <div className="flex w-full max-h-screen overflow-y-auto custom-scrollbar2 ">
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            <div className={`flex-1 w-full transition-all duration-300 ${isOpen ? 'ml-52' : 'ml-16'} p-[20px]`}>
                <div className='w-full flex flex-col gap-[10px]'>
                    <div className="w-full flex gap-[10px]">
                        <button className=" bg-green-400 px-[10px] text-white py-[10px]" onClick={exportToExcel}>
                            Export to Excel
                        </button>
                        <button className=" bg-red-400 px-[10px] text-white py-[10px]" onClick={handleDownloadPDF}>
                            Export to PDF
                        </button>
                    </div>
                    <div className="w-full max-h-full overflow-y-auto custom-scrollbar2 p-[20px]">
                        <table className="w-full table-auto text-center max-w-[750px] mx-auto border border-black">
                            <thead className="w-full border border-black">
                                <tr>
                                    <th className="border border-black p-2">ID</th>
                                    <th className="border border-black p-2">Scheme Type</th>
                                    <th className="border border-black p-2">Scheme Mode</th>
                                </tr>
                            </thead>
                            <tbody className="w-full border border-black">
                                {schemeTypes.map((type) => (
                                    <tr key={type.id} className="border border-black">
                                        <td className="border border-black p-2">{type.id}</td>
                                        <td className="border border-black p-2">{type.SchemeType}</td>
                                        <td className="border border-black p-2">{type.SchemeMode}</td>
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

export default Page
