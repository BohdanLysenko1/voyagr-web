import ProfileHeader from '@/components/Profile/ProfileHeader';
import SocialSection from '@/components/Profile/SocialSection';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Profile Section */}
          <ProfileHeader />

          {/* Social Section */}
          <SocialSection />
        </div>
      </main>
    </div>
  );
}
