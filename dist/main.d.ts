import { FC } from 'react';
export interface IdenticonProps {
    seed: string;
    className?: string;
    size?: number;
    scale?: number;
    color?: string;
    bgColor?: string;
    spotColor?: string;
}
declare const Identicon: FC<IdenticonProps>;
export default Identicon;
