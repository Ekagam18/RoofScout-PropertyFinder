import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Sun, Moon, Menu } from "lucide-react";
import { supabase } from "../supabase";

function Sell() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get("editId");

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    type: "plot",
    state: "punjab",
    address: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    size: "",
    description: "",
  });

  // 🌙 → DARK MODE LOGIC
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("rs-theme") || "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    theme === "dark"
      ? root.classList.add("dark")
      : root.classList.remove("dark");
    try {
      localStorage.setItem("rs-theme", theme);
    } catch {}
  }, [theme]);

  // 🔥 EDIT MODE (LOCAL UI ONLY — Supabase editing coming later)
  useEffect(() => {
    if (editId) {
      setIsEditing(true);
    }
  }, [editId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // 🟢 SUBMIT PROPERTY TO SUPABASE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      title,
      type,
      state,
      address,
      price,
      bedrooms,
      bathrooms,
      size,
      garages,
      description,
    } = formData;

    // 1️⃣ → Get logged in user from Supabase
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;

    if (!session?.user) {
      alert("You must be logged in to list a property.");
      navigate("/login");
      return;
    }

    const userId = session.user.id;

    // 2️⃣ → Build details for UI consistency
    const detailsString =
      type === "plot"
        ? `${size} sqft Plot`
        : `${bedrooms || "X"} Bed, ${bathrooms || "Y"} Bath, ${size} sqft`;

    // 3️⃣ → Insert into Supabase
  // Save directly to localStorage (Supabase not accessible)
  let error = null;

  // Also save to localStorage as backup
  try {
    const propertyData = {
      id: `SELL-${Date.now()}`,
      owner_id: userId,
      title,
      type: type.toLowerCase(),
      price,
      location: `${address}, ${state}`,
      area: size,
      image: null,
      description,
      details: detailsString,
      beds: bedrooms || null,
      baths: bathrooms || null,
      created_at: new Date().toISOString(),
    };
    
    // Use 'allProperties' key so AllProperties page can see them
    const existingProperties = JSON.parse(localStorage.getItem("allProperties") || "[]");
    
    // Add formatted price text
    propertyData.priceText = propertyData.price ? `₹${Number(propertyData.price).toLocaleString()}` : "Price on request";
    
    existingProperties.push(propertyData);
    localStorage.setItem("allProperties", JSON.stringify(existingProperties));
    console.log("✅ Property saved to localStorage!", propertyData);
  } catch (localError) {
    console.log("localStorage Error:", localError);
  }


    if (error) {
      console.log("Error:", error);
      alert("Error saving property.");
      return;
    }

    alert("Property submitted successfully!");
    navigate("/userdashboard");
  };

  // Tailwind UI classes
  const inputClass =
    "border-2 rounded h-12 p-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors";
  const textareaClass =
    "border-2 rounded p-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors";
  const labelClass = "text-gray-700 dark:text-gray-300 font-semibold";
  const sectionBgClass = "shadow-inner m-4 rounded-lg";

  return (
    <div
      className={`transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-br from-blue-50 via-green-50 to-pink-50 min-h-screen"
      }`}
    >
      {/* ─── NAVBAR ───────────────────────────────────────── */}
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
              <p className="text-sm opacity-70">Sell Property</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            className="px-3 py-2 border rounded hover:shadow bg-gray-100 dark:bg-gray-700 dark:border-gray-600 transition-colors duration-200"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>

      {/* ─── MAIN FORM ───────────────────────────────────── */}
      <div className="flex items-start justify-center py-10">
        <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl mx-4">
          <div className="p-8 border-b border-gray-100 dark:border-gray-700">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-blue-600 via-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">
              {isEditing ? "Edit Property Listing" : "List Your Property"}
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-400 mt-2">
              Fill out the details below to put your property on the market.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* ─── BASIC INFORMATION ───────────────────────── */}
            <div className={`bg-blue-50 dark:bg-gray-700 ${sectionBgClass}`}>
              <div className="flex items-center gap-2 text-2xl mt-4 p-4 text-gray-700 dark:text-gray-300 font-bold">
                <i className="ri-home-4-line"></i>
                <p>Basic Information</p>
              </div>

              <div className="md:flex md:space-x-4">
                <div className="flex flex-col w-full p-4">
                  <label htmlFor="title" className={labelClass}>
                    Property Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    className={inputClass}
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="eg. Modern 2BHK Apartment"
                  />
                </div>

                <div className="flex flex-col w-full p-4">
                  <label htmlFor="type" className={labelClass}>
                    Property Type
                  </label>
                  <select
                    id="type"
                    className={inputClass}
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="plot">Plot / Land</option>
                    <option value="flat">Flat / Apartment</option>
                    <option value="builder-floor">
                      Independent / Builder Floor
                    </option>
                    <option value="villa">Independent House / Villa</option>
                  </select>
                </div>
              </div>

              {/* STATE DROPDOWN */}
              {/* STATE INPUT */}
