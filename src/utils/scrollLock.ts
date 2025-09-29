export interface ScrollMetrics {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
}

export const isNearBottom = (
  metrics: ScrollMetrics,
  threshold: number,
  isMobile: boolean
) => {
  const limit = isMobile ? Math.max(threshold, 200) : threshold;
  const distanceFromBottom = metrics.scrollHeight - metrics.scrollTop - metrics.clientHeight;
  return distanceFromBottom < limit;
};

export const shouldAutoScroll = ({
  metrics,
  threshold = 100,
  isMobile = false,
  userInitiated = false,
}: {
  metrics: ScrollMetrics;
  threshold?: number;
  isMobile?: boolean;
  userInitiated?: boolean;
}) => {
  if (userInitiated) {
    return true;
  }

  return isNearBottom(metrics, threshold, isMobile);
};
