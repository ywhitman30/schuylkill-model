function celsiusToFahrenheit(c: number) {
  return (c * 9) / 5 + 32;
}

function fahrenheitToCelsius(f: number) {
  return ((f - 32) * 5) / 9;
}

// Stull approximation for wet bulb temperature
function wetBulbTemperature(tempC: number, humidity: number) {
  return (
    tempC * Math.atan(0.151977 * Math.sqrt(humidity + 8.313659)) +
    Math.atan(tempC + humidity) -
    Math.atan(humidity - 1.676331) +
    0.00391838 * Math.pow(humidity, 1.5) * Math.atan(0.023101 * humidity) -
    4.686035
  );
}

export function calculateWBGT(
  temperatureF: any,
  humidity: any,
  cloudCover: any,
  windSpeed: any
) {
  console.log("WBGT INPUTS:", {
    temperatureF,
    humidity,
    cloudCover,
    windSpeed,
  });

  if (
    typeof temperatureF !== "number" ||
    typeof humidity !== "number"
  ) {
    return null;
  }

  const safeCloud =
    typeof cloudCover === "number"
      ? cloudCover
      : 50;

  const safeWind =
    typeof windSpeed === "number"
      ? windSpeed
      : 0;

  const tempC =
    (temperatureF - 32) * 5 / 9;

  const wbgt =
    tempC +
    (humidity * 0.05) -
    (safeWind * 0.1) +
    (safeCloud * 0.01);

  return Math.round(
    wbgt * 9 / 5 + 32
  );
}
