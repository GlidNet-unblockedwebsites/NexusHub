/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Gamepad2, 
  Search, 
  Filter, 
  X, 
  Maximize2, 
  ChevronLeft,
  Flame,
  Clock,
  Trophy,
  Star,
  RefreshCw,
  ExternalLink,
  Link2,
  Copy,
  Check,
  Settings,
  Shield,
  EyeOff,
  Heart,
  Dices,
  ExternalLink as OpenIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

interface Game {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  iframeUrl: string;
}

export default function App() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Game[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [key, setKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [cloakType, setCloakType] = useState('none');
  const [proxyType, setProxyType] = useState('proxy1');
  const [useProxyForGames, setUseProxyForGames] = useState(true);
  const [activeMirrorIndex, setActiveMirrorIndex] = useState(0);

  const proxyServers = {
    proxy1: 'https://ais-pre-3spwfgjcmbfgqotsoviizc-60560781262.us-east5.run.app/',
    proxy2: 'https://ais-pre-3spwfgjcmbfgqotsoviizc-60560781262.us-east5.run.app/',
    proxy3: 'https://ais-pre-3spwfgjcmbfgqotsoviizc-60560781262.us-east5.run.app/'
  };

  const [isBrowserOpen, setIsBrowserOpen] = useState(false);
  const [browserUrl, setBrowserUrl] = useState('');
  const [activeBrowserUrl, setActiveBrowserUrl] = useState('');

  const cloaks: Record<string, { title: string, icon: string }> = {
    none: { title: 'Nexus Hub', icon: 'https://cdn-icons-png.flaticon.com/512/686/686589.png' },
    google: { title: 'Google', icon: 'https://www.google.com/favicon.ico' },
    drive: { title: 'My Drive - Google Drive', icon: 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png' },
    classroom: { title: 'Classes', icon: 'https://www.gstatic.com/classroom/favicon.png' },
    canvas: { title: 'Dashboard', icon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico' }
  };

  const applyCloak = (type: string) => {
    setCloakType(type);
    const cloak = cloaks[type];
    document.title = cloak.title;
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = cloak.icon;
    document.getElementsByTagName('head')[0].appendChild(link);
  };

  const openAboutBlank = () => {
    const win = window.open('about:blank', '_blank');
    if (!win) return;
    const iframe = win.document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.margin = '0';
    iframe.style.padding = '0';
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.src = window.location.href;
    win.document.body.appendChild(iframe);
    win.document.body.style.margin = '0';
    win.document.body.style.padding = '0';
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText('https://ais-pre-3spwfgjcmbfgqotsoviizc-60560781262.us-east5.run.app/');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reloadGame = () => setKey(prev => prev + 1);

  const playRandomGame = () => {
    const randomIndex = Math.floor(Math.random() * gamesData.length);
    const randomGame = gamesData[randomIndex];
    setSelectedGame(randomGame);
    addToRecentlyPlayed(randomGame);
    setActiveMirrorIndex(0);
  };

  useEffect(() => {
    const saved = localStorage.getItem('recentlyPlayed');
    if (saved) {
      try {
        setRecentlyPlayed(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recently played games', e);
      }
    }

    const savedRatings = localStorage.getItem('userRatings');
    if (savedRatings) {
      try {
        setUserRatings(JSON.parse(savedRatings));
      } catch (e) {
        console.error('Failed to parse user ratings', e);
      }
    }

    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error('Failed to parse wishlist', e);
      }
    }
  }, []);

  const toggleWishlist = (gameId: string) => {
    setWishlist(prev => {
      const newWishlist = prev.includes(gameId)
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId];
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const handleRate = (gameId: string, rating: number) => {
    setUserRatings(prev => {
      const newRatings = { ...prev, [gameId]: rating };
      localStorage.setItem('userRatings', JSON.stringify(newRatings));
      return newRatings;
    });
  };

  const addToRecentlyPlayed = (game: Game) => {
    if (game.id === 'browser') return;
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(g => g.id !== game.id);
      return [game, ...filtered].slice(0, 5);
    });
  };

  useEffect(() => {
    if (recentlyPlayed.length > 0) {
      localStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
    }
  }, [recentlyPlayed]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const categories = useMemo(() => {
    const cats = ['All', 'Wishlist', ...new Set(gamesData.map(g => g.category))];
    return cats;
  }, []);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' 
        || (activeCategory === 'Wishlist' && wishlist.includes(game.id))
        || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, wishlist]);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleProxySearch = (url: string) => {
    let targetUrl = url.trim();
    if (!targetUrl.startsWith('http')) {
      targetUrl = 'https://' + targetUrl;
    }
    const proxyUrl = `${proxyServers[proxyType as keyof typeof proxyServers]}${targetUrl}`;
    setSelectedGame({
      id: 'browser',
      title: url,
      category: 'Browser',
      thumbnail: '',
      iframeUrl: proxyUrl
    });
  };

  const getProxiedUrl = (url: string) => {
    if (!url) return '';
    // If it's already a proxied URL, return it
    if (url.includes('.sciencetools.cc')) return url;
    // Don't proxy local files
    if (url.startsWith('/') || url.startsWith('./')) return url;
    
    return `${proxyServers[proxyType as keyof typeof proxyServers]}${url}`;
  };

  const activeIframeUrl = useMemo(() => {
    if (!selectedGame) return '';
    if (selectedGame.id === 'browser') return selectedGame.iframeUrl;
    
    // Handle mirrors
    const mirrors = (selectedGame as any).mirrors || [];
    const baseUrl = activeMirrorIndex === 0 ? selectedGame.iframeUrl : mirrors[activeMirrorIndex - 1];
    
    return useProxyForGames ? getProxiedUrl(baseUrl) : baseUrl;
  }, [selectedGame, useProxyForGames, proxyType, activeMirrorIndex]);

  const cycleUnblocker = () => {
    const mirrors = (selectedGame as any).mirrors || [];
    const totalMirrors = mirrors.length + 1;

    if (activeMirrorIndex < totalMirrors - 1) {
      // Try next mirror first
      setActiveMirrorIndex(prev => prev + 1);
    } else {
      // Reset mirror and cycle proxy
      setActiveMirrorIndex(0);
      if (!useProxyForGames) {
        setUseProxyForGames(true);
        setProxyType('proxy1');
      } else if (proxyType === 'proxy1') {
        setProxyType('proxy2');
      } else if (proxyType === 'proxy2') {
        setProxyType('proxy3');
      } else {
        setUseProxyForGames(false);
      }
    }
    setKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-panel border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => {
              setSelectedGame(null);
              setActiveCategory('All');
              setSearchInput('');
              setSearchQuery('');
            }}
          >
            <div className="p-2 bg-brand-primary rounded-lg group-hover:rotate-12 transition-transform">
              <Gamepad2 className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-2xl font-bold tracking-tighter">
              NEXUS<span className="text-brand-primary">HUB</span>
              <span className="text-[10px] ml-1 text-white/20 font-medium uppercase tracking-[0.2em] hidden sm:inline">.ORG</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 max-w-xl w-full relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button 
                onClick={playRandomGame}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-brand-primary"
                title="Random Game"
              >
                <Dices className="w-5 h-5" />
              </button>
              <div className="h-6 w-px bg-white/10 mx-1" />
              <button 
                onClick={copyToClipboard}
                className="p-2 bg-brand-primary/10 border border-brand-primary/20 rounded-full text-brand-primary hover:bg-brand-primary hover:text-black transition-all"
                title="Copy Link"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-sm font-medium">
            <button 
              onClick={playRandomGame}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-white/60 hover:text-brand-primary"
              title="Play a Random Game"
            >
              <Dices className="w-4 h-4" />
              Random
            </button>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-white/60 hover:text-brand-primary"
              title="Settings & Cloaking"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button 
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 bg-brand-primary/10 hover:bg-brand-primary/20 border border-brand-primary/20 rounded-xl transition-all text-brand-primary"
              title="Copy Site URL"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        <AnimatePresence mode="wait">
          {!selectedGame ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              {/* Hero Banner */}
              <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden group">
                <img 
                  src="https://picsum.photos/seed/gaming-banner/1200/400" 
                  alt="Featured"
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 space-y-2">
                  <div className="flex items-center gap-2 text-brand-primary text-sm font-bold uppercase tracking-widest">
                    <Flame className="w-4 h-4" />
                    Featured Game
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold">Slope Unleashed</h2>
                  <p className="text-white/60 max-w-md">Experience the ultimate speed challenge in this neon-soaked endless runner.</p>
                  <button 
                    onClick={() => {
                      setSelectedGame(gamesData[0]);
                      addToRecentlyPlayed(gamesData[0]);
                      setActiveMirrorIndex(0);
                    }}
                    className="mt-4 px-8 py-3 bg-brand-primary text-black font-bold rounded-full hover:bg-white transition-colors"
                  >
                    Play Now
                  </button>
                </div>
              </div>

              {/* URL Unblocker */}
              <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-primary/20 to-purple-500/10 border border-white/10 p-8 md:p-12">
                <div className="relative z-10 max-w-2xl">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                    The Web, <span className="text-brand-primary">Unblocked.</span>
                  </h2>
                  <p className="text-white/60 mb-8 text-lg">
                    Type any URL below to browse securely and bypass filters.
                  </p>
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleProxySearch(browserUrl);
                    }}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <div className="flex-1 relative">
                      <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input 
                        type="text"
                        placeholder="Enter URL (e.g. tiktok.com)"
                        value={browserUrl}
                        onChange={(e) => setBrowserUrl(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-brand-primary/50 transition-all text-lg"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="px-8 py-4 bg-brand-primary text-black font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <Shield className="w-5 h-5" />
                      Go Unblocked
                    </button>
                  </form>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <span className="text-xs font-bold text-white/20 uppercase tracking-widest self-center mr-2">Quick Access:</span>
                    {[
                      { name: 'TikTok', url: 'tiktok.com' },
                      { name: 'Discord', url: 'discord.com' },
                      { name: 'Instagram', url: 'instagram.com' },
                      { name: 'YouTube', url: 'youtube.com' }
                    ].map(app => (
                      <button
                        key={app.name}
                        onClick={() => {
                          setBrowserUrl(app.url);
                          handleProxySearch(app.url);
                        }}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium text-white/60 hover:text-brand-primary transition-all"
                      >
                        {app.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 opacity-10 pointer-events-none">
                  <Shield className="w-96 h-96 text-brand-primary" />
                </div>
              </div>

              {/* Recently Played */}
              {recentlyPlayed.length > 0 && searchQuery === '' && activeCategory === 'All' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xl font-bold">
                      <Clock className="w-5 h-5 text-brand-primary" />
                      Recently Played
                    </div>
                    <button 
                      onClick={() => {
                        setRecentlyPlayed([]);
                        localStorage.removeItem('recentlyPlayed');
                      }}
                      className="text-xs text-white/20 hover:text-white/40 transition-colors"
                    >
                      Clear History
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {recentlyPlayed.map((game) => (
                      <motion.div
                        key={`recent-${game.id}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => {
                          setSelectedGame(game);
                          addToRecentlyPlayed(game);
                          setActiveMirrorIndex(0);
                        }}
                        className="group cursor-pointer"
                      >
                        <div className="relative aspect-video rounded-xl overflow-hidden mb-2 border border-white/10">
                          <img 
                            src={game.thumbnail} 
                            alt={game.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Gamepad2 className="w-5 h-5 text-brand-primary" />
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWishlist(game.id);
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 hover:bg-brand-primary hover:text-black transition-all"
                          >
                            <Heart className={`w-3 h-3 ${wishlist.includes(game.id) ? 'fill-current text-brand-primary group-hover:text-black' : 'text-white/60'}`} />
                          </button>
                        </div>
                        <h4 className="font-bold text-xs truncate group-hover:text-brand-primary transition-colors">{game.title}</h4>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRate(game.id, star);
                              }}
                              className="focus:outline-none"
                            >
                              <Star 
                                className={`w-2.5 h-2.5 transition-colors ${
                                  star <= (userRatings[game.id] || 0)
                                    ? 'text-yellow-500 fill-yellow-500' 
                                    : 'text-white/10 hover:text-yellow-500/50'
                                }`} 
                              />
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Filter */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                <Filter className="w-4 h-4 text-white/40 shrink-0" />
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      activeCategory === cat 
                        ? 'bg-brand-primary text-black' 
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Games Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGames.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      setSelectedGame(game);
                      addToRecentlyPlayed(game);
                      setActiveMirrorIndex(0);
                    }}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3 border border-white/10 game-card-hover">
                      <img 
                        src={game.thumbnail} 
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center text-black">
                          <Gamepad2 className="w-6 h-6" />
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(game.id);
                        }}
                        className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 hover:bg-brand-primary hover:text-black transition-all z-10"
                      >
                        <Heart className={`w-4 h-4 ${wishlist.includes(game.id) ? 'fill-current text-brand-primary group-hover:text-black' : 'text-white/60'}`} />
                      </button>
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-black/60 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider rounded border border-white/10">
                          {game.category}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg group-hover:text-brand-primary transition-colors">{game.title}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRate(game.id, star);
                            }}
                            className="focus:outline-none group/star"
                          >
                            <Star 
                              className={`w-3 h-3 transition-all ${
                                star <= (userRatings[game.id] || 0)
                                  ? 'text-yellow-500 fill-yellow-500 scale-110' 
                                  : 'text-white/10 group-hover/star:text-yellow-500/50'
                              }`} 
                            />
                          </button>
                        ))}
                        {userRatings[game.id] && (
                          <span className="text-[10px] text-yellow-500/60 ml-1 font-bold">{userRatings[game.id]}.0</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-white/20 uppercase tracking-tighter font-bold">
                        <Clock className="w-2.5 h-2.5" />
                        Just Added
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredGames.length === 0 && (
                <div className="text-center py-20">
                  <div className="inline-block p-4 bg-white/5 rounded-full mb-4">
                    <Search className="w-8 h-8 text-white/20" />
                  </div>
                  <h3 className="text-xl font-medium text-white/60">No games found matching your search</h3>
                  <button 
                    onClick={() => {setSearchQuery(''); setActiveCategory('All');}}
                    className="mt-4 text-brand-primary hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`flex flex-col gap-6 ${isFullScreen ? 'fixed inset-0 z-50 bg-[#0a0a0a] p-0' : ''}`}
            >
              {/* Player Header */}
              <div className={`flex items-center justify-between ${isFullScreen ? 'p-4 glass-panel' : ''}`}>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedGame(null)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedGame.title}</h2>
                    <p className="text-sm text-white/40">{selectedGame.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Mirror Switcher */}
                  {(selectedGame as any).mirrors && (selectedGame as any).mirrors.length > 0 && (
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-3 py-1 mr-2">
                      <RefreshCw className="w-3 h-3 text-brand-primary mr-2" />
                      <select 
                        value={activeMirrorIndex}
                        onChange={(e) => {
                          setActiveMirrorIndex(parseInt(e.target.value));
                          setKey(prev => prev + 1);
                        }}
                        className="bg-transparent text-[10px] font-bold uppercase tracking-wider focus:outline-none cursor-pointer text-white/60 hover:text-white"
                      >
                        <option value={0} className="bg-[#111]">Mirror 1</option>
                        {(selectedGame as any).mirrors.map((_: any, i: number) => (
                          <option key={i} value={i + 1} className="bg-[#111]">Mirror {i + 2}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-3 py-1 mr-2">
                    <button
                      onClick={() => setUseProxyForGames(!useProxyForGames)}
                      className={`flex items-center gap-2 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                        useProxyForGames ? 'text-brand-primary' : 'text-white/20'
                      }`}
                      title="Toggle Proxy for this game"
                    >
                      <Shield className="w-3 h-3" />
                      Proxy: {useProxyForGames ? 'ON' : 'OFF'}
                    </button>
                    <div className="w-px h-3 bg-white/10 mx-2" />
                    <select 
                      value={proxyType}
                      onChange={(e) => {
                        setProxyType(e.target.value);
                        setKey(prev => prev + 1); // Force reload on proxy change
                      }}
                      className="bg-transparent text-[10px] font-bold uppercase tracking-wider focus:outline-none cursor-pointer text-white/60 hover:text-white"
                    >
                      <option value="proxy1" className="bg-[#111]">P1</option>
                      <option value="proxy2" className="bg-[#111]">P2</option>
                      <option value="proxy3" className="bg-[#111]">P3</option>
                    </select>
                  </div>
                  <button 
                    onClick={() => {
                      const win = window.open('about:blank', '_blank');
                      if (win) {
                        const iframe = win.document.createElement('iframe');
                        iframe.style.width = '100%';
                        iframe.style.height = '100%';
                        iframe.style.border = 'none';
                        iframe.style.margin = '0';
                        iframe.src = activeIframeUrl;
                        win.document.body.appendChild(iframe);
                        win.document.body.style.margin = '0';
                      }
                    }}
                    className="p-2 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-black rounded-full transition-all"
                    title="Force Unblock (Cloaked)"
                  >
                    <Shield className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={reloadGame}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    title="Reload Game"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => window.open(activeIframeUrl, '_blank')}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    title="Open in New Tab"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={toggleFullScreen}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    title="Toggle Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setSelectedGame(null)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Iframe Container */}
              <div className={`relative flex-1 bg-black rounded-3xl overflow-hidden border border-white/10 ${isFullScreen ? 'rounded-none border-none' : 'aspect-video'}`}>
                <iframe
                  key={key}
                  src={activeIframeUrl}
                  className="w-full h-full border-none"
                  allow="autoplay; gamepad; fullscreen; keyboard; focus-without-user-activation"
                  allowFullScreen
                  title={selectedGame.title}
                />
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
                  <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-[10px] text-white/40 flex items-center gap-2">
                    <Shield className="w-3 h-3 text-brand-primary" />
                    If the screen is blank, try switching "Proxy" or "Mirror" in the top right.
                  </div>
                  <div className="flex gap-2 pointer-events-auto">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        cycleUnblocker();
                      }}
                      className="px-4 py-2 bg-brand-primary text-black text-[10px] font-bold uppercase tracking-wider rounded-full hover:scale-105 transition-all flex items-center gap-2"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Auto-Troubleshoot
                    </button>
                  </div>
                </div>
              </div>

              {/* Game Info & Recommendations */}
              {!isFullScreen && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="glass-panel rounded-3xl p-6 space-y-4">
                      <h3 className="text-xl font-bold">About the Game</h3>
                      <p className="text-white/60 leading-relaxed">
                        Enjoy {selectedGame.title}, one of the most popular {selectedGame.category.toLowerCase()} games in our collection. 
                        This version is optimized for web play and works on most modern browsers. 
                        No downloads or installations required!
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {['Unblocked', 'Web', 'Free', selectedGame.category].map(tag => (
                          <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-xs font-medium text-white/40">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-brand-primary" />
                      More Like This
                    </h3>
                    <div className="space-y-4">
                      {gamesData
                        .filter(g => g.id !== selectedGame.id && g.category === selectedGame.category)
                        .slice(0, 3)
                        .map(game => (
                          <div 
                            key={game.id}
                            onClick={() => {
                              setSelectedGame(game);
                              setActiveMirrorIndex(0);
                            }}
                            className="flex gap-4 p-2 rounded-2xl hover:bg-white/5 cursor-pointer transition-colors group"
                          >
                            <img 
                              src={game.thumbnail} 
                              alt={game.title}
                              className="w-20 h-20 object-cover rounded-xl border border-white/10"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex flex-col justify-center">
                              <h4 className="font-bold group-hover:text-brand-primary transition-colors">{game.title}</h4>
                              <p className="text-xs text-white/40">{game.category}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-[#111] border border-white/10 rounded-3xl p-8 space-y-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-primary/10 rounded-xl">
                    <Shield className="w-6 h-6 text-brand-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Settings</h2>
                </div>
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-white/40" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-white/40 uppercase tracking-widest">
                    <EyeOff className="w-4 h-4" />
                    Tab Cloaking
                  </div>
                  <p className="text-sm text-white/40">Change the tab title and icon to hide the site from filters.</p>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(cloaks).map(([key, cloak]) => (
                      <button
                        key={key}
                        onClick={() => applyCloak(key)}
                        className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${
                          cloakType === key 
                            ? 'bg-brand-primary/10 border-brand-primary text-brand-primary' 
                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        <img src={cloak.icon} alt="" className="w-5 h-5 rounded-sm" referrerPolicy="no-referrer" />
                        <span className="text-sm font-medium truncate">{cloak.title.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm font-bold text-white/40 uppercase tracking-widest">
                    <Shield className="w-4 h-4" />
                    Advanced Unblocking
                  </div>
                  <button
                    onClick={openAboutBlank}
                    className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <OpenIcon className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold">Open in About:Blank</div>
                        <div className="text-xs text-white/40">Hides URL from history & filters</div>
                      </div>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-white/20 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm font-bold text-white/40 uppercase tracking-widest">
                    <Link2 className="w-4 h-4" />
                    IONOS Domain Setup
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                    <div className="text-sm font-bold text-white">How to connect nexus-hub.org:</div>
                    <div className="space-y-2">
                      <p className="text-xs text-white/40 leading-relaxed">
                        1. Log in to <span className="text-white">IONOS Control Center</span>.<br/>
                        2. Go to <span className="text-white">Domains & SSL</span> and select <span className="text-white">nexus-hub.org</span>.<br/>
                        3. Select <span className="text-white">Domain Forwarding</span> (Redirect).<br/>
                        4. Choose <span className="text-white">HTTP Redirect</span> and paste the link below:
                      </p>
                      <div className="p-2 bg-black/40 rounded-lg border border-white/5">
                        <span className="text-brand-primary break-all font-mono text-[10px] block">https://ais-pre-3spwfgjcmbfgqotsoviizc-60560781262.us-east5.run.app/</span>
                      </div>
                      <p className="text-[10px] text-white/20 italic">
                        * Note: It may take up to 48 hours for the domain to start working everywhere.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <button 
                    onClick={() => setIsSettingsOpen(false)}
                    className="w-full py-4 bg-brand-primary text-black font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-12 border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-brand-primary rounded-lg">
                <Gamepad2 className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold tracking-tighter">NEXUS<span className="text-brand-primary">HUB</span></span>
            </div>
            <p className="text-white/40 max-w-sm text-sm">
              The ultimate destination for unblocked web games and apps. Play your favorite titles anywhere, anytime, for free.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-white/60">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white/40">
              <li><button className="hover:text-brand-primary transition-colors">All Games</button></li>
              <li><button className="hover:text-brand-primary transition-colors">Categories</button></li>
              <li><button className="hover:text-brand-primary transition-colors">About Us</button></li>
              <li><button className="hover:text-brand-primary transition-colors">Contact</button></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-white/60">Community</h4>
            <ul className="space-y-2 text-sm text-white/40">
              <li><button className="hover:text-brand-primary transition-colors">Discord</button></li>
              <li><button className="hover:text-brand-primary transition-colors">Twitter</button></li>
              <li><button className="hover:text-brand-primary transition-colors">Submit a Game</button></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/20">
          <p>© 2026 Nexus Hub. All rights reserved.</p>
          <div className="flex gap-6">
            <button className="hover:text-white transition-colors">Privacy Policy</button>
            <button className="hover:text-white transition-colors">Terms of Service</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
