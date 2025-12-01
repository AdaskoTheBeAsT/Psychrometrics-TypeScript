<p align="center">
  <img src="https://img.shields.io/npm/v/@adaskothebeast/psychrometrics?style=flat-square&color=blue" alt="npm version">
  <img src="https://img.shields.io/npm/dm/@adaskothebeast/psychrometrics?style=flat-square&color=green" alt="npm downloads">
  <img src="https://img.shields.io/github/license/AdaskoTheBeAsT/Psychrometrics-TypeScript?style=flat-square" alt="license">
  <img src="https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/tree--shakeable-yes-brightgreen?style=flat-square" alt="tree-shakeable">
</p>

# 🌡️ Psychrometrics

> **A comprehensive, type-safe TypeScript library for psychrometric calculations** — calculate air properties, humidity conversions, dew points, and more with scientific precision.

Perfect for **HVAC systems**, **weather applications**, **building automation**, **industrial processes**, and **scientific research**.

---

## ✨ Features

- 🎯 **Type-safe** — Full TypeScript support with detailed JSDoc documentation
- 🔬 **Scientifically accurate** — Based on peer-reviewed formulas and physical constants
- 🌲 **Tree-shakeable** — Import only what you need, no bloat
- ✅ **Well-tested** — 96+ unit tests with edge case coverage
- 🛡️ **Robust validation** — Comprehensive input validation with helpful error messages
- 📦 **Zero config** — Works out of the box with sensible defaults
- 🚀 **Fast** — Optimized calculations with optional interpolation caching

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

// Initialize once at app startup (required for some reverse calculations)
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
// → Enthalpy: 42.29 kJ/kg
```

---

## 📚 API Reference

### Initialization

Some functions (like `saturationVaporPressureToTemperature`, `dewPointTemperature`) require initialization. Call this once at application startup:

```typescript
import { Initializer } from '@adaskothebeast/psychrometrics';

// Option 1: Explicit initialization (recommended)
Initializer.initialize();

// Option 2: With custom precision (0-4 decimal places)
Initializer.initialize(3); // Higher precision, more memory

// Option 3: Lazy initialization (auto-initializes on first use)
Initializer.ensureInitialized();

