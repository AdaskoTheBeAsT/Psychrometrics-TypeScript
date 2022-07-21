# Wet bulb temperature

## Calculating wet bulb temperature

Calculation of wet bulb temperature is not based on specific formula but by bisection method.

For temperature greater or equal to 0°C:

1. temperature is saved as prev
2. specific humidity is saved as specific humidity prev
3. loop is started
4. dew point is calculated based on specific humidity prev
5. temperature difference is calculated by taken half of result of subtracting dew point from temperature prev
6. temperature prev is calculated by subtracting absolute difference from temperature prev
7. enthalpy is calculated by original temperature and original specific humidity
8. specific humidity prev is calculated by enthalpy and temperature prev
9. if temperature difference is greater or equal epsilon, loop 3. is started again

For temperature less than 0°C:

1. temperature is saved as prev
2. specific humidity is saved as specific humidity prev
3. loop is started
4. max specific humidity is calculated based on temperature prev
5. specific humidity difference is calculated by taken half of result of subtracting specific humidity prev from max specific humidity
6. specific humidity prev is calculated by subtracting absolute difference from specific humidity prev
7. enthalpy is calculated by original temperature and original specific humidity
8. temperature prev is calculated by enthalpy and specific humidity prev
9. if scaled specific humidity difference is greater or equal epsilon, loop 3. is started again
