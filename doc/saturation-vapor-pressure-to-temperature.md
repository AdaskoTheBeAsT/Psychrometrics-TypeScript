# Saturation vapor pressure to temperature

There is no simple reversal formula which allows to calculate temperature by saturation vapor pressure. In order to calculate such value I am using [monotone cubic Hermit interpolation](https://en.wikipedia.org/wiki/Monotone_cubic_interpolation).

It is important to invoke `Initializer.initialize` before usage function `saturationVaporPressureToTemperature`. It stores values of function `temperatureToSaturationVaporPressure` in memory and then uses monotone cubic Hermit interpolation to interpolate value based on stored values. 

```ts
  Initializer.initialize();
```

or

```ts
  Initializer.initialize(2);
```

You have ability to setup decimal point accuracy of stored values (meaningful decimal places). Default is 2 -> $10^{-2}$ = 0.01. Values are stored between -100°C and 100°C - so when decimal point accuracy is 2 then 20k values are stored in memory. Decimal point accuracy can be between 0 and 4.

| Decimal point accuracy | Number of values stored |
| ---------------------: | ----------------------: |
|                      0 |                     200 |
|                      1 |                    2000 |
|                      2 |                   20000 |
|                      3 |                  200000 |
|                      4 |                 2000000 |
