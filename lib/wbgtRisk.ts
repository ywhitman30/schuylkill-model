export function getWBGTRisk(wbgt: number) {

  if (wbgt < 80) {
    return {
      level: "Clear Flag",
      color: "text-blue-600",
      message: [
        "Normal activities can take place. As always, maintain hydration and watch for signs of heat stress"
      ]
    };
  }

  if (wbgt <= 85) {
    return {
      level: "Green Flag",
      color: "text-green-600",
      message: [
        "Low intensity activities: regular activities can occur",
        "Medium intensity activities: take a 10 minute break every hour and hydrate",
        "High intensity activities: take a 10 minute break every hour and hydrate"
      ]
    };
  }

  if (wbgt <= 88) {
    return {
      level: "Yellow Flag",
      color: "text-yellow-600",
      message: [
        "Low intensity activities: increase hydration and take a 10 minute break every hour",
        "Medium intensity activities: take a 20 minute break every hour and reduce overly strenuous activities",
        "High intensity activities: take a 30 minute break every hour and ideally reduce any activity to 45 minutes"
      ]
    };
  }

  if (wbgt <= 90) {
    return {
      level: "Red Flag",
      color: "text-red-600",
      message: [
        "Low intensity activities: increase hydration and take a 15 minute break every hour",
        "Medium intensity activities: take a 20 minute break every hour and reduce strenuous activities",
        "High intensity activities: take a 30 minute break every hour and ideally reduce any activity to 45 minutes"
      ]
    };
  }

  return {
    level: "Black Flag",
    color: "text-black",
    message: [
      "Low intensity activities: take a 20 minute break every hour and stay in the shade",
      "Medium intensity activities: take a 40 minute break after 20 minutes of activity and ideally seek shade or an indoor environment",
      "High intensity activities: SUSPEND all outdoor activities and move indoors or reschedule"
    ]
  };
}