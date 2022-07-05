import { MolecularWeightRatio } from './constants';
import { saturationVaporPressureToTemperature } from './saturation-vapor-pressure-to-temperature';

export function dewPoint(airPressure: number, specificHumidity: number): number {
  const specificHumidityNormalized = specificHumidity / 1000.0;
  const saturatedPress =
    (specificHumidityNormalized * airPressure) / (specificHumidityNormalized + MolecularWeightRatio);
  return saturationVaporPressureToTemperature(saturatedPress);
}
