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
 * Standard atmospheric pressure at mean sea level [Pa].
 *
 * Reference: 10th Conférence Générale des Poids et Mesures (CGPM, 1954), Resolution 4;
 * ISO 2533:1975 (*Standard Atmosphere*); ASHRAE Handbook — Fundamentals, Chapter 1, Equation 3.
 */
export const AVERAGE_PRESSURE_AT_SEA_LEVEL = 101325;

/**
 * Latent heat of vaporization (specific enthalpy of evaporation) of water at 0 °C [kJ/kg].
 *
 * Reference: ASHRAE Handbook — Fundamentals, Chapter 1 (*Psychrometrics*), Equation 30;
 * VDI 4670 Blatt 1; Recknagel, Sprenger, and Albers, *Taschenbuch für Heizung + Klimatechnik*
 * (IAPWS-IF97 reference value at 0 °C is `2500.92 kJ/kg`).
 */
export const EVAPORATION_HEAT = 2501;

/**
 * Standard acceleration due to gravity at sea level and 45° latitude [m/s²].
 *
 * Reference: 3rd CGPM (1901); CODATA 2018 / 2022 Fundamental Physical Constants; ISO 2533:1975.
 */
export const GRAVITATIONAL_ACCELERATION = 9.80665;

/**
 * Molar mass of water vapor [kg/mol].
 *
 * Reference: IUPAC Standard Atomic Weights; ASHRAE Handbook — Fundamentals, Chapter 1
 * (IAPWS-95 reference value is `0.018015268 kg/mol`).
 */
export const MOLAR_MASS_OF_WATER_VAPOR = 0.01801528;

/**
 * Standard sea-level atmospheric temperature [K] (15 °C).
 *
 * Reference: ISO 2533:1975 (*Standard Atmosphere*); ICAO Doc 7488/3;
 * ASHRAE Handbook — Fundamentals, Chapter 1, Equation 3.
 */
export const STANDARD_TEMPERATURE = 288.15;

/**
 * Standard tropospheric temperature lapse rate [K/m] (-6.5 K/km from 0 km to 11 km).
 *
 * Reference: ISO 2533:1975 (*Standard Atmosphere*); ICAO Doc 7488/3;
 * ASHRAE Handbook — Fundamentals, Chapter 1, Equation 3.
 */
export const TEMPERATURE_LAPSE_RATE = -0.0065;

/**
 * Molar (universal) gas constant `R = N_A * k_B` [J/(mol·K)].
 *
 * Reference: CODATA 2018 / 2022 Internationally Recommended Values of the Fundamental Physical Constants
 * (exact value following the 2019 SI redefinition, `8.31446261815324 J/(mol·K)`).
 */
export const UNIVERSAL_GAS_CONSTANT = 8.31446261815324;

/**
 * Specific gas constant for water vapor `R_w = R / M_w` [J/(kg·K)].
 *
 * Reference: Derived from CODATA `UNIVERSAL_GAS_CONSTANT` and IUPAC `MOLAR_MASS_OF_WATER_VAPOR`;
 * ASHRAE Handbook — Fundamentals, Chapter 1 (`461.52 J/(kg·K)`).
 */
export const GAS_CONSTANT_FOR_WATER_VAPOR = UNIVERSAL_GAS_CONSTANT / MOLAR_MASS_OF_WATER_VAPOR;

/**
 * Ice-point temperature offset on the Kelvin scale (0 °C in K) [K].
 *
 * Reference: 10th CGPM (1954), Resolution 3; ITS-90 (Preston-Thomas, 1990, Metrologia 27, 3–10); SI Brochure (9th ed., 2019).
 */
export const KELVIN_CONST = 273.15;

/**
 * European (Eurovent / WMO / CIPM-1991) molar mass of dry air [kg/mol].
 *
 * Reference: WMO Technical Regulations (1988); Davis, R. S. (1992), *Equation for the Determination
 * of the Density of Moist Air (1981/91)*, Metrologia, 29(1), 67–70 (closely aligned with ISO 2533:1975 `0.0289644 kg/mol`).
 */
