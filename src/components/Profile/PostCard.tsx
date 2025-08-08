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
    <div className="relative overflow-hidden rounded-2xl group transform hover:scale-105 transition-all duration-300">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-gray-800 to-black opacity-95"></div>
      
      {/* Glass Morphism Overlay */}
      <div className="relative backdrop-blur-sm bg-white/5 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
        {/* Post Image */}
        <div className="relative h-48 w-full bg-black/20 flex items-center justify-center overflow-hidden">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
              <LoadingSpinner size="lg" className="text-white" />
            </div>
          )}
          {imageError ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-600 to-gray-800">
              <ImageIcon className="w-16 h-16 text-white/60" />
            </div>
          ) : (
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-110 opacity-100"
              onError={handleImageError}
            />
          )}
          
          {/* Image Overlay for Better Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Post Content */}
        <div className="p-5">
          {/* Title */}
          <h3 className="font-bold text-white mb-3 line-clamp-2 text-lg drop-shadow-md">
            {post.title}
          </h3>

          {/* Description */}
          <p className="text-white/80 text-sm mb-4 line-clamp-3 leading-relaxed drop-shadow-sm">
            {post.description}
          </p>

          {/* Location */}
          <div className="flex items-center text-white/70 text-xs mb-4 bg-black/20 rounded-full px-3 py-1 w-fit backdrop-blur-sm">
            <MapPin className="w-3 h-3 mr-1" />
            <span className="font-medium">{post.location}</span>
          </div>

          {/* Engagement Stats */}
          <div className="flex items-center justify-between text-sm text-white/80 mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 hover:text-red-400 transition-colors duration-200 cursor-pointer group/heart">
                <Heart className="w-4 h-4 group-hover/heart:scale-110 transition-transform duration-200" />
                <span className="font-medium">{post.likes}</span>
              </div>
              <div className="flex items-center space-x-1 hover:text-blue-400 transition-colors duration-200 cursor-pointer group/comment">
                <MessageCircle className="w-4 h-4 group-hover/comment:scale-110 transition-transform duration-200" />
                <span className="font-medium">{post.comments}</span>
              </div>
              <div className="flex items-center space-x-1 hover:text-green-400 transition-colors duration-200 cursor-pointer group/view">
                <Eye className="w-4 h-4 group-hover/view:scale-110 transition-transform duration-200" />
                <span className="font-medium">{post.views}</span>
              </div>
            </div>
          </div>

          {/* Published Date */}
          <div className="text-xs text-white/60 font-medium bg-black/20 rounded-full px-3 py-1 w-fit backdrop-blur-sm">
            Published {post.publishedDate}
          </div>
        </div>
      </div>
    </div>
  );
}
