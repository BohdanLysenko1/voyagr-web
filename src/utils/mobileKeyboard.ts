export interface KeyboardState {
  isOpen: boolean;
  height: number;
  viewportHeight: number;
}

const KEYBOARD_THRESHOLD = 80;

const createViewportEmitter = (emit: (state: KeyboardState) => void) => {
  const viewport = window.visualViewport;
  if (!viewport) return null;

  let baseline = viewport.height + viewport.offsetTop;

  const handleViewportChange = () => {
    const currentViewportHeight = viewport.height + viewport.offsetTop;
    baseline = Math.max(baseline, currentViewportHeight);
    const keyboardHeight = Math.max(0, baseline - currentViewportHeight);
    emit({
      isOpen: keyboardHeight > KEYBOARD_THRESHOLD,
      height: keyboardHeight,
      viewportHeight: viewport.height,
    });
  };

  viewport.addEventListener('resize', handleViewportChange);
  viewport.addEventListener('scroll', handleViewportChange);

  // emit initial state
  handleViewportChange();

  return () => {
    viewport.removeEventListener('resize', handleViewportChange);
    viewport.removeEventListener('scroll', handleViewportChange);
  };
};

const createResizeEmitter = (emit: (state: KeyboardState) => void) => {
  let baseline = window.innerHeight;

  const handleResize = () => {
    if (window.visualViewport) return;
    if (window.innerHeight > baseline) {
      baseline = window.innerHeight;
    }
    const keyboardHeight = Math.max(0, baseline - window.innerHeight);
    emit({
      isOpen: keyboardHeight > KEYBOARD_THRESHOLD,
      height: keyboardHeight,
      viewportHeight: window.innerHeight,
    });
  };

  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);

  // emit initial state
  handleResize();

  return () => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleResize);
  };
};

export const subscribeToKeyboardState = (listener: (state: KeyboardState) => void) => {
  if (typeof window === 'undefined') return () => undefined;

  const emit = (state: KeyboardState) => {
    listener(state);
  };

  const teardownViewport = createViewportEmitter(emit);
  const teardownResize = createResizeEmitter(emit);

  return () => {
    teardownViewport?.();
    teardownResize?.();
  };
};

export const isIOS = () => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent.toLowerCase();
  const platform = navigator.platform?.toLowerCase() ?? '';
  const isiOSDevice = /iphone|ipad|ipod/.test(ua);
  const isTouchMac = platform.includes('mac') && typeof window !== 'undefined' && 'ontouchstart' in window;
  return isiOSDevice || isTouchMac;
};
