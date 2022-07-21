# Temperature to maximum specific humidity

## Formula for calculating maximum specific humidity for temperature

$$
\large{P_s = temperatureToSaturationVaporPressure(t)}
$$

$$
\omega = 1000 * \frac{M_{ratio} * P_s}{P_a - P_s}
$$

where:

- t - temperature [°C]
- $M_{ratio}$ -  molar mass ratio = 0.6219736437801877
- $P_a$ - atmospheric pressure $[Pa]$
