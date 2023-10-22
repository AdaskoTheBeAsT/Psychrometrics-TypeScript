# Specific and relative humidity to temperature

## Formula for calculating temperature for specific and relative humidity

1. $$
RH_{norm} = \frac{RH}{100}
$$

1. $$
\omega_{norm} = \frac{\omega}{1000}
$$

1. $$
ratio = \frac{\omega_{norm}}{RH_{norm} + \frac{((RH_{norm} - 1)*\omega_{norm})}{M_{ratio}}}
$$

1. $$
t = saturationVaporPressureToTemperature(\frac{ratio*P_a}{M_{ratio}+ratio})
$$

where:

- $RH$ - relative humidity in [%]
- $\omega$ - specific humidity in [g/kg]
- $P_a$ - air pressure in [Pa]
- $M_{ratio}$ -  molar mass ratio = 0.6219736437801877
