# Enthalpy to temperature

## Formula for converting enthalpy to temperature

$$
\large{t_1 = \frac{H + 0.026 - \Delta H_{vap} * \frac{\omega}{1000}}{C_{p_{t>=0}} +  C_v * \frac{\omega}{1000}}}
$$

$$
\large{t_2 = \frac{H - \Delta H_{vap} * \frac{\omega}{1000}}{C_{p_{t<0}} +  C_v * \frac{\omega}{1000}}}
$$

```cs
  if t_1 > 0
    return t_1
  else
    return t_2
```

where:

- $H$ - enthalpy $[\frac{kJ}{kg}]$
- $\Delta H_{vap}$ - evaporation heat = 2501 $[\frac{kJ}{kg}]$
- $\omega$ - specific humidity $[\frac{g}{kg}]$
- $C_{p_{t>=0}}$ - specific heat capacity of air equal or above zero = 1.007 $[\frac{kJ}{kg·°C}]$
- $C_{p_{t<0}}$ - specific heat capacity of air equal or above zero = 1.005 $[\frac{kJ}{kg·°C}]$
- $C_v$ - specific heat capacity of water = 1.84 $[\frac{kJ}{kg·°C}]$
