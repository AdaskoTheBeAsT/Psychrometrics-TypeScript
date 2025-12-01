# @adaskothebeast/psychrometrics

> A comprehensive, type-safe TypeScript library for psychrometric calculations

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
| `saturationVaporPressureToTemperature(pressure)` | Pa → °C |
| `altitudeToAirPressure(altitude)` | m → Pa |
| `airPressureToAltitude(pressure)` | Pa → m |

#### Humidity

| Function | Description |
|----------|-------------|
| `relativeToSpecificHumidity(P, T, RH)` | %, °C → g/kg |
| `specificToRelativeHumidity(P, T, SH)` | g/kg, °C → % |
| `dewPointTemperature(P, SH)` | g/kg → °C |
| `wetBulbTemperature(P, T, SH)` | °C, g/kg → °C |

#### Air Properties

| Function | Description |
|----------|-------------|
| `airDensityByRelativeHumidity(P, T, RH)` | Pa, °C, % → kg/m³ |
| `airDensityBySpecificHumidity(P, T, SH)` | Pa, °C, g/kg → kg/m³ |
| `enthalpy(T, SH)` | °C, g/kg → kJ/kg |

### Initialization

Required for reverse calculations (vapor pressure → temperature):

```typescript
// Default (2 decimal places, 20k values)
Initializer.initialize();

// High precision (4 decimal places, 2M values)
Initializer.initialize(4);

// Lazy initialization
Initializer.ensureInitialized();
```

| Accuracy | Values | Memory |
|:--------:|:------:|:------:|
| 0 | 200 | ~2 KB |
| 1 | 2,000 | ~20 KB |
| **2** | 20,000 | ~200 KB |
| 3 | 200,000 | ~2 MB |
| 4 | 2,000,000 | ~20 MB |

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
