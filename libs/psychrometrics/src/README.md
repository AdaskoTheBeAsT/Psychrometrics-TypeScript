# Psychrometrics

## Description

### Psychrometrics formulas

- [air density by relative humidity](doc/air-density-by-relative-humidity.md)
- [air density by specific humidity](doc/air-density-by-specific-humidity.md)
- [air pressure to altitude (above mean sea level)](doc/air-pressure-to-altitude.md)
- [altitude (above mean sea level) to air pressure](doc/altitude-to-air-pressure.md)
- [constants](doc/constants)
- [dew point temperature](doc/dew-point-temperature.md)
- [relative to specific humidity](doc/relative-to-specific-humidity.md)
- [saturation vapor pressure to temperature](doc/saturation-vapor-pressure-to-temperature.md)
- [specific and relative humidity to temperature](doc/specific-and-relative-humidity-to-temperature.md)
- [specific to relative humidity](doc/specific-to-relative-humidity.md)
- [temperature to maximum specific humidity](doc/temperature-to-maximum-specific-humidity.md)
- [temperature to saturation vapor pressure of water](doc/temperature-to-saturation-vapor-pressure-of-water.md)
- [temperature to saturation vapor pressure of ice](doc/temperature-to-saturation-vapor-pressure-of-ice.md)
- [temperature to saturation vapor pressure](doc/temperature-to-saturation-vapor-pressure.md)
- [wet bulb temperature to specific humidity](doc/wet-bulb-temperature-to-specific-humidity.md)
- [wet bulb temperature](doc/wet-bulb-temperature.md)

## Installation

```sh
yarn add @adaskothebeast/psychrometrics
```

or

```sh
npm install @adaskothebeast/psychrometrics --save
```

## Usage

It is important to invoke `Initializer.initialize` before usage function `saturationVaporPressureToTemperature`. It stores values of function `temperatureToSaturationVaporPressure` in memory and then uses monotone cubic Hermit interpolation to interpolate value based on stored values. 

```ts
  Initializer.initialize();
```

You have ability to setup decimal point accuracy of stored values (meaningful decimal places). Default is 2 -> $10^{-2}$ = 0.01. Values are stored between -100°C and 100°C - so when decimal point accuracy is 2 then 20k values are stored in memory. Decimal point accuracy can be between 0 and 4.

| Decimal point accuracy | Number of values stored |
| ---------------------: | ----------------------: |
|                      0 |                     200 |
|                      1 |                    2000 |
|                      2 |                   20000 |
|                      3 |                  200000 |
|                      4 |                 2000000 |
