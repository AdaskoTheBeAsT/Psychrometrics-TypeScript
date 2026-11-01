# @adaskothebeast/psychrometrics

> A comprehensive, type-safe TypeScript library for psychrometric calculations across European (Eurovent / VDI / Recknagel) and North American (ASHRAE) HVAC standards.

## Installation

```bash
npm install @adaskothebeast/psychrometrics
```

## Quick Start

```typescript
import {
  Initializer,
  airDensityByRelativeHumidity,
  relativeToSpecificHumidity,
  dewPointTemperature,
  wetBulbTemperature,
  enthalpy,
} from '@adaskothebeast/psychrometrics';

// Initialize once at app startup
Initializer.initialize();

const pressure = 101325; // Pa
const density = airDensityByRelativeHumidity(pressure, 20, 60);
console.log(`Air density: ${density.toFixed(4)} kg/m³`);
```

## Documentation

For full documentation, see the [main README](../../../README.md).

### Function Reference

#### Temperature & Pressure

| Function | Description |
|----------|-------------|
| `temperatureToSaturationVaporPressure(temp)` | °C → Pa |
| `temperatureToSaturationVaporPressureOfWater(temp)` | °C → Pa |
| `temperatureToSaturationVaporPressureOfIce(temp)` | °C → Pa |
| `saturationVaporPressureToTemperature(pressure)` | Pa → °C |
| `altitudeToAirPressure(altitude)` | m → Pa |
| `airPressureToAltitude(pressure)` | Pa → m |

#### Humidity & Wet Bulb

| Function | Description |
|----------|-------------|
| `relativeToSpecificHumidity(P, T, RH)` | Pa, °C, % → g/kg |
| `specificToRelativeHumidity(P, T, SH)` | Pa, °C, g/kg → % |
| `temperatureToMaximumSpecificHumidity(P, T)` | Pa, °C → g/kg |
| `dewPointTemperature(P, SH)` | Pa, g/kg → °C |
| `wetBulbTemperature(P, T, SH, epsilon?, maxIterations?)` | Pa, °C, g/kg → °C |
| `wetBulbTemperatureToSpecificHumidity(P, T, WB)` | Pa, °C, °C → g/kg |
| `adiabaticSaturationSpecificHumidity(P, T, SH)` | Pa, °C, g/kg → g/kg |
| `specificAndRelativeHumidityToTemperature(P, SH, RH)` | Pa, g/kg, % → °C |

#### Air Density & Enthalpy

| Function | Description |
|----------|-------------|
| `airDensityByRelativeHumidity(P, T, RH)` | Pa, °C, % → kg/m³ |
| `airDensityBySpecificHumidity(P, T, SH)` | Pa, °C, g/kg → kg/m³ |
| `enthalpy(T, SH)` | °C, g/kg → kJ/kg |
| `enthalpyToTemperature(H, SH)` | kJ/kg, g/kg → °C |
| `enthalpyToSpecificHumidity(H, T)` | kJ/kg, °C → g/kg |
| `condensedWaterOrIceEnthalpy(T)` | °C → kJ/kg |

### Initialization & Standards

```typescript
import {
  Initializer,
  MoistAirEnthalpyFormula,
  PsychrometricStandard,
  SaturationVaporPressureFormula,
  WetBulbFormula,
} from '@adaskothebeast/psychrometrics';

// Default (Eurovent, Recknagel, Magnus-Tetens, Isenthalpic, 2 decimal places)
Initializer.initialize();

// ASHRAE standard configuration
Initializer.initialize(
  2,
  PsychrometricStandard.Ashrae,
  MoistAirEnthalpyFormula.Ashrae,
  SaturationVaporPressureFormula.AshraeHylandWexler,
  WetBulbFormula.DefaultForStandard,
);

// Lazy initialization
Initializer.ensureInitialized();
```

| Accuracy | Values | Memory |
|:--------:|:------:|:------:|
| 0 | 201 | ~3 KB |
| 1 | 2,001 | ~32 KB |
| **2** | 20,001 | ~320 KB |
| 3 | 200,001 | ~3.2 MB |
| 4 | 2,000,001 | ~32 MB |

## Detailed Formula Documentation

- [Air Density by Relative Humidity](doc/air-density-by-relative-humidity.md)
- [Air Density by Specific Humidity](doc/air-density-by-specific-humidity.md)
- [Altitude ↔ Air Pressure](doc/altitude-to-air-pressure.md)
- [Dew Point Temperature](doc/dew-point-temperature.md)
- [Enthalpy](doc/enthalpy.md)
- [Humidity Conversions](doc/relative-to-specific-humidity.md)
- [Saturation Vapor Pressure](doc/temperature-to-saturation-vapor-pressure.md)
- [Wet Bulb Temperature](doc/wet-bulb-temperature.md)
- [Constants](doc/constants.md)

## License

[AGPL-3.0-or-later](LICENSE)
