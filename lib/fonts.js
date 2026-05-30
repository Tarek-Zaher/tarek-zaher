import {
  Bangers,
  Cormorant,
  Lato,
  Lexend,
  Libre_Baskerville,
  Patrick_Hand,
  Press_Start_2P,
} from 'next/font/google';

export const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-family-libre-baskerville',
});

export const lato = Lato({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-family-lato',
});

export const cormorant = Cormorant({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-family-cormorant',
});

export const lexend = Lexend({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-family-lexend',
});

export const bangers = Bangers({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-family-bangers',
});

export const patrickHand = Patrick_Hand({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-family-patrick-hand',
});

export const pressStart = Press_Start_2P({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-family-press-start',
});

export const fontVariables = [
  libreBaskerville.variable,
  lato.variable,
  cormorant.variable,
  lexend.variable,
  bangers.variable,
  patrickHand.variable,
  pressStart.variable,
].join(' ');
