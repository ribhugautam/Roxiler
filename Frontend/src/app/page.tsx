'use client';

import React from "react";
import Table from "./components/Table";
import BarChart from "./components/BarChart";

export default function Home() {
  const [search, setSearch] = React.useState<string>("");
  const [month, setMonth] = React.useState<string>("");
  const [sale, setSale] = React.useState<string>("");
  const [sold, setSold] = React.useState<string>("");
  const [notSold, setNotSold] = React.useState<string>("");
  const [barChartData, setBarChartData] = React.useState([]);

  const calcData = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/rox/getCombinedData?month=${month}`
      );
      const data = await res.json();
      setSale(data.statistics.totalSaleAmount);
      setSold(data.statistics.soldItemsCount);
      setNotSold(data.statistics.notSoldItemsCount);
      setBarChartData(data.barChartData);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  React.useEffect(() => {
    if(month === ""){
      setMonth("January");
    }
    calcData();
  }, [month]);

  return (
    <div className="flex min-h-screen gap-24 items-center flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c] p-24">
      <h1 className="text-2xl md:text-4xl text-center font-bold">Transaction Dashboard</h1>
      <div>
        <div className="flex items-center gap-4 justify-between mb-8">
          <input
            type="text"
            placeholder="Search"
            onChange={handleSearch}
            className="w-full border text-black focus:outline-none max-w-48 border-gray-300 p-[0.3rem] rounded-md"
          />
          <select
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMonth(e.target.value)}
            className="w-full border text-center max-w-48 border-gray-300 p-2 rounded-md focus:outline-none text-black"
          >
            <option value="">All</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
        </div>
        <Table search={search} month={month} setMonth={setMonth} />
      </div>
      <div>
        <h1 className="text-2xl md:text-4xl mb-8 text-center font-bold">Statistics - {month}</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white flex flex-col justify-between items-center p-4 rounded-md">
            <h2 className="text-lg text-black capitalize font-semibold mb-2">Total Sale</h2>
            <p className="text-2xl text-violet-700 font-bold">${sale}</p>
          </div>
          <div className="bg-white flex flex-col justify-between items-center p-4 rounded-md">
            <h2 className="text-lg text-black capitalize font-semibold mb-2">Total sold products</h2>
            <p className="text-2xl text-violet-700 font-bold">{sold}</p>
          </div>
          <div className="bg-white flex flex-col justify-between items-center p-4 rounded-md">
            <h2 className="text-lg text-black capitalize font-semibold mb-2">Total not sold products</h2>
            <p className="text-2xl text-violet-700 font-bold">{notSold}</p>
          </div>
        </div>
      </div>
      <h1 className="text-2xl md:text-4xl text-center font-bold">Bar Chart</h1>
      <BarChart barChartData={barChartData} month={month} />
    </div>
  );
}
