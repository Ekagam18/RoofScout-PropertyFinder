import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
// Note: Supabase temporarily disabled, using localStorage

function AllProperties() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    type: "all",
    price: "all"
  });

  const [sortType, setSortType] = useState("none");
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const perPage = 6;

  // Fetch properties from localStorage (since Supabase is not accessible)
  const fetchProperties = () => {
    try {
      // Get properties from localStorage
      const localProperties = JSON.parse(localStorage.getItem("allProperties") || "[]");
      
      console.log("Loaded properties from localStorage:", localProperties);

      // If no properties exist, add some sample data
      if (localProperties.length === 0) {
        const sampleProperties = [
          {
            id: 'SAMPLE-1',
            title: 'Sample Villa in Punjab',
            type: 'villa',
            price: 5000000,
            priceText: '₹50,00,000',
            location: 'Mohali, Punjab',
            area: 2500,
            image: '/default.jpg',
            beds: '4',
            baths: '3',
            description: 'Beautiful sample villa',
            owner: 'Owner'
          },
          {
            id: 'SAMPLE-2',
            title: 'Sample Plot in Chandigarh',
            type: 'plot',
            price: 2000000,
            priceText: '₹20,00,000',
            location: 'Sector 17, Chandigarh',
            area: 1000,
            image: '/default.jpg',
            beds: '',
            baths: '',
            description: 'Prime location plot',
            owner: 'Owner'
          }
        ];
        localStorage.setItem("allProperties", JSON.stringify(sampleProperties));
        setAllProperties(sampleProperties);
        setFilteredProperties(sampleProperties);
      } else {
        // Ensure consistent format
        const formattedProperties = localProperties.map((prop) => ({
          id: prop.id,
          title: prop.title || "Untitled Property",
          priceText: prop.priceText || (prop.price ? `₹${Number(prop.price).toLocaleString()}` : "Price on request"),
          price: Number(prop.price) || 0,
          area: Number(prop.area) || 0,
          type: prop.type || "house",
          image: prop.image || "/default.jpg",
          location: prop.location || "",
          beds: prop.beds || "",
          baths: prop.baths || "",
          description: prop.description || "",
          owner: prop.owner || "Owner"
        }));

        setAllProperties(formattedProperties);
        setFilteredProperties(formattedProperties);
      }
    } catch (err) {
      console.error("Error loading from localStorage:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Apply Filters
  const applyFilters = () => {
    let filtered = allProperties.filter((prop) => {
      let matchType = filters.type === "all" || prop.type === filters.type;
      let matchPrice = true;

      const p = prop.price;

      switch (filters.price) {
        case "1": matchPrice = p < 5000000; break;        // Below ₹50 Lacs
        case "2": matchPrice = p >= 5000000 && p < 20000000; break;  // ₹50L - ₹2Cr
        case "3": matchPrice = p >= 20000000 && p < 50000000; break; // ₹2Cr - ₹5Cr
        case "4": matchPrice = p >= 50000000; break;      // Above ₹5 Cr
        default: matchPrice = true;
      }

      return matchType && matchPrice;
    });

    setPage(1);
    setFilteredProperties(filtered);
  };

  const clearFilters = () => {
    setFilters({ type: "all", price: "all" });
    setSortType("none");
    setFilteredProperties(allProperties);
    setPage(1);
  };

  // Sorting
  const sortData = (data) => {
    if (sortType === "low") return [...data].sort((a, b) => a.price - b.price);
    if (sortType === "high") return [...data].sort((a, b) => b.price - a.price);
    if (sortType === "area") return [...data].sort((a, b) => a.area - b.area);
    return data;
  };

  const sortedData = sortData(filteredProperties);

  const startIndex = (page - 1) * perPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + perPage);
  const totalPages = Math.ceil(sortedData.length / perPage);

  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4 mt-6 dark:text-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">All Properties</h1>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setLoading(true);
                fetchProperties();
              }}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              🔄 Refresh
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("allProperties");
                setAllProperties([]);
                setFilteredProperties([]);
                alert("All properties cleared! Refresh to reload sample data.");
              }}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              🗑️ Clear All
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-10">
            <p className="text-xl">Loading properties...</p>
          </div>
        )}

        {/* FILTER SECTION */}
        <div className="bg-gray-100 dark:bg-gray-800 p-5 rounded-lg mb-8 shadow">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Property Type */}
            <div>
              <label className="block mb-1 font-semibold">Property Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All</option>
                <option value="plot">Plot / Land</option>
                <option value="flat">Flat / Apartment</option>
                <option value="builder-floor">Builder Floor</option>
                <option value="villa">Villa / House</option>
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block mb-1 font-semibold">Price Range</label>
              <select
                value={filters.price}
                onChange={(e) => setFilters({ ...filters, price: e.target.value })}
                className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All</option>
                <option value="1">Below ₹50 Lacs</option>
                <option value="2">₹50 Lacs - ₹2 Cr</option>
                <option value="3">₹2 Cr - ₹5 Cr</option>
                <option value="4">Above ₹5 Cr</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block mb-1 font-semibold">Sort By</label>
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
              >
                <option value="none">Default</option>
                <option value="low">Price: Low → High</option>
                <option value="high">Price: High → Low</option>
                <option value="area">Area: Low → High</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex items-end gap-3">
              <button
                onClick={applyFilters}
                className="bg-blue-600 text-white px-4 py-2 rounded w-full"
              >
                Apply
              </button>
              <button
                onClick={clearFilters}
                className="bg-gray-500 text-white px-4 py-2 rounded w-full"
              >
                Clear
              </button>
            </div>

          </div>
        </div>

        {/* PROPERTY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {paginatedData.map((prop, idx) => (
            <div
              key={idx}
              className="border rounded-2xl shadow p-4 bg-gray-200 dark:bg-gray-900 hover:shadow-xl hover:-translate-y-1 transition"
            >
              <img src={prop.image} className="w-full h-48 object-cover rounded" alt="" />
              <h2 className="text-xl font-semibold mt-2">{prop.title}</h2>
              <p className="text-gray-600 dark:text-gray-300">{prop.priceText}</p>
              <p className="font-bold mt-1">Area: {prop.area} sq ft</p>
              <p className="text-sm">Type: {prop.type.toUpperCase()}</p>

              <button
                onClick={() =>
                  navigate(`/viewdetail?houseId=${prop.id}&title=${prop.title}&priceText=${prop.priceText}&image=${prop.image}&area=${prop.area}&type=${prop.type}`)
                }
                className="mt-3 bg-blue-600 text-white px-3 py-2 rounded"
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* NO RESULTS */}
        {paginatedData.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-300 text-xl mt-10">
            No properties found.
          </p>
        )}

        {/* PAGINATION */}
        <div className="flex justify-center gap-4 my-10">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 dark:text-white rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-lg font-semibold">
            {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 dark:text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

      </div>

      <Footer />
    </>
  );
}

export default AllProperties;
