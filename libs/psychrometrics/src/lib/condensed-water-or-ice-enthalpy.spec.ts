/**
 * Copyright (C) 2022 Adam Pluciński
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { condensedWaterOrIceEnthalpy } from './condensed-water-or-ice-enthalpy';

describe('condensedWaterOrIceEnthalpy', () => {
  it('should match ASHRAE Equations 33 and 34', () => {
    expect(condensedWaterOrIceEnthalpy(0)).toBeCloseTo(0, 12);
    expect(condensedWaterOrIceEnthalpy(20)).toBeCloseTo(4.186 * 20, 12);
    expect(condensedWaterOrIceEnthalpy(-10)).toBeCloseTo(-333.4 + 2.1 * -10, 12);
  });
});
