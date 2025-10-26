'use client';

import { useRouter } from 'next/navigation';
import AIPageWrapper from '@/components/AI/shared/AIPageWrapper';
import TripPlannerLanding from '@/components/AI/TripPlannerLanding';

export default function AIHomePage() {
  const router = useRouter();

  const handleStartPlanning = () => {
    router.push('/ai/plan');
  };

  return (
    <AIPageWrapper 
      title="AI Travel Assistant" 
      subtitle="Voyagr AI"
      showSidebar={true}
      showMobileNav={true}
    >
      <TripPlannerLanding onStartPlanning={handleStartPlanning} />
    </AIPageWrapper>
  );
}
