'use client';

import React, { useState, useRef, useMemo } from 'react';
import { X, Upload, MapPin, Tag, Search } from 'lucide-react';
import cities from 'cities.json';

interface City {
  name: string;
  country: string;
  subcountry?: string;
  geonameid?: number;
}

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (postData: NewPostData) => void;
}

interface NewPostData {
  title: string;
  description: string;
  location: string;
  image?: File;
  tags: string[];
  publishDate: string;
}

const NewPostModal: React.FC<NewPostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<NewPostData>({
    title: '',
    description: '',
    location: '',
    tags: [],
    publishDate: new Date().toISOString().split('T')[0],
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter cities based on search input
  const filteredLocations = useMemo(() => {
    if (!locationSearch || locationSearch.length < 2) {
      // Show popular destinations when no search or search too short
      const popularCities = [
        'Paris, France',
        'Tokyo, Japan', 
        'New York, USA',
        'London, England',
        'Rome, Italy',
        'Barcelona, Spain',
        'Amsterdam, Netherlands',
        'Sydney, Australia',
        'Dubai, UAE',
        'Bangkok, Thailand'
      ];
      return popularCities;
    }

    // Search through all cities
    const searchTerm = locationSearch.toLowerCase();
    const cityArray = Array.isArray(cities) ? cities as City[] : [];
    const matchingCities = cityArray
      .filter((city: City) => {
        const cityName = city.name.toLowerCase();
        const countryName = city.country.toLowerCase();
        const fullLocation = `${city.name}, ${city.country}`.toLowerCase();
        
        return cityName.includes(searchTerm) || 
               countryName.includes(searchTerm) ||
               fullLocation.includes(searchTerm);
      })
      .slice(0, 8) // Limit to 8 results for better UX
      .map((city: City) => `${city.name}, ${city.country}`);

    return matchingCities;
  }, [locationSearch]);

  const handleInputChange = (field: keyof NewPostData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationSearch = (value: string) => {
    setLocationSearch(value);
    setShowLocationSuggestions(value.length > 0);
  };

  const handleLocationSelect = (location: string) => {
    setFormData(prev => ({ ...prev, location }));
    setLocationSearch('');
    setShowLocationSuggestions(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form
      setFormData({
        title: '',
        description: '',
        location: '',
        tags: [],
        publishDate: new Date().toISOString().split('T')[0],
      });
      setImagePreview(null);
      setTagInput('');
      setLocationSearch('');
      setShowLocationSuggestions(false);
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ backgroundColor: '#D6DDEB' }}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200/50 backdrop-blur-sm bg-white/20">
          <h2 className="text-2xl font-bold text-gray-800">Create New Post</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 rounded-full hover:bg-white/30 transition-colors duration-200 disabled:opacity-50"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-800 mb-2">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Give your post a catchy title..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/70 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Share your travel story, experience, or tips..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/70 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 resize-none"
              required
            />
          </div>

          {/* Location Picker */}
          <div>
            <label htmlFor="location" className="block text-sm font-semibold text-gray-800 mb-2">
              Location
            </label>
            <div className="relative">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="location"
                  type="text"
                  value={formData.location || locationSearch}
                  onChange={(e) => {
                    if (formData.location) {
                      handleInputChange('location', e.target.value);
                    } else {
                      handleLocationSearch(e.target.value);
                    }
                  }}
                  onFocus={() => {
                    if (!formData.location) {
                      setShowLocationSuggestions(true);
                    }
                  }}
                  placeholder="Search for a location..."
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-300 bg-white/70 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
                {formData.location && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, location: '' }));
                      setLocationSearch('');
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {/* Location Suggestions */}
              {showLocationSuggestions && !formData.location && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                  {filteredLocations.length > 0 ? (
                    filteredLocations.map((location: string, index: number) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleLocationSelect(location)}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors duration-200 flex items-center space-x-3 first:rounded-t-xl last:rounded-b-xl"
                      >
                        <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="text-gray-800">{location}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500 text-sm">
                      No locations found. Type to search or enter custom location.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Photo
            </label>
            <div className="space-y-4">
              {imagePreview ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData(prev => ({ ...prev, image: undefined }));
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl bg-white/50 hover:bg-white/70 transition-colors duration-200 flex flex-col items-center justify-center space-y-2"
                >
                  <Upload className="w-8 h-8 text-gray-500" />
                  <span className="text-gray-600 font-medium">Click to upload photo</span>
                  <span className="text-gray-500 text-sm">PNG, JPG up to 10MB</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-semibold text-gray-800 mb-2">
              Tags
            </label>
            <div className="space-y-3">
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="tags"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Add tags (press Enter to add)"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-white/70 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                />
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-blue-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200/50">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl border border-gray-300 bg-white/70 text-gray-700 font-medium hover:bg-white/90 transition-colors duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <span>Publish Post</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPostModal;
