"use client";

import React, { Suspense, useEffect, useState } from "react";

const headings = [
  "ID",
  "Title",
  "Description",
  "Price",
  "Category",
  "Image",
  "Sold",
];

interface Props {
  month?: string;
  search?: string;
  setMonth: React.Dispatch<React.SetStateAction<string>>;
}

function Table(Props: Props) {
  const { month, search, setMonth } = Props;
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const handlePrev = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    page === total ? setPage(1) : setPage(page + 1);
  };

  const productsData = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/rox/getTransactions?month=${month}&search=${search}&page=${page}&perPage=${perPage}`
      );
      const data = await res.json();
      setProducts(data.transactions);
      setTotal(data.totalPages);
      setTotalItems(data.totalRecords);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (month === "All") {
      setMonth("");
    }
    productsData();
  }, [page, perPage, month, search]);

  return (
    <div className="rounded-lg border border-gray-200">
      <div className="overflow-x-auto rounded-t-lg">
        <Suspense fallback={<div className="text-center w-full h-32 " >Loading...</div>}>
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead className="ltr:text-left rtl:text-right">
              <tr>
                {headings.map((heading, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="whitespace-nowrap font-bold border-b border-gray-200 px-4 py-2 text-gray-900"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {products.map((product: any) => (
                <tr key={product._id}>
                  <td className="border-b border-gray-200 px-4 py-2 font-medium text-gray-900">
                    {product.id}.
                  </td>
                  <td className="border-b border-gray-200 px-4 py-2 text-gray-700">
                    {product.title.slice(0, 50)}
                  </td>
                  <td className="border-b border-gray-200 px-4 py-2 text-gray-700">
                    {product.description.slice(0, 100)}
                  </td>
                  <td className="border-b border-gray-200 px-4 py-2 text-gray-700">
                    <span className="font-bold">$</span>
                    {product.price}
                  </td>
                  <td className="border-b capitalize border-gray-200 px-4 py-2 text-gray-700">
                    {product.category}
                  </td>
                  <td className="border-b border-gray-200 px-4 py-2 text-gray-700">
                    <img
                      src={product.image}
                      alt={product.title}
                      width={50}
                      height={50}
                    />
                  </td>
                  <td className="border-b capitalize border-gray-200 px-4 py-2 text-gray-700">
                    {product.sold}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Suspense>
      </div>

      <div className="rounded-b-lg border-t text-sm font-semibold flex justify-between items-center border-gray-200 px-4 py-2">
        <span>Page No: {page}</span>
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            className="rounded border active:scale-95 border-gray-200 px-4 py-2"
          >
            Prev
          </button>
          <button
            onClick={handleNext}
            className="rounded border active:scale-95 border-gray-200 px-4 py-2"
          >
            Next
          </button>
        </div>
        <div className="flex justify-center items-center gap-2">
          <span>
            Per Page :{" "}
            <select
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                if (totalItems < Number(e.target.value)) {
                  setPerPage(10);
                } else {
                  setPerPage(Number(e.target.value));
                }
              }}
              value={perPage}
              className="border text-sm rounded-xl border-gray-200 px-4 py-2 focus:outline-none text-black"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
            </select>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Table;
