import React from "react";

const Home = () => {
  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Image Section */}
      <div className="w-1/2 flex items-center justify-center">
        <img
          src="https://i.ibb.co.com/Lhx7P7nH/Untitled-design-3.png"
          alt="Blood Donation"
          className="max-w-full max-h-screen object-contain"
        />
      </div>

      {/* Text Section */}
      <div className="w-1/2 flex items-center justify-center flex flex-col">
        <h3 className="text-3xl font-semibold text-center">
          Donate <span className="text-[#880808]"> Blood </span> or Find{" "}
          <span className="text-[#880808]"> Blood </span>
        </h3>
        <p className="text-lg">Because every life matters</p>
      </div>
    </div>
  );
};

export default Home;
