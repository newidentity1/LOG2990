import { MINIMUM_DIAMETER_DROPS, MINIMUM_DIAMETER_SPRAY, MINIMUM_DROPS_PER_SECOND } from '@app/constants/constants';
import { BasicToolProperties } from './basic-tool-properties';

export class SprayProperties extends BasicToolProperties {
    diameterSpray: number = MINIMUM_DIAMETER_SPRAY;
    diameterDrops: number = MINIMUM_DIAMETER_DROPS;
    dropsPerSecond: number = MINIMUM_DROPS_PER_SECOND;
}
