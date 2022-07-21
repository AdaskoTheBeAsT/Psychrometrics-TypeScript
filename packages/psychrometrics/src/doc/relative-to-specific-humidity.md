# Relative to specific humidity

## Formula which converts relative to specific humidity

1. $$
\large{RH_{norm} = RH / 100}
$$

1. $$
\large{P_s = temperatureToSaturationVaporPressure(t)}
$$

1. $$
\large{HumidityRatio_{saturated} = \frac{M_{ratio} * P_s}{P_a - P_s}}
$$

1. $$
\large{\omega = \frac{1000 * RH_{norm} * HumidityRatio_{saturated}}{(1+\frac{(1 - RH_{norm}) * HumidityRatio_{saturated}}{M_{ratio}})}}
$$

where:

- $RH$ - relative humidity [%]
- $t$ - temperature [°C]
- $M_{ratio}$ -  molar mass ratio = 0.6219736437801877
- $P_a$ - atmospheric pressure $[Pa]$
