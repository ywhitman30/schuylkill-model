const USGS_URL = "https://waterservices.usgs.gov/nwis/iv/";

const headers = {
  "User-Agent": "Mozilla/5.0",
  Accept: "application/json",
};

export async function getRiverConditions() {
  let flow = null;
  let height = null;
  let time = "";
  let waterTemperature = null;

  try {
    // Main gauge: Philadelphia
    const riverResponse = await fetch(
      `${USGS_URL}?format=json&sites=01473730&parameterCd=00060,00065`,
      { headers }
    );

    if (riverResponse.ok) {
      const riverData = await riverResponse.json();

      for (const item of riverData.value.timeSeries) {
        const value = item.values[0].value[0];
        const parameter = item.variable.variableCode[0].value;

        if (parameter === "00060") {
          flow = Number(value.value);
          time = value.dateTime;
        }

        if (parameter === "00065") {
          height = Number(value.value);
        }
      }
    }
  } catch {
    // Ignore river fetch failures and fall back to nulls
  }

  try {
    // Norristown gauge: water temperature
    const tempResponse = await fetch(
      `${USGS_URL}?format=json&sites=01473500&parameterCd=00010`,
      { headers }
    );

    if (tempResponse.ok) {
      const tempData = await tempResponse.json();
      const tempSeries = tempData.value.timeSeries;

      if (tempSeries.length > 0) {
        const tempValue = tempSeries[0].values[0].value[0];
        waterTemperature = (Number(tempValue.value) * 9 / 5) + 32;
      }
    }
  } catch {
    // Ignore temperature fetch failures
  }

  return {
    flow,
    height,
    waterTemperature,
    time,
  };
}