export const EUROVENT_MOLAR_MASS_OF_DRY_AIR = 0.0289647;

/**
 * North American (ASHRAE / CIPM-2007) molar mass of dry air at 400 ppm CO₂ [kg/mol].
 *
 * Reference: ASHRAE Handbook — Fundamentals, Chapter 1; Herrmann, S., Kretzschmar, H.-J., and Gatley, D. P. (2009),
 * *Thermodynamic Properties of Real Moist Air, Dry Air, Steam, Water, and Ice (RP-1485)*, HVAC&R Research, 15(5), 961–986;
 * Picard, A., Davis, R. S., Gläser, M., and Fujii, K. (2008), *Revised formula for the density of moist air (CIPM-2007)*,
 * Metrologia, 45(2), 149–155.
 */
export const ASHRAE_MOLAR_MASS_OF_DRY_AIR = 0.02896546;

/**
 * European (Eurovent / WMO) ratio of molar mass of water vapor to dry air `M_w / M_da` (~0.621974).
 *
 * Reference: Derived from `MOLAR_MASS_OF_WATER_VAPOR` and `EUROVENT_MOLAR_MASS_OF_DRY_AIR`
 * (ISO 2533:1975 / Recknagel / VDI 4670 nominal value `0.62198` or `0.622`).
 */
export const EUROVENT_MOLAR_MASS_RATIO = MOLAR_MASS_OF_WATER_VAPOR / EUROVENT_MOLAR_MASS_OF_DRY_AIR;

/**
 * North American (ASHRAE) ratio of molar mass of water vapor to dry air `M_w / M_da` (0.621945).
 *
 * Reference: ASHRAE Handbook — Fundamentals, Chapter 1 (*Psychrometrics*), Equation 20;
 * Herrmann, Kretzschmar, and Gatley (2009), ASHRAE RP-1485 (`0.018015268 / 0.02896546 = 0.621945`).
 */
export const ASHRAE_MOLAR_MASS_RATIO = 0.621945;

/**
 * European (Eurovent / WMO) specific gas constant for dry air `R_da = R / M_da` [J/(kg·K)] (~287.055).
 *
 * Reference: Derived from CODATA `UNIVERSAL_GAS_CONSTANT` and `EUROVENT_MOLAR_MASS_OF_DRY_AIR`;
 * ISO 2533:1975; Recknagel, Sprenger, and Albers, *Taschenbuch für Heizung + Klimatechnik*.
 */
export const EUROVENT_GAS_CONSTANT_FOR_DRY_AIR = UNIVERSAL_GAS_CONSTANT / EUROVENT_MOLAR_MASS_OF_DRY_AIR;

/**
 * North American (ASHRAE) specific gas constant for dry air `R_da` [J/(kg·K)] (287.042).
 *
 * Reference: ASHRAE Handbook — Fundamentals, Chapter 1 (*Psychrometrics*);
 * Herrmann, Kretzschmar, and Gatley (2009), ASHRAE RP-1485.
 */
export const ASHRAE_GAS_CONSTANT_FOR_DRY_AIR = 287.042;

/**
 * European (Eurovent / EN 13053 / DIN 1946) standard moist air density [kg/m³] (at 20 °C, 50% RH, 101 325 Pa).
 *
 * Reference: EN 13053 (*Ventilation for buildings — Air handling units*); Eurovent Certification;
 * Recknagel, Sprenger, and Albers, *Taschenbuch für Heizung + Klimatechnik*.
 */
export const EUROVENT_STANDARD_AIR_DENSITY = 1.2;

/**
 * North American (ASHRAE / AMCA 210) standard air density [kg/m³] (0.075 lbm/ft³ at 20 °C dry air, 101 325 Pa).
 *
 * Reference: ASHRAE Handbook — Fundamentals, Chapter 18 / Chapter 21;
 * ANSI/AMCA Standard 210 / ANSI/ASHRAE Standard 51 (*Laboratory Methods of Testing Fans for Certified Aerodynamic Performance Rating*).
 */
