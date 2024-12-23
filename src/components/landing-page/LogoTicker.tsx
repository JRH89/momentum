"use client";

import { motion } from "framer-motion";
import {
  CloudLightning,
  Compass,
  Feather,
  Music,
  Star,
  Sunrise
} from "lucide-react";

const pageData = [
  { icon: CloudLightning, text: "Nimbus Data Sync" },
  { icon: Compass, text: "Navigator Pro" },
  { icon: Feather, text: "Quill Editor" },
  { icon: Music, text: "Harmonic Sound" },
  { icon: Star, text: "Stellar Reviews" },
  { icon: Sunrise, text: "Morning Alerts" },
  { icon: CloudLightning, text: "Nimbus Data Sync" },
  { icon: Compass, text: "Navigator Pro" },
  { icon: Feather, text: "Quill Editor" },
  { icon: Music, text: "Harmonic Sound" },
  { icon: Star, text: "Stellar Reviews" },
  { icon: Sunrise, text: "Morning Alerts" }
];

export const LogoTicker = () => {
  return (
    <div className="py-12">
      <div className="container">
        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black,transparent)]">
          <motion.div
            className="flex gap-14 flex-none pr-14 text-lg sm:text-2xl font-semibold"
            animate={{
              translateX: "-50%",
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            }}
          >
            {pageData.map((item, index) => (
              <div key={index} className="flex gap-1 items-center">
                <item.icon className="logo-ticker-image" />
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
