// 프로젝트 주 색상 정의 - 브라운/갈색 테마
export const colors = {
    primary: {
        DEFAULT: '#92705b',
        light: '#b08d79',
        dark: '#6b5344',
        50: '#faf6f3',
        100: '#f3ebe4',
        200: '#e6d5c8',
        300: '#d4b9a5',
        400: '#b08d79',
        500: '#92705b',
        600: '#7d5d4a',
        700: '#6b5344',
        800: '#5a453a',
        900: '#4a3930',
    },
    secondary: {
        DEFAULT: '#d4a574',
        light: '#e5c4a1',
        dark: '#b8894f',
    },
    accent: {
        DEFAULT: '#8b9a6f',
        light: '#a8b78e',
        dark: '#6e7d52',
    },
    neutral: {
        DEFAULT: '#78716c',
        light: '#a8a29e',
        dark: '#57534e',
        50: '#fafaf9',
        100: '#f5f5f4',
        200: '#e7e5e4',
        300: '#d6d3d1',
        400: '#a8a29e',
        500: '#78716c',
        600: '#57534e',
        700: '#44403c',
        800: '#292524',
        900: '#1c1917',
    },
    success: '#84cc16',
    warning: '#f59e0b',
    error: '#dc2626',
    background: '#fffbf7',
    surface: '#faf6f3',
};

// Tab Navigator 등에서 사용할 색상
export const tabColors = {
    active: colors.primary.DEFAULT,
    inactive: colors.neutral.light,
    background: colors.background,
};

// Header 색상
export const headerColors = {
    background: colors.primary.DEFAULT,
    text: '#ffffff',
};

export default colors;
