export const defaultTheme = {
    primaryColor: '#2A3547',
    // Add other theme variables as needed
};

export function getThemeColor(colorKey: keyof typeof defaultTheme): string {
    return defaultTheme[colorKey];
}
