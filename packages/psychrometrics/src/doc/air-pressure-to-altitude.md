# Air pressure to altitude

Formula which converts air pressure to altitude

$$
  \huge{h=h_b+\frac{T_b}{L_b}*\left [ \left (\frac{P}{P_b} \right )^\frac{-R*L_b}{g_0*M}-1 \right ]}
$$

where

- $P_b$ - static pressure (pressure at sea level) = $101325 [Pa]$
- $T_b$ - standard temperature (temperature at sea level 15°C) = $288.15 [°K]$
- $L_b$ - standard temperature lapse rate = $-0.0065 \left [\frac{°K}{m} \right ]$
- $h$ - height about sea level $[m]$
- $h_b$ - height at the bottom of atmospheric layer = $0 [m]$
- $R$ - Universal Gas Constant = $8.31446261815324 \left [ \frac{N*m}{mol*°K} \right ]$
- $g_0$ - gravitational acceleration constant = $9.80665 \left [\frac{m}{s^2} \right ]$
- $M$ - molar mass of Earth’s air = $0.0289647  \left [\frac{kg}{mol} \right]$

[Relationship Between Altitude and Pressure](https://www.mide.com/interplanetary-air-pressure-at-altitude-calculator)
