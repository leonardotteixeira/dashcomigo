/**
 * Design System Tokens
 * Central source of truth for all design values
 */

export const colors = {
  // Core brand colors
  primary: "#28A263",
  primaryHover: "#20915a",
  secondary: "#0066FF",

  // Text colors
  textPrimary: "#001529",
  textSecondary: "rgba(0,21,41,0.6)",

  // Backgrounds
  bgLight: "#FFFFFF",
  bgLighter: "#F5F7FA",

  // Borders
  borderDefault: "#E5E7EB",

  // Semantic colors
  success: "#10b981",
  danger: "#ef4444",
  warning: "#f59e0b",
  info: "#0066FF",
  dark: "#003a6d",
};

export const iconColors = {
  success: { bg: `${colors.success}/10`, text: colors.success },
  danger: { bg: `${colors.danger}/10`, text: colors.danger },
  warning: { bg: `${colors.warning}/10`, text: colors.warning },
  info: { bg: `${colors.info}/10`, text: colors.info },
  primary: { bg: `${colors.primary}/10`, text: colors.primary },
  dark: { bg: `${colors.dark}/10`, text: colors.dark },
  secondary: { bg: `${colors.secondary}/10`, text: colors.secondary },
};

export const spacing = {
  sectionGap: "space-y-8",
  elementGap: "space-y-6",
  cardPadding: "p-6",
  cardPaddingLarge: "p-7",
};

export const cardStyles = {
  base: "bg-white rounded-2xl shadow-sm border border-[#E5E7EB]",
  padding: "p-6",
  paddingLarge: "p-7",
  hover: "hover:border-[#0066FF]/20 hover:shadow-md transition-all",
};

export const buttonStyles = {
  primary: "bg-[#28A263] text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-[#20915a] transition-colors",
  secondary: "bg-[#0066FF] text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-[#0052CC] transition-colors",
  outline: "border border-[#E5E7EB] text-[#001529] font-semibold py-2.5 px-4 rounded-lg hover:bg-[#F5F7FA] transition-colors",
  ghost: "text-[#001529] font-medium py-2 px-3 rounded-lg hover:bg-[#F5F7FA] transition-colors",
};

export const shadows = {
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
};

export const transitions = {
  default: "transition-all duration-300",
  fast: "transition-all duration-150",
  slow: "transition-all duration-500",
};
