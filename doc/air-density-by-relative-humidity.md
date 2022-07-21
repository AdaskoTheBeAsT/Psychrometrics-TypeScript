# Air density

## Formula which calculates air density by relative humidity

$$
  \huge{\rho= \frac{P_d}{R_d*(T_{db}+273.15)}  + \frac{P_v}{R_v*(T_{db}+273.15)} }
$$

where

- $P_v$ - actual vapor pressure $[Pa]$ which equals to percentage RH of Saturation Vapor Pressure for given temperature $P_v = RH * P_s$ 
- $P_d$ - pressure of dry air $[Pa]$ which equals to atmospheric pressure minus actual vapor pressure $P_d = P_a - P_v$
- $R_d$ - gas constant for dry air which equals Universal Gas Constant / molar mass of dry air   $\frac{8.31446261815324 \left [ \frac{N*m}{mol*°K} \right ]}{0.0289647  \left [\frac{kg}{mol} \right]} = 287.05502277438535 \left [ \frac{N*m}{kg*°K} \right ] $
- $R_v$ - gas constant for water vapor which equals Universal Gas Constant / molar mass of water vapor  $\frac{8.31446261815324 \left [ \frac{N*m}{mol*°K} \right ]}{0.01801528  \left [\frac{kg}{mol} \right]} = 461.52280831345604 \left [ \frac{N*m}{kg*°K} \right ] $
- $T_{db}$ - dry bulb temperature $[°C]$
