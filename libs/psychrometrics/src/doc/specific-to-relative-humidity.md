# Specific to relative humidity

## Formula for calculating relative humidity for specific humidity and temperature

1. $$
\large{P_s = temperatureToSaturationVaporPressure(t)}
$$

1. $$
\large{HumidityRatio_{saturated} = \frac{M_{ratio} * P_s}{P_a - P_s}}
$$

1. $$
\omega_{norm} = \frac{\omega}{1000}
$$

1. $$
RH = \frac{100 * \omega_{norm} * (1 + \frac{HumidityRatio_{saturated}}{M_{ratio}})}{HumidityRatio_{saturated} * (1 + \frac{\omega_{norm}}{M_{ratio}})}
$$

where:

- t - temperature [°C]
- $M_{ratio}$ -  molar mass ratio = 0.6219736437801877
- $P_a$ - atmospheric pressure $[Pa]$
- $\omega$ - specific humidity [g/kg]
