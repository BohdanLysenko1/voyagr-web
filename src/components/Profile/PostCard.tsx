'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, Eye, MapPin, ImageIcon } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

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
}

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  return (
    <div 
      className="relative overflow-hidden rounded-2xl group hover:scale-105 transition-transform duration-300"
      style={{ backgroundColor: '#D6DDEB' }}
    >
      {/* Additional Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200/20 to-indigo-200/15"></div>
      
      {/* Glass Morphism Overlay */}
      <div className="relative backdrop-blur-sm bg-white/20 border border-white/30 shadow-md transition-shadow duration-300">
        {/* Post Image */}
        <div className="relative h-48 w-full bg-white/10 flex items-center justify-center overflow-hidden">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm">
              <LoadingSpinner size="lg" className="text-gray-800" />
            </div>
          )}
          {imageError ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/20 to-white/10">
              <ImageIcon className="w-16 h-16 text-gray-600" />
            </div>
          ) : (
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-110 opacity-100"
              onError={handleImageError}
              onLoad={handleImageLoad}
              onLoadStart={() => setImageLoading(true)}
            />
          )}
          
          {/* Image Overlay for Better Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#5271FF]/40 via-transparent to-transparent opacity-0 transition-opacity duration-300"></div>
        </div>

        {/* Post Content */}
        <div className="p-5">
          {/* Title */}
          <h3 className="font-bold text-gray-800 mb-3 line-clamp-2 text-lg">
            {post.title}
          </h3>

          {/* Description */}
          <p className="text-gray-700 text-sm mb-4 line-clamp-3 leading-relaxed">
            {post.description}
          </p>

          {/* Location */}
          <div className="flex items-center text-gray-800 text-xs mb-4 bg-white/30 rounded-full px-3 py-1 w-fit backdrop-blur-sm">
            <MapPin className="w-3 h-3 mr-1 text-gray-700" />
            <span className="font-medium">{post.location}</span>
          </div>

          {/* Engagement Stats */}
          <div className="flex items-center justify-between text-sm text-gray-700 mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 transition-colors duration-200 cursor-pointer group/heart">
                <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 group-hover/heart:scale-110 transition-transform duration-200" />
                <span className="text-gray-600 text-xs ml-1">{post.likes}</span>
              </div>
              <div className="flex items-center space-x-1 transition-colors duration-200 cursor-pointer group/comment">
                <MessageCircle className="w-4 h-4 text-gray-600 hover:text-blue-500 group-hover/comment:scale-110 transition-transform duration-200" />
                <span className="text-gray-600 text-xs ml-1">{post.comments}</span>
              </div>
              <div className="flex items-center space-x-1 transition-colors duration-200 cursor-pointer group/view">
                <Eye className="w-4 h-4 text-gray-600 hover:text-green-500 group-hover/view:scale-110 transition-transform duration-200" />
                <span className="text-gray-600 text-xs ml-1">{post.views}</span>
              </div>
            </div>
          </div>

          {/* Published Date */}
          <div className="text-xs text-gray-700 font-medium bg-white/30 rounded-full px-3 py-1 w-fit backdrop-blur-sm">
            Published {post.publishedDate}
          </div>
        </div>
      </div>
    </div>
  );
}