<div className="p-4">
  <label htmlFor="state" className={labelClass}>
    State
  </label>
  <input
    id="state"
    type="text"
    className={inputClass}
    value={formData.state}
    onChange={handleChange}
    placeholder="Type your state"
    required
  />
</div>


              <div className="p-4 pb-6">
                <label htmlFor="address" className={labelClass}>
                  Full Address
                </label>
                <textarea
                  id="address"
                  rows="3"
                  className={textareaClass}
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Enter the full property address"
                />
              </div>
            </div>

            <hr className="my-6 mx-6 border-gray-200 dark:border-gray-600" />

            {/* ─── DETAILS & PRICE ─────────────────────────── */}
            <div className={`bg-yellow-50 dark:bg-gray-700 ${sectionBgClass}`}>
              <div className="flex gap-2 text-2xl mt-4 p-4 text-gray-700 dark:text-gray-300 font-bold">
                <i className="ri-price-tag-3-line"></i>
                <p>Details & Price</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 pb-4">
                <div className="flex flex-col">
                  <label htmlFor="price" className={labelClass}>
                    Price (in ₹)
                  </label>
                  <input
                    id="price"
                    type="text"
                    className={inputClass}
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="bedrooms" className={labelClass}>
                    Bedrooms
                  </label>
                  <input
                    id="bedrooms"
                    type="text"
                    className={inputClass}
                    value={formData.bedrooms}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="bathrooms" className={labelClass}>
                    Bathrooms
                  </label>
                  <input
                    id="bathrooms"
                    type="text"
                    className={inputClass}
                    value={formData.bathrooms}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="p-4">
                <label htmlFor="size" className={labelClass}>
                  Total Size (in sq. ft.)
                </label>
                <input
                  id="size"
                  type="text"
                  className={inputClass}
                  value={formData.size}
                  onChange={handleChange}
                />
              </div>

              <div className="p-4 pb-6">
                <label htmlFor="description" className={labelClass}>
                  Description
                </label>
                <textarea
                  id="description"
                  rows="3"
                  className={textareaClass}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell us more about your property..."
                />
              </div>
            </div>

            <hr className="my-6 mx-6 border-gray-200 dark:border-gray-600" />

            {/* ─── PHOTO UPLOAD (NOT CONNECTED YET) ───────── */}
            <div
              className={`bg-purple-50 dark:bg-gray-700 m-4 rounded-lg shadow-sm p-4`}
            >
              <div className="flex items-center gap-2 text-2xl text-gray-700 dark:text-gray-300 font-bold mb-4">
                <i className="ri-multi-image-line"></i>
                <p>Upload Photos</p>
              </div>

              <div className="p-4">
                <input
                  id="photos"
                  name="photos"
                  type="file"
                  multiple
                  accept="image/*"
                  className="w-full md:w-auto text-gray-700 dark:text-gray-300"
                />
              </div>

              <div className="flex justify-center px-6 pb-8">
                <button
                  type="submit"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-3 text-white font-semibold shadow-lg hover:shadow-xl active:scale-[.99] transition"
                >
                  {isEditing ? "Update Property" : "Submit Property"}
                  <span className="text-white/90">→</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Sell;

// 2nd code

// import { useState, useEffect } from "react";
// import { useNavigate, useSearchParams, Link } from "react-router-dom";
// import { Sun, Moon, Menu } from "lucide-react";
// import { supabase } from "../supabase";

// function Sell() {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const editId = searchParams.get("editId");

//   const [isEditing, setIsEditing] = useState(false);

//   const [formData, setFormData] = useState({
//     title: "",
//     type: "house",
//     state: "",
//     address: "",
//     price: "",
//     bedrooms: "",
//     bathrooms: "",
//     size: "",
//     garages: "",
//     description: "",
//   });