export const ASHRAE_STANDARD_AIR_DENSITY = 1.204;

/**
 * European (Recknagel / VDI / Glück) isobaric specific heat capacity of dry air [kJ/(kg·K)].
 *
 * Reference: Recknagel, Sprenger, and Albers, *Taschenbuch für Heizung + Klimatechnik*;
 * Glück, B. (1991), *Zustands- und Stoffwerte*; Lemmon et al. (2000), J. Phys. Chem. Ref. Data, 29(3), 331–385
 * (`c_p,da(0 °C) = 1.0054 kJ/(kg·K)`).
 */
export const SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_EUROVENT = 1.005;

/**
 * North American (ASHRAE) isobaric specific heat capacity of dry air [kJ/(kg·K)].
 *
 * Reference: ASHRAE Handbook — Fundamentals, Chapter 1 (*Psychrometrics*), Equation 30;
 * VDI 4670 Blatt 1.
 */
export const SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_ASHRAE = 1.006;

/**
 * Bernd Glück (1991) effective linear coefficient for dry-air specific enthalpy above 13 °C [kJ/(kg·K)].
 *
 * Reference: Glück, B. (1991), *Zustands- und Stoffwerte: Wasser, Dampf, Luft; Verbrennungsrechnung*,
 * 2nd ed., Verlag für Bauwesen, Berlin.
 */
export const SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_GLUCK_ABOVE_THRESHOLD = 1.007;

/**
 * Bernd Glück (1991) dry-air enthalpy linear offset [kJ/kg] (`(1.007 - 1.005) * 13 = 0.026 kJ/kg`).
 *
 * Reference: Glück, B. (1991), *Zustands- und Stoffwerte: Wasser, Dampf, Luft; Verbrennungsrechnung*,
 * 2nd ed., Verlag für Bauwesen, Berlin.
 */
export const GLUCK_DRY_AIR_ENTHALPY_OFFSET = 0.026;

/**
 * Bernd Glück (1991) dry-air enthalpy transition temperature [°C] where `1.005 * t` and `1.007 * t - 0.026` intersect.
 *
 * Reference: Glück, B. (1991), *Zustands- und Stoffwerte: Wasser, Dampf, Luft; Verbrennungsrechnung*,
 * 2nd ed., Verlag für Bauwesen, Berlin.
 */
export const GLUCK_DRY_AIR_TEMPERATURE_THRESHOLD = 13.0;

/**
 * Modern standard isobaric specific heat capacity of water vapor [kJ/(kg·K)].
 *
 * Reference: ASHRAE Handbook — Fundamentals, Chapter 1 (*Psychrometrics*), Equation 30;
 * VDI 4670 Blatt 1; Recknagel, Sprenger, and Albers, *Taschenbuch für Heizung + Klimatechnik*;
 * IAPWS-IF97 (`c_p,w ≈ 1.859–1.864 kJ/(kg·K)` at 0–25 °C).
 */
export const SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR_STANDARD = 1.86;

/**
 * Legacy European isobaric specific heat capacity of water vapor [kJ/(kg·K)].
 *
 * Reference: Mollier, R. (1923), *Ein neues Diagramm für Dampfluftgemische*, Z. VDI 67, 869–872;
 * Glück, B. (1991), *Zustands- und Stoffwerte: Wasser, Dampf, Luft; Verbrennungsrechnung*.
 */
export const SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR_LEGACY = 1.84;

/**
 * Isobaric specific heat capacity of liquid water `c_p,w` [kJ/(kg·K)] used in thermodynamic wet-bulb energy balance (`h_w(t*) = 4.186 * t*`).
 *
 * Reference: ASHRAE Handbook — Fundamentals, Chapter 1 (*Psychrometrics*), Equation 33;
 * IAPWS-IF97 (Wagner and Kretzschmar, 2008).
 */
export const SPECIFIC_HEAT_CAPACITY_OF_LIQUID_WATER = 4.186;

