import autumnBackground from '../assets/seasons/autumn.jpg';
import springBackground from '../assets/seasons/spring.jpg';
import summerBackground from '../assets/seasons/summer.jpg';
import winterBackground from '../assets/seasons/winter.jpg';

import type { Season } from '../types/media';

export interface SeasonConfig {
  title: string;
  subtitle: string;
  eyebrow: string;
  background: string;
}

export const SEASON_CONFIG: Record<Season, SeasonConfig> = {
  winter: {
    title: 'Зима',
    eyebrow: 'Холодный сезон',
    subtitle:
      'Снег, длинные вечера и истории, к которым особенно хочется возвращаться зимой.',
    background: winterBackground,
  },

  spring: {
    title: 'Весна',
    eyebrow: 'Сезон пробуждения',
    subtitle:
      'Больше света, новое начало и вещи, которые хочется открыть заново.',
    background: springBackground,
  },

  summer: {
    title: 'Лето',
    eyebrow: 'Тёплый сезон',
    subtitle:
      'Длинные дни, свобода и истории, которые хорошо звучат летним вечером.',
    background: summerBackground,
  },

  autumn: {
    title: 'Осень',
    eyebrow: 'Сезон атмосферы',
    subtitle:
      'Дождь, тёмные вечера и знакомое чувство, ради которого хочется остаться дома.',
    background: autumnBackground,
  },
};