import React from "react";
import Card from "./Card";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-8 pb-4 ">
     
     <Card>
           <div className="max-w-6xl mx-auto px-4 flex flex-col space-y-8">


        <div className="text-center">
          <h2 className="text-white text-xl font-semibold">
            RoadSos Emergency System
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Fast response. Safer roads. Reliable emergency support.
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex justify-center flex-wrap gap-6 text-sm font-medium">
          <a className="hover:text-white" href="#">Dashboard</a>
          <a className="hover:text-white" href="#">Report Incident</a>
          <a className="hover:text-white" href="#">Live Map</a>
          <a className="hover:text-white" href="#">Emergency Contacts</a>
          <a className="hover:text-white" href="#">About</a>
        </nav>

        {/* Socials */}
        <div className="flex justify-center space-x-5">
          {[
            "facebook",
            "linkedin",
            "instagram",
            "messenger",
            "twitter",
          ].map((platform) => (
            <a
              key={platform}
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-70 hover:opacity-100 transition"
            >
              <img
                src={`https://img.icons8.com/fluent/30/000000/${platform}.png`}
                alt={platform}
              />
            </a>
          ))}
        </div>

        {/* Bottom line */}
        <div className="text-center text-xs text-gray-500 border-t border-gray-800 pt-4">
          © {new Date().getFullYear()} RoadSos. All rights reserved.
        </div>
      </div>
     </Card>
 
    </footer>
  );
};

export default Footer;