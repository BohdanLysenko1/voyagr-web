import { useState, useEffect } from 'react';

export interface DeviceInfo {
  isMobile: boolean;
  isIOSDevice: boolean;
}

/**
 * Custom hook to detect device type and platform
 * Handles responsive breakpoints and iOS device detection
 */
export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isIOSDevice: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileCheck =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent) ||
        window.innerWidth <= 768;
      const iOSCheck =
        /ipad|iphone|ipod/.test(userAgent) ||
        (navigator.maxTouchPoints > 1 && /macintosh/.test(userAgent));

      setDeviceInfo({
        isMobile: mobileCheck,
        isIOSDevice: iOSCheck,
      });

      // Add device-specific body classes for CSS targeting
      if (iOSCheck) {
        document.body.classList.add('ios-device');
      } else {
        document.body.classList.remove('ios-device');
      }

      if (mobileCheck) {
        document.body.classList.add('mobile-device');
      } else {
        document.body.classList.remove('mobile-device');
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
      document.body.classList.remove('ios-device', 'mobile-device');
    };
  }, []);

  return deviceInfo;
}