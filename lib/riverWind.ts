const riverSections = {
  Fishbowl: {
    heading: 250.54,
    rightSide: "Conshohocken side",
    leftSide: "I-76 side",
  },
  "Around the Bend": {
    heading: 146.26,
    rightSide: "right side",
    leftSide: "left side",
  },
};

export function getRiverWindEffect(
  windDirection: number,
  section: keyof typeof riverSections
) {
  const river = riverSections[section];

  let difference = windDirection - river.heading;

  if (difference < 0) difference += 360;

  if (difference <= 45 || difference >= 315) {
    return `With river flow on ${section}`;
  }

  if (difference >= 135 && difference <= 225) {
    return `Against river flow on ${section}`;
  }

  if (difference > 45 && difference < 135) {
    return `Crosswind on ${section} from ${river.rightSide}`;
  }

  return `Crosswind on ${section} from ${river.leftSide}`;
}