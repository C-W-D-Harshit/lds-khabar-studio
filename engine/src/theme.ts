import {loadFont as loadKhand} from '@remotion/google-fonts/Khand';
import {loadFont as loadMukta} from '@remotion/google-fonts/Mukta';
import {loadFont as loadTeko} from '@remotion/google-fonts/Teko';

export const F = {
  head: loadKhand('normal', {weights: ['600', '700'], subsets: ['devanagari', 'latin']}).fontFamily,
  body: loadMukta('normal', {weights: ['500', '700', '800'], subsets: ['devanagari', 'latin']}).fontFamily,
  num: loadTeko('normal', {weights: ['500', '600', '700'], subsets: ['latin', 'devanagari']}).fontFamily,
};

export const C = {
  navy: '#0B1F4D',
  navy2: '#13327A',
  navyDeep: '#060F29',
  red: '#E0141E',
  redDeep: '#A50D14',
  yellow: '#FFC915',
  yellow2: '#FFE14D',
  white: '#FFFFFF',
  ink: '#0A1230',
  green: '#16C76A',
  greenDeep: '#0B8F4A',
  saffron: '#FF8A1F',
  gold: '#F6C453',
  grey: '#9AA6C2',
};

export const FPS = 30;
