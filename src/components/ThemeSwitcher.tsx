import * as React from "react";
import { IconButton } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";

interface ColorModeSwitcherProps {
  toggleTheme: () => void;
  theme: string;
}

const ColorModeSwitcher: React.FC<ColorModeSwitcherProps> = ({
  toggleTheme,
  theme,
}) => {
  const buttonProps = {
    size: "lg",
    isRound: true,
    variant: "ghost",
    icon: theme === "light" ? <MoonIcon /> : <SunIcon />,
    "aria-label": "Switch DarkMode",
  };

  return (
    <motion.div
      whileTap={{ rotate: 180 }}
      style={{ display: "flex", alignSelf: "flex-end" }}
    >
      <IconButton onClick={toggleTheme} {...buttonProps} />
    </motion.div>
  );
};

export default ColorModeSwitcher;
