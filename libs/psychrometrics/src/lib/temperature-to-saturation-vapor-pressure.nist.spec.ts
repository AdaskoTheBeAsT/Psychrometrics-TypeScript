/*
 * Reference: NIST Chemistry WebBook (SRD 69), Water (CAS 7732-18-5)
 * Antoine Equation Parameters (vapor pressure), Bridgeman and Aldrich, 1964.
 * https://webbook.nist.gov/cgi/cbook.cgi?ID=C7732185&Mask=4&Type=ANTOINE
 */

import { Initializer } from './initializer';
import { MoistAirEnthalpyFormula } from './moist-air-enthalpy-formula';
import { PsychrometricStandard } from './psychrometric-standard';
import { SaturationVaporPressureFormula } from './saturation-vapor-pressure-formula';
import { temperatureToSaturationVaporPressureOfWater } from './temperature-to-saturation-vapor-pressure';

type AntoineCoefficients = {
  /** log10(P[bar]) = A - (B / (T[K] + C)) */
  A: number;
  B: number;
  C: number;
};

function nistAntoinePressurePa(temperatureC: number): number {
  const temperatureK = temperatureC + 273.15;

  // Coefficients calculated by NIST from Bridgeman & Aldrich (1964) data.
  // Ranges are in Kelvin, per NIST.
  let coeffs: AntoineCoefficients;
  if (temperatureK >= 344 && temperatureK <= 373) {
    coeffs = { A: 5.08354, B: 1663.125, C: -45.622 };
  } else if (temperatureK >= 334 && temperatureK <= 363) {
    coeffs = { A: 5.0768, B: 1659.793, C: -45.854 };
  } else if (temperatureK >= 304 && temperatureK <= 333) {
    coeffs = { A: 5.20389, B: 1733.926, C: -39.485 };
  } else if (temperatureK >= 273 && temperatureK <= 303) {
    coeffs = { A: 5.40221, B: 1838.675, C: -31.737 };
  } else {
    throw new RangeError(`NIST Antoine reference not configured for ${temperatureC}°C (${temperatureK} K).`);
  }

  const pressureBar = Math.pow(10, coeffs.A - coeffs.B / (temperatureK + coeffs.C));
  return pressureBar * 1e5;
}

describe('temperatureToSaturationVaporPressureOfWater (vs NIST Antoine vapor pressure)', () => {
  afterAll(() => {
    Initializer.initialize();
  });

  const formulaCases: [SaturationVaporPressureFormula, number][] = [
    [SaturationVaporPressureFormula.MagnusTetens, 0.03],
    [SaturationVaporPressureFormula.Huang2018, 0.002],
    [SaturationVaporPressureFormula.AshraeHylandWexler, 0.002],
    [SaturationVaporPressureFormula.Iapws95MurphyKoop, 0.002],
  ];

  it.each(formulaCases)(
    'formula %p should match NIST Antoine reference within %p for selected temperatures (5°C..99°C)',
    (formula, maxRelativeError) => {
      expect.hasAssertions();

      Initializer.initialize(2, PsychrometricStandard.Eurovent, MoistAirEnthalpyFormula.Recknagel, formula);
      const temperaturesC = [5, 10, 20, 25, 40, 50, 70, 80, 90, 95, 99];

      for (const temperatureC of temperaturesC) {
        const expectedPa = nistAntoinePressurePa(temperatureC);
        const actualPa = temperatureToSaturationVaporPressureOfWater(temperatureC);

        const relativeError = Math.abs(actualPa - expectedPa) / expectedPa;
        expect(relativeError).toBeLessThanOrEqual(maxRelativeError);
      }
    },
  );
});
