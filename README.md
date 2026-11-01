# 🌡️ Psychrometrics

[![npm version](https://img.shields.io/npm/v/@adaskothebeast/psychrometrics.svg)](https://www.npmjs.com/package/@adaskothebeast/psychrometrics)
![NPM Downloads @adaskothebeast/psychrometrics](https://img.shields.io/npm/dt/%40adaskothebeast%2Fpsychrometrics?label=psychrometrics)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0+-blue.svg)](https://www.typescriptlang.org/)
[![CodeFactor](https://www.codefactor.io/repository/github/adaskothebeast/psychrometrics-typescript/badge)](https://www.codefactor.io/repository/github/adaskothebeast/psychrometrics-typescript)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/AdaskoTheBeAsT/Psychrometrics-TypeScript/ci.yml)](https://github.com/AdaskoTheBeAsT/Psychrometrics-TypeScript/actions/workflows/ci.yml)
![Sonar Tests](https://img.shields.io/sonar/tests/AdaskoTheBeAsT_Psychrometrics-TypeScript?server=https%3A%2F%2Fsonarcloud.io)
![Sonar Coverage](https://img.shields.io/sonar/coverage/AdaskoTheBeAsT_Psychrometrics-TypeScript?server=https%3A%2F%2Fsonarcloud.io)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=AdaskoTheBeAsT_Psychrometrics-TypeScript&metric=alert_status)](https://sonarcloud.io/dashboard?id=AdaskoTheBeAsT_Psychrometrics-TypeScript)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=AdaskoTheBeAsT_Psychrometrics-TypeScript&metric=bugs)](https://sonarcloud.io/summary/new_code?id=AdaskoTheBeAsT_Psychrometrics-TypeScript)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=AdaskoTheBeAsT_Psychrometrics-TypeScript&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=AdaskoTheBeAsT_Psychrometrics-TypeScript)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=AdaskoTheBeAsT_Psychrometrics-TypeScript&metric=coverage)](https://sonarcloud.io/summary/new_code?id=AdaskoTheBeAsT_Psychrometrics-TypeScript)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=AdaskoTheBeAsT_Psychrometrics-TypeScript&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=AdaskoTheBeAsT_Psychrometrics-TypeScript)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=AdaskoTheBeAsT_Psychrometrics-TypeScript&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=AdaskoTheBeAsT_Psychrometrics-TypeScript)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=AdaskoTheBeAsT_Psychrometrics-TypeScript&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=AdaskoTheBeAsT_Psychrometrics-TypeScript)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=AdaskoTheBeAsT_Psychrometrics-TypeScript&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=AdaskoTheBeAsT_Psychrometrics-TypeScript)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=AdaskoTheBeAsT_Psychrometrics-TypeScript&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=AdaskoTheBeAsT_Psychrometrics-TypeScript)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=AdaskoTheBeAsT_Psychrometrics-TypeScript&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=AdaskoTheBeAsT_Psychrometrics-TypeScript)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=AdaskoTheBeAsT_Psychrometrics-TypeScript&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=AdaskoTheBeAsT_Psychrometrics-TypeScript)

> **A comprehensive, type-safe TypeScript library for psychrometric calculations** — calculate moist air properties, humidity conversions, dew points, wet-bulb temperatures, and enthalpy across both European (Eurovent / VDI / Recknagel) and North American (ASHRAE) HVAC standards.

Perfect for **HVAC systems**, **air handling unit (AHU) design**, **weather applications**, **building automation**, **industrial processes**, and **scientific research**.

---

## ✨ Features

- 🎯 **Type-safe** — Full TypeScript 6+ support with detailed JSDoc documentation and literature references
- 🌍 **Multi-standard** — Switch between **Eurovent** and **ASHRAE** physical constants, saturation vapor pressure correlations, enthalpy formulas, and wet-bulb models
- 🔬 **Scientifically accurate** — Supports Magnus-Tetens, Huang (2018), ASHRAE Hyland-Wexler (1983), and IAPWS-95 Wagner-Pruß (2002) / Murphy-Koop (2005) formulations
- 🌲 **Tree-shakeable** — Import from the root package or granular subpath entrypoints
- ✅ **Well-tested** — 117 unit tests across 21 test suites, including NIST / IAPWS-95 reference validation
- 🛡️ **Robust validation** — Comprehensive input validation with descriptive error messages and custom error types
- 🚀 **Fast** — Direct analytical formulas paired with monotone cubic Hermite spline inversion (`@adaskothebeast/splines`)

---

## 📦 Installation

```bash
# npm
npm install @adaskothebeast/psychrometrics

# yarn
yarn add @adaskothebeast/psychrometrics

# pnpm
pnpm add @adaskothebeast/psychrometrics
```

---

## 🚀 Quick Start

```typescript
import {
  Initializer,
  airDensityByRelativeHumidity,
  relativeToSpecificHumidity,
  dewPointTemperature,
  wetBulbTemperature,
  enthalpy,
} from '@adaskothebeast/psychrometrics';

// Initialize once at app startup (required for inverse vapor-pressure/dew-point/wet-bulb calculations)
Initializer.initialize();

// Standard atmospheric pressure at sea level [Pa]
const pressure = 101325;

// Calculate air density at 20°C and 60% relative humidity
const density = airDensityByRelativeHumidity(pressure, 20, 60);
console.log(`Air density: ${density.toFixed(4)} kg/m³`);
// → Air density: 1.1978 kg/m³

// Convert relative humidity to specific humidity
const specificHumidity = relativeToSpecificHumidity(pressure, 20, 60);
console.log(`Specific humidity: ${specificHumidity.toFixed(2)} g/kg`);
// → Specific humidity: 8.74 g/kg

// Calculate dew point temperature
const dewPoint = dewPointTemperature(pressure, specificHumidity);
console.log(`Dew point: ${dewPoint.toFixed(1)}°C`);
// → Dew point: 12.0°C

// Calculate wet bulb temperature
const wetBulb = wetBulbTemperature(pressure, 20, specificHumidity);
console.log(`Wet bulb: ${wetBulb.toFixed(1)}°C`);
// → Wet bulb: 15.1°C

// Calculate air enthalpy
const h = enthalpy(20, specificHumidity);
console.log(`Enthalpy: ${h.toFixed(2)} kJ/kg`);
// → Enthalpy: 42.39 kJ/kg
```

---

## 🆕 What's New in v8.0.0

- **Regional HVAC Standards (`PsychrometricStandard`)**:
  - Choose between `PsychrometricStandard.Eurovent` (default European convention: WMO / CIPM-1991 / ISO 2533 dry-air constants, $\rho_{\text{std}} = 1.20\text{ kg/m}^3$) and `PsychrometricStandard.Ashrae` (North American ASHRAE Fundamentals / RP-1485 / CIPM-2007 constants, $\rho_{\text{std}} = 1.204\text{ kg/m}^3$).
- **Selectable Saturation Vapor Pressure Correlations (`SaturationVaporPressureFormula`)**:
  - `MagnusTetens` (DIN EN ISO 13788 / Tetens 1930 / Murray 1967, default)
  - `Huang2018` (Huang 2018 rational exponential formula)
  - `AshraeHylandWexler` (ASHRAE Fundamentals / Hyland & Wexler 1983 ITS-90 equations)
  - `Iapws95MurphyKoop` (IAPWS-95 Wagner & Pruß 2002 for liquid water + Murphy & Koop 2005 for ice)
- **Selectable Moist Air Enthalpy Correlations (`MoistAirEnthalpyFormula`)**:
  - `Recknagel` (VDI 4670 / Recknagel / Eurovent: $c_{p,\text{da}} = 1.005$, $c_{p,\text{w}} = 1.86$, default)
  - `Ashrae` (ASHRAE Fundamentals: $c_{p,\text{da}} = 1.006$, $c_{p,\text{w}} = 1.86$)
  - `Gluck` (Bernd Glück 1991 piecewise-linear switching at $13\,^\circ\text{C}$, $c_{p,\text{w}} = 1.84$)
  - `GluckLegacy` (legacy Glück adaptation switching at $0\,^\circ\text{C}$, $c_{p,\text{w}} = 1.84$)
  - `MollierLegacy` (classic European Mollier $i\text{-}x$ chart: $c_{p,\text{da}} = 1.005$, $c_{p,\text{w}} = 1.84$)
- **Selectable Wet-Bulb & Adiabatic Saturation Formulations (`WetBulbFormula`)**:
  - `DefaultForStandard` (automatically uses `Isenthalpic` for `Eurovent` and `Thermodynamic` for `Ashrae`)
  - `Isenthalpic` (European Mollier $h\text{-}x$ constant-enthalpy saturation line)
  - `Thermodynamic` (ASHRAE thermodynamic wet-bulb / frost-bulb energy balance accounting for condensed water or ice enthalpy)
- **New Functions**:
  - `adiabaticSaturationSpecificHumidity` (plus `*Isenthalpic` and `*Thermodynamic` variants)
  - `condensedWaterOrIceEnthalpy`
  - `temperatureToSaturationVaporPressureOfWater` and `temperatureToSaturationVaporPressureOfIce`
  - Explicit formula-specific functions for saturation vapor pressure, enthalpy, inverse enthalpy, and wet-bulb calculations
- **Modernized Toolchain**:
  - Upgraded to `@adaskothebeast/splines` v6, Nx 24, TypeScript 6, and Node 26 with full subpath exports.

---

## 📚 API Reference

### Initialization & Standards Configuration

Inverse saturation vapor pressure functions (`saturationVaporPressureToTemperature`, `dewPointTemperature`, `wetBulbTemperature`, `adiabaticSaturationSpecificHumidity`, `specificAndRelativeHumidityToTemperature`) use a monotone cubic Hermite spline built by `Initializer.initialize()`.

```typescript
import {
  Initializer,
  MoistAirEnthalpyFormula,
  PsychrometricStandard,
  SaturationVaporPressureFormula,
  WetBulbFormula,
} from '@adaskothebeast/psychrometrics';

// Option 1: European HVAC defaults (Eurovent, Recknagel, Magnus-Tetens, Isenthalpic, accuracy = 2)
Initializer.initialize();

// Option 2: North American ASHRAE standard configuration
Initializer.initialize(
  2,
  PsychrometricStandard.Ashrae,
  MoistAirEnthalpyFormula.Ashrae,
  SaturationVaporPressureFormula.AshraeHylandWexler,
  WetBulbFormula.DefaultForStandard, // resolves to WetBulbFormula.Thermodynamic
);

// Option 3: High-precision scientific configuration (IAPWS-95 + Murphy-Koop, accuracy = 3)
Initializer.initialize(
  3,
  PsychrometricStandard.Ashrae,
  MoistAirEnthalpyFormula.Ashrae,
  SaturationVaporPressureFormula.Iapws95MurphyKoop,
  WetBulbFormula.Thermodynamic,
);

// Option 4: Lazy initialization (initializes only if not already initialized)
Initializer.ensureInitialized();

// Inspect active configuration
console.log(Initializer.isInitialized); // true
console.log(Initializer.currentAccuracy); // 3
console.log(Initializer.currentStandard); // PsychrometricStandard.Ashrae
console.log(Initializer.currentEnthalpyFormula); // MoistAirEnthalpyFormula.Ashrae
console.log(Initializer.currentSaturationVaporPressureFormula); // SaturationVaporPressureFormula.Iapws95MurphyKoop
console.log(Initializer.currentWetBulbFormula); // WetBulbFormula.Thermodynamic
```

#### Memory vs Precision Trade-off

| Decimal Accuracy | Values Cached | Memory | Use Case |
|:----------------:|:-------------:|:------:|:---------|
| 0 | 201 | ~3 KB | Rough estimates |
| 1 | 2,001 | ~32 KB | General use |
| **2** (default) | 20,001 | ~320 KB | **Recommended** |
| 3 | 200,001 | ~3.2 MB | High precision |
| 4 | 2,000,001 | ~32 MB | Scientific research |

#### Numerical Stability (Round-tripping)

`temperatureToSaturationVaporPressure(...)` is a direct analytical formula.
The reverse `saturationVaporPressureToTemperature(...)` uses a **monotone cubic Hermite spline** built by `Initializer.initialize(...)`.

If you repeatedly round-trip $T \to P_{\text{sat}}(T) \to T$ many times, the result is stable (it will not diverge), with minimal drift near $0\,^\circ\text{C}$ where the forward correlation transitions between **ice** ($\le 0\,^\circ\text{C}$) and **water** ($> 0\,^\circ\text{C}$):

- `Initializer.initialize(2)` (default):
  - single round-trip error: **$\le \sim 6 \times 10^{-5}\ ^\circ\text{C}$**
  - after 100 repeated round-trips: **$\le \sim 6 \times 10^{-3}\ ^\circ\text{C}$** (worst cases near $0\,^\circ\text{C}$)
- `Initializer.initialize(3)`:
  - after 100 repeated round-trips: **$\le \sim 7 \times 10^{-4}\ ^\circ\text{C}$** (worst cases near $0\,^\circ\text{C}$)

If you run iterative algorithms that repeatedly convert back and forth, prefer `Initializer.initialize(3)` (or higher).

---

### Core Functions

#### 🌡️ Temperature & Pressure

| Function | Description | Units |
|----------|-------------|-------|
| `temperatureToSaturationVaporPressure(temp)` | Saturation vapor pressure over water ($>0\,^\circ\text{C}$) or ice ($\le 0\,^\circ\text{C}$) | °C → Pa |
| `temperatureToSaturationVaporPressureOfWater(temp)` | Saturation vapor pressure over liquid water ($>0\,^\circ\text{C}$) | °C → Pa |
| `temperatureToSaturationVaporPressureOfIce(temp)` | Saturation vapor pressure over ice ($\le 0\,^\circ\text{C}$) | °C → Pa |
| `saturationVaporPressureToTemperature(pressure)` | Saturation temperature from vapor pressure (requires `Initializer`) | Pa → °C |
| `altitudeToAirPressure(altitude)` | Barometric air pressure at altitude | m → Pa |
| `airPressureToAltitude(pressure)` | Altitude from barometric air pressure | Pa → m |

Explicit formula variants are also exported (`*MagnusTetens`, `*Huang2018`, `*AshraeHylandWexler`, `*Iapws95`, `*MurphyKoop`, `*Iapws95MurphyKoop`).

#### 💧 Humidity Conversions

| Function | Description | Units |
|----------|-------------|-------|
| `relativeToSpecificHumidity(P, T, RH)` | Convert relative humidity to specific humidity | Pa, °C, % → g/kg |
| `specificToRelativeHumidity(P, T, SH)` | Convert specific humidity to relative humidity | Pa, °C, g/kg → % |
| `temperatureToMaximumSpecificHumidity(P, T)` | Maximum specific humidity at saturation | Pa, °C → g/kg |

#### 🌡️ Dew Point, Wet Bulb & Adiabatic Saturation

| Function | Description | Units |
|----------|-------------|-------|
| `dewPointTemperature(P, SH)` | Dew point / frost point temperature from specific humidity | Pa, g/kg → °C |
| `wetBulbTemperature(P, T, SH, epsilon?, maxIterations?)` | Wet-bulb temperature using active `WetBulbFormula` | Pa, °C, g/kg → °C |
| `wetBulbTemperatureToSpecificHumidity(P, T, WB)` | Specific humidity from dry-bulb and wet-bulb temperatures | Pa, °C, °C → g/kg |
| `adiabaticSaturationSpecificHumidity(P, T, SH)` | Saturation specific humidity at wet-bulb temperature | Pa, °C, g/kg → g/kg |
| `specificAndRelativeHumidityToTemperature(P, SH, RH)` | Dry-bulb temperature from specific and relative humidity | Pa, g/kg, % → °C |

Explicit wet-bulb model variants are also exported (`*Isenthalpic`, `*Thermodynamic`).

#### 🌬️ Air Density & Enthalpy

| Function | Description | Units |
|----------|-------------|-------|
| `airDensityByRelativeHumidity(P, T, RH)` | Moist air density from relative humidity | Pa, °C, % → kg/m³ |
| `airDensityBySpecificHumidity(P, T, SH)` | Moist air density from specific humidity | Pa, °C, g/kg → kg/m³ |
| `enthalpy(T, SH)` | Moist air specific enthalpy using active `MoistAirEnthalpyFormula` | °C, g/kg → kJ/kg |
| `enthalpyToTemperature(H, SH)` | Dry-bulb temperature from enthalpy and specific humidity | kJ/kg, g/kg → °C |
| `enthalpyToSpecificHumidity(H, T)` | Specific humidity from enthalpy and dry-bulb temperature | kJ/kg, °C → g/kg |
| `condensedWaterOrIceEnthalpy(T)` | Specific enthalpy of condensed water ($\ge 0\,^\circ\text{C}$) or ice ($< 0\,^\circ\text{C}$) | °C → kJ/kg |

Explicit enthalpy formula variants are also exported (`*Recknagel`, `*Ashrae`, `*Gluck`, `*GluckLegacy`, `*MollierLegacy`).

---

### Physical Constants

```typescript
import {
  AVERAGE_PRESSURE_AT_SEA_LEVEL,                  // 101325 Pa
  GRAVITATIONAL_ACCELERATION,                      // 9.80665 m/s²
  UNIVERSAL_GAS_CONSTANT,                          // 8.31446261815324 J/(mol·K)
  MOLAR_MASS_OF_WATER_VAPOR,                       // 0.01801528 kg/mol
  EVAPORATION_HEAT,                                // 2501 kJ/kg
  KELVIN_CONST,                                    // 273.15 K
  EUROVENT_MOLAR_MASS_OF_DRY_AIR,                  // 0.0289647 kg/mol
  ASHRAE_MOLAR_MASS_OF_DRY_AIR,                    // 0.02896546 kg/mol
  EUROVENT_STANDARD_AIR_DENSITY,                   // 1.2 kg/m³
  ASHRAE_STANDARD_AIR_DENSITY,                     // 1.204 kg/m³
  SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_EUROVENT,      // 1.005 kJ/(kg·K)
  SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_ASHRAE,        // 1.006 kJ/(kg·K)
  SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR_STANDARD,  // 1.86 kJ/(kg·K)
  SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR_LEGACY,    // 1.84 kJ/(kg·K)
  SPECIFIC_HEAT_CAPACITY_OF_LIQUID_WATER,          // 4.186 kJ/(kg·K)
  SPECIFIC_HEAT_CAPACITY_OF_ICE,                   // 2.1 kJ/(kg·K)
  LATENT_HEAT_OF_FUSION_OF_WATER,                  // 333.4 kJ/kg
} from '@adaskothebeast/psychrometrics';
```

---

## 🛡️ Error Handling

The library provides detailed, actionable error messages:

```typescript
import {
  airDensityByRelativeHumidity,
  temperatureToSaturationVaporPressure,
} from '@adaskothebeast/psychrometrics';

try {
  // Invalid relative humidity
  airDensityByRelativeHumidity(101325, 20, 150);
} catch (error) {
  console.error(error.message);
  // → "relativeHumidity must be between 0 and 100%. Received: 150%."
}

try {
  // Temperature out of range
  temperatureToSaturationVaporPressure(150);
} catch (error) {
  console.error(error.message);
  // → "Temperature (150°C) is outside valid range. Must be between -100°C and 100°C."
}
```

### Custom Error Types

```typescript
import {
  InitializationRequiredError, // Thrown when Initializer.initialize() has not been called
  WetBulbConvergenceError,     // Thrown when numerical wet-bulb root-finding fails to converge
} from '@adaskothebeast/psychrometrics';
```

---

## 🔬 Scientific Background

### Correlations & References

- **Saturation Vapor Pressure**:
  - **Magnus-Tetens**: DIN EN ISO 13788:2012; Tetens (1930); Murray (1967)
  - **Huang (2018)**: [Journal of Applied Meteorology and Climatology, 57(6), 1265–1272](https://journals.ametsoc.org/view/journals/apme/57/6/jamc-d-17-0334.1.xml)
  - **ASHRAE Hyland-Wexler (1983)**: ASHRAE Handbook — Fundamentals, Chapter 1, Equations 5 & 6; Hyland & Wexler (1983)
  - **IAPWS-95 & Murphy-Koop**: Wagner & Pruß (2002), J. Phys. Chem. Ref. Data, 31(2), 387–535; Murphy & Koop (2005), Q. J. R. Meteorol. Soc., 131(608), 1539–1565
- **Barometric Formula**: ISO 2533:1975 Standard Atmosphere model for altitude-pressure conversions
- **Moist Air Enthalpy & Wet-Bulb**: Recknagel / VDI 4670 Blatt 1, ASHRAE Fundamentals Chapter 1, Glück (1991), and Mollier (1923)

### Valid Ranges

| Parameter | Range | Notes |
|-----------|-------|-------|
| Temperature | -100°C to 100°C | Uses ice formula ≤ 0°C, liquid water > 0°C |
| Altitude | -430.5m to 8848m | Dead Sea Depression to Mt. Everest |
| Relative Humidity | 0% to 100% | — |
| Specific Humidity | ≥ 0 g/kg | — |

---

## 📖 Detailed Documentation

Each calculation has detailed mathematical documentation in [`doc/`](doc):

- [Air Density by Relative Humidity](doc/air-density-by-relative-humidity.md)
- [Air Density by Specific Humidity](doc/air-density-by-specific-humidity.md)
- [Altitude to Air Pressure](doc/altitude-to-air-pressure.md)
- [Air Pressure to Altitude](doc/air-pressure-to-altitude.md)
- [Dew Point Temperature](doc/dew-point-temperature.md)
- [Enthalpy](doc/enthalpy.md)
- [Enthalpy to Temperature](doc/enthalpy-to-temperature.md)
- [Enthalpy to Specific Humidity](doc/enthalpy-to-specific-humidity.md)
- [Relative to Specific Humidity](doc/relative-to-specific-humidity.md)
- [Specific to Relative Humidity](doc/specific-to-relative-humidity.md)
- [Specific & Relative Humidity to Temperature](doc/specific-and-relative-humidity-to-temperature.md)
- [Temperature to Maximum Specific Humidity](doc/temperature-to-maximum-specific-humidity.md)
- [Temperature to Saturation Vapor Pressure](doc/temperature-to-saturation-vapor-pressure.md)
- [Saturation Vapor Pressure to Temperature](doc/saturation-vapor-pressure-to-temperature.md)
- [Wet Bulb Temperature](doc/wet-bulb-temperature.md)
- [Wet Bulb Temperature to Specific Humidity](doc/wet-bulb-temperature-to-specific-humidity.md)
- [Physical Constants](doc/constants.md)

---

## 🏗️ Use Cases

### HVAC Engineering

```typescript
// Calculate required dehumidification
const indoorTemp = 24; // °C
const indoorRH = 70;   // % (too humid!)
const targetRH = 50;   // %

const currentSH = relativeToSpecificHumidity(101325, indoorTemp, indoorRH);
const targetSH = relativeToSpecificHumidity(101325, indoorTemp, targetRH);
const moistureToRemove = currentSH - targetSH;

console.log(`Remove ${moistureToRemove.toFixed(2)} g/kg of moisture`);
```

### Weather Station

```typescript
// Calculate "feels like" metrics from sensor data
const temp = 32;         // °C
const humidity = 80;     // %
const pressure = 101325; // Pa

const sh = relativeToSpecificHumidity(pressure, temp, humidity);
const dewPt = dewPointTemperature(pressure, sh);
const wetBulb = wetBulbTemperature(pressure, temp, sh);

console.log(`Temperature: ${temp}°C`);
console.log(`Dew Point: ${dewPt.toFixed(1)}°C`);
console.log(`Wet Bulb: ${wetBulb.toFixed(1)}°C`);
```

### Altitude Compensation

```typescript
// Adjust readings for high-altitude locations
const altitude = 1600; // Denver, CO (meters)
const localPressure = altitudeToAirPressure(altitude);

console.log(`Local pressure: ${(localPressure / 1000).toFixed(1)} kPa`);
// → Local pressure: 83.5 kPa
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

```bash
# Clone the repo
git clone https://github.com/AdaskoTheBeAsT/Psychrometrics-TypeScript.git
cd Psychrometrics-TypeScript

# Install dependencies
yarn install

# Run tests
yarn test

# Run linting
yarn lint

# Build
yarn build
```

---

## 📄 License

[AGPL-3.0-or-later](LICENSE) © [Adam "AdaskoTheBeAsT" Pluciński](https://github.com/AdaskoTheBeAsT)
