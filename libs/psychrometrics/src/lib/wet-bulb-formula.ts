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
 * Specifies the psychrometric wet-bulb / adiabatic saturation calculation convention configured via `Initializer`.
 */
export enum WetBulbFormula {
  /**
   * Automatically selects the wet-bulb formulation matching the configured `PsychrometricStandard`:
   * `Isenthalpic` for `PsychrometricStandard.Eurovent` and `Thermodynamic` for `PsychrometricStandard.Ashrae`.
   */
  DefaultForStandard = 0,

  /**
   * European Mollier `h-x` isenthalpic saturation approximation:
   * `h(t, x) = h(t_wb, x_s(t_wb))`.
   *
   * Neglects the condensed-phase enthalpy carried by the evaporated liquid water or sublimated ice so lines of constant
   * wet-bulb temperature coincide with lines of constant moist air enthalpy.
   *
   * Reference: Mollier, R. (1923), *Ein neues Diagramm für Dampfluftgemische*, Z. VDI 67, 869–872;
   * Recknagel, Sprenger, and Albers, *Taschenbuch für Heizung + Klimatechnik*; Eurovent Certification.
   */
  Isenthalpic = 1,

  /**
   * Thermodynamic adiabatic saturation (wet-bulb / frost-bulb) energy balance including the condensed-phase enthalpy
   * of evaporated liquid water (`h_w(t*) = 4.186 * t*` for `t* >= 0 °C`) or sublimated ice
   * (`h_i(t*) = -333.4 + 2.1 * t*` for `t* < 0 °C`):
   * `h(t, x) + ((x_s(t*) - x) / 1000) * h_w/i(t*) = h(t*, x_s(t*))`.
   *
   * Reference: ASHRAE Handbook — Fundamentals, Chapter 1 (*Psychrometrics*), Equations 32, 33, and 34;
   * VDI 4670 Blatt 1.
   */
  Thermodynamic = 2,
}
