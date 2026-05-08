export const conversionData = {
  currency: {
    label: "Currency",
    units: ["USD", "IDR", "EUR", "JPY", "GBP", "SGD"],
    rates: {
      USD: 1,
      IDR: 16250,
      EUR: 0.93,
      JPY: 155.5,
      GBP: 0.80,
      SGD: 1.35
    }
  },
  length: {
    label: "Length",
    units: ["Meters", "Kilometers", "Centimeters", "Miles", "Feet", "Inches"],
    rates: {
      Meters: 1,
      Kilometers: 0.001,
      Centimeters: 100,
      Miles: 0.000621371,
      Feet: 3.28084,
      Inches: 39.3701
    }
  },
  weight: {
    label: "Weight",
    units: ["Kilograms", "Grams", "Milligrams", "Pounds", "Ounces"],
    rates: {
      Kilograms: 1,
      Grams: 1000,
      Milligrams: 1000000,
      Pounds: 2.20462,
      Ounces: 35.274
    }
  },
  temperature: {
    label: "Temperature",
    units: ["Celsius", "Fahrenheit", "Kelvin"],
    isSpecial: true // Needs specific formula logic
  }
};