//   // Dark mode
//   const [theme, setTheme] = useState(() => {
//     try {
//       return localStorage.getItem("rs-theme") || "light";
//     } catch {
//       return "light";
//     }
//   });

//   useEffect(() => {
//     const root = document.documentElement;
//     theme === "dark"
//       ? root.classList.add("dark")
//       : root.classList.remove("dark");

//     try {
//       localStorage.setItem("rs-theme", theme);
//     } catch {}
//   }, [theme]);

//   // Edit mode enable
//   useEffect(() => {
//     if (editId) setIsEditing(true);
//   }, [editId]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value });
//   };

//   // Submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const {
//       title,
//       type,
//       state,
//       address,
//       price,
//       bedrooms,
//       bathrooms,
//       size,
//       garages,
//       description,
//     } = formData;

//     const { data: sessionData } = await supabase.auth.getSession();
//     const session = sessionData.session;

//     if (!session?.user) {
//       alert("You must be logged in to list a property.");
//       navigate("/login");
//       return;
//     }

//     const userId = session.user.id;

//     const detailsString =
//       type === "plot"
//         ? `${size} sqft Plot`
//         : `${bedrooms || "X"} Bed, ${bathrooms || "Y"} Bath, ${size} sqft`;

//     const { error } = await supabase.from("properties").insert([
//       {
//         owner_id: userId,
//         title,
//         type: type.toLowerCase(),
//         price,
//         location: `${address}, ${state}`,
//         area: size,
//         image: null,
//         beds: bedrooms || null,
//         baths: bathrooms || null,
//         garages: garages || null,
//         description,
//         details: detailsString,
//       },
//     ]);

//     if (error) {
//       console.log("Supabase Insert Error:", error);
//       alert("Error saving property.");
//       return;
//     }

//     alert("Property submitted successfully!");
//     navigate("/userdashboard");
//   };

//   // UI Classes
//   const inputClass =
//     "border-2 rounded h-12 p-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors";
//   const textareaClass =
//     "border-2 rounded p-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors";
//   const labelClass = "text-gray-700 dark:text-gray-300 font-semibold";
//   const sectionBgClass = "shadow-inner m-4 rounded-lg";

//   return (
//     <div
//       className={`transition-colors duration-300 ${
//         theme === "dark"
//           ? "bg-gray-900 text-gray-100"
//           : "bg-gradient-to-br from-blue-50 via-green-50 to-pink-50 min-h-screen"
//       }`}
//     >
//       {/* NAVBAR */}
//       <div
//         className={`backdrop-blur-md ${
//           theme === "dark" ? "bg-gray-800/70" : "bg-white/60"
//         } sticky top-0 z-50 flex justify-between items-center h-20 px-6 shadow-sm`}
//       >
//         <div className="flex items-center gap-4">
//           <Link
//             to="/userdashboard"
//             className="p-2 rounded hover:bg-gray-200/20 dark:hover:bg-gray-700/20"
//           >
//             <Menu size={20} />
//           </Link>

//           <div className="flex items-center gap-3">
//             <img src="/logoRS.jpg" className="h-12 w-12 rounded-full" alt="" />
//             <div>
//               <h1 className="text-xl font-bold tracking-tight">
//                 <Link to="/">
//                   <span className="text-yellow-400">Roof</span>
//                   <span className="text-blue-500">Scout</span>
//                 </Link>
//               </h1>
//               <p className="text-sm opacity-70">Sell Property</p>
//             </div>
//           </div>
//         </div>

//         <button
//           onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
//           className="px-3 py-2 border rounded hover:shadow bg-gray-100 dark:bg-gray-700 dark:border-gray-600 transition-colors"
//         >
//           {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
//         </button>
//       </div>

//       {/* MAIN FORM */}
//       <div className="flex items-start justify-center py-10">
//         <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl mx-4">
//           <div className="p-8 border-b border-gray-100 dark:border-gray-700">
//             <h1 className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-blue-600 via-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">
//               {isEditing ? "Edit Property Listing" : "List Your Property"}
//             </h1>
//             <p className="text-center text-gray-600 dark:text-gray-400 mt-2">
//               Fill out the details below to put your property on the market.
//             </p>
//           </div>

