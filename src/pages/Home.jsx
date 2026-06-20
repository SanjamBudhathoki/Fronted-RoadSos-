import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* HERO */}
      <section className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">

          <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6">
            🚨 Emergency Response Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Emergency Help
            <span className="text-red-500"> When Every Second Counts</span>
          </h1>

          <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
            RoadSOS connects citizens, ambulance services, police,
            fire departments and roadside responders through one
            real-time emergency network.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
            <Link to="/user/dashbord">
              <Button className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-xl font-semibold">
                🚨 Report Emergency
              </Button>
            </Link>

            <Link to="/provider/dashbord">
              <Button className="bg-gray-800 hover:bg-gray-700 px-8 py-3 rounded-xl font-semibold">
                Provider Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-3xl font-bold text-red-500">24/7</h3>
            <p className="text-gray-400 mt-2">Emergency Support</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-3xl font-bold text-red-500">500+</h3>
            <p className="text-gray-400 mt-2">Incidents Resolved</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-3xl font-bold text-red-500">&lt;5 min</h3>
            <p className="text-gray-400 mt-2">Average Response</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-3xl font-bold text-red-500">100%</h3>
            <p className="text-gray-400 mt-2">Real-Time Tracking</p>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="container mx-auto px-6 py-24">

        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold">
            How RoadSOS Works
          </h2>

          <p className="text-gray-400 mt-3">
            Fast. Accurate. Reliable.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="font-semibold text-xl mb-2">
              Report Location
            </h3>
            <p className="text-gray-400">
              Share incident details and GPS coordinates instantly.
            </p>
          </div>

          <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
            <div className="text-4xl mb-4">🚑</div>
            <h3 className="font-semibold text-xl mb-2">
              Provider Dispatch
            </h3>
            <p className="text-gray-400">
              Nearby responders receive alerts immediately.
            </p>
          </div>

          <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
            <div className="text-4xl mb-4">🛰️</div>
            <h3 className="font-semibold text-xl mb-2">
              Live Tracking
            </h3>
            <p className="text-gray-400">
              Monitor response progress in real time.
            </p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 pb-24">

        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-10 text-center">

          <h2 className="text-3xl font-bold">
            Need Immediate Assistance?
          </h2>

          <p className="mt-3 text-red-100">
            Submit an emergency report and notify nearby responders instantly.
          </p>

          <Link to="/user/dashbord">
            <Button className="mt-8 bg-white text-black hover:bg-gray-100 px-8 py-3 rounded-xl">
              Report Now
            </Button>
          </Link>

        </div>
      </section>

    </div>
  );
};

export default Home;