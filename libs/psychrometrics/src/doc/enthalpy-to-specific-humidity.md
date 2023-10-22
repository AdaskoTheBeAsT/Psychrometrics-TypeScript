# Enthalpy to specific humidity

## Formula for converting enthalpy to specific humidity for temperature above or equal 0

$$
    \large{\omega = 1000 * \frac{H - C_{p_{t>=0}} * t + 0.026}{\Delta H_{vap} + C_v * t}}
$$

where:

- $H$ - enthalpy $[\frac{kJ}{kg}]$
- $C_{p_{t>=0}}$ - specific heat capacity of air equal or above zero = 1.007 $[\frac{kJ}{kg·°C}]$
- $T_{da}$ - temperature of dry air $[°C]$
- $\Delta H_{vap}$ - evaporation heat = 2501 $[\frac{kJ}{kg}]$
- $C_v$ - specific heat capacity of water = 1.84 $[\frac{kJ}{kg·°C}]$

## Formula for converting enthalpy to specific humidity for temperature below 0

$$
    \large{\omega = 1000 * \frac{H - C_{p_{t<0}} * t}{\Delta H_{vap} + C_v * t}}
$$

where:

- $H$ - enthalpy $[\frac{kJ}{kg}]$
- $C_{p_{t<0}}$ - specific heat capacity of air below zero = 1.005 $[\frac{kJ}{kg·°C}]$
- $T_{da}$ - temperature of dry air $[°C]$
- $\Delta H_{vap}$ - evaporation heat = 2501 $[\frac{kJ}{kg}]$
- $C_v$ - specific heat capacity of water = 1.84 $[\frac{kJ}{kg·°C}]$
