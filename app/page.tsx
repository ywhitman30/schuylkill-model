'use client';

import dynamic from "next/dynamic";
import BoatCard from "../components/BoatCard";
import ConditionsPanel from "../components/ConditionsPanel";

const MAINTENANCE_MODE = false; // Set to true to enable maintenance mode

const Map = dynamic(() => import("../components/Map"), {
  ssr: false,
});

export default function Home() {
  if (MAINTENANCE_MODE) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900">
            Under Maintenance
          </h1>
          <p className="text-xl mt-4 text-gray-700">
            We're currently performing maintenance on the Schuylkill Model.
          </p>
          <p className="mt-4 text-gray-700">
            Please check back later for real-time river conditions and safety information.
          </p>
          <p className="mt-4 text-gray-700">
            Thank you for your patience!
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="max-w-6xl mx-auto p-8">

        <h1 className="text-5xl font-bold text-blue-900 text-gray-900">
          Schuylkill Model
        </h1>

        <p className="text-xl mt-4 text-gray-700">
          Interactive river conditions for rowers.
        </p>

        <div className="mt-10">
          <Map />
        </div>

        <div className="mt-10">
          <h2 className="text-3xl font-bold text-blue-900 mb-6 text-gray-900">
            Boat Suitability
          </h2>

          <div className="grid md:grid-cols-5 gap-6">
            <BoatCard
              name="Single (1x)"
              image="/boats/single.svg"
              status="Caution"
              color="orange"
              reason="Sensitive to wind and current."
            />

            <BoatCard
              name="Double (2x)"
              image="/boats/double.svg"
              status="Good"
              color="green"
              reason="Handles moderate conditions."
            />

            <BoatCard
              name="Quad (4x)"
              image="/boats/quad.svg"
              status="Good"
              color="green"
              reason="Stable and efficient."
            />

            <BoatCard
              name="Four (4+)"
              image="/boats/four.svg"
              status="Good"
              color="green"
              reason="Good in stronger wind."
            />

            <BoatCard
              name="Eight (8+)"
              image="/boats/eight.svg"
              status="Excellent"
              color="green"
              reason="Most stable boat type."
            />
          </div>
        </div>

        <div className="mt-10">
          <ConditionsPanel />
        </div>

      </div>
    </main>
  );
}