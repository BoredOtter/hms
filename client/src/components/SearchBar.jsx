import React from 'react';
import formInput from './utils/formInput';
import loupeImage from '../assets/search.png'; // Import the loupe image from the assets folder

const SearchBar = ({ searchTerm, onSearch }) => {
  return (
    <div className="text-center relative">
  <div className="max-w-[500px] mx-auto relative">
    <input
      type="text"
      placeholder="Search"
      value={searchTerm}
      onChange={(e) => onSearch(e.target.value)}
      className="w-full bg-sky-100 px-10 py-1.5 rounded-md border border-sky-100 focus:outline-none focus:border-blue-500 text-black pl-8"
    />
      <img src={loupeImage} alt="Search" className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-4.5 bg-stone-10 rounded-full" />
  </div>
</div>

  );
}

export default SearchBar;
