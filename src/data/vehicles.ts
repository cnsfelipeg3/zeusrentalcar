// Shared vehicle data with pricing
export interface VehicleData {
  name: string;
  categoryLabel: string;
  trim: string;
  passengers: number;
  dailyPrice: number;
}

export const vehiclePrices: Record<string, number> = {
  "Nissan Kicks": 45.14,
  "Kia Sportage": 60.18,
  "Kia Sorento": 80.24,
  "Mitsubishi Outlander": 80.24,
  "Volkswagen Tiguan": 80.24,
  "VOLKSWAGEN TIGUAN": 80.24,
  "Dodge Durango": 100.30,
  "Chevrolet Suburban": 150.45,
  "Volkswagen Atlas": 150.45,
  "Lexus NX": 130.39,
  "Mercedes-Benz GLA": 130.39,
  "Volvo XC60": 160.48,
  "BMW X5 M Sport": 220.66,
  "Cadillac Escalade": 280.84,
  "Audi Q7": 280.84,
  "Chrysler Pacifica": 70.21,
  "Mustang Conversível": 320.96,
  "MUSTANG CONVERSÍVEL": 320.96,
  "Corvette Stingray C8": 651.95,
};

export const vehicleTrims: Record<string, string> = {
  "Nissan Kicks": "SV / SR",
  "Kia Sportage": "LX / EX",
  "Kia Sorento": "LX / EX",
  "Mitsubishi Outlander": "ES / SE",
  "Volkswagen Tiguan": "SE / SEL",
  "VOLKSWAGEN TIGUAN": "SE / SEL",
  "Dodge Durango": "GT / SXT",
  "Chevrolet Suburban": "LT / Premier",
  "Volkswagen Atlas": "SE / SEL",
  "Lexus NX": "F Sport / Base",
  "Mercedes-Benz GLA": "GLA 250 / 4MATIC",
  "Volvo XC60": "R-Design / Inscription",
  "BMW X5 M Sport": "xDrive40i M Sport",
  "Cadillac Escalade": "Premium Luxury",
  "Audi Q7": "Premium Plus / Prestige",
  "Chrysler Pacifica": "Touring / Limited",
  "Mustang Conversível": "EcoBoost / GT",
  "MUSTANG CONVERSÍVEL": "EcoBoost / GT",
  "Corvette Stingray C8": "6.2 V8",
};
