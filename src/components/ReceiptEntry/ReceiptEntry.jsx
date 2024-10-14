"use client";

import React, { useEffect, useRef, useState } from "react";
import { GiClick } from "react-icons/gi";
import { TbListDetails } from "react-icons/tb";
import { RiSecurePaymentLine } from "react-icons/ri";
import { FaTrash } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const ReceiptEntry = () => {

  const goldrate = 82.22;

  const cashDescRef = useRef(null);
  const cashAmountRef = useRef(null);
  const cardDescRef = useRef(null);
  const cardAmountRef = useRef(null);
  const onlineDescRef = useRef(null);
  const onlineAmountRef = useRef(null);
  const onlineParticularsRef = useRef(null);
  const onlineAccRef = useRef(null);
  const upiDescRef = useRef(null);
  const upiAmountRef = useRef(null);
  const upiParticularsRef = useRef(null);
  const upiAccRef = useRef(null);

  const inputRefs = {
    GoldWtBtn: useRef(null),
    AmountBtn: useRef(null),
    InchargeBtn: useRef(null),
    NarrationBtn: useRef(null),
    SubmitBtn: useRef(null),
  }

  const [nextReceiptNumber, setNextReceiptNumber] = useState(null);

  useEffect(() => {
    const fetchNextReceiptNumber = async () => {
      try {
        const response = await fetch('https://scheme-purchase-backend.vercel.app/api/receipt/generatereceiptno');
        if (!response.ok) {
          throw new Error('Failed to fetch the next receipt number');
        }
        const data = await response.json();
        setNextReceiptNumber(data.nextReceiptNumber);
      } catch (error) {
        console.error('Error fetching the next receipt number:', error);
      }
    };

    fetchNextReceiptNumber();
  }, []);

  const [CardNo, setCardNo] = useState("");
  const [ShemeData, setShemeData] = useState({});
  const [receiptData, setReceiptData] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [receiptNo, setReceiptNo] = useState("");
  const [selectedOption, setSelectedOption] = useState(true);
  // const [paymentMode, setPaymentMode] = useState("");
  const [amount, setAmount] = useState(null);
  const [GoldWt, setGoldWt] = useState(parseFloat(parseFloat(ShemeData?.scheme?.SchemeAmount) / parseFloat(goldrate)).toFixed(2));
  const [GoldAmount, setGoldAmount] = useState(null);
  const [Description, setDescription] = useState("");
  const [Incharge, setIncharge] = useState("");
  // const [accno, setAccno] = useState("");

  const [receipts, setReceipts] = useState([]);

  const [cards, setCards] = useState([]);
  const [online, setOnline] = useState([]);
  const [upi, setUpi] = useState([]);
  const [selectedModes, setSelectedModes] = useState([]);

  useEffect(() => {
    const fetchReceipts = async () => {
      const response = await fetch('https://scheme-purchase-backend.vercel.app/api/receipt/getallreceipts');
      const data = await response.json();
      setReceipts(data);
    };

    fetchReceipts();
  }, []);

  const fetchmember = async () => {
    try {
      const response = await fetch("https://scheme-purchase-backend.vercel.app/api/memberdiscontinue/checkstatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cardno: CardNo,
        }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.settled || data.discontinued) {
        alert("Member is already settled or discontinued.");

        // Reset related state variables
        setCardNo("");
        setShemeData({});
        setCashdesc("");
        setCarddesc("");
        setOnlinedesc("");
        setUpidesc("");
        setCashamount(0);
        setCardamount(0);
        setOnlineamount(0);
        setUpiamount(0);
        setOnlineparticulars("");
        setUpiparticulars("");
        setOnlineacc("");
        setUpiacc("");
        setEntries([]);
        setReceiptNo("");
        setSelectedOption(true);
        setAmount(null);
        setGoldWt(null);
        setGoldAmount(null);
        setDescription("");
        setIncharge("");
        setReceipts([]);
        setCards([]);
        setOnline([]);
        setUpi([]);
        setSelectedModes([]);
      } else {
        // Member is not settled or discontinued, proceed with fetching
        const fetchResponse = await fetch("https://scheme-purchase-backend.vercel.app/api/schememember/fetchmember", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            cardno: CardNo,
          }),
        });

        if (!fetchResponse.ok) {
          throw new Error(`Network response was not ok: ${fetchResponse.statusText}`);
        }

        const memberData = await fetchResponse.json();
        setShemeData(memberData);
      }
    } catch (error) {
      console.error(error);
    }
  };


  const handleKeyDown = (event, mode) => {
    if (event.key === 'Enter') {
      switch (mode) {
        case 'Cash':
          if (event.target === cashDescRef.current) {
            event.preventDefault();
            cashAmountRef.current.focus();
          } else if (event.target === cashAmountRef.current) {
            event.preventDefault();
            handleAddEntry('Cash', '', '', cashdesc, cashamount);
          }
          break;
        case 'Card':
          if (event.target === cardDescRef.current) {
            event.preventDefault();
            cardAmountRef.current.focus();
          } else if (event.target === cardAmountRef.current) {
            event.preventDefault();
            handleAddEntry('Card', '', '', carddesc, cardamount);
          }
          break;
        case 'Online':
          if (event.target === onlineParticularsRef.current) {
            event.preventDefault();
            onlineAccRef.current.focus();
          }
          if (event.target === onlineAccRef.current) {
            event.preventDefault();
            onlineDescRef.current.focus();
          }
          if (event.target === onlineDescRef.current) {
            event.preventDefault();
            onlineAmountRef.current.focus();
          }
          if (event.target === onlineAmountRef.current) {
            event.preventDefault();
            handleAddEntry('Online', onlineparticulars, onlineacc, onlinedesc, onlineamount);
          }
          break;
        case 'UPI':
          if (event.target === upiParticularsRef.current) {
            event.preventDefault();
            upiAccRef.current.focus();
          }
          if (event.target === upiAccRef.current) {
            event.preventDefault();
            upiDescRef.current.focus();
          }
          if (event.target === upiDescRef.current) {
            event.preventDefault();
            upiAmountRef.current.focus();
          }
          if (event.target === upiAmountRef.current) {
            event.preventDefault();
            handleAddEntry('UPI', upiparticulars, upiacc, upidesc, upiamount);
          }
          break;
        default:
          break;
      }
    }
  };


  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch('https://scheme-purchase-backend.vercel.app/api/payments/getpaymentmethods');
        const data = await response.json();

        // Segregate data based on PMODE
        const cardData = data.filter(item => item.PMODE === 'CARD');
        const onlineData = data.filter(item => item.PMODE === 'ONLINE');
        const upiData = data.filter(item => item.PMODE === 'UPI');

        // Update useStates
        setCards(cardData);
        setOnline(onlineData);
        setUpi(upiData);
      } catch (error) {
        console.error('Error fetching payment methods:', error);
      }
    };

    fetchPaymentMethods();
  }, []);

  const [cashdesc, setCashdesc] = useState("");
  const [carddesc, setCarddesc] = useState("");
  const [onlinedesc, setOnlinedesc] = useState("");
  const [upidesc, setUpidesc] = useState("");
  const [cashamount, setCashamount] = useState(0);
  const [cardamount, setCardamount] = useState(0);
  const [onlineamount, setOnlineamount] = useState(0);
  const [upiamount, setUpiamount] = useState(0);
  const [onlineparticulars, setOnlineparticulars] = useState("");
  const [upiparticulars, setUpiparticulars] = useState("");
  const [onlineacc, setOnlineacc] = useState("");
  const [upiacc, setUpiacc] = useState("");

  const [entries, setEntries] = useState([]);

  const createReceipt = async () => {
    if (!amount || !GoldWt) {
      alert('Please fill all the required fields');
      return;
    }

    if (amount > ShemeData?.scheme?.SchemeAmount) {
      alert("You have paid more than the scheme amount");
      return;
    }
    else if (amount < ShemeData?.scheme?.SchemeAmount) {
      alert("You have paid less than the scheme amount");
      return;
    }

    try {
      const response = await fetch("https://scheme-purchase-backend.vercel.app/api/receipt/createreceipt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rno: nextReceiptNumber.toString(),
          cardno: CardNo,
          rdate: receiptData,
          mno: ShemeData?.member?.Mobile1,
          mname: ShemeData?.member?.MemberName,
          address: ShemeData?.member?.Address,
          cpoint: selectedOption,
          CashDesc: cashdesc,
          CashAmount: cashamount,
          CardDesc: carddesc,
          CardAmount: cardamount,
          OnlineParticulars: onlineparticulars,
          OnlineAcc: onlineacc,
          OnlineDesc: onlinedesc,
          OnlineAmount: onlineamount,
          UPIParticulars: upiparticulars,
          UPIAcc: upiacc,
          UPIDesc: upidesc,
          UPIAmount: upiamount,
          desc: "",
          amount: parseFloat(amount),
          gamount: parseFloat(amount),
          incharge: "",
          gweight: parseFloat((parseFloat(amount) / parseFloat(goldrate)).toFixed(2)),
          months: ShemeData?.receipt?.length,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        window.alert("Receipt Created Successfully");
        window.location.reload();

        // Reset all state variables to their initial values
        setCashdesc("");
        setCarddesc("");
        setOnlinedesc("");
        setUpidesc("");
        setCashamount(0);
        setCardamount(0);
        setOnlineamount(0);
        setUpiamount(0);
        setOnlineparticulars("");
        setUpiparticulars("");
        setOnlineacc("");
        setUpiacc("");
        setEntries([]);
        setCardNo("");
        setShemeData({});
        setReceiptData(new Date().toISOString().split("T")[0]);
        setReceiptNo("");
        setSelectedOption(true);
        setAmount(null);
        setGoldWt(null);
        setGoldAmount(null);
        setDescription("");
        setIncharge("");
        setReceipts([]);
        setCards([]);
        setOnline([]);
        setUpi([]);
        setSelectedModes([]);
      } else {
        window.alert("Error Occurred: " + data.error);
      }
    } catch (e) {
      console.error(e);
      window.alert("Error Occurred while creating Receipt");
    }
  };


  const handleDelete = async (receiptNo) => {
    const response = await fetch(`https://scheme-purchase-backend.vercel.app/api/receipt/${receiptNo}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert("Deleted successfully");
      setReceipts(receipts.filter(receipt => receipt.ReceiptNo !== receiptNo));
    } else {
      const errorData = await response.json();
      console.error("Failed to delete receipt:", errorData.error);
    }
  };

  // const handleModeChange = (mode) => {
  //   setSelectedModes((prevModes) => {
  //     if (prevModes.includes(mode)) {
  //       return prevModes.filter((m) => m !== mode);
  //     } else {
  //       return [...prevModes, mode];
  //     }
  //   });
  // };

  const handleModeChange = (mode) => {
    if (selectedModes.includes(mode)) {
      setSelectedModes(selectedModes.filter((m) => m !== mode));
    } else {
      setSelectedModes([mode]);
    }
  };

  const handleDeleteEntry = (index) => {
    setEntries((prevEntries) => {
      // Save the entry to be deleted
      const deletedEntry = prevEntries[index];

      // Filter out the entry from entries
      const updatedEntries = prevEntries.filter((entry, i) => i !== index);

      // Reset corresponding state variables based on the deleted entry
      switch (deletedEntry.mode) {
        case 'Cash':
          setCashdesc('');
          setCashamount(0);
          break;
        case 'Card':
          setCarddesc('');
          setCardamount(0);
          break;
        case 'Online':
          setOnlinedesc('');
          setOnlineamount(0);
          setOnlineparticulars('');
          setOnlineacc('');
          break;
        case 'UPI':
          setUpidesc('');
          setUpiamount(0);
          setUpiparticulars('');
          setUpiacc('');
          break;
        default:
          break;
      }

      return updatedEntries;
    });
  };


  const handleAddEntry = (mode, particulars, acc, desc, amount) => {
    const existingEntry = entries.find(entry => entry.mode === mode);
    if (existingEntry) {
      alert(`Entry for ${mode} already exists.`);
    } else {
      setEntries([...entries, { mode, particulars, acc, desc, amount }]);
      // Reset form fields
    }
  };

  const handleKeyDown2 = (e, nextField) => {
    console.log(nextField);
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputRefs[nextField]) {
        inputRefs[nextField].current.focus();
      }
    }
  };

  // console.log(cashamount);


  // console.log(ShemeData?.receipt?.length)

  const calculateTotal = () => {
    return entries.reduce((total, entry) => total + entry.amount, 0);
  };

  useEffect(() => {
    const totalAmount = calculateTotal();
    setAmount(totalAmount.toFixed(2)); // Adjust formatting as needed
  }, [entries]);

  // console.log(parseFloat(parseFloat(ShemeData?.scheme?.SchemeAmount)/parseFloat(goldrate)).toFixed(2));

  return (
    <div className="w-full max-h-[100000px]">
      <div className="w-full h-full flex flex-col gap-[10px] sm:gap-[15px] lg:gap-[5px]">



        <div className="px-[10px] sm:px-[20px] lg:px-[20px] py-[5px] sm:py-[10px] lg:py-[10px]">
          <div
            className="w-full h-full px-[15px] sm:px-[30px] lg:px-[45px] py-[10px] sm:py-[10px] lg:py-[10px] rounded-md flex items-center gap-[5px] sm:gap-[8px] lg:gap-[12px]"
            style={{
              background:
                "linear-gradient(270deg, #0A0E16 5.64%, #182456 97.55%)",
            }}
          >
            <div className="basis-[60%] flex items-center justify-between w-full h-full">
              <h1 className="text-[#fff] text-[20px] sm:text-[24px] lg:text-[20px] font-semibold pl-[10px] border-l-8 rounded-s-md border-[#52BD91]">
                Receipt Entry
              </h1>

              <div className="flex gap-[10px] items-center text-center justify-center">
                <p className="text-white text-[14px] sm:text-[15px] lg:text-[16px] font-semibold">
                  Financial Year
                </p>
                <p className="text-[#52BD91] text-[14px] sm:text-[17px] lg:text-[18px] font-bold">
                  {new Date().getFullYear()}-{new Date().getFullYear() + 1}
                </p>
              </div>
            </div>

          </div>
        </div>



        <div className="flex gap-[10px] w-full h-full px-[20px]">
          <div className="basis-[80%] w-full h-full flex flex-col">
            <div
              className="w-full h=full p-[3px] flex flex-col gap-[5px] sm:gap-[9px] lg:gap-[13px] items-center justify-center bg-center bg-cover bg-no-repeat"
              style={{
                background:
                  " url(/receiptbanner.png) ",
              }}
            >
              <div className="w-full flex items-center justify-center gap-[10px] sm:gap-[15px] lg:gap-[20px] text-[14px] sm:text-[16px] lg:text-[14px] font-semibold text-[#0D1327] px-[20px]">
                <div className="basis-[33%] w-full flex flex-col justify-start items-center text-start">
                  <h1 className=" pb-[2px] sm:px-[3px] lg:px-[4px]">
                    Receipt No
                  </h1>
                  <input
                    type="text"
                    value={nextReceiptNumber}
                    readOnly
                    className="rounded-md text-center  focus:outline-none px-[5px] sm:px-[10px] lg:px-[15px] py-[2px] sm:py-[4px] lg:py-[4px] max-w-[150px] w-full"
                  />
                </div>



                <div className="basis-[33%]  w-full flex flex-col justify-start items-center text-start">
                  <h1 className=" pb-[2px] sm:px-[3px] lg:px-[4px]">
                    Rec Date
                  </h1>
                  <input
                    type="date"
                    value={receiptData}
                    onChange={(e) => setReceiptData(e.target.value)}
                    className="rounded-md focus:outline-none px-[5px] sm:px-[10px] lg:px-[15px] py-[2px] sm:py-[4px] lg:py-[4px] max-w-[150px] w-full"
                  />
                </div>



                <div className="basis-[33%] flex flex-col text-[14px] sm:text-[16px] w-full lg:text-[14px] items-center justify-center gap-[0px] sm:gap-[10px] lg:gap-[0px]">
                  <p className="font-bold ">Installment No</p>
                  <input
                    type="text"
                    value={ShemeData?.receipt?.length + 1}
                    className="bg-[#52BD91] text-center px-[3px] py-[3px] sm:py-[5px] focus:outline-none  rounded-lg max-w-[150px] w-full"
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col items-center justify-between gap-[5px] sm:gap-[7px] lg:gap-[7px] text-[14px] sm:text-[16px] lg:text-[18px] font-semibold text-[#0D1327] py-[10px] sm:py-[15px] lg:py-[10px]">
              <div className="flex items-center justify-between w-full">
                <div className="flex gap-[5px] sm:gap-[7px] lg:gap-[9px] items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 34 34"
                    fill="none"
                  >
                    <path
                      d="M15.6 12.8C15.6 15.124 13.724 17 11.4 17C9.076 17 7.2 15.124 7.2 12.8C7.2 10.476 9.076 8.60005 11.4 8.60005C13.724 8.60005 15.6 10.476 15.6 12.8ZM19.8 28.2H3V25.4C3 22.306 6.766 19.8 11.4 19.8C16.034 19.8 19.8 22.306 19.8 25.4M31 17V19.8H18.4V17M31 11.4V14.2H18.4V11.4M31 5.80005V8.60005H18.4V5.80005H31Z"
                      fill="#182456"
                    />
                  </svg>
                  <p className="text-[20px] sm:text-[16px] lg:text-[16px] text-[#182456]">
                    Card Details
                  </p>
                </div>



              </div>

              <div className="w-full flex items-center justify-start gap-[2px] sm:gap-[5px]">
                <p className=" w-full max-w-[60px] text-[14px] sm:text-[16px] lg:text-[14px]">
                  Card No
                </p>
                <input
                  type="text"
                  value={CardNo}
                  onChange={(e) => setCardNo(e.target.value)}
                  className="px-[5px] max-w-[200px] w-full bg-orange-500 text-center font-bold sm:px-[10px] lg:px-[15px] py-[3px] sm:py-[2px] text-[20px] sm:text-[24px] lg:text-[16px] text-[#000] focus:outline-none rounded-md "
                />
                <button
                  className="bg-[#52BD91] text-white px-[5px] sm:px-[10px] lg:px-[15px] py-[3px] sm:py-[2px] rounded-md text-[14px] "
                  onClick={() => fetchmember()}
                >
                  Search
                </button>
              </div>



              <div className="w-full grid grid-cols-3 items-start justify-between gap-[5px] sm:gap-[10px] lg:gap-[12px] pt-[0px]">

                <div className="basis-[60%] flex flex-col text-[14px] sm:text-[16px] lg:text-[16px] items-start justify-between gap-[5px] sm:gap-[10px] lg:gap-[0px]">
                  <p className="text-[10px]">Member Name</p>
                  <input
                    type="text"
                    value={ShemeData?.member?.MemberName}
                    className="px-[5px] sm:px-[10px] lg:px-[15px] py-[3px] sm:py-[2px] focus:outline-none border border-gray-500 rounded-md text-[14px] w-full"
                    readOnly
                  />
                </div>

                <div className="basis-[40%] w-full">
                  <div className="flex flex-col w-full text-[14px] sm:text-[16px] lg:text-[14px] items-start justify-center gap-[5px] sm:gap-[10px] lg:gap-[0px]">
                    <p className="text-[10px]">Mobile No</p>
                    <input
                      type="text"
                      value={ShemeData?.member?.MobileNo}
                      className="px-[5px] sm:px-[10px] lg:px-[15px] py-[3px] sm:py-[2px] focus:outline-none border border-gray-500 rounded-md w-full"
                      readOnly
                    />
                  </div>
                </div>


                <div className="flex w-full flex-col items-start justify-start">
                  <div className=" flex flex-col text-[14px] w-full items-start sm:text-[16px] lg:text-[14px] gap-[5px] sm:gap-[0px] lg:gap-[0px]">
                    <p className="text-[10px]">Address</p>
                    <textarea
                      name=""
                      id=""
                      rows={1}
                      value={ShemeData?.member?.Address}
                      className="w-full max-w-[400px] px-[5px] sm:px-[10px] lg:px-[15px] py-[3px] sm:py-[2px] focus:outline-none border border-gray-500 rounded-md "
                      readOnly
                    ></textarea>
                  </div>
                </div>

              </div>


            </div>



            <div className="mt-[5px] flex flex-col gap-[2px]">
              <div className="flex items-center justify-start ">
                <RiSecurePaymentLine size={25} />
                <h1 className=" text-[20px] sm:text-[16px] lg:text-[16px] text-[#182456] font-semibold">
                  Payment Details
                </h1>


              </div>
              <div className='w-full grid grid-cols-4 gap-[5px] items-center justify-center mb-[5px]'>
                {['Cash', 'Card', 'Online', 'UPI'].map((mode) => (
                  <button
                    key={mode}
                    className={`border flex items-center justify-center gap-[5px] border-gray-500 p-[2px] text-[14px] ${selectedModes.includes(mode) ? 'bg-[#182456] text-white' : ''}`}
                    onClick={() => handleModeChange(mode)}
                  >
                    {mode}
                    <GiClick size={20} />
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-[2px] px-[0px]">
                {selectedModes.includes('Cash') && (
                  <div className="w-full h-full grid grid-cols-4 gap-[5px] items-center justify-center">
                    <div className="flex flex-col items-start justify-center text-left w-full">
                      <p className="text-[12px]">Payment Mode</p>
                      <input type="text" value="Cash" readOnly className="w-full text-[14px] focus:outline-none border border-gray-500 p-[3px] rounded-md" />
                    </div>
                    <div className="flex flex-col items-start justify-center text-left w-full">
                      <p className="text-[12px]">Description</p>
                      <input type="text" value={cashdesc} onKeyDown={(e) => handleKeyDown(e, 'Cash')}
                        ref={cashDescRef} onChange={(e) => setCashdesc(e.target.value)} className="w-full text-[14px] focus:outline-none border border-gray-500 p-[3px] rounded-md" />
                    </div>
                    <div className="flex flex-col items-start justify-center text-left w-full">
                      <p className="text-[12px]">Amount</p>
                      <input
                        type="number"
                        value={cashamount}
                        onKeyDown={(e) => handleKeyDown(e, 'Cash')}
                        ref={cashAmountRef}
                        onChange={(e) => setCashamount(parseInt(e.target.value, 10))}
                        className="w-full text-[14px] focus:outline-none border border-gray-500 p-[3px] rounded-md"
                      />
                    </div>
                    <button onClick={() => handleAddEntry('Cash', '', '', cashdesc, cashamount)} className="border bg-[#182456] text-white border-black p-1 mt-2">
                      Add Entry
                    </button>
                  </div>
                )}

                {selectedModes.includes('Card') && (
                  <div className="w-full h-full grid grid-cols-4 gap-[5px] items-center justify-center">
                    <div className="flex flex-col items-start justify-center text-left w-full">
                      <p className="text-[12px]">Payment Mode</p>
                      <input type="text" value="Card" readOnly className="w-full text-[14px] focus:outline-none border border-gray-500 p-[3px] rounded-md" />
                    </div>
                    <div className="flex flex-col items-start justify-center text-left w-full">
                      <p className="text-[12px]">Description</p>
                      <input type="text" value={carddesc} onKeyDown={(e) => handleKeyDown(e, 'Card')}
                        ref={cardDescRef} onChange={(e) => setCarddesc(e.target.value)} className="w-full text-[14px] focus:outline-none border border-gray-500 p-[3px] rounded-md" />
                    </div>
                    <div className="flex flex-col items-start justify-center text-left w-full">
                      <p className="text-[12px]">Amount</p>
                      <input
                        type="number"
                        value={cardamount}
                        onKeyDown={(e) => handleKeyDown(e, 'Card')}
                        ref={cardAmountRef}
                        onChange={(e) => setCardamount(parseInt(e.target.value, 10))}
                        className="w-full text-[14px] focus:outline-none border border-gray-500 p-[3px] rounded-md"
                      />
                    </div>
                    <button onClick={() => handleAddEntry('Card', '', '', carddesc, cardamount)} className="border border-gray-500 bg-[#182456] text-white p-1 mt-2">
                      Add Entry
                    </button>
                  </div>
                )}

                {selectedModes.includes('Online') && (
                  <div className="w-full h-full grid grid-cols-6 gap-[5px] items-center justify-center">
                    <div className="flex flex-col items-start justify-center text-left w-full">
                      <p className="text-[12px]">Payment Mode</p>
                      <input type="text" value="Online" readOnly className="w-full text-[14px] focus:outline-none border border-gray-500 p-[3px] rounded-md" />
                    </div>
                    <div className="flex flex-col items-start justify-center text-left w-full">
                      <p className="text-[12px]">Particulars</p>
                      <select onChange={(e) => setOnlineparticulars(e.target.value)} ref={onlineParticularsRef} onKeyDown={(e) => handleKeyDown(e, 'Online')} name="online" id="online" className="text-[14px] focus:outline-none border border-gray-500 w-full rounded-md p-[3px]">
                        <option value="">Select</option>
                        {online.map((option, index) => (
                          <option key={index} value={option?.PAYMODE}>{option?.PAYMODE}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col items-start justify-center text-left w-full">
                      <p className="text-[12px]">Acc No</p>
                      <select ref={onlineAccRef} onKeyDown={(e) => handleKeyDown(e, 'Online')} onChange={(e) => setOnlineacc(e.target.value)} name="accno" id="accno" className="text-[14px] focus:outline-none border border-gray-500 w-full rounded-lg p-[3px]">
                        <option value="">Select</option>
                        {online.map((option, index) => (
                          <option key={index} value={option?.ACCNO}>{option?.ACCNO}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col items-start justify-center text-left w-full">
                      <p className="text-[12px]">Description</p>
                      <input ref={onlineDescRef} onKeyDown={(e) => handleKeyDown(e, 'Online')} type="text" value={onlinedesc} onChange={(e) => setOnlinedesc(e.target.value)} className="w-full text-[14px] focus:outline-none border border-gray-500 p-[3px] rounded-lg" />
                    </div>
                    <div className="flex flex-col items-start justify-center text-left w-full">
                      <p className="text-[12px]">Amount</p>
                      <input
                        type="number"
                        value={onlineamount}
                        ref={onlineAmountRef}
                        onKeyDown={(e) => handleKeyDown(e, 'Online')}
                        onChange={(e) => setOnlineamount(parseInt(e.target.value, 10))}
                        className="w-full text-[14px] focus:outline-none border border-gray-500 p-[3px] rounded-lg"
                      />
                    </div>
                    <button onClick={() => handleAddEntry('Online', onlineparticulars, onlineacc, onlinedesc, onlineamount)} className="border border-gray-500 p-1 bg-[#182456] text-white mt-2">
                      Add Entry
                    </button>
                  </div>
                )}

                {selectedModes.includes('UPI') && (
                  <div className="w-full h-full grid grid-cols-6 gap-[5px] items-center justify-center">
                    <div className="flex flex-col items-start justify-center text-left w-full">
                      <p className="text-[12px]">Payment Mode</p>
                      <input type="text" value="UPI" readOnly className="w-full text-[14px] focus:outline-none border border-gray-500 p-[3px] rounded-lg" />
                    </div>
                    <div className="flex flex-col items-start justify-center text-left w-full">
                      <p className="text-[12px]">Particulars</p>
                      <select ref={upiParticularsRef} onKeyDown={(e) => handleKeyDown(e, 'UPI')} onChange={(e) => setUpiparticulars(e.target.value)} name="upi" id="upi" className="text-[14px] focus:outline-none border border-gray-500 w-full rounded-lg p-[3px]">
                        <option value="">Select</option>
                        {upi.map((option, index) => (
                          <option key={index} value={option?.PAYMODE}>{option?.PAYMODE}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col items-start justify-center text-left w-full">
                      <p className="text-[12px]">Acc No.</p>
                      <select ref={upiAccRef} onKeyDown={(e) => handleKeyDown(e, 'UPI')} onChange={(e) => setUpiacc(e.target.value)} name="upiacc" id="upiacc" className="text-[14px] focus:outline-none border border-gray-500 w-full rounded-lg p-[3px]">
                        <option value="">Select</option>
                        {upi.map((option, index) => (
                          <option key={index} value={option?.ACCNO}>{option?.ACCNO}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col items-start justify-center text-left w-full">
                      <p className="text-[12px]">Description</p>
                      <input type="text" ref={upiDescRef} onKeyDown={(e) => handleKeyDown(e, 'UPI')} value={upidesc} onChange={(e) => setUpidesc(e.target.value)} className="w-full text-[14px] focus:outline-none border border-gray-500 p-[3px] rounded-lg" />
                    </div>
                    <div className="flex flex-col items-start justify-center text-left w-full">
                      <p className="text-[12px]">Amount</p>
                      <input
                        type="number"
                        value={upiamount}
                        ref={upiAmountRef}
                        onKeyDown={(e) => handleKeyDown(e, 'UPI')}
                        onChange={(e) => setUpiamount(parseInt(e.target.value, 10))}
                        className="w-full text-[14px] focus:outline-none border border-gray-500 p-[3px] rounded-lg"
                      />
                    </div>
                    <button onClick={() => handleAddEntry('UPI', upiparticulars, upiacc, upidesc, upiamount)} className="border border-gray-500 p-1 mt-2 bg-[#182456] text-white">
                      Add Entry
                    </button>
                  </div>
                )}
              </div>
              <div className="w-full px-[10px] sm:px-[20px] lg:px-[0px] mt-[0px]">
                <div className="w-full h-[75px] overflow-y-auto custom-scrollbar border border-gray-500 rounded-md">
                  <table className="w-full text-[12px] table-auto">
                    <thead>
                      <tr className="bg-[#182456] text-white">
                        <th className="p-[7px]">Sno</th>
                        <th className="p-[7px]">Payment Mode</th>
                        <th className="p-[7px]">Particulars</th>
                        <th className="p-[7px]">Account No</th>
                        <th className="p-[7px]">Description</th>
                        <th className="p-[7px]">Amount</th>
                        <th className="p-[7px]">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries.map((entry, index) => (
                        <tr key={index} className="text-center">
                          <td className="p-[5px]">{index + 1}</td>
                          <td className="p-[5px]">{entry.mode}</td>
                          <td className="p-[5px]">{entry.particulars}</td>
                          <td className="p-[5px]">{entry.acc}</td>
                          <td className="p-[5px]">{entry.desc}</td>
                          <td className="p-[5px]">{entry.amount}</td>
                          <td className="p-[5px]">
                            <button onClick={() => handleDeleteEntry(index)} className="text-red-500">
                              <FaTrash size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="w-full grid grid-cols-3 items-end justify-center gap-[5px] sm:gap-[0px] lg:gap-[10px] px-[0px]">
              <div className="w-[150px] cursor-pointer h-[35px] text-[14px] px-[5px] sm:px-[10px] lg:px-[15px] flex items-center justify-center gap-[5px] bg-[#172561] rounded-md">
                <button
                  className="text-white font-bold"
                  ref={inputRefs.SubmitBtn}
                  onClick={() => createReceipt()}
                >
                  SAVE
                </button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="17"
                  viewBox="0 0 19 17"
                  fill="none"
                >
                  <mask
                    id="mask0_215_507"
                    style={{ maskType: "luminance" }}
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="19"
                    height="17"
                  >
                    <path
                      d="M7.78768 2.88939L5.90308 1.22913C5.73645 1.08242 5.51049 1 5.27488 1C5.03927 1 4.8133 1.08242 4.64667 1.22913L2.13342 3.44268C2.05088 3.51536 1.98539 3.60164 1.94072 3.69661C1.89604 3.79158 1.87305 3.89337 1.87305 3.99617C1.87305 4.09896 1.89604 4.20076 1.94072 4.29572C1.98539 4.39069 2.05088 4.47698 2.13342 4.54965L4.01847 6.20952M11.7235 13.7783L13.6081 15.4386C13.6906 15.5113 13.7886 15.569 13.8964 15.6083C14.0042 15.6477 14.1198 15.6679 14.2365 15.6679C14.3532 15.6679 14.4688 15.6477 14.5766 15.6083C14.6845 15.569 14.7824 15.5113 14.8649 15.4386L17.3782 13.225C17.5448 13.0783 17.6384 12.8793 17.6384 12.6717C17.6384 12.4642 17.5448 12.2652 17.3782 12.1185L15.4932 10.4582"
                      stroke="white"
                      stroke-width="1.56518"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M17.3876 3.8258L14.8744 1.6123C14.5274 1.30668 13.9648 1.30668 13.6178 1.6123L1.68016 12.1264C1.33316 12.432 1.33316 12.9275 1.68016 13.2331L4.19335 15.4466C4.54035 15.7523 5.10294 15.7523 5.44994 15.4466L17.3876 4.93254C17.7346 4.62692 17.7346 4.13142 17.3876 3.8258Z"
                      fill="white"
                      stroke="white"
                      stroke-width="1.56518"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M9.53405 9.31209C10.0248 9.31209 10.4226 8.96172 10.4226 8.52951C10.4226 8.09729 10.0248 7.74692 9.53405 7.74692C9.04332 7.74692 8.64551 8.09729 8.64551 8.52951C8.64551 8.96172 9.04332 9.31209 9.53405 9.31209Z"
                      fill="black"
                    />
                    <path
                      d="M7.75671 10.8773C8.24744 10.8773 8.64526 10.5269 8.64526 10.0947C8.64526 9.66248 8.24744 9.3121 7.75671 9.3121C7.26598 9.3121 6.86816 9.66248 6.86816 10.0947C6.86816 10.5269 7.26598 10.8773 7.75671 10.8773Z"
                      fill="black"
                    />
                    <path
                      d="M11.3114 7.74691C11.8021 7.74691 12.1999 7.39653 12.1999 6.96432C12.1999 6.53211 11.8021 6.18173 11.3114 6.18173C10.8207 6.18173 10.4229 6.53211 10.4229 6.96432C10.4229 7.39653 10.8207 7.74691 11.3114 7.74691Z"
                      fill="black"
                    />
                  </mask>
                  <g mask="url(#mask0_215_507)">
                    <path
                      d="M-1.13086 -2H20.1942V16.7821H-1.13086V-2Z"
                      fill="white"
                    />
                  </g>
                </svg>
              </div>

              <div className="flex flex-col text-[14px] sm:text-[16px] w-full lg:text-[14px] items-start justify-center gap-[5px] sm:gap-[10px] lg:gap-[0px]">
                <p className=" ">Gold Wt</p>
                <input
                  type="text"
                  value={parseFloat(parseFloat(ShemeData?.scheme?.SchemeAmount) / parseFloat(goldrate)).toFixed(2)}
                  ref={inputRefs.GoldWtBtn}
                  readOnly
                  onKeyDown={(e) => handleKeyDown2(e, 'AmountBtn')}
                  className="w-full bg-red-500 focus:outline-none px-[10px] sm:px-[15px] py-[3px] sm:py-[2px] lg:py-[2px] border border-gray-500 rounded-lg text-[14px] sm:text-[16px]"
                  onChange={() => setGoldWt(parseFloat(parseFload(ShemeData?.scheme?.SchemeAmount) / parseFloat(goldrate)).toFixed(2))}
                />
              </div>

              <div className=" flex flex-col text-[14px] sm:text-[16px] w-full lg:text-[14px] items-start justify-center gap-[5px] sm:gap-[10px] lg:gap-[0px]">
                <p className=" ">Paid Amount</p>
                <input
                  type="text"
                  value={amount}
                  ref={inputRefs.AmountBtn}
                  readOnly
                  onKeyDown={(e) => handleKeyDown2(e, 'InchargeBtn')}
                  className="bg-red-500 px-[3px] py-[3px] sm:py-[2px] focus:outline-none border border-gray-500 rounded-lg w-full"
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              {/* <div className=" flex flex-col text-[14px] sm:text-[14px] lg:text-[14px] items-start justify-between ">
                <p className="font-semibold">Incharge</p>
                <input
                  type="text"
                  value={Incharge}
                  ref={inputRefs.InchargeBtn}
                  onKeyDown={(e) => handleKeyDown2(e, 'NarrationBtn')}
                  className="px-[5px] sm:px-[10px] lg:px-[15px] py-[3px] sm:py-[2px] focus:outline-none border border-gray-500 rounded-lg max-w-[350px] w-full"
                  onChange={(e) => setIncharge(e.target.value)}
                />
              </div>

              <div className=" flex flex-col text-[14px] sm:text-[14px] lg:text-[14px] items-start justify-between">
                <p className="font-semibold">Narration</p>
                <textarea
                  name=""
                  id=""
                  rows={1}
                  value={Description}
                  ref={inputRefs.NarrationBtn}
                  onKeyDown={(e) => handleKeyDown2(e, 'SubmitBtn')}
                  className="max-w-[350px] w-full px-[5px] sm:px-[10px] lg:px-[15px] py-[3px] sm:py-[2px] focus:outline-none border border-gray-500 rounded-lg"
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div> */}
            </div>
          </div>

          <div className="basis-[20%] w-full h-full rounded-md">
            <div className="flex gap-[5px] mb-[5px] sm:gap-[7px] lg:gap-[9px] items-start justify-start px-[20px]">
              <TbListDetails size={25} />
              <p className="text-[20px] sm:text-[16px] font-semibold lg:text-[16px] text-[#182456]">
                Scheme Details
              </p>
            </div>
            <div className="flex w-full flex-col gap-[4px]">
              <div style={{ background: "radial-gradient(35.46% 49.1% at 49.1% 50%, #EEF2FF 0%, #DAE2FF 100%)" }} className="rounded-md flex flex-row items-center justify-between gap-[5px] border-gray-500 h-full w-full p-[4px]">
                <p className="text-[12px] font-semibold">Scheme Type:</p>
                <p className="text-[12px]">{ShemeData?.member?.SchemeType}</p>
              </div>
              <div style={{ background: "radial-gradient(35.46% 49.1% at 49.1% 50%, #EEF2FF 0%, #DAE2FF 100%)" }} className="rounded-md flex flex-row items-center justify-between gap-[5px] border-gray-500 h-full w-full p-[4px]">
                <p className="text-[12px] font-semibold">Scheme Name:</p>
                <p className="text-[12px]">{ShemeData?.member?.SchemeName}</p>
              </div>
              <div style={{ background: "radial-gradient(35.46% 49.1% at 49.1% 50%, #EEF2FF 0%, #DAE2FF 100%)" }} className="rounded-md flex flex-row items-center justify-between gap-[5px] border-gray-500 h-full w-full p-[4px]">
                <p className="text-[12px] font-semibold">Scheme Amount:</p>
                <p className="text-[12px]">{ShemeData?.scheme?.SchemeAmount}</p>
              </div>
              <div style={{ background: "radial-gradient(35.46% 49.1% at 49.1% 50%, #EEF2FF 0%, #DAE2FF 100%)" }} className="rounded-md flex flex-row items-center justify-between gap-[5px] border-gray-500 h-full w-full p-[4px]">
                <p className="text-[12px] font-semibold">Scheme Duration:</p>
                <p className="text-[12px]">{ShemeData?.scheme?.SchemeDuration}</p>
              </div>
              <div style={{ background: "radial-gradient(35.46% 49.1% at 49.1% 50%, #EEF2FF 0%, #DAE2FF 100%)" }} className="rounded-md flex flex-row items-center justify-between gap-[5px] border-gray-500 h-full w-full p-[4px]">
                <p className="text-[12px] font-semibold">Paid Amount:</p>
                <p className="text-[12px]">{ShemeData?.receipt?.reduce(
                  (accumulator, currentItem) =>
                    accumulator + currentItem.Amount,
                  0
                ) || [0]}</p>
              </div>
              <div style={{ background: "radial-gradient(35.46% 49.1% at 49.1% 50%, #EEF2FF 0%, #DAE2FF 100%)" }} className="rounded-md flex flex-row items-center justify-between gap-[5px] border-gray-500 h-full w-full p-[4px]">
                <p className="text-[12px] font-semibold">Scheme Value:</p>
                <p className="text-[12px]">{ShemeData?.scheme?.SchemeValue}</p>
              </div>
              <div style={{ background: "radial-gradient(35.46% 49.1% at 49.1% 50%, #EEF2FF 0%, #DAE2FF 100%)" }} className="rounded-md flex flex-row items-center justify-between gap-[5px] border-gray-500 h-full w-full p-[4px]">
                <p className="text-[12px] font-semibold">Join Date:</p>
                <p className="text-[12px]">{ShemeData?.member?.JoinDate}</p>
              </div>
              <div style={{ background: "radial-gradient(35.46% 49.1% at 49.1% 50%, #EEF2FF 0%, #DAE2FF 100%)" }} className="rounded-md flex flex-row items-center justify-between gap-[5px] border-gray-500 h-full w-full p-[4px]">
                <p className="text-[12px] font-semibold">Paid Months:</p>
                <p className="text-[12px]">{ShemeData?.receipt?.length}</p>
              </div>
              <div style={{ background: "radial-gradient(35.46% 49.1% at 49.1% 50%, #EEF2FF 0%, #DAE2FF 100%)" }} className="rounded-md flex flex-row items-center justify-between gap-[5px] border-gray-500 h-full w-full p-[4px]">
                <p className="text-[12px] font-semibold">Balance Months:</p>
                <p className="text-[12px]">{ShemeData?.scheme?.SchemeDuration -
                  ShemeData?.receipt?.length}</p>
              </div>
              <div style={{ background: "radial-gradient(35.46% 49.1% at 49.1% 50%, #EEF2FF 0%, #DAE2FF 100%)" }} className="rounded-md flex flex-row items-center justify-between gap-[5px] border-gray-500 h-full w-full p-[4px]">
                <p className="text-[12px] font-semibold">Balance Amount:</p>
                <p className="text-[12px]">{ShemeData?.scheme?.SchemeValue -
                  ShemeData?.receipt?.reduce(
                    (accumulator, currentItem) =>
                      accumulator + currentItem.Amount,
                    0
                  ) || [0]}</p>
              </div>
            </div>
          </div>
        </div>








        <div className="w-full px-[20px] sm:px-[50px] lg:px-[20px] max-h-full mb-[0px]">
          {/* <div className="w-full h-full flex gap-[5px] sm:gap-[10px] lg:gap-[15px]">
            <div className="basis-[45%] border-2 border-[#182456] rounded-xl overflow-hidden">

              <div className="w-full flex flex-col items-center justify-between gap-[5px] sm:gap-[7px] lg:gap-[7px] text-[14px] sm:text-[16px] lg:text-[18px] font-semibold text-[#0D1327] py-[10px] sm:py-[15px] lg:py-[10px] px-[10px] sm:px-[10px] lg:px-[20px]">
                <div className="flex items-center justify-between w-full">
                  <div className="flex gap-[5px] sm:gap-[7px] lg:gap-[9px] items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="34"
                      height="34"
                      viewBox="0 0 34 34"
                      fill="none"
                    >
                      <path
                        d="M15.6 12.8C15.6 15.124 13.724 17 11.4 17C9.076 17 7.2 15.124 7.2 12.8C7.2 10.476 9.076 8.60005 11.4 8.60005C13.724 8.60005 15.6 10.476 15.6 12.8ZM19.8 28.2H3V25.4C3 22.306 6.766 19.8 11.4 19.8C16.034 19.8 19.8 22.306 19.8 25.4M31 17V19.8H18.4V17M31 11.4V14.2H18.4V11.4M31 5.80005V8.60005H18.4V5.80005H31Z"
                        fill="#182456"
                      />
                    </svg>
                    <p className="text-[20px] sm:text-[24px] lg:text-[20px] text-[#182456]">
                      Card Details
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-[2px] sm:gap-[5px]">
                    <p className=" text-[14px] sm:text-[16px] lg:text-[14px]">
                      Card No
                    </p>
                    <input
                      type="text"
                      value={CardNo}
                      onChange={(e) => setCardNo(e.target.value)}
                      className="px-[5px] w-full max-w-[150px] bg-orange-500 text-center font-bold sm:px-[10px] lg:px-[15px] py-[3px] sm:py-[2px] text-[20px] sm:text-[24px] lg:text-[16px] text-[#000] focus:outline-none border border-black rounded-md"
                    />
                  </div>
                  <button
                    className="bg-[#52BD91] text-white px-[5px] sm:px-[10px] lg:px-[15px] py-[3px] sm:py-[2px] rounded-md text-[14px] -ml-[20px]"
                    onClick={() => fetchmember()}
                  >
                    Search
                  </button>
                </div>



                <div className="w-full flex items-start justify-between gap-[5px] sm:gap-[10px] lg:gap-[12px] pt-[10px]">


                  <div className="basis-[60%] flex flex-col text-[14px] sm:text-[16px] lg:text-[16px] items-start justify-between gap-[5px] sm:gap-[10px] lg:gap-[0px]">
                    <p className="text-[12px]">Member Name</p>
                    <input
                      type="text"
                      value={ShemeData?.member?.MemberName}
                      className="px-[5px] sm:px-[10px] lg:px-[15px] py-[3px] sm:py-[2px] focus:outline-none border border-black rounded-md text-[14px] w-full"
                      readOnly
                    />
                  </div>

                  <div className="basis-[40%] w-full">
                    <div className="flex flex-col w-full text-[14px] sm:text-[16px] lg:text-[14px] items-start justify-center gap-[5px] sm:gap-[10px] lg:gap-[0px]">
                      <p className="text-[12px]">Mobile No</p>
                      <input
                        type="text"
                        value={ShemeData?.member?.MobileNo}
                        className="px-[5px] sm:px-[10px] lg:px-[15px] py-[3px] sm:py-[2px] focus:outline-none border border-black rounded-md max-w-[150px] w-full"
                        readOnly
                      />
                    </div>
                  </div>


                </div>
                <div className="flex w-full  items-start justify-start">
                  <div className=" flex text-[14px] w-full items-center sm:text-[16px] lg:text-[14px] gap-[5px] sm:gap-[10px] lg:gap-[15px]">
                    <p className=" ">Address</p>
                    <textarea
                      name=""
                      id=""
                      rows={1}
                      value={ShemeData?.member?.Address}
                      className="w-full max-w-[400px] px-[5px] sm:px-[10px] lg:px-[15px] py-[3px] sm:py-[2px] focus:outline-none border border-black rounded-md"
                      readOnly
                    ></textarea>
                  </div>
                </div>

              </div>

              <div className="flex flex-col gap-[10px] sm:gap-[10px] lg:gap-[10px] py-[10px] sm:py-[15px] lg:py-[10px]">
                <div className="flex gap-[5px] sm:gap-[7px] lg:gap-[9px] items-start justify-start px-[20px]">
                  <TbListDetails size={30} />
                  <p className="text-[20px] sm:text-[24px] font-semibold lg:text-[20px] text-[#182456]">
                    Scheme Details
                  </p>
                </div>

                <div className="w-full flex items-start justify-start px-[20px] gap-[3px] sm:gap-[5px]">
                  <div className="flex flex-col gap-[3px] sm:gap-[0px]">
                    <div className="grid grid-cols-2 w-full gap-[10px] sm:gap-[15px] lg:gap-[20px]">
                      <div className="flex flex-col">
                        <p className="text-[14px]">Scheme Type</p>
                        <input
                          type="text"
                          value={ShemeData?.member?.SchemeType}
                          className="w-full focus:outline-none px-[10px] sm:px-[15px] py-[3px] sm:py-[2px] lg:py-[2px] border border-black rounded-md text-[14px] sm:text-[14px] "
                          readOnly
                        />
                      </div>

                      <div className="flex flex-col">
                        <p className="text-[14px]">Scheme Name</p>
                        <input
                          type="text"
                          value={ShemeData?.member?.SchemeName}
                          className="w-full focus:outline-none px-[10px] sm:px-[15px] py-[3px] sm:py-[2px] lg:py-[2px] border border-black rounded-md text-[14px] sm:text-[14px] "
                        ></input>
                      </div>

                    </div>
                  </div>



                </div>

                <div className="flex flex-col gap-[4px] sm:gap-[8px] px-[10px] sm:px-[20px] lg:px-[20px]">
                  <div className="w-full flex items-center justify-evenly gap-[5px] sm:gap-[10px] lg:gap-[5px]">
                    <div className="basis-[33%] flex flex-col text-[14px] sm:text-[16px] w-full lg:text-[14px] items-start justify-center gap-[5px] sm:gap-[10px] lg:gap-[0px] text-left">
                      <p className=" ">Amount</p>
                      <input
                        type="text"
                        value={ShemeData?.scheme?.SchemeAmount}
                        className="bg-[#52BD91] px-[3px] py-[3px] sm:py-[2px] focus:outline-none border border-black rounded-md w-full"
                      />
                    </div>

                    <div className="basis-[33%] flex flex-col text-[14px] sm:text-[16px] w-full lg:text-[14px] items-start justify-center gap-[5px] sm:gap-[10px] lg:gap-[0px]">
                      <p className=" ">Scheme Duration</p>
                      <input
                        type="text"
                        value={ShemeData?.scheme?.SchemeDuration}
                        className=" px-[3px] py-[3px] sm:py-[2px] focus:outline-none border border-black rounded-md w-full"
                        readOnly
                      />
                    </div>

                    <div className="basis-[33%] flex flex-col text-[14px] sm:text-[16px] w-full lg:text-[14px] items-start justify-between gap-[5px] sm:gap-[10px] lg:gap-[0px]">
                      <p className=" ">Paid Amount</p>
                      <input
                        type="text"
                        value={
                          ShemeData?.receipt?.reduce(
                            (accumulator, currentItem) =>
                              accumulator + currentItem.Amount,
                            0
                          ) || [0]
                        }
                        className=" px-[3px] py-[3px] sm:py-[2px] focus:outline-none border border-black rounded-md w-full"
                        readOnly
                      />
                    </div>

                  </div>

                  <div className="w-full flex gap-[5px] sm:gap-[10px] lg:gap-[10px]">
                    <div className="basis-[33%] flex flex-col text-[14px] sm:text-[16px] w-full lg:text-[14px] items-start justify-between gap-[5px] sm:gap-[10px] lg:gap-[0px]">
                      <p className=" ">Scheme Value</p>
                      <input
                        type="text"
                        value={ShemeData?.scheme?.SchemeValue}
                        className=" px-[3px] py-[3px] sm:py-[2px] focus:outline-none border border-black rounded-md w-full"
                        readOnly
                      />
                    </div>

                    <div className="basis-[33%] flex flex-col text-[14px] sm:text-[16px] w-full lg:text-[14px] items-start justify-between gap-[5px] sm:gap-[10px] lg:gap-[0px]">
                      <p className=" ">Scheme Join Date</p>
                      <input
                        type="text"
                        value={ShemeData?.member?.JoinDate}
                        className=" px-[3px] py-[3px] sm:py-[2px] focus:outline-none border border-black rounded-md w-full"
                      />
                    </div>

                    <div className="basis-[33%] flex flex-col text-[14px] sm:text-[16px] w-full lg:text-[14px] items-start justify-between gap-[5px] sm:gap-[10px] lg:gap-[0px]">
                      <p className=" ">Paid Months</p>
                      <input
                        type="text"
                        value={ShemeData?.receipt?.length}
                        className=" px-[3px] py-[3px] sm:py-[2px] focus:outline-none border border-black rounded-md w-full"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="w-full flex gap-[5px] sm:gap-[10px] lg:gap-[10px]">


                    <div className="basis-[50%] flex flex-col text-[14px] sm:text-[16px] w-full lg:text-[14px] items-start justify-between gap-[5px] sm:gap-[10px] lg:gap-[0px]">
                      <p className=" ">Balance Month</p>
                      <input
                        type="text"
                        value={
                          ShemeData?.scheme?.SchemeDuration -
                          ShemeData?.receipt?.length
                        }
                        className=" px-[3px] py-[3px] sm:py-[2px] focus:outline-none border border-black rounded-md w-full"
                        readOnly
                      />
                    </div>

                    <div className="basis-[50%] flex flex-col text-[14px] sm:text-[16px] w-full lg:text-[14px] items-start justify-between gap-[5px] sm:gap-[10px] lg:gap-[0px]">
                      <p className=" ">Balance Amount</p>
                      <input
                        type="text"
                        value={
                          ShemeData?.scheme?.SchemeValue -
                          ShemeData?.receipt?.reduce(
                            (accumulator, currentItem) =>
                              accumulator + currentItem.Amount,
                            0
                          ) || [0]
                        }
                        className="px-[3px] py-[3px] sm:py-[2px] focus:outline-none border border-black rounded-md w-full"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="w-full flex gap-[5px] items-center justify-center sm:gap-[10px] lg:gap-[15px]">

                  </div>
                </div>
              </div>
            </div>
            <div className="basis-[55%] relative flex flex-col justify-center gap-[10px]  border-2 border-[#182456] rounded-xl py-[5px] sm:py-[10px] lg:py-[15px]">
              <div className="flex items-center justify-start px-[10px] sm:px-[20px] lg:px-[20px]">
                <RiSecurePaymentLine size={30} />
                <h1 className=" text-[20px] sm:text-[24px] lg:text-[20px] text-[#182456] font-semibold">
                  Payment Details
                </h1>


              </div>

              <div className="flex flex-col gap-[4px] sm:gap-[8px] px-[10px] sm:px-[10px] lg:px-[20px]">
















                <div className="flex flex-col gap-[2px] px-[20px]">
                  <div className='w-full grid grid-cols-4 gap-[5px] items-center justify-center mb-[20px]'>
                    {['Cash', 'Card', 'Online', 'UPI'].map((mode) => (
                      <button
                        key={mode}
                        className={`border flex items-center justify-center gap-[5px] border-black p-2 ${selectedModes.includes(mode) ? 'bg-[#182456] text-white' : ''}`}
                        onClick={() => handleModeChange(mode)}
                      >
                        {mode}
                        <GiClick size={20} />
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-col gap-[2px] px-[0px]">
                    {selectedModes.includes('Cash') && (
                      <div className="w-full h-full grid grid-cols-4 gap-[5px] items-center justify-center">
                        <div className="flex flex-col items-start justify-center text-left w-full">
                          <p className="text-[12px]">Payment Mode</p>
                          <input type="text" value="Cash" readOnly className="w-full text-[14px] focus:outline-none border border-black p-[3px] rounded-md" />
                        </div>
                        <div className="flex flex-col items-start justify-center text-left w-full">
                          <p className="text-[12px]">Description</p>
                          <input type="text" value={cashdesc} onKeyDown={(e) => handleKeyDown(e, 'Cash')}
                            ref={cashDescRef} onChange={(e) => setCashdesc(e.target.value)} className="w-full text-[14px] focus:outline-none border border-black p-[3px] rounded-md" />
                        </div>
                        <div className="flex flex-col items-start justify-center text-left w-full">
                          <p className="text-[12px]">Amount</p>
                          <input
                            type="number"
                            value={cashamount}
                            onKeyDown={(e) => handleKeyDown(e, 'Cash')}
                            ref={cashAmountRef}
                            onChange={(e) => setCashamount(parseInt(e.target.value, 10))}
                            className="w-full text-[14px] focus:outline-none border border-black p-[3px] rounded-md"
                          />
                        </div>
                        <button onClick={() => handleAddEntry('Cash', '', '', cashdesc, cashamount)} className="border bg-[#182456] text-white border-black p-1 mt-2">
                          Add Entry
                        </button>
                      </div>
                    )}

                    {selectedModes.includes('Card') && (
                      <div className="w-full h-full grid grid-cols-4 gap-[5px] items-center justify-center">
                        <div className="flex flex-col items-start justify-center text-left w-full">
                          <p className="text-[12px]">Payment Mode</p>
                          <input type="text" value="Card" readOnly className="w-full text-[14px] focus:outline-none border border-black p-[3px] rounded-md" />
                        </div>
                        <div className="flex flex-col items-start justify-center text-left w-full">
                          <p className="text-[12px]">Description</p>
                          <input type="text" value={carddesc} onKeyDown={(e) => handleKeyDown(e, 'Card')}
                            ref={cardDescRef} onChange={(e) => setCarddesc(e.target.value)} className="w-full text-[14px] focus:outline-none border border-black p-[3px] rounded-md" />
                        </div>
                        <div className="flex flex-col items-start justify-center text-left w-full">
                          <p className="text-[12px]">Amount</p>
                          <input
                            type="number"
                            value={cardamount}
                            onKeyDown={(e) => handleKeyDown(e, 'Card')}
                            ref={cardAmountRef}
                            onChange={(e) => setCardamount(parseInt(e.target.value, 10))}
                            className="w-full text-[14px] focus:outline-none border border-black p-[3px] rounded-md"
                          />
                        </div>
                        <button onClick={() => handleAddEntry('Card', '', '', carddesc, cardamount)} className="border border-black bg-[#182456] text-white p-1 mt-2">
                          Add Entry
                        </button>
                      </div>
                    )}

                    {selectedModes.includes('Online') && (
                      <div className="w-full h-full grid grid-cols-6 gap-[5px] items-center justify-center">
                        <div className="flex flex-col items-start justify-center text-left w-full">
                          <p className="text-[12px]">Payment Mode</p>
                          <input type="text" value="Online" readOnly className="w-full text-[14px] focus:outline-none border border-black p-[3px] rounded-md" />
                        </div>
                        <div className="flex flex-col items-start justify-center text-left w-full">
                          <p className="text-[12px]">Particulars</p>
                          <select onChange={(e) => setOnlineparticulars(e.target.value)} ref={onlineParticularsRef} onKeyDown={(e) => handleKeyDown(e, 'Online')} name="online" id="online" className="text-[14px] focus:outline-none border border-black w-full rounded-md p-[3px]">
                            <option value="">Select</option>
                            {online.map((option, index) => (
                              <option key={index} value={option?.PAYMODE}>{option?.PAYMODE}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex flex-col items-start justify-center text-left w-full">
                          <p className="text-[12px]">Acc No</p>
                          <select ref={onlineAccRef} onKeyDown={(e) => handleKeyDown(e, 'Online')} onChange={(e) => setOnlineacc(e.target.value)} name="accno" id="accno" className="text-[14px] focus:outline-none border border-black w-full rounded-lg p-[3px]">
                            <option value="">Select</option>
                            {online.map((option, index) => (
                              <option key={index} value={option?.ACCNO}>{option?.ACCNO}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex flex-col items-start justify-center text-left w-full">
                          <p className="text-[12px]">Description</p>
                          <input ref={onlineDescRef} onKeyDown={(e) => handleKeyDown(e, 'Online')} type="text" value={onlinedesc} onChange={(e) => setOnlinedesc(e.target.value)} className="w-full text-[14px] focus:outline-none border border-black p-[3px] rounded-lg" />
                        </div>
                        <div className="flex flex-col items-start justify-center text-left w-full">
                          <p className="text-[12px]">Amount</p>
                          <input
                            type="number"
                            value={onlineamount}
                            ref={onlineAmountRef}
                            onKeyDown={(e) => handleKeyDown(e, 'Online')}
                            onChange={(e) => setOnlineamount(parseInt(e.target.value, 10))}
                            className="w-full text-[14px] focus:outline-none border border-black p-[3px] rounded-lg"
                          />
                        </div>
                        <button onClick={() => handleAddEntry('Online', onlineparticulars, onlineacc, onlinedesc, onlineamount)} className="border border-black p-1 bg-[#182456] text-white mt-2">
                          Add Entry
                        </button>
                      </div>
                    )}

                    {selectedModes.includes('UPI') && (
                      <div className="w-full h-full grid grid-cols-6 gap-[5px] items-center justify-center">
                        <div className="flex flex-col items-start justify-center text-left w-full">
                          <p className="text-[12px]">Payment Mode</p>
                          <input type="text" value="UPI" readOnly className="w-full text-[14px] focus:outline-none border border-black p-[3px] rounded-lg" />
                        </div>
                        <div className="flex flex-col items-start justify-center text-left w-full">
                          <p className="text-[12px]">Particulars</p>
                          <select ref={upiParticularsRef} onKeyDown={(e) => handleKeyDown(e, 'UPI')} onChange={(e) => setUpiparticulars(e.target.value)} name="upi" id="upi" className="text-[14px] focus:outline-none border border-black w-full rounded-lg p-[3px]">
                            <option value="">Select</option>
                            {upi.map((option, index) => (
                              <option key={index} value={option?.PAYMODE}>{option?.PAYMODE}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex flex-col items-start justify-center text-left w-full">
                          <p className="text-[12px]">Acc No.</p>
                          <select ref={upiAccRef} onKeyDown={(e) => handleKeyDown(e, 'UPI')} onChange={(e) => setUpiacc(e.target.value)} name="upiacc" id="upiacc" className="text-[14px] focus:outline-none border border-black w-full rounded-lg p-[3px]">
                            <option value="">Select</option>
                            {upi.map((option, index) => (
                              <option key={index} value={option?.ACCNO}>{option?.ACCNO}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex flex-col items-start justify-center text-left w-full">
                          <p className="text-[12px]">Description</p>
                          <input type="text" ref={upiDescRef} onKeyDown={(e) => handleKeyDown(e, 'UPI')} value={upidesc} onChange={(e) => setUpidesc(e.target.value)} className="w-full text-[14px] focus:outline-none border border-black p-[3px] rounded-lg" />
                        </div>
                        <div className="flex flex-col items-start justify-center text-left w-full">
                          <p className="text-[12px]">Amount</p>
                          <input
                            type="number"
                            value={upiamount}
                            ref={upiAmountRef}
                            onKeyDown={(e) => handleKeyDown(e, 'UPI')}
                            onChange={(e) => setUpiamount(parseInt(e.target.value, 10))}
                            className="w-full text-[14px] focus:outline-none border border-black p-[3px] rounded-lg"
                          />
                        </div>
                        <button onClick={() => handleAddEntry('UPI', upiparticulars, upiacc, upidesc, upiamount)} className="border border-black p-1 mt-2 bg-[#182456] text-white">
                          Add Entry
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="w-full px-[10px] sm:px-[20px] lg:px-[0px] mt-[0px]">
                    <div className="w-full h-[175px] overflow-y-auto custom-scrollbar border border-[#000] rounded-md">
                      <table className="w-full table-auto">
                        <thead>
                          <tr className="bg-[#182456] text-white">
                            <th className="p-[7px]">Sno</th>
                            <th className="p-[7px]">Payment Mode</th>
                            <th className="p-[7px]">Particulars</th>
                            <th className="p-[7px]">Account No</th>
                            <th className="p-[7px]">Description</th>
                            <th className="p-[7px]">Amount</th>
                            <th className="p-[7px]">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {entries.map((entry, index) => (
                            <tr key={index} className="text-center">
                              <td className="p-[5px]">{index + 1}</td>
                              <td className="p-[5px]">{entry.mode}</td>
                              <td className="p-[5px]">{entry.particulars}</td>
                              <td className="p-[5px]">{entry.acc}</td>
                              <td className="p-[5px]">{entry.desc}</td>
                              <td className="p-[5px]">{entry.amount}</td>
                              <td className="p-[5px]">
                                <button onClick={() => handleDeleteEntry(index)} className="text-red-500">
                                  <FaTrash size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

















                <div className="w-full flex items-start justify-start gap-[5px] sm:gap-[10px] lg:gap-[15px] px-[20px]">
                  



                  <div className="flex flex-col text-[14px] sm:text-[16px] w-full lg:text-[14px] items-start justify-center gap-[5px] sm:gap-[10px] lg:gap-[0px]">
                    <p className=" ">Gold Wt</p>
                    <input
                      type="text"
                      value={parseFloat(parseFloat(ShemeData?.scheme?.SchemeAmount) / parseFloat(goldrate)).toFixed(2)}
                      ref={inputRefs.GoldWtBtn}
                      readOnly
                      onKeyDown={(e) => handleKeyDown2(e, 'AmountBtn')}
                      className="w-full max-w-[150px] bg-red-500 focus:outline-none px-[10px] sm:px-[15px] py-[3px] sm:py-[2px] lg:py-[2px] border border-black rounded-lg text-[14px] sm:text-[16px] "
                      onChange={() => setGoldWt(parseFloat(parseFload(ShemeData?.scheme?.SchemeAmount) / parseFloat(goldrate)).toFixed(2))}
                    />
                  </div>


                  

                  <div className="basis-[33%] flex flex-col text-[14px] sm:text-[16px] w-full lg:text-[14px] items-start justify-center gap-[5px] sm:gap-[10px] lg:gap-[0px]">
                    <p className=" ">Paid Amount</p>
                    <input
                      type="text"
                      value={amount}
                      ref={inputRefs.AmountBtn}
                      readOnly
                      onKeyDown={(e) => handleKeyDown2(e, 'InchargeBtn')}
                      className="bg-red-500 px-[3px] py-[3px] sm:py-[2px] focus:outline-none border border-black rounded-lg w-full"
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-[20px] w-full px-[10px] sm:px-[20px] lg:px-[20px]">
                  

                  <div className="w-full flex items-center justify-between gap-[5px] sm:gap-[10px] lg:gap-[7px] pt-[0px]">
                    <div className="basis-[50%] flex text-[14px] sm:text-[14px] lg:text-[14px] items-center justify-between gap-[5px] sm:gap-[10px] lg:gap-[15px]">
                      <p className="font-semibold">Incharge</p>
                      <input
                        type="text"
                        value={Incharge}
                        ref={inputRefs.InchargeBtn}
                        onKeyDown={(e) => handleKeyDown2(e, 'NarrationBtn')}
                        className="px-[5px] sm:px-[10px] lg:px-[15px] py-[3px] sm:py-[2px] focus:outline-none border border-black rounded-lg max-w-[350px] w-full"
                        onChange={(e) => setIncharge(e.target.value)}
                      />
                    </div>

                    <div className="basis-[50%] flex text-[14px] sm:text-[14px] lg:text-[14px] items-center justify-between gap-[5px] sm:gap-[10px] lg:gap-[15px]">
                      <p className="font-semibold">Narration</p>
                      <textarea
                        name=""
                        id=""
                        rows={1}
                        value={Description}
                        ref={inputRefs.NarrationBtn}
                        onKeyDown={(e) => handleKeyDown2(e, 'SubmitBtn')}
                        className="max-w-[350px] w-full px-[5px] sm:px-[10px] lg:px-[15px] py-[3px] sm:py-[2px] focus:outline-none border border-black rounded-lg"
                        onChange={(e) => setDescription(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="w-full px-[10px] sm:px-[20px] lg:px-[40px]">
                  <div className="flex w-full h-full items-center justify-center gap-[5px] sm:gap-[8px] lg:gap-[7px]">
                    

                    <div className="w-[200px] cursor-pointer h-[35px] text-[14px] px-[5px] sm:px-[10px] lg:px-[15px] flex items-center justify-center gap-[5px] bg-[#172561] rounded-md">
                      <button
                        className="text-white font-bold"
                        ref={inputRefs.SubmitBtn}
                        onClick={() => createReceipt()}
                      >
                        SAVE
                      </button>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="19"
                        height="17"
                        viewBox="0 0 19 17"
                        fill="none"
                      >
                        <mask
                          id="mask0_215_507"
                          style={{ maskType: "luminance" }}
                          maskUnits="userSpaceOnUse"
                          x="0"
                          y="0"
                          width="19"
                          height="17"
                        >
                          <path
                            d="M7.78768 2.88939L5.90308 1.22913C5.73645 1.08242 5.51049 1 5.27488 1C5.03927 1 4.8133 1.08242 4.64667 1.22913L2.13342 3.44268C2.05088 3.51536 1.98539 3.60164 1.94072 3.69661C1.89604 3.79158 1.87305 3.89337 1.87305 3.99617C1.87305 4.09896 1.89604 4.20076 1.94072 4.29572C1.98539 4.39069 2.05088 4.47698 2.13342 4.54965L4.01847 6.20952M11.7235 13.7783L13.6081 15.4386C13.6906 15.5113 13.7886 15.569 13.8964 15.6083C14.0042 15.6477 14.1198 15.6679 14.2365 15.6679C14.3532 15.6679 14.4688 15.6477 14.5766 15.6083C14.6845 15.569 14.7824 15.5113 14.8649 15.4386L17.3782 13.225C17.5448 13.0783 17.6384 12.8793 17.6384 12.6717C17.6384 12.4642 17.5448 12.2652 17.3782 12.1185L15.4932 10.4582"
                            stroke="white"
                            stroke-width="1.56518"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M17.3876 3.8258L14.8744 1.6123C14.5274 1.30668 13.9648 1.30668 13.6178 1.6123L1.68016 12.1264C1.33316 12.432 1.33316 12.9275 1.68016 13.2331L4.19335 15.4466C4.54035 15.7523 5.10294 15.7523 5.44994 15.4466L17.3876 4.93254C17.7346 4.62692 17.7346 4.13142 17.3876 3.8258Z"
                            fill="white"
                            stroke="white"
                            stroke-width="1.56518"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M9.53405 9.31209C10.0248 9.31209 10.4226 8.96172 10.4226 8.52951C10.4226 8.09729 10.0248 7.74692 9.53405 7.74692C9.04332 7.74692 8.64551 8.09729 8.64551 8.52951C8.64551 8.96172 9.04332 9.31209 9.53405 9.31209Z"
                            fill="black"
                          />
                          <path
                            d="M7.75671 10.8773C8.24744 10.8773 8.64526 10.5269 8.64526 10.0947C8.64526 9.66248 8.24744 9.3121 7.75671 9.3121C7.26598 9.3121 6.86816 9.66248 6.86816 10.0947C6.86816 10.5269 7.26598 10.8773 7.75671 10.8773Z"
                            fill="black"
                          />
                          <path
                            d="M11.3114 7.74691C11.8021 7.74691 12.1999 7.39653 12.1999 6.96432C12.1999 6.53211 11.8021 6.18173 11.3114 6.18173C10.8207 6.18173 10.4229 6.53211 10.4229 6.96432C10.4229 7.39653 10.8207 7.74691 11.3114 7.74691Z"
                            fill="black"
                          />
                        </mask>
                        <g mask="url(#mask0_215_507)">
                          <path
                            d="M-1.13086 -2H20.1942V16.7821H-1.13086V-2Z"
                            fill="white"
                          />
                        </g>
                      </svg>
                    </div>

                    
                  </div>
                </div>
              </div>
            </div>
          </div> */}




          <div className="w-full max-h-full overflow-y-auto custom-scrollbar2 p-[10px] text-[12px]">
            <table className="w-full table-auto text-center max-w-[1250px] overflow-hidden mx-auto border border-black">
              <thead className="w-full border border-black text-[12px] bg-[#4FC997]">
                <tr>
                  <th className="border border-black p-2">ID</th>
                  <th className="border border-black p-2">Receipt No</th>
                  <th className="border border-black p-2">Receipt Date</th>
                  <th className="border border-black p-2">Card No</th>
                  <th className="border border-black p-2">Scheme Name</th>
                  <th className="border border-black p-2">Scheme Code</th>
                  <th className="border border-black p-2">Mobile No</th>
                  <th className="border border-black p-2">Member Name</th>
                  <th className="border border-black p-2">Address</th>
                  <th className="border border-black p-2">Amount</th>
                  <th className="border border-black p-2">Gold Wt</th>
                  <th className="border border-black p-2">Gold Amount</th>
                  <th className="border border-black p-2">Actions</th>
                </tr>
              </thead>
              <tbody className="w-full border border-black">
                {receipts?.map((receipt, index) => (
                  <tr key={receipt.id} className={`px-1 text-[12px] ${(index % 2 == 0) ? "bg-white" : "bg-gray-100"} font-medium`}>
                    <td className="border border-black p-2">{receipt.id}</td>
                    <td className="border border-black p-2">{receipt.ReceiptNo}</td>
                    <td className="border border-black p-2">{receipt.ReceiptDate}</td>
                    <td className="border border-black p-2">{receipt.CardNo}</td>
                    <td className="border border-black p-2">{receipt.SchemeName}</td>
                    <td className="border border-black p-2">{receipt.SchemeCode}</td>
                    <td className="border border-black p-2">{receipt.MobileNo}</td>
                    <td className="border border-black p-2">{receipt.MemberName}</td>
                    <td className="border border-black p-2">{receipt.Address}</td>
                    <td className="border border-black p-2">{receipt.Amount}</td>
                    <td className="border border-black p-2">{receipt.GoldWt}</td>
                    <td className="border border-black p-2">{receipt.GoldAmount}</td>
                    <td className="border border-black p-2 text-[14px]">
                      <button className="text-red-700" onClick={() => handleDelete(receipt.ReceiptNo)}><MdDelete /></button>
                    </td>
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
export default ReceiptEntry;
