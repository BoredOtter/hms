import React from 'react';
import loupeImage from '../assets/loupe.jpg'; // Import the loupe image from the assets folder

const SearchBar = ({ searchTerm, onSearch }) => {
  return (
    <div className="text-center relative">
  <div className="max-w-[500px] mx-auto relative">
    <input
      type="text"
      placeholder="Search by firstname/lastname"
      value={searchTerm}
      onChange={(e) => onSearch(e.target.value)}
      className="w-full bg-stone-100 px-10 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black pl-8"
    />
      <img src={loupeImage} alt="Search" className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-4.5 bg-stone-10 rounded-full" />
  </div>
</div>

  );
}

export default SearchBar;
