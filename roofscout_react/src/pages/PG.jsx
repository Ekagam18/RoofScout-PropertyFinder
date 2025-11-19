import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Sun, Moon, Menu } from 'lucide-react';
import { supabase } from "../supabase";

function PG() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get('editId');
  const [isEditing, setIsEditing] = useState(false);

  // --- DARK MODE ---
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('rs-theme') || 'light'; }
    catch { return 'light'; }
  });

  useEffect(() => {
    const root = document.documentElement;
    theme === 'dark'
      ? root.classList.add('dark')
      : root.classList.remove('dark');
    try { localStorage.setItem('rs-theme', theme); } catch {}
  }, [theme]);

  // FORM STATE
  const [formData, setFormData] = useState({
    pgName: "",
    address: "",
    bestFor: "boys",
    sharingType: "single",
    price: "",
    amenities: {
      food: false,
      wifi: false,
      ac: false,
      laundry: false,
      power: false,
      housekeeping: false
    }
  });

  const handleAmenityChange = (amenity) => {
    setFormData({
      ...formData,
      amenities: {
        ...formData.amenities,
        [amenity]: !formData.amenities[amenity],
      },
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // SUBMIT PG LISTING TO SUPABASE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { pgName, address, bestFor, sharingType, price, amenities } = formData;

    // 1️⃣ AUTH CHECK
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;

    if (!session?.user) {
      alert("You must be logged in to list a PG.");
      navigate("/login");
      return;
    }

    const userId = session.user.id;

    // 2️⃣ INSERT PG INTO SUPABASE
    const { error } = await supabase.from("properties").insert([
      {
        owner_id: userId,
        title: pgName,
        type: "pg",                                      // consistent type
        price: price,
        location: address,
        image: null,
        area: null,
      },
    ]);

    if (error) {
      console.log("Insert Error:", error);
      alert("Error saving PG property.");
      return;
    }

    alert("PG Listing Submitted!");
    navigate("/userdashboard");
  };

  // UI CLASSES
  const inputClass =
    "border-2 rounded h-12 p-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100";
  const textareaClass =
    "border-2 rounded p-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100";
  const labelClass = "text-gray-700 dark:text-gray-300 font-semibold";
  const sectionBgClass = "shadow-lg m-4 rounded-lg";
  const sectionTitleClass =
    "text-2xl font-bold flex items-center gap-2 text-gray-700 dark:text-gray-300";

  return (
    <div
      className={`transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-br from-blue-50 via-green-50 to-pink-50 min-h-screen"
      }`}
    >
      {/* NAVBAR */}
      <div
        className={`backdrop-blur-md ${
          theme === "dark" ? "bg-gray-800/70" : "bg-white/60"
        } sticky top-0 z-50 flex justify-between items-center h-20 px-6 shadow-sm`}
      >
        <div className="flex items-center gap-4">
          <Link
            to="/userdashboard"
            className="p-2 rounded hover:bg-gray-200/20 dark:hover:bg-gray-700/20"
          >
            <Menu size={20} />
          </Link>

          <div className="flex items-center gap-3">
            <img src="/logoRS.jpg" className="h-12 w-12 rounded-full" alt="" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                <Link to="/">
                  <span className="text-yellow-400">Roof</span>
                  <span className="text-blue-500">Scout</span>
                </Link>
              </h1>
              <p className="text-sm opacity-70">PG Listing</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="px-3 py-2 border rounded bg-gray-100 dark:bg-gray-700"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex items-start justify-center py-10 px-4">
        <div className="w-full md:w-[50%] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl">
          
          <div className="text-center p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
              List Your PG / Co-Living Space
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Share your PG details with potential tenants.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* BASIC INFO */}
            <div className={`bg-blue-100 dark:bg-gray-700 ${sectionBgClass}`}>
              <div className={sectionTitleClass}>
                <i className="ri-home-4-line p-4"></i>
                <p>Basic Information</p>
              </div>

              <div className="px-4 pb-4">
                <label className={labelClass}>PG Name</label>
                <input
                  id="pgName"
                  className={inputClass}
                  value={formData.pgName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="px-4 pb-4">
                <label className={labelClass}>Full Address</label>
                <textarea
                  id="address"
                  className={textareaClass}
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* PRICE & ROOM DETAILS */}
            <div className={`bg-green-100 dark:bg-gray-700 ${sectionBgClass}`}>
              <div className={sectionTitleClass}>
                <i className="ri-price-tag-3-line p-4"></i>
                <p>Room & Pricing Details</p>
              </div>

              <div className="px-4 pb-4 flex flex-col gap-4">

                <label className={labelClass}>Best For</label>
                <select
                  id="bestFor"
                  className={inputClass}
                  value={formData.bestFor}
                  onChange={handleChange}
                >
                  <option value="boys">Boys only</option>
                  <option value="girls">Girls only</option>
                  <option value="coliving">Co-living</option>
                </select>

                <label className={labelClass}>Sharing Type</label>
                <select
                  id="sharingType"
                  className={inputClass}
                  value={formData.sharingType}
                  onChange={handleChange}
                >
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="triple">Triple</option>
                  <option value="4+">4+ Sharing</option>
                </select>

                <label className={labelClass}>Price per bed (₹)</label>
                <input
                  id="price"
                  className={inputClass}
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* AMENITIES */}
            <div className={`bg-yellow-100 dark:bg-gray-700 ${sectionBgClass}`}>
              <div className={sectionTitleClass}>
                <i className="ri-service-line p-4"></i>
                <p>Amenities</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                {Object.keys(formData.amenities).map((key) => (
                  <label key={key} className="flex items-center gap-2 capitalize">
                    <input
                      type="checkbox"
                      checked={formData.amenities[key]}
                      onChange={() => handleAmenityChange(key)}
                    />
                    {key}
                  </label>
                ))}
              </div>
            </div>

            {/* SUBMIT */}
            <div className="w-full flex justify-center px-6 pb-8">
              <button
                type="submit"
                className="w-full md:w-auto bg-green-600 text-white px-8 py-3 rounded-xl shadow-md"
              >
                Submit PG →
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PG;
