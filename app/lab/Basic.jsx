"use client";

import { useState } from "react";
import ImageInput from "./ImageInput";

export default function Basic({
  name,
  setName,
  description,
  setDescription,
  coverImage,
  setCoverImage,
}) {
  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-black text-white">Bot Configuration</h2>
        <p className="text-white/70 text-lg">
          Set up your trading bot's identity and basic settings
        </p>
      </div>

      <div className="space-y-8">
        {/* Bot Name Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <span className="text-orange-400 text-sm">🤖</span>
            </div>
            <h3 className="text-xl font-bold text-white">Bot Name</h3>
          </div>

          <p className="text-white/60 pl-11">
            Choose a memorable name for your trading bot
          </p>

          <div className="pl-11">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-400/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your bot name (e.g., 'Alpha Trader Pro')"
                className="relative w-full px-6 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/50 text-lg font-medium focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm hover:border-white/30 hover:bg-white/8"
              />

              {name && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {name && (
              <div className="mt-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                <p className="text-orange-400 text-sm">
                  ✨ Great choice! Your bot will be known as "{name}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bot Description Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <span className="text-orange-400 text-sm">📝</span>
            </div>
            <h3 className="text-xl font-bold text-white">Description</h3>
          </div>

          <p className="text-white/60 pl-11">
            Describe your bot's trading strategy and purpose
          </p>

          <div className="pl-11">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-400/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your bot's strategy, goals, and trading approach..."
                rows={4}
                className="relative w-full px-6 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/50 text-lg font-medium focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm hover:border-white/30 hover:bg-white/8 resize-none"
              />

              <div className="absolute bottom-4 right-4 text-white/40 text-sm">
                {description?.length || 0}/500
              </div>
            </div>

            {description && (
              <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-blue-400 text-sm">
                  📊 Good description! This helps track your bot's performance
                  and strategy.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bot Avatar Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <span className="text-orange-400 text-sm">🎨</span>
            </div>
            <h3 className="text-xl font-bold text-white">Bot Avatar</h3>
          </div>

          <p className="text-white/60 pl-11">
            Upload a custom image or choose from our gallery
          </p>

          <div className="pl-11">
            <ImageInput coverImage={coverImage} setCoverImage={setCoverImage} />
          </div>
        </div>

        {/* Configuration Summary */}
        {(name || description || coverImage) && (
          <div className="mt-10">
            <div className="p-6 bg-gradient-to-br from-orange-500/10 to-yellow-400/10 border border-orange-500/20 rounded-2xl">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center mt-1">
                  <span className="text-orange-400">📋</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white mb-4">Bot Preview</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Bot Info */}
                    <div className="space-y-3">
                      <div>
                        <span className="text-white/60 text-sm">Bot Name:</span>
                        <p className="text-white font-medium">
                          {name || "Not set"}
                        </p>
                      </div>

                      {description && (
                        <div>
                          <span className="text-white/60 text-sm">
                            Description:
                          </span>
                          <p className="text-white/80 text-sm mt-1 line-clamp-3">
                            {description}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Bot Avatar Preview */}
                    <div className="flex justify-center md:justify-end">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/10 border border-white/20 flex items-center justify-center">
                        {coverImage ? (
                          <img
                            src={coverImage}
                            alt="Bot Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white/60 text-2xl">🤖</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pro Tips */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mt-1">
              <span className="text-blue-400 text-sm">💡</span>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">Pro Tips</h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="text-orange-400 mt-1">•</span>
                  <span>
                    Choose descriptive names like "Scalper Pro" or "Long Term
                    Growth"
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-orange-400 mt-1">•</span>
                  <span>
                    Document your strategy in the description for future
                    reference
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-orange-400 mt-1">•</span>
                  <span>
                    Custom avatars help you quickly identify bots in your
                    dashboard
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
