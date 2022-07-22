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
export const AVERAGE_PRESSURE_AT_SEA_LEVEL = 101325.0;

/**
 * Evaporation heat [kJ/kg]
 */
export const EVAPORATION_HEAT = 2501;

/**
 * Gravitational acceleration [m/s²]
 */
export const GRAVITATIONAL_ACCELERATION = 9.80665;

/**
 * Molar mass of dry air [kg/mol]
 * https://www.engineeringtoolbox.com/air-composition-d_212.html
 */
export const MOLAR_MASS_OF_DRY_AIR = 0.0289647;

/**
 * Molar mass of water vapor [kg/mol]
 */
export const MOLAR_MASS_OF_WATER_VAPOR = 0.01801528;

/**
 * Molar mass water to dry air ratio
 */
export const MOLAR_MASS_RATIO = MOLAR_MASS_OF_WATER_VAPOR / MOLAR_MASS_OF_DRY_AIR;

/**
 * Specific heat capacity of air below 0 [kJ/kg·°C]
 */
export const SPECIFIC_HEAT_CAPACITY_OF_AIR_BELOW_ZERO = 1.005;

/**
 * Specific heat capacity of air equal or above 0 [kJ/kg·°C]
 */
export const SPECIFIC_HEAT_CAPACITY_OF_AIR_EQ_ABOVE_ZERO = 1.007;

/**
 * Specific heat capacity of water [kJ/kg·°C]
 */
export const SPECIFIC_HEAT_CAPACITY_OF_WATER = 1.84;

/**
 * Standard temperature (15°C) in Kelvin [°K]
 */
export const STANDARD_TEMPERATURE = 288.15;

/**
 * Temperature lapse rate [°K/m]
 */
export const TEMPERATURE_LAPSE_RATE = -0.0065;

/**
 * Universal gas constant J/(mol·°K) or (N·m)/(mol·°K)
 * Redefined in 2019
 * as per https://sciencenotes.org/ideal-gas-constant-r-universal-gas-constant/
 */
export const UNIVERSAL_GAS_CONSTANT = 8.31446261815324;

/**
 * Gas constant for dry air [J/(kg·K)]
 */
export const GAS_CONSTANT_FOR_DRY_AIR = UNIVERSAL_GAS_CONSTANT / MOLAR_MASS_OF_DRY_AIR;

/**
 * Gas constant for dry air [J/(kg·K)]
 */
export const GAS_CONSTANT_FOR_WATER_VAPOR = UNIVERSAL_GAS_CONSTANT / MOLAR_MASS_OF_WATER_VAPOR;