/**
 * Isobaric specific heat capacity of solid ice `c_p,i` [kJ/(kg·K)] used in thermodynamic frost-bulb energy balance (`h_i(t*) = -333.4 + 2.1 * t*`).
 *
 * Reference: ASHRAE Handbook — Fundamentals, Chapter 1 (*Psychrometrics*), Equation 34;
 * IAPWS-2006 Release on an Equation of State for H₂O Ice Ih (Feistel and Wagner, 2006).
 */
export const SPECIFIC_HEAT_CAPACITY_OF_ICE = 2.1;

/**
 * Specific latent heat (enthalpy) of fusion of water/ice at 0 °C [kJ/kg] used in thermodynamic frost-bulb energy balance (`h_i(t*) = -333.4 + 2.1 * t*`).
 *
 * Reference: ASHRAE Handbook — Fundamentals, Chapter 1 (*Psychrometrics*), Equation 34;
 * IAPWS-2006 / CODATA.
 */
export const LATENT_HEAT_OF_FUSION_OF_WATER = 333.4;

/**
 * Active molar mass of dry air [kg/mol] configured by `Initializer` (`EUROVENT_MOLAR_MASS_OF_DRY_AIR` by default).
 */
export let MOLAR_MASS_OF_DRY_AIR = EUROVENT_MOLAR_MASS_OF_DRY_AIR;

/**
 * Active molar mass water to dry air ratio (`M_w / M_da`) configured by `Initializer` (`EUROVENT_MOLAR_MASS_RATIO` by default).
 */
export let MOLAR_MASS_RATIO = EUROVENT_MOLAR_MASS_RATIO;

/**
 * Active gas constant for dry air [J/(kg·K)] configured by `Initializer` (`EUROVENT_GAS_CONSTANT_FOR_DRY_AIR` by default).
 */
export let GAS_CONSTANT_FOR_DRY_AIR = EUROVENT_GAS_CONSTANT_FOR_DRY_AIR;

/**
 * Active standard air density [kg/m³] configured by `Initializer` (`EUROVENT_STANDARD_AIR_DENSITY` by default).
 */
export let STANDARD_AIR_DENSITY = EUROVENT_STANDARD_AIR_DENSITY;

/**
 * Active specific heat capacity of dry air below the transition temperature [kJ/(kg·°C)] configured by `Initializer`.
 */
export let SPECIFIC_HEAT_CAPACITY_OF_AIR_BELOW_ZERO = SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_EUROVENT;

/**
 * Active specific heat capacity of dry air at or above the transition temperature [kJ/(kg·°C)] configured by `Initializer`.
 */
export let SPECIFIC_HEAT_CAPACITY_OF_AIR_EQ_ABOVE_ZERO = SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_EUROVENT;

/**
 * Active isobaric specific heat capacity of water vapor [kJ/(kg·°C)] configured by `Initializer`.
 */
export let SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR = SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR_STANDARD;

/**
 * Updates active dry-air standard constants.
 * @internal
 */
export function setActiveStandardConstants(
  molarMassOfDryAir: number,
  molarMassRatio: number,
  gasConstantForDryAir: number,
  standardAirDensity: number,
): void {
  MOLAR_MASS_OF_DRY_AIR = molarMassOfDryAir;
  MOLAR_MASS_RATIO = molarMassRatio;
  GAS_CONSTANT_FOR_DRY_AIR = gasConstantForDryAir;
  STANDARD_AIR_DENSITY = standardAirDensity;
}

/**
 * Updates active enthalpy specific heat constants.
 * @internal
 */
export function setActiveEnthalpyConstants(
  cpAirBelowZero: number,
  cpAirEqAboveZero: number,
  cpWaterVapor: number,
): void {
  SPECIFIC_HEAT_CAPACITY_OF_AIR_BELOW_ZERO = cpAirBelowZero;
  SPECIFIC_HEAT_CAPACITY_OF_AIR_EQ_ABOVE_ZERO = cpAirEqAboveZero;
  SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR = cpWaterVapor;
}
