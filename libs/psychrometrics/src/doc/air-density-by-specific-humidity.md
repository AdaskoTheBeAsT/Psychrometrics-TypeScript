# Air density

## Formula which calculates air density by specific humidity

$$
  \huge{\rho= \frac{(1 + \frac{\omega}{1000}) * P_a}{R_d*(T_{db} +273.15)*( 1 + \frac{M_{da}}{M_{wv}} * \frac{\omega}{1000})} }
$$

where

- $\omega$ - specific humidity $[\frac{g}{kg}]$
- $P_a$ - atmospheric pressure $[Pa]$
- $R_d$ - gas constant for dry air which equals Universal Gas Constant / molar mass of dry air   $\frac{8.31446261815324 \left [ \frac{N*m}{mol*°K} \right ]}{0.0289647  \left [\frac{kg}{mol} \right]} = 287.05502277438535 \left [ \frac{N*m}{kg*°K} \right ]$
- $T_{db}$ - dry bulb temperature $[°C]$
- $M_{da}$ - molar mass of dry air $0.0289647  \left [\frac{kg}{mol} \right]$
- $M_{wv}$ - molar mass of water vapor $0.01801528  \left [\frac{kg}{mol} \right]$
