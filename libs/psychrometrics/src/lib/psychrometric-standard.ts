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
 * Specifies the regional HVAC psychrometric constant convention.
 */
export enum PsychrometricStandard {
  /**
   * European HVAC industry standard convention.
   *
   * Dry-air molar mass (`0.0289647 kg/mol`), gas constant (`~287.055 J/(kg·K)`),
   * and molar mass ratio (`~0.621974`) from WMO Technical Regulations (1988) / CIPM-1981/91 (Davis, 1992, Metrologia 29, 67–70)
   * and ISO 2533:1975 Standard Atmosphere.
   * Standard moist air density (`1.20 kg/m³`) at 20 °C, 50% RH, 101 325 Pa per EN 13053 / Eurovent / DIN 1946.
   */
  Eurovent = 0,

  /**
   * United States HVAC industry standard convention.
   *
   * Dry-air molar mass (`0.02896546 kg/mol`), gas constant (`287.042 J/(kg·K)`),
   * and molar mass ratio (`0.621945`) from ASHRAE Handbook — Fundamentals (Chapter 1, Psychrometrics),
   * ASHRAE RP-1485 (Herrmann, Kretzschmar, and Gatley, 2009), and CIPM-2007 (Picard et al., 2008, Metrologia 45, 149–155).
   * Standard air density (`1.204 kg/m³`, equivalent to `0.075 lbm/ft³`) per ASHRAE Fundamentals and ANSI/AMCA Standard 210.
   */
  Ashrae = 1,
}
