// Shared vehicle data with pricing
export interface VehicleData {
  name: string;
  categoryKey: string;
  passengers: number;
  luggage?: number;
  dailyPrice: number; // USD per day (fictional for now)
  coverSlug: string;
  preparing?: boolean;
}

export const vehiclePrices: Record<string, number> = {
  "Corvette Stingray C8": 389,
  "Mustang Conversível": 189,
  "Cadillac Escalade": 299,
  "BMW X5 M Sport": 249,
  "Chevrolet Suburban": 219,
  "Dodge Durango": 159,
  "Kia Sorento": 119,
  "Kia Sportage": 99,
  "Mitsubishi Outlander": 109,
  "Volkswagen Tiguan": 115,
  "Chrysler Pacifica": 139,
  "Lexus NX": 199,
  "Audi Q7": 269,
  "Volvo XC60": 229,
  "MUSTANG CONVERSÍVEL": 189,
  "VOLKSWAGEN TIGUAN": 115,
  "Nissan Kicks": 89,
  "Volkswagen Atlas": 169,
  "Mercedes-Benz GLA": 209,
};
