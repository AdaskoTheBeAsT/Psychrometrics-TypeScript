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
 * Gravitational acceleration [m/s²]
 */
export const GravitationalAcceleration = 9.80665;

/**
 * Standard temperature (15°C) in Kelvin [°K]
 */
export const StandardTemperature = 288.15;

/**
 * Universal gas constant J/(mol·K) or (N·m)/(mol·K)
 */
export const UniversalGasConstant = 8.31446261815324;

/**
 * Temperature lapse rate [K/m]
 */
export const TemperatureLapseRate = -0.0065;

/**
 * MolecularWaterWeight [kg/mol]
 */
export const MolecularWeightOfWater = 0.01801528;

/**
 * MolecularDryAirWeight [kg/mol]
 */
export const MolecularWeightOfDryAir = 0.0289647;

/**
 * Molecular weight water to dry air ratio
 */
export const MolecularWeightRatio = MolecularWeightOfWater / MolecularWeightOfDryAir;
