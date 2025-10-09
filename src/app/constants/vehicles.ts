// Vehicle types available for selection
export const VEHICLE_TYPES = [
  { id: 'van', label: 'Van' },
  { id: 'camaro', label: 'Camaro' },
  { id: 'land-rover', label: 'Land Rover' },
  { id: 'bike', label: 'Bike' },
  { id: 'f1', label: 'F1' },
  { id: 'mercedes-gtr', label: 'Mercedes GTR' },
] as const;

export type VehicleType = typeof VEHICLE_TYPES[number]['id'];
