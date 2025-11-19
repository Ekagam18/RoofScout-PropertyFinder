import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Sun, Moon, Menu } from 'lucide-react'; 

function PG() {
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
    pgName: '',
    address: '',
    bestFor: 'boys',
    sharingType: 'single',
    price: '',
    amenities: {
      food: false,
      wifi: false,
      ac: false,
      laundry: false,
      power: false,
      housekeeping: false
    }
  });

  useEffect(() => {
    if (editId) {
      const userProperties = JSON.parse(localStorage.getItem('userProperties')) || [];
      const propertyToEdit = userProperties.find(prop => prop.id === Number(editId));
      
      if (propertyToEdit && propertyToEdit.type === 'PG') {
        setIsEditing(true);
        setFormData({
          pgName: propertyToEdit.title || '',
          address: propertyToEdit.address || '',
          bestFor: propertyToEdit.details?.includes('boys') ? 'boys' : 
                   propertyToEdit.details?.includes('girls') ? 'girls' : 'coliving',
          sharingType: propertyToEdit.details?.includes('Single') ? 'single' :
                       propertyToEdit.details?.includes('Double') ? 'double' :
                       propertyToEdit.details?.includes('Triple') ? 'triple' : '4+',
          price: propertyToEdit.price || '',
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
    const { pgName, address, bestFor, sharingType, price, amenities } = formData;
    const photos = e.target.pgPhotos?.files || [];

    // --- Authentication Check ---
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
          title: pgName,
          address,
          details: `Best for ${bestFor}, ${sharingType} sharing`,
          price,
          amenities,
          photoCount: photos.length > 0 ? photos.length : existingProperties[propertyIndex].photoCount
        };
        alert('PG Listing Updated Successfully!');
      } else {
        alert('Error: Could not update PG listing.');
        return;
      }
    } else {
      const newProperty = {
        id: Date.now(),
        type: 'PG',
        title: pgName,
        address,
        details: `Best for ${bestFor}, ${sharingType} sharing`,
        price,
        amenities,
        photoCount: photos.length,
        owner: currentOwner, // Save Owner
        status: 'Pending Approval'
      };
      existingProperties.push(newProperty);
      alert('PG Listing Submitted and Saved!');
    }

    localStorage.setItem('userProperties', JSON.stringify(existingProperties));
    navigate('/userdashboard');
  };

  // --- Utility Classes for Dark Mode Fixes ---
  const inputClass = "border-2 rounded h-12 p-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors";
  const textareaClass = "border-2 rounded p-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors";
  const labelClass = "text-gray-600 dark:text-gray-300 font-semibold";
  const sectionTitleClass = "text-2xl font-bold flex items-center gap-2 text-gray-700 dark:text-gray-300";
  const sectionBgClass = "shadow-lg m-4 rounded-lg";


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
              <p className="text-sm opacity-70">PG Listing</p>
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
        <div className="w-full md:w-[50%] bg-white dark:bg-gray-800 shadow-2xl rounded-3xl">
          <div className="text-center p-6 border-b border-gray-100 dark:border-gray-700">
            <h1 className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-700 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
              {isEditing ? 'Edit PG / Co-Living Space' : 'List Your PG / Co-Living Space'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Fill out the details below to list your Paying Guest accommodation
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            
            {/* Basic Information Section */}
            <div className={`bg-blue-100 dark:bg-gray-700 ${sectionBgClass}`}>
              <div className={sectionTitleClass}>
                <div className="flex gap-2 p-4">
                  <i className="ri-home-4-line"></i>
                  <p>Basic Information</p>
                </div>
              </div>
              <div className="flex flex-col px-4 pb-4">
                <label htmlFor="pgName" className={labelClass}>PG Name / Title</label>
                <input
                  type="text"
                  id="pgName"
                  className={inputClass}
                  value={formData.pgName}
                  onChange={(e) => setFormData({ ...formData, pgName: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col px-4 py-4">
                <label htmlFor="address" className={labelClass}>Full Address</label>
                <textarea
                  id="address"
                  rows="3"
                  className={textareaClass}
                  placeholder="Enter the full property address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Room & Pricing Details Section */}
            <div className={`bg-green-100 dark:bg-gray-700 ${sectionBgClass} pb-4`}>
              <div className={sectionTitleClass}>
                <div className="flex gap-2 p-4">
                  <i className="ri-price-tag-3-line"></i>
                  <p>Room & Pricing Details</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4 px-4">
                <div className="flex flex-col w-full">
                  <label htmlFor="bestFor" className={labelClass}>Best For</label>
                  <select
                    id="bestFor"
                    className={inputClass}
                    value={formData.bestFor}
                    onChange={(e) => setFormData({ ...formData, bestFor: e.target.value })}
                    required
                  >
                    <option value="boys">Boys only</option>
                    <option value="girls">Girls only</option>
                    <option value="coliving">Co-Living (Unisex)</option>
                  </select>
                </div>

                <div className="flex flex-col w-full">
                  <label htmlFor="sharingType" className={labelClass}>Sharing Type</label>
                  <select
                    id="sharingType"
                    className={inputClass}
                    value={formData.sharingType}
                    onChange={(e) => setFormData({ ...formData, sharingType: e.target.value })}
                    required
                  >
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="triple">Triple</option>
                    <option value="4+">4 or more</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-col w-full">
                  <label htmlFor="price" className={labelClass}>Price per Bed (₹)</label>
                  <input
                    type="text"
                    id="price"
                    className={inputClass}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Amenities & Services Section */}
            <div className={`bg-yellow-100 dark:bg-gray-700 ${sectionBgClass}`}>
              <div className={sectionTitleClass}>
                <div className="flex gap-2 px-4 pt-4">
                  <i className="ri-service-line"></i>
                  <p>Amenities & Services</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 p-4 gap-4">
                {Object.keys(formData.amenities).map((amenityKey) => (
                    <label key={amenityKey} className="flex items-center gap-2 capitalize text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        id={amenityKey}
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
            <div className={`bg-purple-50 dark:bg-gray-700 rounded-2xl border border-purple-100 dark:border-gray-600 m-4`}>
              <div className={sectionTitleClass}>
                <div className="flex gap-2 px-4 pt-4">
                  <i className="ri-image-add-line"></i>
                  <p>Upload Photos</p>
                </div>
              </div>
              <div className="p-4 py-4">
                <input
                  type="file"
                  id="pgPhotos"
                  name="pgPhotos"
                  className="block w-full text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 dark:file:bg-violet-600 dark:file:text-white dark:hover:file:bg-violet-700"
                  multiple
                />
              </div>
            </div>

            <div className="w-full flex justify-center px-6 pb-8">
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

export default PG;