//           <form onSubmit={handleSubmit}>
//             {/* BASIC INFO */}
//             <div
//               className={`bg-blue-50 dark:bg-gray-700 ${sectionBgClass}`}
//             >
//               <div className="flex items-center gap-2 text-2xl mt-4 p-4 text-gray-700 dark:text-gray-300 font-bold">
//                 <i className="ri-home-4-line"></i>
//                 <p>Basic Information</p>
//               </div>

//               <div className="md:flex md:space-x-4">
//                 <div className="flex flex-col w-full p-4">
//                   <label htmlFor="title" className={labelClass}>
//                     Property Title
//                   </label>
//                   <input
//                     id="title"
//                     type="text"
//                     className={inputClass}
//                     value={formData.title}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <div className="flex flex-col w-full p-4">
//                   <label htmlFor="type" className={labelClass}>
//                     Property Type
//                   </label>
//                   <select
//                     id="type"
//                     className={inputClass}
//                     value={formData.type}
//                     onChange={handleChange}
//                     required
//                   >
//                     <option value="plot">Plot / Land</option>
//                     <option value="flat">Flat / Apartment</option>
//                     <option value="builder-floor">
//                       Independent / Builder Floor
//                     </option>
//                     <option value="villa">Independent House / Villa</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="p-4">
//                 <label htmlFor="state" className={labelClass}>State</label>
//                 <input
//                   id="state"
//                   className={inputClass}
//                   value={formData.state}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="p-4 pb-6">
//                 <label htmlFor="address" className={labelClass}>
//                   Full Address
//                 </label>
//                 <textarea
//                   id="address"
//                   rows="3"
//                   className={textareaClass}
//                   value={formData.address}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//             </div>

//             <hr className="my-6 mx-6 border-gray-200 dark:border-gray-600" />

//             {/* DETAILS */}
//             <div
//               className={`bg-yellow-50 dark:bg-gray-700 ${sectionBgClass}`}
//             >
//               <div className="flex gap-2 text-2xl mt-4 p-4 text-gray-700 dark:text-gray-300 font-bold">
//                 <i className="ri-price-tag-3-line"></i>
//                 <p>Details & Price</p>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 pb-4">
//                 <div className="flex flex-col">
//                   <label htmlFor="price" className={labelClass}>Price</label>
//                   <input id="price" className={inputClass} value={formData.price} onChange={handleChange} />
//                 </div>

//                 <div className="flex flex-col">
//                   <label htmlFor="bedrooms" className={labelClass}>Bedrooms</label>
//                   <input id="bedrooms" className={inputClass} value={formData.bedrooms} onChange={handleChange} />
//                 </div>

//                 <div className="flex flex-col">
//                   <label htmlFor="bathrooms" className={labelClass}>Bathrooms</label>
//                   <input id="bathrooms" className={inputClass} value={formData.bathrooms} onChange={handleChange} />
//                 </div>
//               </div>

//               <div className="p-4">
//                 <label htmlFor="size" className={labelClass}>Total Size (sqft)</label>
//                 <input id="size" className={inputClass} value={formData.size} onChange={handleChange} />
//               </div>

//               <div className="p-4">
//                 <label htmlFor="garages" className={labelClass}>Garages</label>
//                 <input id="garages" className={inputClass} value={formData.garages} onChange={handleChange} />
//               </div>

//               <div className="p-4 pb-6">
//                 <label htmlFor="description" className={labelClass}>Description</label>
//                 <textarea id="description" rows="3" className={textareaClass} value={formData.description} onChange={handleChange} />
//               </div>
//             </div>

//             <hr className="my-6 mx-6 border-gray-200 dark:border-gray-600" />

//             {/* PHOTOS */}
//             <div
//               className={`bg-purple-50 dark:bg-gray-700 ${sectionBgClass} p-4`}
//             >
//               <div className="flex items-center gap-2 text-2xl text-gray-700 dark:text-gray-300 font-bold mb-4">
//                 <i className="ri-multi-image-line"></i>
//                 <p>Upload Photos</p>
//               </div>

//               <div className="p-4">
//                 <input type="file" multiple accept="image/*" className="w-full text-gray-700 dark:text-gray-300" />
//               </div>

//               <div className="flex justify-center px-6 pb-8">
//                 <button
//                   type="submit"
//                   className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-3 text-white font-semibold shadow-lg hover:shadow-xl transition"
//                 >
//                   {isEditing ? "Update Property" : "Submit Property"} →
//                 </button>
//               </div>
//             </div>
//           </form>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default Sell;
