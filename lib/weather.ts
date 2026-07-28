const LAT = 40.071973;
const LON = -75.290180;

export async function getWeather() {
  const response = await fetch(
    `https://api.weather.gov/points/${LAT},${LON}`,
    {
      headers: {
        "User-Agent": "SchuylkillModel"
      }
    }
  );

  const points = await response.json();

  const forecastResponse = await fetch(
    points.properties.forecastHourly,
    {
      headers: {
        "User-Agent": "SchuylkillModel"
      }
    }
  );

  const forecast = await forecastResponse.json();

  const current = forecast.properties.periods[0];

  console.log({
    temperature: current.temperature,
    humidity: current.relativeHumidity?.value,
    windSpeed: current.windSpeed,
    windDirection: current.windDirection,
    gusts: current.windGusts,
  });

  return {
    temperature: current.temperature,
    humidity: current.relativeHumidity.value,
    cloudCover: current.cloudCover ?? 50,
    windSpeed: current.windSpeed,
    windDirection: current.windDirection,
    gusts: current.windGusts,
    condition: current.shortForecast,
    time: new Date().toISOString(),
    precipitation: current.probabilityOfPrecipitation.value ?? 0,
  };
}
