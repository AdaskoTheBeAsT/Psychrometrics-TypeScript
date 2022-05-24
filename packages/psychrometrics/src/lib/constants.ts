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
 * Atmospheric pressure [Pa]
 */
export const P0 = 101325.0;

/**
 * Gravitational acceleration [m/s²]
 */
export const g = 9.80665;

/**
 * Molar mass of Earth's air [kg/mol]
 */
export const M = 0.0289644;

/**
 * Standard temperature (15°C) in Kelvin [K]
 */
export const T = 288.15;

/**
 * Universal gas constant J/(mol·K)
 */
export const R = 8.31446261815324;

/**
 * Temperature lapse rate [K/m]
 */
export const Lb = -0.0065;

/**
 * MolecularWaterWeight [g/mol]
 */
export const MolecularWaterWeight = 18.01528;

/**
 * MolecularDryAirWeight [g/mol]
 */
export const MolecularDryAirWeight = 28.9647;

/**
 * Molecular weight water to dry air ratio
 */
export const MolecularWeightRatio = MolecularWaterWeight / MolecularDryAirWeight;
