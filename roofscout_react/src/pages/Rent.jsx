import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Sun, Moon, Menu } from 'lucide-react'; 

function Rent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get('editId');
  const [isEditing, setIsEditing] = useState(false);
  
  // 1. --- DARK MODE STATE AND LOGIC ---
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('rs-theme') || 'light'; }
    catch { return 'light'; }
  });

  useEffect(() => {
    const root = document.documentElement;
    theme === 'dark' ? root.classList.add('dark') : root.classList.remove('dark');
    try { localStorage.setItem('rs-theme', theme); } catch {}
  }, [theme]);

  const [formData, setFormData] = useState({
    title: '',
    type: 'Apartment / Flat',
    state: 'punjab', // --- (NEW) Default State ---
    address: '',
    bhk: '1 BHK',
    furnishing: 'Semi-Furnished',
    rent: '',
    deposit: '',
    amenities: {
      parking: false,
      ac: false,
      backup: false,
      kitchen: false,
      security: false,
      balcony: false
    }
  });

  useEffect(() => {
    if (editId) {
      const userProperties = JSON.parse(localStorage.getItem('userProperties')) || [];
      const propertyToEdit = userProperties.find(prop => prop.id === Number(editId));
      
      if (propertyToEdit && propertyToEdit.type === 'Rent') {
        setIsEditing(true);
        setFormData({
          title: propertyToEdit.title || '',
          type: propertyToEdit.propertyType || 'Apartment / Flat',
          state: propertyToEdit.state || 'punjab', // Load state
          address: propertyToEdit.address || '',
          bhk: propertyToEdit.bhk || '1 BHK',
          furnishing: propertyToEdit.furnishing || 'Semi-Furnished',
          rent: propertyToEdit.price || '',
          deposit: propertyToEdit.deposit || '',
          amenities: propertyToEdit.amenities || formData.amenities
        });
      }
    }
  }, [editId]);

  const handleAmenityChange = (amenity) => {
    setFormData({
      ...formData,
      amenities: {
        ...formData.amenities,
        [amenity]: !formData.amenities[amenity]
      }
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, type, state, address, bhk, furnishing, rent, deposit, amenities } = formData;
    const photos = e.target.propertyPhotos?.files || [];

    // --- (FIX 1) Authentication Check ---
    const currentOwner = sessionStorage.getItem('loggedUser');
    if (!currentOwner) {
      alert('You must be logged in to list a property.');
      navigate('/login');
      return;
    }

    let existingProperties = JSON.parse(localStorage.getItem('userProperties')) || [];

    if (isEditing) {
      const propertyIndex = existingProperties.findIndex(prop => prop.id === Number(editId));
      if (propertyIndex > -1) {
        existingProperties[propertyIndex] = {
          ...existingProperties[propertyIndex],
          title,
          propertyType: type,
          state: state, // Update state
          address,
          bhk,
          furnishing,
          price: rent,
          deposit,
          amenities,
          details: `${bhk}, ${furnishing}`,
          photoCount: photos.length > 0 ? photos.length : existingProperties[propertyIndex].photoCount
        };
        alert('Property Updated Successfully!');
      } else {
        alert('Error: Could not update property.');
        return;
      }
    } else {
      const newProperty = {
        id: Date.now(),
        type: 'Rent',
        title,
        propertyType: type,
        state: state.toLowerCase(), // Save state
        address,
        bhk,
        furnishing,
        price: rent,
        deposit,
        amenities,
        details: `${bhk}, ${furnishing}`,
        photoCount: photos.length,
        owner: currentOwner, // Save Owner
        status: 'Active'
      };
      existingProperties.push(newProperty);
      alert('Property for Rent Submitted and Saved!');
    }

    localStorage.setItem('userProperties', JSON.stringify(existingProperties));
    navigate('/userdashboard');
  };

  // --- Utility Classes for Dark Mode Fixes ---
  const inputClass = "p-2 border-2 rounded h-12 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors";
  const textareaClass = "border-2 p-2 rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors";
  const labelClass = "font-semibold text-gray-600 dark:text-gray-300 mb-1";
  const sectionTitleClass = "text-2xl font-bold flex items-center gap-2 text-gray-700 dark:text-gray-300";
  const sectionBgClass = "shadow-lg m-4 rounded-lg p-4";

  return (
    <div className={`transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 via-green-50 to-pink-50 min-h-screen'
    }`}>
      
      {/* --- NEW NAVBAR --- */}
      <div className={`backdrop-blur-md ${
        theme === 'dark' ? 'bg-gray-800/70' : 'bg-white/60'
      } sticky top-0 z-50 flex justify-between items-center h-20 px-6 shadow-sm`}>

        <div className="flex items-center gap-4">
          <Link to="/userdashboard" className="p-2 rounded hover:bg-gray-200/20 dark:hover:bg-gray-700/20">
            <Menu size={20} />
          </Link>

          <div className="flex items-center gap-3">
            <img src="/logoRS.jpg" className="h-12 w-12 rounded-full" alt="RoofScout" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                <Link to="/">
                  <span className="text-yellow-400">Roof</span>
                  <span className="text-blue-500">Scout</span>
                </Link>
              </h1>
              <p className="text-sm opacity-70">Rent Property</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          
          {/* DARK MODE BUTTON */}
          <button 
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} 
            className="px-3 py-2 border rounded hover:shadow bg-gray-100 dark:bg-gray-700 dark:border-gray-600 transition-colors duration-200"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
      
      {/* --- MAIN FORM CONTENT --- */}
      <div className="flex items-start justify-center py-10 px-4">
        <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl">
          <div className="text-center p-6 border-b border-gray-100 dark:border-gray-700">
            <h1 className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-700 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
              {isEditing ? 'Edit Rental Listing' : 'List Your Property for Rent'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Provide the details below to find the perfect tenant.</p>
          </div>

          <form onSubmit={handleSubmit}>
            
            {/* Property Details Section */}
            <div className={`bg-blue-100 dark:bg-gray-700 ${sectionBgClass}`}>
              <div className={sectionTitleClass}>
                <i className="ri-home-heart-line"></i>
                <p>Property Details</p>
              </div>
              <hr className="my-3 border-blue-200 dark:border-gray-600" />

              <div className="flex flex-col md:flex-row w-full gap-4">
                <div className="w-full flex flex-col">
                  <label htmlFor="title" className={labelClass}>
                    Property Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    placeholder="e.g., Modern 2BHK Apartment"
                    className={inputClass}
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col w-full">
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
                    <option>Apartment / Flat</option>
                    <option>Independent House / Villa</option>
                    <option>Builder Floor</option>
                  </select>
                </div>
              </div>

              {/* State Dropdown */}
              <div className="flex flex-col mt-4">
                <label htmlFor="state" className={labelClass}>State</label>
                <select
                  id="state"
                  className={inputClass}
                  value={formData.state}
                  onChange={handleChange}
                  required
                >
                  <option value="punjab">Punjab</option>
                  <option value="goa">Goa</option>
                  <option value="gujarat">Gujarat</option>
                  <option value="haryana">Haryana</option>
                  <option value="delhi">Delhi</option>
                  <option value="maharashtra">Maharashtra</option>
                  {/* Add others */}
                </select>
              </div>

              <div className="flex flex-col mt-4">
                <label htmlFor="address" className={labelClass}>
                  Full Address
                </label>
                <textarea
                  id="address"
                  rows="3"
                  className={textareaClass}
                  placeholder="Enter full address including city and pin code"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Rental & Configuration Section */}
            <div className={`bg-green-100 dark:bg-gray-700 ${sectionBgClass}`}>
              <div className={sectionTitleClass}>
                <i className="ri-price-tag-3-line"></i>
                <p>Rental & Configuration</p>
              </div>
              <hr className="my-3 border-green-200 dark:border-gray-600" />

              <div className="flex flex-col md:flex-row w-full gap-4">
                <div className="flex flex-col w-full">
                  <label htmlFor="bhk" className={labelClass}>BHK Type</label>
                  <select
                    id="bhk"
                    className={inputClass}
                    value={formData.bhk}
                    onChange={handleChange}
                    required
                  >
                    <option>1 BHK</option>
                    <option>2 BHK</option>
                    <option>3 BHK</option>
                    <option>4+ BHK</option>
                  </select>
                </div>
                <div className="flex flex-col w-full">
                  <label htmlFor="furnishing" className={labelClass}>
                    Furnishing
                  </label>
                  <select
                    id="furnishing"
                    className={inputClass}
                    value={formData.furnishing}
                    onChange={handleChange}
                    required
                  >
                    <option>Semi-Furnished</option>
                    <option>Fully-Furnished</option>
                    <option>Unfurnished</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4 mt-4">
                <div className="flex flex-col w-full">
                  <label htmlFor="rent" className={labelClass}>
                    Monthly Rent (₹)
                  </label>
                  <input
                    type="text"
                    id="rent"
                    className={inputClass}
                    value={formData.rent}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label htmlFor="deposit" className={labelClass}>
                    Security Deposit (₹)
                  </label>
                  <input
                    type="text"
                    id="deposit"
                    className={inputClass}
                    value={formData.deposit}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Amenities Section */}
            <div className={`bg-yellow-100 dark:bg-gray-700 ${sectionBgClass}`}>
              <div className={sectionTitleClass}>
                <i className="ri-service-line"></i>
                <p>Amenities</p>
              </div>
              <hr className="my-3 border-yellow-200 dark:border-gray-600" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Object.keys(formData.amenities).map((amenityKey) => (
                  <label key={amenityKey} className="flex items-center gap-2 capitalize text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      id={`amenity${amenityKey}Rent`}
                      checked={formData.amenities[amenityKey]}
                      onChange={() => handleAmenityChange(amenityKey)}
                      className="form-checkbox h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
                    />
                    {amenityKey.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                ))}
              </div>
            </div>

            {/* Photo Upload Section & Submit */}
            <div className={`bg-purple-50 dark:bg-gray-700 rounded-2xl border border-purple-100 dark:border-gray-600 m-4 p-4`}>
              <div className={sectionTitleClass}>
                <i className="ri-image-add-line"></i>
                <p>Upload Photos</p>
              </div>
              <hr className="my-3 border-purple-200 dark:border-gray-600" />
              <div className="mt-4">
                <input
                  type="file"
                  id="propertyPhotos"
                  name="propertyPhotos"
                  className="block w-full text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 dark:file:bg-violet-600 dark:file:text-white dark:hover:file:bg-violet-700"
                  multiple
                />
              </div>
            </div>

            <div className="w-full flex justify-center p-6">
              <button
                type="submit"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-3 text-white font-semibold shadow-lg hover:shadow-xl active:scale-[.99] focus:outline-none focus:ring-4 focus:ring-emerald-400/40 transition"
              >
                {isEditing ? 'Update Property' : 'Submit Property'}
                <span className="text-white/90">→</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Rent;