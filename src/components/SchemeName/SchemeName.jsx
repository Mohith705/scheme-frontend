"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const SchemeName = () => {
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

  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchSchemeNames = async () => {
      try {
        const response = await fetch('https://scheme-purchase-backend.vercel.app/api/schemename/getnames', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
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
  }, []);

  const handleDelete = async (schemeName) => {
    try {
      const response = await fetch(`https://scheme-purchase-backend.vercel.app/api/schemename/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ schemeName }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);  // Show the error message
        return;
      }

      // Remove the deleted item from the state
      setSchemeNames(schemeNames.filter((type) => type.SchemeName !== schemeName));
      alert('Scheme Name deleted successfully');
    } catch (error) {
      console.error('Error deleting scheme name:', error);
      alert('An error occurred while deleting the scheme name. Please try again.');
    }
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

  const handleEdit = (scheme) => {
    setEditing(true);
    setEditingId(scheme.id);
    setSchemeType(scheme.SchemeType);
    setSchemeName(scheme.SchemeName);
    setDuration(scheme.SchemeDuration);
    setAmount(scheme.SchemeAmount);
    setPersons(scheme.SchemePersons);
    setBonus(scheme.BonusAmount);
    setBonusMonths(scheme.BonusMonth);
    setComm(scheme.Commper);
    setCode(scheme.SchemeCode);
  }

  const pushSchemeName = async () => {
    const data = {
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
      continuous: continuous
    }

    // console.log(data);

    // if (!schemeType || !schemeName || !duration || !amount || !persons || !bonus || !bonusmonths || !code) {
    //   alert("Please fill all the fields");
    //   return;
    // }

    try {
      let response;

      if (editing) {
        response = await fetch("https://scheme-purchase-backend.vercel.app/api/schemename/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...data, id: editingId }),
        })
      } else {
        response = await fetch("https://scheme-purchase-backend.vercel.app/api/schemename", {
          method: "POST",
          body: JSON.stringify(data),
        });
      }

      if (!response.ok) {
        throw new Error("Network response is not ok in scheme name");
      }

      const ans = await response.json();

      alert(ans?.message);
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
      window.location.reload();
    } catch (error) {
      console.error(error);
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
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => { }, [duration, amount, bonus, bonusmonths]);

  const inputRefs = {
    schemeType: useRef(null),
    schemeName: useRef(null),
    duration: useRef(null),
    amount: useRef(null),
    persons: useRef(null),
    bonus: useRef(null),
    bonusmonths: useRef(null),
    code: useRef(null),
    comm: useRef(null)
  };

  // Function to handle key down event and move to next input on Enter key
  const handleKeyDown = (e, nextField) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputRefs[nextField]) {
        inputRefs[nextField].current.focus();
      }
    }
  };

  useEffect(() => {
  }, [schemeName, duration, amount, persons, bonus, bonusmonths, comm, code, editing, editingId])

  return (
    <>
      <div
        className="w-full min-h-screen"
        style={{ background: "url(/banner.png) lightgray 50% / cover no-repeat" }}
      >
        <div className="w-full h-full">
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
                  Scheme Name
                </h1>
              </div>

              {/* <Link href={"/schemename/namereport"} className=" cursor-pointer h-[45px] w-[250px] px-[5px] sm:px-[10px] lg:px-[15px] flex items-center justify-center gap-[5px] bg-[#52BD91] rounded-md">
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
            <div className="max-w-[750px] w-full flex flex-col m-auto max-h-full border border-[#182456] rounded-xl overflow-hidden">
              <div
                className="w-full h-[60px] flex flex-col gap-[10px] sm:gap-[15px] lg:gap-[20px] items-center justify-center bg-center bg-cover bg-no-repeat" style={{
                  background: "url(/receiptbanner.png)"
                }}

              >
                {/* <div className="flex items-center justify-center gap-[2px] sm:gap-[4px] lg:gap-[6px]">
                  <img src="/tlogo.png" alt="" />
                  <img src="/textLogo.png" alt="" className="max-w-[170px]" />
                </div> */}
              </div>

              <div className="w-full py-[10px] px-[20px] font-semibold bg-[#F6F8FF] flex flex-col gap-[5px] sm:gap-[10px] lg:gap-[15px] text-[14px] sm:text-[16px] lg:text-[14px] text-[#182456]">
                <div className="w-full flex gap-[5px] items-center justify-between">
                  <div className="basis-[50%] flex flex-col items-start justify-center">
                    <p className="font-bold text-[14px] sm:text-[15px] lg:text-[15px]">
                      Scheme Type:
                    </p>
                    <select
                      name="schemetype"
                      className="p-[10px] text-[12px] sm:p-[5px] max-w-[300px] w-full rounded-lg focus:outline-none border border-gray-500"
                      value={schemeType}
                      onChange={(e) => setSchemeType(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, 'schemeName')}
                      ref={inputRefs.schemeType}
                    >
                      <option value="">Select Scheme Type</option>
                      {schemeTypes?.map((type) => (
                        <option key={type?.id} value={type?.SchemeType}>
                          {type?.SchemeType}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="basis-[50%]">
                    <label htmlFor="schemename" className="text-[15px]">Scheme name</label>
                    <input
                      type="text"
                      className=" p-[4px] focus:outline-none border max-w-[300px] text-[12px] border-black rounded-md w-full"
                      placeholder="Enter Scheme Name"
                      value={schemeName}
                      onChange={(e) => setSchemeName(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, 'duration')}
                      ref={inputRefs.schemeName}
                    />
                  </div>
                </div>
                <div className="w-full flex items-center justify-center gap-[10px] sm:gap-[15px]">
                  <div className="basis-[33%]" >
                    <label htmlFor="duration" className="text-[15px]">Duration</label>
                    <input
                      type="text"
                      className=" p-[4px] focus:outline-none text-[12px] border border-gray-500 rounded-md w-full"
                      placeholder="Enter Duration"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, 'amount')}
                      ref={inputRefs.duration}
                    />
                  </div>
                  <div className="basis-[33%]">
                    <label htmlFor="amount" className="text-[15px]">Amount</label>
                    <input
                      type="text"
                      className=" p-[4px] focus:outline-none text-[12px] border border-gray-500 rounded-md w-full"
                      placeholder="Enter Amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, 'persons')}
                      ref={inputRefs.amount}
                    />
                  </div>
                  <div className="basis-[33%]">
                    <label htmlFor="persons" className="text-[15px]">No.of Persons</label>
                    <input
                      type="text"
                      name="persons"
                      value={persons}
                      className=" p-[4px] focus:outline-none border border-gray-500 text-[12px] rounded-md w-full"
                      placeholder="Enter Capacity"
                      onChange={(e) => setPersons(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, 'bonus')}
                      ref={inputRefs.persons}
                    />
                  </div>
                </div>
                <div className="w-full flex items-center justify-center gap-[10px] sm:gap-[15px]">
                  <div className="basis-[33%]">
                    <label htmlFor="bonus" className="text-[15px]">Bonus Amount</label>
                    <input
                      type="text"
                      className=" p-[4px] focus:outline-none border border-gray-500 text-[12px] rounded-md w-full"
                      placeholder="Enter Bonus Amount"
                      value={bonus}
                      onChange={(e) => setBonus(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, 'bonusmonths')}
                      ref={inputRefs.bonus}
                    />
                  </div>
                  <div className="basis-[33%]">
                    <label htmlFor="months" className="text-[15px]">Bonus Months</label>
                    <input
                      type="text"
                      name="months"
                      className=" p-[4px] focus:outline-none border border-gray-500 text-[12px] rounded-md w-full"
                      placeholder="Enter Bonus Months"
                      value={bonusmonths}
                      onChange={(e) => setBonusMonths(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, 'code')}
                      ref={inputRefs.bonusmonths}
                    />
                  </div>
                  <div className="basis-[33%]">
                    <label htmlFor="schemevalue" className="text-[15px]">Scheme Value</label>
                    <input
                      type="text"
                      className=" p-[4px] focus:outline-none border border-gray-500 rounded-md text-[12px] w-full"
                      placeholder=" Scheme Value"
                      value={duration * amount + bonusmonths * bonus}
                      readOnly
                    />
                  </div>
                </div>
                <div className="w-full flex items-center justify-center gap-[10px] sm:gap-[15px]">
                  <div className="basis-[66%] w-full flex items-start justify-center gap-[10px] sm:gap-[15px]">
                    <div className="basis-[50%] w-full">
                      <label htmlFor="comm" className="text-[15px]">Scheme Code</label>
                      <input
                        type="text"
                        className=" p-[4px] focus:outline-none border border-gray-500 rounded-md text-[12px] w-full"
                        placeholder="Enter Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, 'comm')}
                        ref={inputRefs.code}
                      />
                    </div>
                    <div className="basis-[50%] w-full">
                      <label htmlFor="comm" className="text-[15px]">Emp Comm(%)</label>
                      <input
                        type="text"
                        className=" p-[4px] focus:outline-none border border-gray-500 rounded-md text-[12px] w-full"
                        placeholder="Enter Emp Comm"
                        value={comm}
                        onChange={(e) => setComm(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, 'saveButton')}
                        ref={inputRefs.comm}
                      />
                      <p className="text-[12px]">
                        Employee Commission will be:-{" "}
                        {(comm * (duration * amount + bonusmonths * bonus)) / 100}
                      </p>
                    </div>
                  </div>

                  <div className="basis-[33%] h-full flex items-center justify-center gap-[10px]">
                    <label htmlFor="continuous" className="text-[15px]">Continuous Card No</label>
                    <input
                      type="checkbox"
                      name="continuous"
                      checked={continuous}
                      onChange={(e) => setContinuous(e.target.checked)}
                      value={continuous}
                      className=" p-[4px] focus:outline-none border border-gray-500 rounded-md"
                    />
                  </div>
                </div>

              </div>
            </div>

            <div className="w-full text-[14px] flex items-center justify-center gap-[10px] sm:gap-[15px] lg:gap-[20px]">
              <button
                onClick={() => pushSchemeName()}
                className="px-[20px] sm:px-[30px] w-[120px] rounded-md py-[2px] sm:py-[5px] bg-[#52BD91] text-white font-semibold flex items-center justify-center cursor-pointer"
                ref={inputRefs.saveButton}
              >
                {editing ? "UPDATE" : "SAVE"}
              </button>

              <div className="px-[20px] sm:px-[30px] w-[120px] rounded-md py-[2px] sm:py-[5px] bg-[#182456] text-white font-semibold flex items-center justify-center cursor-pointer">
                CANCEL
              </div>
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
                  <th className="border border-black p-1">Scheme Amount</th>
                  <th className="border border-black p-1">Scheme Duration</th>
                  <th className="border border-black p-1">Scheme Persons</th>
                  <th className="border border-black p-1">Bonus Months</th>
                  <th className="border border-black p-1">Bonus Amount</th>
                  <th className="border border-black p-1">Scheme Value</th>
                  <th className="border border-black p-1">Commission Per</th>
                  <th className="border border-black p-1">Commission Amount</th>
                  <th className="border border-black p-1">Actions</th>
                </tr>
              </thead>
              <tbody className="w-full border border-black">
                {schemeNames.map((type, index) => (
                  <tr key={type.id} className={`px-1 text-[12px] font-medium ${(index % 2 == 0) ? "bg-white" : "bg-gray-100 "}`}>
                    <td className="border border-black p-1">{type.id}</td>
                    <td className="border border-black p-1">{type.SchemeCode}</td>
                    <td className="border border-black p-1">{type.SchemeType}</td>
                    <td className="border border-black p-1">{type.SchemeName}</td>
                    <td className="border border-black p-1">{type.SchemeAmount}</td>
                    <td className="border border-black p-1">{type.SchemeDuration}</td>
                    <td className="border border-black p-1">{type.SchemePersons}</td>
                    <td className="border border-black p-1">{type.BonusMonth}</td>
                    <td className="border border-black p-1">{type.BonusAmount}</td>
                    <td className="border border-black p-1">{type.SchemeValue}</td>
                    <td className="border border-black p-1">{type.Commper}</td>
                    <td className="border border-black p-1">{type.Commamt}</td>
                    <td className="border border-black p-1 text-[14px]">
                      <button className="text-blue-700 " onClick={() => handleEdit(type)}><FaRegEdit /></button>
                      <button className="text-red-700" onClick={() => handleDelete(type.SchemeName)}><MdDelete /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


        </div>
      </div>
    </>
  );
};

export default SchemeName;
