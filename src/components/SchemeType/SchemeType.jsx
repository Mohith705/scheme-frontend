"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const SchemeType = () => {
    const [schemeType, setSchemeType] = useState("");
    const [goldScheme, setGoldScheme] = useState("Cash Scheme");

    const [schemeTypes, setSchemeTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

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

    const handleDelete = async (schemeType) => {
        try {
            const response = await fetch(`https://scheme-purchase-backend.vercel.app/api/schemetype/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ schemeType }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error);  // Show the error message
                return;
            }

            // Remove the deleted item from the state
            setSchemeTypes(schemeTypes.filter((type) => type.SchemeType !== schemeType));
            alert('Scheme type deleted successfully');
        } catch (error) {
            console.error('Error deleting scheme type:', error);
            alert('An error occurred while deleting the scheme type. Please try again.');
        }
    };

    const handleEdit = (type) => {
        setSchemeType(type.SchemeType);
        setGoldScheme(type.SchemeMode);
        setEditing(true);
        setEditingId(type.id);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            type: schemeType,
            mode: goldScheme,
        };

        if (data.type === "") {
            alert("Enter Scheme Type");
        } else {
            try {
                let response;
                if (editing) {
                    response = await fetch(`https://scheme-purchase-backend.vercel.app/api/schemetype/update`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ ...data, id: editingId }),
                    });
                } else {
                    response = await fetch("https://scheme-purchase-backend.vercel.app/api/schemetype", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data),
                    });
                }

                const result = await response.json();

                if (response.ok) {
                    alert("Data saved successfully");
                    setGoldScheme("Cash Scheme");
                    setSchemeType("");
                    setEditing(false);
                    setEditingId(null);
                } else {
                    alert(result.error || "Failed to save data");
                    setGoldScheme("Cash Scheme");
                    setSchemeType("");
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert("An error occurred. Please try again.");
                setGoldScheme("Cash Scheme");
                setSchemeType("");
            }
        }
    };



    return (
        <div
            className="w-full min-h-screen"
            style={{ background: "url(/banner.png) lightgray 50% / cover no-repeat" }}
        >
            <div className="w-full h-full">
                <div className="px-[10px] sm:px-[20px] lg:px-[40px] py-[5px] sm:py-[10px] lg:py-[15px]">
                    <div
                        className="w-full h-full px-[15px] sm:px-[30px] lg:px-[45px] py-[10px] sm:py-[10px] lg:py-[10px] rounded-md flex items-center gap-[10px] sm:gap-[15px] lg:gap-[20px]"
                        style={{
                            background:
                                "linear-gradient(270deg, #0A0E16 5.64%, #182456 97.55%)",
                        }}
                    >
                        <div className="basis-[60%] flex items-center justify-between w-full h-full">
                            <h1 className="flex-1 text-[#fff] text-[20px] sm:text-[16px] lg:text-[20px] font-semibold pl-[10px] border-l-8 rounded-s-md border-[#52BD91]">
                                Scheme Type
                            </h1>
                        </div>

                        {/* <Link href={"/schemetype/typereport"} className=" cursor-pointer h-[45px] w-[250px] px-[5px] sm:px-[10px] lg:px-[15px] flex items-center justify-center gap-[5px] bg-[#52BD91] rounded-md">
                            <p className="text-white font-bold">GET REPORT</p>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M0.149414 9C0.149414 4.30545 3.97146 0.5 8.68649 0.5C13.4015 0.5 17.2236 4.30545 17.2236 9C17.2236 13.6946 13.4015 17.5 8.68649 17.5C3.97146 17.5 0.149414 13.6946 0.149414 9ZM8.68649 2.2C6.87515 2.2 5.138 2.91643 3.85719 4.19167C2.57638 5.46692 1.85683 7.19653 1.85683 9C1.85683 10.8035 2.57638 12.5331 3.85719 13.8083C5.138 15.0836 6.87515 15.8 8.68649 15.8C10.4978 15.8 12.235 15.0836 13.5158 13.8083C14.7966 12.5331 15.5161 10.8035 15.5161 9C15.5161 7.19653 14.7966 5.46692 13.5158 4.19167C12.235 2.91643 10.4978 2.2 8.68649 2.2Z"
                                    fill="#F8F8F8"
                                />
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M9.5404 4.74999C9.5404 4.52456 9.45046 4.30836 9.29036 4.14895C9.13026 3.98955 8.91311 3.89999 8.6867 3.89999C8.46028 3.89999 8.24313 3.98955 8.08303 4.14895C7.92293 4.30836 7.83299 4.52456 7.83299 4.74999V8.14999H4.41816C4.19174 8.14999 3.9746 8.23955 3.8145 8.39895C3.6544 8.55836 3.56445 8.77456 3.56445 8.99999C3.56445 9.22543 3.6544 9.44163 3.8145 9.60103C3.9746 9.76044 4.19174 9.84999 4.41816 9.84999H7.83299V13.25C7.83299 13.4754 7.92293 13.6916 8.08303 13.851C8.24313 14.0104 8.46028 14.1 8.6867 14.1C8.91311 14.1 9.13026 14.0104 9.29036 13.851C9.45046 13.6916 9.5404 13.4754 9.5404 13.25V9.84999H12.9552C13.1816 9.84999 13.3988 9.76044 13.5589 9.60103C13.719 9.44163 13.8089 9.22543 13.8089 8.99999C13.8089 8.77456 13.719 8.55836 13.5589 8.39895C13.3988 8.23955 13.1816 8.14999 12.9552 8.14999H9.5404V4.74999Z"
                                    fill="#F8F8F8"
                                />
                            </svg>
                        </Link> */}
                    </div>
                </div>

                <div className="w-full flex flex-col gap-[10px] sm:gap-[15px] lg:gap-[20px] items-center justify-center">
                    <div className="max-w-[550px] w-full flex flex-col m-auto max-h-full border border-[#182456] rounded-xl overflow-hidden">
                        <div
                            className="w-full h-[50px] flex items-center justify-center"
                            style={{
                                background: "url(/receiptbanner.png)"
                            }}
                        >
                            {/* <div className="flex items-center justify-center gap-[2px] sm:gap-[4px] lg:gap-[6px]">
                                <img src="/tlogo.png" alt="" />
                                <img src="/textLogo.png" alt="" className="max-w-[170px]" />
                            </div> */}
                        </div>

                        <div className="w-full p-[10px] sm:p-[15px] lg:p-[20px] bg-[#F6F8FF] flex flex-col gap-[5px] sm:gap-[10px] lg:gap-[15px] text-[14px] sm:text-[16px] lg:text-[14px] text-[#182456]">
                            <div className="w-full flex items-center justify-center gap-[20px]">
                                <p className="basis-[40%] font-semibold  flex items-center justify-center">
                                    Scheme Type:
                                </p>
                                <input
                                    type="text"
                                    value={schemeType}
                                    className="basis-[60%] max-w-[250px] w-full focus:outline-none p-[4px] sm:p-[3px] lg:p-[3px] text-[12px] rounded-md border border-gray-500 "
                                    onChange={(e) => setSchemeType(e.target.value)}
                                />
                            </div>
                            {/* <div className="w-full flex items-center justify-between">
                                <p className="basis-[40%]  font-semibold underline ">
                                    Group Code:
                                </p>
                                <input
                                    type="text"
                                    value={groupCode}
                                    className="basis-[60%] w-full focus:outline-none p-[4px] sm:p-[7px] lg:p-[10px] rounded-xl border-2 border-[#182456] "
                                    onChange={(e) => setGroupCode(e.target.value)}
                                />
                            </div> */}
                            <div className="w-full flex items-center justify-center gap-[5px] sm:gap-[10px] lg:gap-[15px]">
                                <div className="flex items-center justify-center gap-[2px] sm:gap-[4px] lg:gap-[6px]">
                                    <input
                                        type="radio"
                                        name="scheme"
                                        id="goldscheme"
                                        value="Gold Scheme"
                                        onChange={(e) => setGoldScheme(e.target.value)}
                                        checked={goldScheme === "Gold Scheme"}
                                    />
                                    <label htmlFor="goldscheme" className="font-semibold">
                                        Gold Scheme
                                    </label>
                                </div>
                                <div className="flex items-center justify-center gap-[2px] sm:gap-[4px] lg:gap-[6px]">
                                    <input
                                        type="radio"
                                        name="scheme"
                                        id="cashscheme"
                                        value="Cash Scheme"
                                        onChange={(e) => setGoldScheme(e.target.value)}
                                        checked={goldScheme === "Cash Scheme"}
                                    />
                                    <label htmlFor="cashscheme" className="font-semibold">
                                        Cash Scheme
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full text-[14px] flex items-center justify-center gap-[10px] sm:gap-[15px] lg:gap-[20px]">
                        <button
                            className="px-[20px] w-[120px] sm:px-[30px] rounded-md py-[2px] sm:py-[5px] bg-[#52BD91] text-white font-semibold flex items-center justify-center cursor-pointer"
                            onClick={handleSubmit}
                        >
                            {editing ? "UPDATE" : "SAVE"}
                        </button>

                        <div className="px-[20px] w-[120px] sm:px-[30px] rounded-md py-[2px] sm:py-[5px] bg-[#182456] text-white font-semibold flex items-center justify-center cursor-pointer">
                            CANCEL
                        </div>
                    </div>
                </div>

                <div className="w-full max-h-full overflow-y-auto custom-scrollbar2 p-[20px]">
                    <table className="w-full table-auto text-center max-w-[750px] mx-auto border border-black">
                        <thead className="w-full border border-black">
                            <tr className="bg-[#4FC997]">
                                <th className="border border-black p-2">ID</th>
                                <th className="border border-black p-2">Scheme Type</th>
                                <th className="border border-black p-2">Scheme Mode</th>
                                <th className="border border-black p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="w-full border border-black">
                            {schemeTypes.map((type, index) => (
                                <tr key={type.id} className={`px-1 text-[12px] ${(index % 2 == 0) ? "bg-white" : "bg-gray-100"} font-medium`}>
                                    <td className="border border-black p-2">{type.id}</td>
                                    <td className="border border-black p-2">{type.SchemeType}</td>
                                    <td className="border border-black p-2">{type.SchemeMode}</td>
                                    <td className="border border-black p-2 text-[14px]">
                                        <button className="text-blue-700 mr-2" onClick={() => handleEdit(type)}><FaRegEdit /></button>
                                        <button className="text-red-700" onClick={() => handleDelete(type.SchemeType)}><MdDelete /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SchemeType;
