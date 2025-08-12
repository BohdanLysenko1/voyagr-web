'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Plus, Eye } from 'lucide-react';
import PostCard from './PostCard';
import NewPostModal from './NewPostModal';

interface Post {
  id: string;
  title: string;
  description: string;
  image: string;
  likes: number;
  comments: number;
  views: number;
  publishedDate: string;
  location: string;
  isUserPost?: boolean;
}

interface SocialSectionProps {
  posts?: Post[];
}

export default function SocialSection({ posts }: SocialSectionProps) {
  const [activeFilter, setActiveFilter] = useState<'your-posts' | 'all'>('your-posts');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [allPosts, setAllPosts] = useState<Post[]>(posts || []);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsFilterOpen(false);
    }
  };

  // Default posts data - in a real app, this would come from props or API
  const defaultPosts: Post[] = [
    {
      id: '1',
      title: 'Casa Lucia: A Hidden Gem in Buenos Aires',
      description: 'Tucked in the heart of Recoleta, Casa Lucia stands boutique charm with quiet elegance. The rooms are spacious and bathed in natural light, with soft linens and warm wood accents throughout local breakfasts and fresh espresso worth waking up for. Whether you\'re wandering nearby parks or winding down at the rooftop pool, it feels like home just better.',
      image: '/images/casa-lucia.jpg',
      likes: 49,
      comments: 15,
      views: 3,
      publishedDate: 'July 2, 2025',
      location: 'Buenos Aires, Argentina',
      isUserPost: true
    },
    {
      id: '2',
      title: 'Casa Lucia: A Hidden Gem in Buenos Aires',
      description: 'Tucked in the heart of Recoleta, Casa Lucia stands boutique charm with quiet elegance. The rooms are spacious and bathed in natural light, with soft linens and warm wood accents throughout local breakfasts and fresh espresso worth waking up for. Whether you\'re wandering nearby parks or winding down at the rooftop pool, it feels like home just better.',
      image: '/images/casa-lucia.jpg',
      likes: 49,
      comments: 15,
      views: 3,
      publishedDate: 'July 2, 2025',
      location: 'Buenos Aires, Argentina',
      isUserPost: false
    },
    {
      id: '3',
      title: 'Casa Lucia: A Hidden Gem in Buenos Aires',
      description: 'Tucked in the heart of Recoleta, Casa Lucia stands boutique charm with quiet elegance. The rooms are spacious and bathed in natural light, with soft linens and warm wood accents throughout local breakfasts and fresh espresso worth waking up for. Whether you\'re wandering nearby parks or winding down at the rooftop pool, it feels like home just better.',
      image: '/images/casa-lucia.jpg',
      likes: 49,
      comments: 15,
      views: 3,
      publishedDate: 'July 2, 2025',
      location: 'Buenos Aires, Argentina',
      isUserPost: true
    },
    {
      id: '4',
      title: 'Casa Lucia: A Hidden Gem in Buenos Aires',
      description: 'Tucked in the heart of Recoleta, Casa Lucia stands boutique charm with quiet elegance. The rooms are spacious and bathed in natural light, with soft linens and warm wood accents throughout local breakfasts and fresh espresso worth waking up for. Whether you\'re wandering nearby parks or winding down at the rooftop pool, it feels like home just better.',
      image: '/images/casa-lucia.jpg',
      likes: 49,
      comments: 15,
      views: 3,
      publishedDate: 'July 2, 2025',
      location: 'Buenos Aires, Argentina',
      isUserPost: false
    },
    {
      id: '5',
      title: 'Casa Lucia: A Hidden Gem in Buenos Aires',
      description: 'Tucked in the heart of Recoleta, Casa Lucia stands boutique charm with quiet elegance. The rooms are spacious and bathed in natural light, with soft linens and warm wood accents throughout local breakfasts and fresh espresso worth waking up for. Whether you\'re wandering nearby parks or winding down at the rooftop pool, it feels like home just better.',
      image: '/images/casa-lucia.jpg',
      likes: 49,
      comments: 15,
      views: 3,
      publishedDate: 'July 2, 2025',
      location: 'Buenos Aires, Argentina',
      isUserPost: true
    },
    {
      id: '6',
      title: 'Casa Lucia: A Hidden Gem in Buenos Aires',
      description: 'Tucked in the heart of Recoleta, Casa Lucia stands boutique charm with quiet elegance. The rooms are spacious and bathed in natural light, with soft linens and warm wood accents throughout local breakfasts and fresh espresso worth waking up for. Whether you\'re wandering nearby parks or winding down at the rooftop pool, it feels like home just better.',
      image: '/images/casa-lucia.jpg',
      likes: 49,
      comments: 15,
      views: 3,
      publishedDate: 'July 2, 2025',
      location: 'Buenos Aires, Argentina',
      isUserPost: false
    }
  ];

  // Update allPosts when props change
  useEffect(() => {
    if (posts && posts.length > 0) {
      setAllPosts(posts);
    }

  }, [posts]);

  // Filter posts based on active filter
  const filteredPosts = activeFilter === 'your-posts' 
    ? allPosts.filter(post => post.isUserPost) // Filter by user's posts
    : allPosts; // Show all posts

  const [visiblePosts, setVisiblePosts] = useState(6);

  const handleLoadMore = () => {
    setVisiblePosts(prev => Math.min(prev + 6, filteredPosts.length));
  };

  // Reset visible posts when filter changes
  const handleFilterChange = (filter: 'your-posts' | 'all') => {
    setActiveFilter(filter);
    setVisiblePosts(6); // Reset to show 6 posts
    setIsFilterOpen(false);
  };

  // Handle new post creation
  const handleCreatePost = (postData: any) => {
    try {
      // Create new post object
      const newPost: Post = {
        id: Date.now().toString(), // Simple ID generation
        title: postData.title,
        description: postData.description,
        location: postData.location || 'Unknown Location',
        image: postData.image ? URL.createObjectURL(postData.image) : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwTDE3NSAxMjVIMTI1VjE3NUgxNzVMMjAwIDE1MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTI3NSAxMjVIMjI1VjE3NUgyNzVWMTI1WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K',
        likes: 0,
        comments: 0,
        views: 0,
        publishedDate: new Date(postData.publishDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        isUserPost: true
      };

      // Add to posts array
      setAllPosts(prev => [newPost, ...prev]);
      
      // Switch to "Your Posts" filter to show the new post
      setActiveFilter('your-posts');
      setVisiblePosts(6);
      
      console.log('New post created:', newPost);
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl group">
      {/* Custom Light Blue Background - Darker for Better Contrast */}
      <div className="absolute inset-0" style={{ backgroundColor: '#B8C8E5' }}></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-300/30 to-indigo-300/25"></div>
      
      {/* Glass Morphism Overlay */}
      <div className="relative backdrop-blur-sm bg-white/20 border border-white/30 shadow-2xl p-6">
        {/* Social Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 drop-shadow-lg">Social</h2>
        </div>

        {/* Filter and New Post */}
        <div className="flex items-center justify-between mb-6">
          {/* Filter Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              onKeyDown={handleKeyDown}
              aria-expanded={isFilterOpen}
              aria-haspopup="true"
              className="flex items-center space-x-2 text-gray-800 hover:text-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 rounded-full px-4 py-3 shadow-md hover:shadow-lg transform hover:scale-105"
              style={{ backgroundColor: '#D6DDEB' }}
            >
              <span className="text-lg font-semibold">
                {activeFilter === 'your-posts' ? 'Your Posts' : 'All'}
              </span>
              <ChevronDown 
                className={`w-5 h-5 transition-transform duration-200 ${
                  isFilterOpen ? 'rotate-180' : ''
                }`} 
              />
            </button>
          
            {isFilterOpen && (
              <div 
                className="absolute top-full left-0 mt-2 bg-white/90 backdrop-blur-md border border-white/50 rounded-lg shadow-2xl z-10 min-w-[120px]"
                role="menu"
                aria-orientation="vertical"
              >
                <button
                  onClick={() => handleFilterChange('your-posts')}
                  onKeyDown={handleKeyDown}
                  role="menuitem"
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:bg-gray-100 first:rounded-t-lg text-gray-800 ${
                    activeFilter === 'your-posts' ? 'bg-blue-100 text-blue-800' : ''
                  }`}
                >
                  Your Posts
                </button>
                <button
                  onClick={() => handleFilterChange('all')}
                  onKeyDown={handleKeyDown}
                  role="menuitem"
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:bg-gray-100 last:rounded-b-lg text-gray-800 ${
                    activeFilter === 'all' ? 'bg-blue-100 text-blue-800' : ''
                  }`}
                >
                  All
                </button>
              </div>
            )}
        </div>

          {/* New Post Button */}
          <button 
            onClick={() => setIsNewPostModalOpen(true)}
            className="group relative flex items-center space-x-3 px-6 py-4 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 shadow-md hover:shadow-lg transform hover:scale-105"
            style={{ backgroundColor: '#D6DDEB' }}
            aria-label="Create a new post"
          >
            <div className="w-6 h-6 rounded-full border-2 border-gray-800 flex items-center justify-center">
              <Plus className="w-4 h-4 text-gray-800 group-hover:rotate-90 transition-transform duration-300" />
            </div>
            <span className="font-medium text-gray-800 text-lg">New Post</span>
          </button>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {filteredPosts.slice(0, visiblePosts).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Show More Button */}
        {visiblePosts < filteredPosts.length && (
          <div className="text-center">
            <button
              onClick={handleLoadMore}
              className="group relative flex items-center space-x-2 mx-auto text-gray-800 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-transparent rounded-xl px-6 py-3 bg-white/40 backdrop-blur-md border border-white/50 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              aria-label={`Load ${Math.min(6, filteredPosts.length - visiblePosts)} more posts`}
            >
              <Eye className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span>Show More</span>
              <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        )}
      </div>
      
      {/* New Post Modal */}
      <NewPostModal
        isOpen={isNewPostModalOpen}
        onClose={() => setIsNewPostModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
}
