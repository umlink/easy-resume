import Color from 'color';
import { v4 as uuidv4 } from 'uuid';

export const generateRandomID = (): string => uuidv4();

const getGrayColor = (luma: number) => {
  if (luma > 0.9) return '#1D2129';
  if (luma > 0.8) return '#272E3B';
  if (luma > 0.7) return '#272E3B';
  if (luma > 0.6) return '#272E3B';
  if (luma > 0.5) return '#f9f9f9';
  if (luma > 0.4) return '#f9f9f9';
  if (luma > 0.3) return '#f9f9f9';
  if (luma > 0.2) return '#f9f9f9';
  if (luma > 0.1) return '#f9f9f9';
  return '#fff';
};

export const reversalColor = (themeColor: string) => {
  const currentColor: any = Color(themeColor);
  const [r, g, b] = currentColor.rgb().color;
  const luma = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 255;
  return {
    luma,
    rgb: currentColor.rgb().color.join(','),
    contrastColor: getGrayColor(luma),
  };
};

export const getHexColorByAlpha = (color: string, alpha: number) => {
  // 创建前景色对象
  let foreground = Color(color);

  // 创建背景色对象，白色
  let background = Color('#FFFFFF');

  // 计算混合后的 RGB 颜色值
  let blendedR = Math.round(alpha * foreground.red() + (1 - alpha) * background.red());
  let blendedG = Math.round(alpha * foreground.green() + (1 - alpha) * background.green());
  let blendedB = Math.round(alpha * foreground.blue() + (1 - alpha) * background.blue());

  // 创建混合后的颜色对象
  let blendedColor = Color({ r: blendedR, g: blendedG, b: blendedB });

  // 返回混合后的颜色的 hex 值
  return blendedColor.hex().toUpperCase();
};

export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};
