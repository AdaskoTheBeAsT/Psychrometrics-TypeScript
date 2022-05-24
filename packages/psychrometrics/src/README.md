# Psychrometrics

## Description

Psychrometrics formulas. Formulas calculate:

- saturation vapor pressure of water by temperature
- saturation vapor pressure of ice by temperature
- saturation vapor pressure by temperature
- temperature by saturation vapor pressure
- air pressure by elevation (above mean sea level)
- elevation (above mean sea level) by air pressure

## Installation

```sh
yarn add @adaskothebeast/psychrometrics
```

or

```sh
npm install @adaskothebeast/psychrometrics --save
```

## Usage

It is important to invoke `Initializer.initialize` before usage function `temperatureBySaturationVaporPressure`. It stores values of function `saturationVaporPressureByTemperature` in memory and then uses monotone cubic Hermit interpolation to interpolate value based on stored values. 

```ts
  Initializer.initialize();
```

You have ability to setup decimal point accuracy of stored values (meaningful decimal places). Default is 2 -> 10<sup>-2</sup> = 0.01. Values are stored between -100°C and 100°C - so when decimal point accuracy is 2 then 20k values are stored in memory. Decimal point accuracy can be between 0 and 4.

| Decimal point accuracy | Number of values stored |
| ---------------------: | ----------------------: |
|                      0 |                     200 |
|                      1 |                    2000 |
|                      2 |                   20000 |
|                      3 |                  200000 |
|                      4 |                 2000000 |