// Check initialization status
console.log(Initializer.isInitialized); // true
console.log(Initializer.currentAccuracy); // 2 (default)
```

#### Memory vs Precision Trade-off

| Decimal Accuracy | Values Cached | Memory | Use Case |
|:----------------:|:-------------:|:------:|:---------|
| 0 | 200 | ~2 KB | Rough estimates |
| 1 | 2,000 | ~20 KB | General use |
| **2** (default) | 20,000 | ~200 KB | **Recommended** |
| 3 | 200,000 | ~2 MB | High precision |
| 4 | 2,000,000 | ~20 MB | Scientific research |

---

### Core Functions

#### 🌡️ Temperature & Pressure

| Function | Description | Units |
|----------|-------------|-------|
| `temperatureToSaturationVaporPressure(temp)` | Saturation vapor pressure at temperature | °C → Pa |
| `saturationVaporPressureToTemperature(pressure)` | Temperature from saturation pressure | Pa → °C |
| `altitudeToAirPressure(altitude)` | Air pressure at altitude | m → Pa |
| `airPressureToAltitude(pressure)` | Altitude from air pressure | Pa → m |

#### 💧 Humidity Conversions

| Function | Description | Units |
|----------|-------------|-------|
| `relativeToSpecificHumidity(P, T, RH)` | Convert RH to specific humidity | %, °C → g/kg |
| `specificToRelativeHumidity(P, T, SH)` | Convert specific humidity to RH | g/kg, °C → % |
| `temperatureToMaximumSpecificHumidity(P, T)` | Max specific humidity at saturation | °C → g/kg |

#### 🌡️ Derived Properties

| Function | Description | Units |
|----------|-------------|-------|
| `dewPointTemperature(P, SH)` | Dew point from specific humidity | g/kg → °C |
| `wetBulbTemperature(P, T, SH)` | Wet bulb temperature | °C, g/kg → °C |
| `wetBulbTemperatureToSpecificHumidity(P, T, WB)` | Specific humidity from wet bulb | °C → g/kg |
| `specificAndRelativeHumidityToTemperature(P, SH, RH)` | Temperature from both humidities | g/kg, % → °C |

#### 🌬️ Air Properties

| Function | Description | Units |
|----------|-------------|-------|
| `airDensityByRelativeHumidity(P, T, RH)` | Air density from RH | Pa, °C, % → kg/m³ |
| `airDensityBySpecificHumidity(P, T, SH)` | Air density from specific humidity | Pa, °C, g/kg → kg/m³ |
| `enthalpy(T, SH)` | Moist air enthalpy | °C, g/kg → kJ/kg |
| `enthalpyToTemperature(H, SH)` | Temperature from enthalpy | kJ/kg, g/kg → °C |
| `enthalpyToSpecificHumidity(H, T)` | Specific humidity from enthalpy | kJ/kg, °C → g/kg |

---

### Physical Constants

```typescript
import {
  AVERAGE_PRESSURE_AT_SEA_LEVEL,    // 101325 Pa
  GRAVITATIONAL_ACCELERATION,        // 9.80665 m/s²
  UNIVERSAL_GAS_CONSTANT,            // 8.31446... J/(mol·K)
  MOLAR_MASS_OF_DRY_AIR,            // 0.0289647 kg/mol
  MOLAR_MASS_OF_WATER_VAPOR,        // 0.01801528 kg/mol
  EVAPORATION_HEAT,                  // 2501 kJ/kg
  SPECIFIC_HEAT_CAPACITY_OF_WATER,   // 1.84 kJ/(kg·°C)
  // ... and more
} from '@adaskothebeast/psychrometrics';
```

---

## 🛡️ Error Handling

The library provides detailed, actionable error messages:

```typescript
import { airDensityByRelativeHumidity } from '@adaskothebeast/psychrometrics';

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
  InitializationRequiredError,  // Thrown when Initializer.initialize() not called
  WetBulbConvergenceError,      // Thrown when wet bulb calculation fails to converge
} from '@adaskothebeast/psychrometrics';
```

---

## 🔬 Scientific Background

### Formulas Used

- **Saturation Vapor Pressure**: Based on [Huang (2018)](https://journals.ametsoc.org/view/journals/apme/57/6/jamc-d-17-0334.1.xml) — "A Simple Accurate Formula for Calculating Saturation Vapor Pressure of Water and Ice"
- **Barometric Formula**: Standard atmosphere model for altitude-pressure conversions
- **Humidity Calculations**: Based on thermodynamic relationships using molar mass ratios

### Valid Ranges

| Parameter | Range | Notes |
|-----------|-------|-------|
| Temperature | -100°C to 100°C | Uses ice formula ≤0°C, water >0°C |
| Altitude | -430.5m to 8848m | Dead Sea to Mt. Everest |
| Relative Humidity | 0% to 100% | — |
| Specific Humidity | ≥ 0 g/kg | — |

---

## 📖 Detailed Documentation

Each function has detailed mathematical documentation:

- [Air Density by Relative Humidity](libs/psychrometrics/src/doc/air-density-by-relative-humidity.md)
- [Air Density by Specific Humidity](libs/psychrometrics/src/doc/air-density-by-specific-humidity.md)
- [Altitude ↔ Air Pressure](libs/psychrometrics/src/doc/altitude-to-air-pressure.md)
- [Dew Point Temperature](libs/psychrometrics/src/doc/dew-point-temperature.md)
- [Enthalpy Calculations](libs/psychrometrics/src/doc/enthalpy.md)
- [Humidity Conversions](libs/psychrometrics/src/doc/relative-to-specific-humidity.md)
- [Saturation Vapor Pressure](libs/psychrometrics/src/doc/temperature-to-saturation-vapor-pressure.md)
- [Wet Bulb Temperature](libs/psychrometrics/src/doc/wet-bulb-temperature.md)
- [Physical Constants](libs/psychrometrics/src/doc/constants.md)

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
const temp = 32;        // °C
const humidity = 80;    // %
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

[AGPL-3.0-or-later](LICENSE) © [Adam Pluciński](https://github.com/AdaskoTheBeAsT)

---

<p align="center">
  <sub>Built with ❤️ for the HVAC and scientific computing community</sub>
</p>
