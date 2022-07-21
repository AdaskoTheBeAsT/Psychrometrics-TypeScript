# Enthalpy

## Formula for calculating enthalpy for temperature above or equal 0

$$
  \large{ H_{t>=0} = C_{p_{t>=0}} * T_{da} - 0.026 + \frac{\omega}{1000} * (\Delta H_{vap}+C_v*T_{da})  }
$$

where:

- $C_{p_{t>=0}}$ - specific heat capacity of air equal or above zero = 1.007 $[\frac{kJ}{kg·°C}]$
- $T_{da}$ - temperature of dry air $[°C]$
- $\omega$ - specific humidity $[\frac{g}{kg}]$
- $\Delta H_{vap}$ - evaporation heat = 2501 $[\frac{kJ}{kg}]$
- $C_v$ - specific heat capacity of water = 1.84 $[\frac{kJ}{kg·°C}]$

$$
  \large{ H_{t>=0} = 1.007 * T_{da} - 0.026 + \frac{\omega}{1000} * (2501+1.84*T_{da})  }
$$

## Formula for calculating enthalpy for temperature below 0

$$
  \large{ H_{t<0} = C_{p_{t<0}} * T_{da} + \frac{\omega}{1000} * (\Delta H_{vap}+C_v*T_{da})  }
$$

where:

- $C_{p_{t<0}}$ - specific heat capacity of air equal or above zero = 1.005 $[\frac{kJ}{kg·°C}]$
- $T_{da}$ - temperature of dry air $[°C]$
- $\omega$ - specific humidity $[\frac{g}{kg}]$
- $\Delta H_{vap}$ - evaporation heat = 2501 $[\frac{kJ}{kg}]$
- $C_v$ - specific heat capacity of water = 1.84 $[\frac{kJ}{kg·°C}]$

$$
  \large{ H_{t>=0} = 1.005 * T_{da} + \frac{\omega}{1000} * (2501+1.84*T_{da})  }
$$
