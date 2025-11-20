import { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { PropertyContext } from "../contexts/PropertyContext";
import { supabase } from "../supabase";

function States() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { apiProperties, hiddenIds } = useContext(PropertyContext);

  const [supabaseProps, setSupabaseProps] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [filters, setFilters] = useState({ type: "all", price: "all" });
  const [sortType, setSortType] = useState("none");

  const [page, setPage] = useState(1);
  const perPage = 6;

  // FETCH PROPERTIES (prioritize localStorage since Supabase not available)
  useEffect(() => {
    async function fetchProps() {
      let data = [];
      
      // First try localStorage (primary data source now)
      try {
        const localData = JSON.parse(localStorage.getItem("allProperties") || "[]");
        console.log("States.jsx: Loaded from localStorage:", localData.length, "properties");
        data = localData;
      } catch (err) {
        console.log("Error loading from localStorage:", err);
        data = [];
      }
      
      // If localStorage is empty, try Supabase as backup
      if (data.length === 0) {
        try {
          const { data: supabaseData, error: supabaseError } = await supabase.from("properties").select("*");
          if (!supabaseError && supabaseData) {
            data = supabaseData;
            console.log("States.jsx: Loaded from Supabase:", data.length, "properties");
          }
        } catch (err) {
          console.log("Supabase also not available:", err);
        }
      }
      
      if (data.length === 0) {
        console.log("No properties found in localStorage or Supabase");
        setSupabaseProps([]);
        return;
      }

     const formatted = data.map((p) => {
  let district = "";
  let state = "";

  if (p.location?.includes(",")) {
    const parts = p.location.split(",");
    district = parts[0]?.trim().toLowerCase();
    state = parts[1]?.trim().toLowerCase();
  } else {
    state = p.location?.trim().toLowerCase();
  }

  return {
    id: p.id,
    title: p.title,
    type: p.type?.toLowerCase(),
    priceText: "₹" + Number(p.price).toLocaleString(),
    dataPrice: Number(p.price),
    area: p.area || 0,

    // 🔥 FIXED IMAGE
    image: p.image && p.image !== "undefined" ? p.image : "/default.jpg",

    // 🔥 ADD THESE FIELDS (VERY IMPORTANT)
    desc: p.desc || "",
    address: p.address || "",
    beds: p.beds || "",
    baths: p.baths || "",
    garages: p.garages || "",
    owner: p.owner || "Owner",
    location: p.location || "",

    district,
    state,
  };
});


      setSupabaseProps(formatted);
    }

    fetchProps();
  }, []);

  // COMBINE & FILTER
  useEffect(() => {
    const selectedState = (searchParams.get("state") || "punjab").toLowerCase();
    console.log("States.jsx: Filtering for state:", selectedState);

    const all = [...apiProperties, ...supabaseProps];
    console.log("States.jsx: Total properties to filter:", all.length);

    const match = all.filter(
      (p) => {
        const stateMatch = (p.state || "").toLowerCase().includes(selectedState) || 
                          (p.location || "").toLowerCase().includes(selectedState);
        const notHidden = !hiddenIds.includes(p.id);
        
        console.log(`Property "${p.title}": state="${p.state}", location="${p.location}", matches="${stateMatch}", notHidden="${notHidden}"`);
        
        return stateMatch && notHidden;
      }
    );

    console.log("States.jsx: Filtered properties:", match.length);
    setFilteredProperties(match);
    setPage(1);
  }, [apiProperties, supabaseProps, searchParams]);

  // SORTING
  const sortData = (data) => {
    if (sortType === "low") return [...data].sort((a, b) => a.dataPrice - b.dataPrice);
    if (sortType === "high") return [...data].sort((a, b) => b.dataPrice - a.dataPrice);
    if (sortType === "area") return [...data].sort((a, b) => a.area - b.area);
    return data;
  };

  const sorted = sortData(filteredProperties);
  const startIndex = (page - 1) * perPage;
  const paginated = sorted.slice(startIndex, startIndex + perPage);
  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));

  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4 mt-6 dark:text-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            Properties in {searchParams.get("state")?.toUpperCase()}
          </h1>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <i className="ri-refresh-line"></i>
            Refresh
          </button>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Showing {filteredProperties.length} properties
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {paginated.map((p) => (
            <div
              key={p.id}
              className="border rounded-xl shadow bg-gray-100 dark:bg-gray-900 p-4"
            >
              <img
                src={p.image}
                onError={(e) => (e.target.src = "/default.jpg")}
                className="w-full h-48 object-cover rounded"
              />

              <h2 className="text-xl font-semibold mt-2">{p.title}</h2>
              <p>{p.priceText}</p>
              <p className="font-bold">Area: {p.area} sq ft</p>
              <p>Type: {p.type?.toUpperCase()}</p>

              <button
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() =>
  navigate(
    `/viewdetail?houseId=${p.id}` +
    `&title=${encodeURIComponent(p.title)}` +
    `&priceText=${encodeURIComponent(p.priceText || "")}` +
    `&desc=${encodeURIComponent(p.desc || "")}` +
    `&address=${encodeURIComponent(p.address || "")}` +
    `&image=${encodeURIComponent(p.image || "")}` +
    `&location=${encodeURIComponent((p.district || "") + ", " + (p.state || ""))}` +
    `&type=${encodeURIComponent(p.type || "")}` +
    `&area=${encodeURIComponent(p.area || "")}` +
    `&beds=${encodeURIComponent(p.beds || "")}` +
    `&baths=${encodeURIComponent(p.baths || "")}` +
    `&garages=${encodeURIComponent(p.garages || "")}` +
    `&owner=${encodeURIComponent(p.owner || "Owner")}`
  )
}

              >
                View Details
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4 my-10">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span>{page} / {totalPages}</span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default States;
