"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

const SchemeName2 = () => {
    const [schemeTypes, setSchemeTypes] = useState([]);
    const [schemeType, setSchemeType] = useState("");
    const [schemeName, setSchemeName] = useState("");
    const [duration, setDuration] = useState(null);
    const [amount, setAmount] = useState(null);
    const [persons, setPersons] = useState(null);
    const [bonus, setBonus] = useState(null);
    const [bonusmonths, setBonusMonths] = useState(null);
    const [comm, setComm] = useState(null);
    const [schemevalue, setSchemeValue] = useState(0);
    const [commamt, setCommAmt] = useState(0);
    const [code, setCode] = useState();
    const [schemeNames, setSchemeNames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [continuous, setContinuous] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const inputRefs = {
        schemeType: useRef(null),
        schemeName: useRef(null),
        duration: useRef(null),
        amount: useRef(null),
        persons: useRef(null),
        bonus: useRef(null),
        bonusmonths: useRef(null),
        code: useRef(null),
        comm: useRef(null),
    };

    const fetchData = async () => {
        try {
            const response = await fetch("https://scheme-purchase-backend.vercel.app/api/schemetype/gettypes");
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }

            const data = await response.json();
            setSchemeTypes(data);
            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    };

    useEffect(() => {
        const fetchSchemeNames = async () => {
            try {
                const response = await fetch("https://scheme-purchase-backend.vercel.app/api/schemename/getnames", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();
                setSchemeNames(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSchemeNames();
        fetchData();
    }, []);

    const handleDelete = async (schemeName) => {
        try {
            const response = await fetch(`https://scheme-purchase-backend.vercel.app/api/schemename/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ schemeName }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error);
                return;
            }

            setSchemeNames(schemeNames.filter((type) => type.SchemeName !== schemeName));
            alert("Scheme Name deleted successfully");
        } catch (error) {
            console.error("Error deleting scheme name:", error);
            alert("An error occurred while deleting the scheme name. Please try again.");
        }
    };

    const handleEdit = (scheme) => {
        setSchemeType(scheme.SchemeType);
        setSchemeName(scheme.SchemeName);
        setDuration(scheme.SchemeDuration);
        setAmount(scheme.SchemeAmount);
        setPersons(scheme.SchemePersons);
        setBonus(scheme.BonusAmount);
        setBonusMonths(scheme.BonusMonth);
        setComm(scheme.Commper);
        setCode(scheme.SchemeCode);
        setIsEditing(true);
        setEditId(scheme.id);
        setContinuous(scheme.Continuous);
    };

    const pushSchemeName = async () => {
        if (!schemeType || !schemeName || !duration || !amount || !persons || !bonus || !bonusmonths || !code) {
            alert("Please fill all the fields");
            return;
        }

        const payload = {
            sname: schemeName,
            schemetype: schemeType,
            samount: parseFloat(amount),
            sduration: parseFloat(duration),
            spersons: parseFloat(persons),
            bmonth: parseFloat(bonusmonths),
            bamount: parseFloat(bonus),
            svalue: parseFloat(duration * amount + bonusmonths * bonus),
            commper: parseFloat(comm),
            commamt: (comm * (duration * amount + bonusmonths * bonus)) / 100,
            code: code,
            continuous: continuous,
        };

        const url = isEditing ? `/api/schemename/update/${editId}` : "/api/schemename";
        const method = isEditing ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Network response is not ok in scheme name");
            }

            const ans = await response.json();
            alert(ans?.message);

            setSchemeNames((prevSchemeNames) => {
                if (isEditing) {
                    return prevSchemeNames.map((scheme) =>
                        scheme.id === editId ? { ...scheme, ...payload } : scheme
                    );
                } else {
                    return [...prevSchemeNames, ans.scheme];
                }
            });

            setSchemeName("");
            setDuration(null);
            setAmount(null);
            setPersons(null);
            setBonus(null);
            setBonusMonths(null);
            setComm(null);
            setCommAmt(0);
            setSchemeValue(0);
            setCode("");
            setIsEditing(false);
            setEditId(null);
        } catch (error) {
            console.error(error);
            alert("An error occurred while saving the scheme. Please try again.");
        }
    };

    const handleKeyDown = (e, nextField) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (inputRefs[nextField]) {
                inputRefs[nextField].current.focus();
            }
        }
    };

    return (
        <>
            <div className="w-full min-h-screen" style={{ background: "url(/banner.png) lightgray 50% / cover no-repeat" }}>
                <div className="w-full h-full">
                    <div className="px-[10px] sm:px-[20px] lg:px-[40px] py-[5px] sm:py-[10px] lg:py-[15px]">
                        <div
                            className="w-full h-full px-[15px] sm:px-[30px] lg:px-[45px] py-[10px] sm:py-[15px] lg:py-[15px] rounded-md flex items-center gap-[10px] sm:gap-[15px] lg:gap-[20px]"
                            style={{
                                background: "linear-gradient(270deg, #0A0E16 5.64%, #182456 97.55%)",
                            }}
                        >
                            <div className="basis-[60%] flex items-center justify-between w-full h-full">
                                <h1 className="flex-1 text-[#fff] text-[20px] sm:text-[24px] lg:text-[20px] font-semibold pl-[10px] border-l-8 rounded-s-md border-[#52BD91]">
                                    Scheme Name
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-[10px] sm:gap-[15px] lg:gap-[20px] items-center justify-center">
                        <div className="max-w-[750px] w-full flex flex-col m-auto max-h-full border border-[#182456] rounded-xl overflow-hidden">
                            <div
                                className="w-full h-[60px] flex flex-col gap-[10px] sm:gap-[15px] lg:gap-[20px] items-center justify-center bg-center bg-cover bg-no-repeat"
                                style={{
                                    background: "url(/receiptbanner.png)",
                                }}
                            ></div>

                            <div className="w-full py-[10px] px-[20px] font-semibold bg-[#F6F8FF] flex flex-col gap-[5px] sm:gap-[10px] lg:gap-[15px] text-[14px] sm:text-[16px] lg:text-[14px] text-[#182456]">
                                <div className="w-full flex gap-[5px] items-center justify-between">
                                    <div className="basis-[50%] flex flex-col items-start justify-start gap-[5px]">
                                        <label>Scheme Type:</label>
                                        <select
                                            ref={inputRefs.schemeType}
                                            className="h-[40px] px-[10px] w-full border border-[#BDBDBD] rounded-md outline-none"
                                            value={schemeType}
                                            onChange={(e) => setSchemeType(e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, "schemeName")}
                                        >
                                            <option value="">Select a Scheme Type</option>
                                            {schemeTypes.map((scheme) => (
                                                <option key={scheme.id} value={scheme.SchemeType}>
                                                    {scheme.SchemeType}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="basis-[50%] flex flex-col items-start justify-start gap-[5px]">
                                        <label>Scheme Name:</label>
                                        <input
                                            ref={inputRefs.schemeName}
                                            className="h-[40px] px-[10px] w-full border border-[#BDBDBD] rounded-md outline-none"
                                            type="text"
                                            value={schemeName}
                                            onChange={(e) => setSchemeName(e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, "duration")}
                                        />
                                    </div>
                                </div>

                                <div className="w-full flex gap-[5px] items-center justify-between">
                                    <div className="basis-[50%] flex flex-col items-start justify-start gap-[5px]">
                                        <label>Scheme Duration:</label>
                                        <input
                                            ref={inputRefs.duration}
                                            className="h-[40px] px-[10px] w-full border border-[#BDBDBD] rounded-md outline-none"
                                            type="number"
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, "amount")}
                                        />
                                    </div>

                                    <div className="basis-[50%] flex flex-col items-start justify-start gap-[5px]">
                                        <label>Scheme Amount:</label>
                                        <input
                                            ref={inputRefs.amount}
                                            className="h-[40px] px-[10px] w-full border border-[#BDBDBD] rounded-md outline-none"
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, "persons")}
                                        />
                                    </div>
                                </div>

                                <div className="w-full flex gap-[5px] items-center justify-between">
                                    <div className="basis-[50%] flex flex-col items-start justify-start gap-[5px]">
                                        <label>Persons:</label>
                                        <input
                                            ref={inputRefs.persons}
                                            className="h-[40px] px-[10px] w-full border border-[#BDBDBD] rounded-md outline-none"
                                            type="number"
                                            value={persons}
                                            onChange={(e) => setPersons(e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, "bonus")}
                                        />
                                    </div>

                                    <div className="basis-[50%] flex flex-col items-start justify-start gap-[5px]">
                                        <label>Bonus Amount:</label>
                                        <input
                                            ref={inputRefs.bonus}
                                            className="h-[40px] px-[10px] w-full border border-[#BDBDBD] rounded-md outline-none"
                                            type="number"
                                            value={bonus}
                                            onChange={(e) => setBonus(e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, "bonusmonths")}
                                        />
                                    </div>
                                </div>

                                <div className="w-full flex gap-[5px] items-center justify-between">
                                    <div className="basis-[50%] flex flex-col items-start justify-start gap-[5px]">
                                        <label>Bonus Months:</label>
                                        <input
                                            ref={inputRefs.bonusmonths}
                                            className="h-[40px] px-[10px] w-full border border-[#BDBDBD] rounded-md outline-none"
                                            type="number"
                                            value={bonusmonths}
                                            onChange={(e) => setBonusMonths(e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, "comm")}
                                        />
                                    </div>

                                    <div className="basis-[50%] flex flex-col items-start justify-start gap-[5px]">
                                        <label>Commission Percentage:</label>
                                        <input
                                            ref={inputRefs.comm}
                                            className="h-[40px] px-[10px] w-full border border-[#BDBDBD] rounded-md outline-none"
                                            type="number"
                                            value={comm}
                                            onChange={(e) => setComm(e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, "code")}
                                        />
                                    </div>
                                </div>

                                <div className="w-full flex gap-[5px] items-center justify-between">
                                    <div className="basis-[50%] flex flex-col items-start justify-start gap-[5px]">
                                        <label>Scheme Code:</label>
                                        <input
                                            ref={inputRefs.code}
                                            className="h-[40px] px-[10px] w-full border border-[#BDBDBD] rounded-md outline-none"
                                            type="text"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, "continuous")}
                                        />
                                    </div>

                                    <div className="basis-[50%] flex flex-col items-start justify-start gap-[5px]">
                                        <label>Continuous:</label>
                                        <input
                                            type="checkbox"
                                            checked={continuous}
                                            onChange={(e) => setContinuous(e.target.checked)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="w-full py-[10px] px-[20px] flex gap-[10px] sm:gap-[15px] lg:gap-[20px]">
                                <button
                                    onClick={pushSchemeName}
                                    className="h-[40px] px-[20px] bg-[#182456] text-[#fff] rounded-md"
                                >
                                    {isEditing ? "Update Scheme" : "Add Scheme"}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="px-[10px] sm:px-[20px] lg:px-[40px] py-[5px] sm:py-[10px] lg:py-[15px]">
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : (
                            <table className="w-full border-collapse border border-[#182456]">
                                <thead>
                                    <tr>
                                        <th className="border border-[#182456] px-[10px] py-[5px]">Scheme Name</th>
                                        <th className="border border-[#182456] px-[10px] py-[5px]">Scheme Type</th>
                                        <th className="border border-[#182456] px-[10px] py-[5px]">Duration</th>
                                        <th className="border border-[#182456] px-[10px] py-[5px]">Amount</th>
                                        <th className="border border-[#182456] px-[10px] py-[5px]">Persons</th>
                                        <th className="border border-[#182456] px-[10px] py-[5px]">Bonus Amount</th>
                                        <th className="border border-[#182456] px-[10px] py-[5px]">Bonus Months</th>
                                        <th className="border border-[#182456] px-[10px] py-[5px]">Commission</th>
                                        <th className="border border-[#182456] px-[10px] py-[5px]">Scheme Code</th>
                                        <th className="border border-[#182456] px-[10px] py-[5px]">Continuous</th>
                                        <th className="border border-[#182456] px-[10px] py-[5px]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {schemeNames.map((scheme) => (
                                        <tr key={scheme.id}>
                                            <td className="border border-[#182456] px-[10px] py-[5px]">{scheme.SchemeName}</td>
                                            <td className="border border-[#182456] px-[10px] py-[5px]">{scheme.SchemeType}</td>
                                            <td className="border border-[#182456] px-[10px] py-[5px]">{scheme.SchemeDuration}</td>
                                            <td className="border border-[#182456] px-[10px] py-[5px]">{scheme.SchemeAmount}</td>
                                            <td className="border border-[#182456] px-[10px] py-[5px]">{scheme.SchemePersons}</td>
                                            <td className="border border-[#182456] px-[10px] py-[5px]">{scheme.BonusAmount}</td>
                                            <td className="border border-[#182456] px-[10px] py-[5px]">{scheme.BonusMonth}</td>
                                            <td className="border border-[#182456] px-[10px] py-[5px]">{scheme.CommisionPercentage}</td>
                                            <td className="border border-[#182456] px-[10px] py-[5px]">{scheme.SchemeCode}</td>
                                            <td className="border border-[#182456] px-[10px] py-[5px]">{scheme.SchemeContinuous ? "Yes" : "No"}</td>
                                            <td className="border border-[#182456] px-[10px] py-[5px] flex gap-[10px] justify-center">
                                                <button
                                                    onClick={() => handleEdit(scheme)}
                                                    className="bg-blue-500 text-white px-[10px] py-[5px] rounded-md"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(scheme.id)}
                                                    className="bg-red-500 text-white px-[10px] py-[5px] rounded-md"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default SchemeName2;

