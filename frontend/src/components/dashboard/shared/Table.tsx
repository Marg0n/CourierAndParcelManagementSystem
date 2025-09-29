/* eslint-disable @typescript-eslint/no-explicit-any */

import { ArrowUpDown, Edit3, Eye, MoreVertical, Trash2 } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";

interface TableProps {
  data: Array<Record<string, any>>; //? Accept external data
}

const Table: React.FC<TableProps> = ({ data }) => {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "asc" | "desc";
  }>({
    key: null,
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isOpen, setIsOpen] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState<number | null>(null);

  const selectRef = useRef<HTMLDivElement>(null);

  const toggleActionMenu = (id: number) => {
    setOpenActionMenuId(openActionMenuId === id ? null : id);
  };

  //* 🔎 Search
  const filteredData = useMemo(() => {
    return data.filter((item) =>
      Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [data, search]);

  //* ↕️ Sort
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key!] < b[sortConfig.key!])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key!] > b[sortConfig.key!])
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  //* 📄 Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setOpenActionMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="p-4">
      {/* Search */}
      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-3 px-4 py-2 border rounded-md"
      />

      {/* Table */}
      <div className="rounded-md border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              {Object.keys(data[0] || {}).map(
                (key) =>
                  key !== "_id" && (
                    <th
                      key={key}
                      className="p-3 text-left font-medium text-gray-700 cursor-pointer"
                    >
                      <div className="flex items-center gap-1">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                        <ArrowUpDown onClick={() => handleSort(key)} />
                      </div>
                    </th>
                  )
              )}
              <th className="p-3 text-left font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item: any, index: number) => (
              <tr key={item._id || index} className="border-t hover:bg-gray-50">
                {Object.entries(item).map(
                  ([key, value]) =>
                    key !== "_id" && (
                      <td key={key} className="p-3">
                        {value as string}
                      </td>
                    )
                )}
                <td className="p-3 relative">
                  <MoreVertical onClick={() => toggleActionMenu(index)} />
                  {openActionMenuId === index && (
                    <div className="absolute right-0 top-6 bg-white border rounded shadow-md p-2">
                      <p className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1">
                        <Edit3 size={20} color="red" className="ml-2" /> Edit
                      </p>
                      <p className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1">
                        <Trash2 size={20} color="red" className="ml-2" /> Delete
                      </p>
                      <p className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1">
                        <Eye /> View
                      </p>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between">
        <p>
          Showing {(currentPage - 1) * pageSize + 1}–
          {Math.min(currentPage * pageSize, sortedData.length)} of{" "}
          {sortedData.length}
        </p>
        <div className="flex gap-2">
          <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
            Prev
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
