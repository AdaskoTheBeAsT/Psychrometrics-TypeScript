/**
 * Copyright (C) 2022 Adam Pluciński
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * Average atmospheric pressure at sea level [Pa]
 */
export const AveragePressureAtSeaLevel = 101325.0;

/**
 * Evaporation heat [kJ/kg]
 */
export const EvaporationHeat = 2501;

/**
 * Gravitational acceleration [m/s²]
 */
export const GravitationalAcceleration = 9.80665;

/**
 * Molar mass of dry air [kg/mol]
 */
export const MolarMassOfDryAir = 0.0289647;

/**
 * Molar mass of water vapor [kg/mol]
 */
export const MolarMassOfWaterVapor = 0.01801528;

/**
 * Molar mass water to dry air ratio
 */
export const MolarMassRatio = MolarMassOfWaterVapor / MolarMassOfDryAir;

/**
 * Specific heat capacity of air below 0 [kJ/kg°C]
 */
export const SpecificHeatCapacityOfAirBelowZero = 1.005;

/**
 * Specific heat capacity of air equal or above 0 [kJ/kg°C]
 */
export const SpecificHeatCapacityOfAirEqAboveZero = 1.007;

/**
 * Specific heat capacity of water [kJ/kg°C]
 */
export const SpecificHeatCapacityOfWater = 1.84;

/**
 * Standard temperature (15°C) in Kelvin [°K]
 */
export const StandardTemperature = 288.15;

/**
 * Temperature lapse rate [K/m]
 */
export const TemperatureLapseRate = -0.0065;

/**
 * Universal gas constant J/(mol·K) or (N·m)/(mol·K)
 */
export const UniversalGasConstant = 8.31446261815324;

/**
 * Gas constant for dry air [J/(kg·K)]
 */
export const GasConstantForDryAir = UniversalGasConstant / MolarMassOfDryAir;

/**
 * Gas constant for dry air [J/(kg·K)]
 */
export const GasConstantForWaterVapor = UniversalGasConstant / MolarMassOfWaterVapor;
