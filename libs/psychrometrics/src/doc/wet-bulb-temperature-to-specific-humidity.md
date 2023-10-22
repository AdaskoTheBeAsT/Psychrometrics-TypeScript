# Wet bulb temperature to specific humidity

## Formula for calculating specific humidity based on wet bulb temperature

1. $$
\large{\omega_{max} = temperatureToMaximumSpecificHumidity(P_a, T_{wb})}
$$

1. $$
\large{H = enthalpy(T_{wb}, \omega_{max})}
$$

1. $$
\large{\omega = enthalpyToSpecificHumidity(H, t)}
$$

where:

- $P_a$ - atmospheric pressure $[Pa]$
- $t$ - temperature $[°C]$
- $T_{wb}$ - wet bulb temperature $[°C]$
