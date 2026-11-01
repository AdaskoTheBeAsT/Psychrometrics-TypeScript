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
 * Specifies the empirical or thermodynamic correlation used to calculate saturation vapor pressure
 * over liquid water (`t > 0 °C`) and ice (`t <= 0 °C`).
 */
export enum SaturationVaporPressureFormula {
  /**
   * Magnus-Tetens exponential formulation (European / Eurovent / DIN EN ISO 13788 standard):
   * - Water (`t > 0 °C`): `P_ws(t) = 610.5 * exp(17.269 * t / (237.3 + t))`
   * - Ice (`t <= 0 °C`): `P_wi(t) = 610.5 * exp(21.875 * t / (265.5 + t))`
   *
   * Reference: DIN EN ISO 13788:2012 (*Hygrothermal performance of building components and building elements*, Section 4.2.2);
   * Tetens, O. (1930), *Über einige meteorologische Begriffe*, Z. Geophys., 6, 297–309;
   * Murray, F. W. (1967), *On the Computation of Saturation Vapor Pressure*, J. Appl. Meteorol., 6, 203–204.
   */
  MagnusTetens = 0,

  /**
   * Huang (2018) high-accuracy rational exponential formulation:
   * - Water (`t > 0 °C`): `P_ws(t) = exp(34.494 - 4924.99 / (t + 237.1)) / (t + 105.0)^1.57`
   * - Ice (`t <= 0 °C`): `P_wi(t) = exp(43.494 - 6545.8 / (t + 278.0)) / (t + 868.0)^2`
   *
   * Reference: Huang, J. (2018), *A Simple Accurate Formula for Calculating Saturation Vapor Pressure of Water and Ice*,
   * Journal of Applied Meteorology and Climatology, 57(6), 1265–1272, Equations 17 and 18.
   */
  Huang2018 = 1,

  /**
   * ASHRAE Hyland and Wexler (1983) formulation on the ITS-90 temperature scale:
   * - Ice (`t <= 0 °C`): `ln(P_wi) = C1/T + C2 + C3*T + C4*T^2 + C5*T^3 + C6*T^4 + C7*ln(T)`
   * - Water (`t > 0 °C`): `ln(P_ws) = C8/T + C9 + C10*T + C11*T^2 + C12*T^3 + C13*ln(T)`
   *
   * Reference: ASHRAE Handbook — Fundamentals, Chapter 1 (*Psychrometrics*), Equations 5 and 6;
   * Hyland, R. W., and Wexler, A. (1983), *Formulations for the Thermodynamic Properties of the Saturated Phases
   * of H2O from 173.15 K to 473.15 K*, ASHRAE Transactions, 89(2A), 500–519.
   */
  AshraeHylandWexler = 2,

  /**
   * IAPWS-95 Wagner and Pruß (2002) formulation for liquid water combined with Murphy and Koop (2005) for ice:
   * - Water (`t > 0 °C`): six-term Wagner-Pruß fractional-exponent equation anchored at the critical point (`T_c = 647.096 K`, `P_c = 22.064 MPa`)
   * - Ice (`t <= 0 °C`): `ln(P_wi) = 9.550426 - 5723.265/T + 3.53068*ln(T) - 0.00728332*T`
   *
   * Reference: Wagner, W., and Pruß, A. (2002), *The IAPWS Formulation 1995 for the Thermodynamic Properties
   * of Ordinary Water Substance for General and Scientific Use*, J. Phys. Chem. Ref. Data, 31(2), 387–535, Equation 2.5;
   * Murphy, D. M., and Koop, T. (2005), *Review of the vapour pressures of ice and supercooled water for atmospheric applications*,
   * Q. J. R. Meteorol. Soc., 131(608), 1539–1565, Equation 7.
   */
  Iapws95MurphyKoop = 3,
}
