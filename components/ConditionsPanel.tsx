"use client";

import { getRiverWindEffect } from "../lib/riverWind";
import { useEffect, useState } from "react";
import { getRiverConditions } from "../lib/usgs";
import { getWeather } from "../lib/weather";
import { calculateWBGT } from "../lib/wbgt";
import { getWBGTRisk } from "../lib/wbgtRisk";

export default function ConditionsPanel() {
  const [river, setRiver] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  async function loadData() {
    const riverData = await getRiverConditions();
    const weatherData = await getWeather();

    setRiver(riverData);
    setWeather(weatherData);
    setLastUpdated(new Date());
  }

  useEffect(() => {
    loadData();

    const interval = setInterval(() => {
      loadData();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const wbgtValue =
    weather && weather.temperature != null && weather.humidity != null
      ? calculateWBGT(
          weather.temperature,
          weather.humidity,
          weather.cloudCover,
          weather.windSpeed
        )
      : null;

  const risk = wbgtValue != null ? getWBGTRisk(wbgtValue) : null;
  const riverWind =
  weather?.windDirection != null
    ? getRiverWindEffect(weather.windDirection, "Fishbowl")
    : null;

  const riskColor =
    risk?.level === "Green Flag"
      ? "text-green-600"
      : risk?.level === "Yellow Flag"
      ? "text-yellow-600"
      : risk?.level === "Red Flag"
      ? "text-red-600"
      : risk?.level === "Black Flag"
      ? "text-black"
      : "text-gray-900";

  return (
    <div className="grid md:grid-cols-3 gap-6 mt-10">

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-bold text-gray-900">River Height</h2>
        <p className="text-2xl mt-2 text-gray-900 font-semibold">
          {river ? `${river.height?.toFixed(2)} ft` : "Loading..."}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-bold text-gray-900">River Flow</h2>
        <p className="text-2xl mt-2 text-gray-900 font-semibold">
          {river ? `${river.flow?.toLocaleString()} cfs` : "Loading..."}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-bold text-gray-900">Water Temperature</h2>
        <p className="text-2xl mt-2 text-gray-900 font-semibold">
          {river && river.waterTemperature != null
            ? `${river.waterTemperature.toFixed(1)}°F`
            : "Loading..."}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-bold text-gray-900">Temperature</h2>
        <p className="text-2xl mt-2 text-gray-900 font-semibold">
          {weather ? `${weather.temperature}°F` : "Loading..."}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-bold text-gray-900">Wind</h2>
        <p className="mt-2 text-gray-700">
          {weather ? `${weather.windSpeed} mph` : "Loading..."}
        </p>
        <p className="text-gray-700">
          Gusts: {weather?.gusts ?? "Loading..."} mph
        </p>
        <p className="text-gray-700">
          Direction: {weather?.windDirection ?? "Loading..."}°
        </p>
        <p className="text-gray-700">
          River effect: {riverWind ?? "Loading..."}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-bold text-gray-900">Weather</h2>

        <p className="mt-2 text-gray-700">
          Humidity: {weather?.humidity ?? "Loading..."}%
        </p>

        <p className="text-gray-700">
          Precipitation:{" "}
          {weather
            ? `${(weather.precipitation * 0.03937).toFixed(2)} in`
            : "Loading..."}
        </p>

        <p className="text-gray-700">
          WBGT: {wbgtValue != null ? `${wbgtValue}°F` : "Loading..."}
        </p>

        {risk ? (
          <div className="mt-2">
            <p className={`font-bold ${riskColor}`}>
              {risk.level}
            </p>

            <div className="mt-3 space-y-1 text-sm text-gray-900">
              {risk.message.map((line) => {
                const [title, ...rest] = line.split(":");

                return (
                  <p key={line}>
                    <span className="font-bold">{title}:</span>
                    {rest.join(":")}
                  </p>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-bold text-gray-900">Last Updated</h2>

        <p className="mt-2 text-gray-700">
          {lastUpdated
            ? lastUpdated.toLocaleString()
            : "Loading..."}
        </p>
      </div>

    </div>
  );
}