import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Leaf, Flower, TreePine, Sprout, MapPin, Heart, Droplets, Sun, Wind, Users, Eye } from 'lucide-react';

const PlantGossipNetwork = () => {
  const [plants, setPlants] = useState([]);
  const [gossipMessages, setGossipMessages] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [newGossip, setNewGossip] = useState('');
  const [activeTab, setActiveTab] = useState('garden');
  const [isTyping, setIsTyping] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(6);
  const chatEndRef = useRef(null);

  const plantDatabase = [
    {
      id: 1,
      name: 'Rosa',
      type: 'Rose',
      icon: Flower,
      color: 'text-pink-500',
      bgColor: 'bg-pink-100',
      borderColor: 'border-pink-300',
      location: 'Front Garden Bed',
      habitat: 'Well-drained soil, full sunlight',
      waterNeeds: 'Moderate - 2-3 times per week',
      sunlight: 'Full sun (6-8 hours daily)',
      season: 'Blooms spring through fall',
      personality: 'Elegant and dramatic',
      specialNeeds: 'Regular pruning, aphid watch',
      relationships: ['Sunny', 'Basilio'], // Plants they gossip about most
      gossipStyle: 'dramatic'
    },
    {
      id: 2,
      name: 'Oakley',
      type: 'Oak Tree',
      icon: TreePine,
      color: 'text-green-700',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-300',
      location: 'Backyard Corner',
      habitat: 'Deep soil, plenty of space',
      waterNeeds: 'Low - rain dependent',
      sunlight: 'Full to partial sun',
      season: 'Deciduous - colorful fall leaves',
      personality: 'Wise and protective',
      specialNeeds: 'Acorn cleanup, branch monitoring',
      relationships: ['Fernanda', 'Minty', 'Rosa'],
      gossipStyle: 'wise'
    },
    {
      id: 3,
      name: 'Basilio',
      type: 'Basil',
      icon: Leaf,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      location: 'Kitchen Herb Garden',
      habitat: 'Rich, moist soil',
      waterNeeds: 'High - daily watering',
      sunlight: 'Full sun preferred',
      season: 'Annual - harvest before frost',
      personality: 'Aromatic and helpful',
      specialNeeds: 'Pinch flowers, regular harvesting',
      relationships: ['Minty', 'Rosa', 'Sunny'],
      gossipStyle: 'helpful'
    },
    {
      id: 4,
      name: 'Sunny',
      type: 'Sunflower',
      icon: Flower,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-300',
      location: 'South-facing Wall',
      habitat: 'Any well-drained soil',
      waterNeeds: 'Moderate - drought tolerant',
      sunlight: 'Full sun essential',
      season: 'Summer bloomer',
      personality: 'Cheerful and optimistic',
      specialNeeds: 'Support for tall stems',
      relationships: ['Rosa', 'Basilio', 'Fernanda'],
      gossipStyle: 'cheerful'
    },
    {
      id: 5,
      name: 'Fernanda',
      type: 'Fern',
      icon: Sprout,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-100',
      borderColor: 'border-emerald-300',
      location: 'Shaded Patio',
      habitat: 'Humid, shaded areas',
      waterNeeds: 'High - keep soil moist',
      sunlight: 'Shade to partial shade',
      season: 'Evergreen - year round',
      personality: 'Mysterious and ancient',
      specialNeeds: 'High humidity, indirect light',
      relationships: ['Oakley', 'Minty', 'Sunny'],
      gossipStyle: 'mysterious'
    },
    {
      id: 6,
      name: 'Minty',
      type: 'Mint',
      icon: Leaf,
      color: 'text-teal-500',
      bgColor: 'bg-teal-100',
      borderColor: 'border-teal-300',
      location: 'Contained Herb Pot',
      habitat: 'Moist soil, spreads rapidly',
      waterNeeds: 'High - loves water',
      sunlight: 'Partial sun to shade',
      season: 'Perennial - harvest regularly',
      personality: 'Energetic and invasive',
      specialNeeds: 'Container planting, regular trimming',
      relationships: ['Basilio', 'Fernanda', 'Oakley'],
      gossipStyle: 'energetic'
    }
  ];

  const moods = ['happy', 'excited', 'content', 'chatty', 'sleepy', 'thirsty', 'sunny', 'gossipy'];
  
  // Enhanced gossip templates with plant-to-plant interactions
  const gossipTemplates = [
    // About other plants
    {
      template: "Have you seen how {target} has been showing off lately? Their {trait} is getting out of hand!",
      style: 'dramatic',
      traits: ['blooms', 'leaves', 'growth', 'fragrance', 'height']
    },
    {
      template: "I heard {target} complaining about the watering schedule again. Some plants are never satisfied!",
      style: 'gossipy',
      traits: []
    },
    {
      template: "{target} and I had the most delightful conversation about the morning dew yesterday.",
      style: 'cheerful',
      traits: []
    },
    {
      template: "Between you and me, I think {target} has been getting extra fertilizer. Look how vibrant they are!",
      style: 'mysterious',
      traits: []
    },
    {
      template: "I'm a bit worried about {target}. They seem to be drooping more than usual lately.",
      style: 'helpful',
      traits: []
    },
    {
      template: "Did you know {target} attracts the most beautiful butterflies? I'm quite envious actually.",
      style: 'wise',
      traits: []
    },
    {
      template: "{target} told me they're planning to spread their roots closer to the fountain. Bold move!",
      style: 'energetic',
      traits: []
    },
    // General garden gossip
    {
      template: "The gardener's been playing that classical music again. I think it's helping everyone grow!",
      style: 'any',
      traits: []
    },
    {
      template: "Those new wind chimes are absolutely lovely, don't you think?",
      style: 'any',
      traits: []
    },
    {
      template: "I spotted a family of ladybugs setting up home near the compost. How exciting!",
      style: 'any',
      traits: []
    }
  ];

  // Plant reactions to gossip
  const reactions = [
    "Oh my! Really?",
    "I had no idea!",
    "That's fascinating!",
    "How interesting...",
    "I've noticed that too!",
    "Well, I never!",
    "That explains a lot!",
    "Goodness gracious!",
    "How delightful!",
    "Oh dear...",
    "That's wonderful news!",
    "I'm not surprised!"
  ];

  useEffect(() => {
    // Initialize plants
    const initialPlants = plantDatabase.map(plant => ({
      ...plant,
      mood: moods[Math.floor(Math.random() * moods.length)],
      gossipCount: Math.floor(Math.random() * 3),
      lastActive: new Date().toLocaleTimeString(),
      healthStatus: 'healthy',
      isOnline: true,
      position: {
        x: Math.random() * 70 + 10,
        y: Math.random() * 60 + 20
      }
    }));
    
    setPlants(initialPlants);
    setSelectedPlant(initialPlants[0]);

    // Start gossip conversations
    const gossipInterval = setInterval(() => {
      generatePlantToPlantGossip(initialPlants);
    }, 5000);

    // Simulate plant reactions
    const reactionInterval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance of reaction
        generatePlantReaction(initialPlants);
      }
    }, 8000);

    // Update online status randomly
    const statusInterval = setInterval(() => {
      updatePlantStatus(initialPlants);
    }, 15000);

    return () => {
      clearInterval(gossipInterval);
      clearInterval(reactionInterval);
      clearInterval(statusInterval);
    };
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom of chat
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gossipMessages]);

  const generatePlantToPlantGossip = (currentPlants) => {
    const gossiper = currentPlants[Math.floor(Math.random() * currentPlants.length)];
    
    // Show typing indicator
    setIsTyping(gossiper.name);
    
    setTimeout(() => {
      setIsTyping(null);
      
      // Choose gossip style based on plant personality
      const availableTemplates = gossipTemplates.filter(
        t => t.style === gossiper.gossipStyle || t.style === 'any'
      );
      
      const template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
      let message = template.template;
      
      // If template mentions another plant, choose a target
      if (message.includes('{target}')) {
        const possibleTargets = gossiper.relationships.length > 0 
          ? gossiper.relationships 
          : currentPlants.filter(p => p.id !== gossiper.id).map(p => p.name);
        
        const target = possibleTargets[Math.floor(Math.random() * possibleTargets.length)];
        message = message.replace('{target}', target);
        
        if (message.includes('{trait}') && template.traits.length > 0) {
          const trait = template.traits[Math.floor(Math.random() * template.traits.length)];
          message = message.replace('{trait}', trait);
        }
      }

      const newMessage = {
        id: Date.now(),
        plantId: gossiper.id,
        plantName: gossiper.name,
        plantType: gossiper.type,
        message: message,
        timestamp: new Date().toLocaleTimeString(),
        likes: 0,
        color: gossiper.color,
        messageType: 'gossip',
        isAboutOtherPlant: message.includes('Rosa') || message.includes('Oakley') || 
                          message.includes('Basilio') || message.includes('Sunny') || 
                          message.includes('Fernanda') || message.includes('Minty')
      };

      setGossipMessages(prev => [newMessage, ...prev.slice(0, 49)]);
      
      // Update plant status
      setPlants(prev => prev.map(plant => 
        plant.id === gossiper.id 
          ? { 
              ...plant, 
              gossipCount: plant.gossipCount + 1, 
              mood: 'chatty',
              lastActive: new Date().toLocaleTimeString()
            }
          : plant
      ));

      // Reset mood after delay
      setTimeout(() => {
        setPlants(prev => prev.map(plant => 
          plant.id === gossiper.id 
            ? { ...plant, mood: moods[Math.floor(Math.random() * moods.length)] }
            : plant
        ));
      }, 4000);
    }, 1500 + Math.random() * 2000); // Simulate typing time
  };

  const generatePlantReaction = (currentPlants) => {
    if (gossipMessages.length === 0) return;
    
    const reactor = currentPlants[Math.floor(Math.random() * currentPlants.length)];
    const recentMessage = gossipMessages[Math.floor(Math.random() * Math.min(3, gossipMessages.length))];
    
    // Don't react to own messages
    if (recentMessage.plantId === reactor.id) return;
    
    const reaction = reactions[Math.floor(Math.random() * reactions.length)];
    
    const reactionMessage = {
      id: Date.now(),
      plantId: reactor.id,
      plantName: reactor.name,
      plantType: reactor.type,
      message: reaction,
      timestamp: new Date().toLocaleTimeString(),
      likes: 0,
      color: reactor.color,
      messageType: 'reaction',
      replyTo: recentMessage.plantName
    };

    setGossipMessages(prev => [reactionMessage, ...prev.slice(0, 49)]);
    
    setPlants(prev => prev.map(plant => 
      plant.id === reactor.id 
        ? { 
            ...plant, 
            gossipCount: plant.gossipCount + 1,
            lastActive: new Date().toLocaleTimeString()
          }
        : plant
    ));
  };

  const updatePlantStatus = (currentPlants) => {
    setPlants(prev => prev.map(plant => ({
      ...plant,
      isOnline: Math.random() > 0.1, // 90% chance to stay online
      mood: Math.random() > 0.7 ? moods[Math.floor(Math.random() * moods.length)] : plant.mood
    })));
    
    setOnlineUsers(Math.floor(Math.random() * 2) + 5); // 5-6 users online
  };

  const shareGossip = () => {
    if (!selectedPlant || !newGossip.trim()) return;

    const message = {
      id: Date.now(),
      plantId: selectedPlant.id,
      plantName: selectedPlant.name,
      plantType: selectedPlant.type,
      message: newGossip,
      timestamp: new Date().toLocaleTimeString(),
      likes: 0,
      color: selectedPlant.color,
      messageType: 'user',
      isUserMessage: true
    };

    setGossipMessages(prev => [message, ...prev.slice(0, 49)]);
    setPlants(prev => prev.map(plant => 
      plant.id === selectedPlant.id 
        ? { 
            ...plant, 
            gossipCount: plant.gossipCount + 1, 
            mood: 'excited',
            lastActive: new Date().toLocaleTimeString()
          }
        : plant
    ));

    setNewGossip('');
  };

  const likeGossip = (messageId) => {
    setGossipMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, likes: msg.likes + 1 } : msg
    ));
  };

  const getMoodEmoji = (mood) => {
    const moodMap = {
      happy: '😊',
      excited: '🤩', 
      content: '😌',
      chatty: '💬',
      sleepy: '😴',
      thirsty: '💧',
      sunny: '☀️',
      gossipy: '🗣️'
    };
    return moodMap[mood] || '🌱';
  };

  const getMessageTypeIcon = (messageType) => {
    switch (messageType) {
      case 'reaction': return '💭';
      case 'gossip': return '🗣️';
      case 'user': return '👤';
      default: return '💬';
    }
  };

  const TabButton = ({ id, label, icon: Icon, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
        active 
          ? 'bg-green-500 text-white shadow-md' 
          : 'bg-white text-gray-600 hover:bg-green-50 hover:text-green-600'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Plant Gossip Network</h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>{onlineUsers} plants online</span>
                  </div>
                  <span>•</span>
                  <span>Live conversations</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <TabButton
                id="garden"
                label="Garden"
                icon={TreePine}
                active={activeTab === 'garden'}
                onClick={setActiveTab}
              />
              <TabButton
                id="plants"
                label="Plant Profiles"
                icon={Flower}
                active={activeTab === 'plants'}
                onClick={setActiveTab}
              />
              <TabButton
                id="chat"
                label="Live Chat"
                icon={MessageCircle}
                active={activeTab === 'chat'}
                onClick={setActiveTab}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Garden View */}
        {activeTab === 'garden' && (
          <div className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Garden Visualization */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-green-500 to-blue-500 text-white">
                    <h2 className="text-xl font-semibold">Interactive Garden Map</h2>
                    <p className="text-green-100">Click plants to see their status and join conversations</p>
                  </div>
                  <div className="p-6 h-96 relative bg-gradient-to-br from-green-100 via-green-50 to-blue-100">
                    {plants.map((plant) => {
                      const IconComponent = plant.icon;
                      return (
                        <div
                          key={plant.id}
                          className="absolute cursor-pointer group"
                          style={{
                            left: `${plant.position.x}%`,
                            top: `${plant.position.y}%`
                          }}
                          onClick={() => setSelectedPlant(plant)}
                        >
                          <div className={`relative p-3 rounded-full ${plant.bgColor} ${
                            selectedPlant?.id === plant.id ? 'ring-4 ring-blue-400 scale-110' : ''
                          } shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105`}>
                            <IconComponent className={`w-6 h-6 ${plant.color}`} />
                            
                            {/* Online status indicator */}
                            <div className={`absolute -top-1 -left-1 w-3 h-3 rounded-full ${
                              plant.isOnline ? 'bg-green-400' : 'bg-gray-400'
                            } border-2 border-white`}></div>
                            
                            {/* Mood emoji */}
                            <div className="absolute -top-1 -right-1 text-lg">
                              {getMoodEmoji(plant.mood)}
                            </div>
                            
                            {/* Gossip count */}
                            {plant.gossipCount > 0 && (
                              <div className="absolute -bottom-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {plant.gossipCount}
                              </div>
                            )}
                            
                            {/* Typing indicator */}
                            {isTyping === plant.name && (
                              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                                <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap animate-pulse">
                                  typing...
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Hover tooltip */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                              {plant.name} - {plant.mood} {plant.isOnline ? '(online)' : '(away)'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Chat */}
                <div className="bg-white rounded-xl shadow-lg p-6 mt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Join the Conversation</h3>
                  {selectedPlant ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`p-2 rounded-full ${selectedPlant.bgColor} relative`}>
                          {React.createElement(selectedPlant.icon, { className: `w-5 h-5 ${selectedPlant.color}` })}
                          <div className={`absolute -top-1 -left-1 w-3 h-3 rounded-full ${
                            selectedPlant.isOnline ? 'bg-green-400' : 'bg-gray-400'
                          } border-2 border-white`}></div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">{selectedPlant.name}</span>
                          <span className="ml-2 text-sm text-gray-500">
                            {getMoodEmoji(selectedPlant.mood)} {selectedPlant.mood}
                          </span>
                          <span className="ml-2 text-xs text-gray-400">
                            {selectedPlant.isOnline ? 'online' : 'away'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newGossip}
                          onChange={(e) => setNewGossip(e.target.value)}
                          placeholder={`Share what ${selectedPlant.name} is thinking...`}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          onKeyPress={(e) => e.key === 'Enter' && shareGossip()}
                        />
                        <button
                          onClick={shareGossip}
                          disabled={!newGossip.trim()}
                          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">Select a plant from the garden to join their conversation!</p>
                  )}
                </div>
              </div>

              {/* Selected Plant Details & Live Feed */}
              <div className="space-y-4">
                {selectedPlant && (
                  <div className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 ${selectedPlant.borderColor}`}>
                    <div className={`p-4 ${selectedPlant.bgColor}`}>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {React.createElement(selectedPlant.icon, { className: `w-8 h-8 ${selectedPlant.color}` })}
                          <div className={`absolute -top-1 -left-1 w-3 h-3 rounded-full ${
                            selectedPlant.isOnline ? 'bg-green-400' : 'bg-gray-400'
                          } border-2 border-white`}></div>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{selectedPlant.name}</h3>
                          <p className="text-gray-600">{selectedPlant.type}</p>
                        </div>
                        <div className="ml-auto text-2xl">
                          {getMoodEmoji(selectedPlant.mood)}
                        </div>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Location</p>
                          <p className="text-sm text-gray-600">{selectedPlant.location}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Users className="w-4 h-4 text-purple-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Often chats with</p>
                          <p className="text-sm text-gray-600">{selectedPlant.relationships.join(', ')}</p>
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-sm font-medium text-gray-700 mb-1">Current Status</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className={`w-2 h-2 rounded-full ${selectedPlant.isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                          <span>{selectedPlant.isOnline ? 'Active in chat' : 'Away'}</span>
                          <span>• {selectedPlant.mood}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow p-4">
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Recent Activity
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {gossipMessages.slice(0, 4).map((msg) => (
                      <div key={msg.id} className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
                        <span className="font-medium">{msg.plantName}</span>: {msg.message.slice(0, 50)}...
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Plant Profiles View */}
        {activeTab === 'plants' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plants.map((plant) => (
              <div key={plant.id} className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 ${plant.borderColor} hover:shadow-xl transition-shadow`}>
                <div className={`p-4 ${plant.bgColor}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {React.createElement(plant.icon, { className: `w-6 h-6 ${plant.color}` })}
                        <div className={`absolute -top-1 -left-1 w-2 h-2 rounded-full ${
                          plant.isOnline ? 'bg-green-400' : 'bg-gray-400'
                        } border border-white`}></div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">{plant.name}</h3>
                    </div>
                    <div className="text-xl">{getMoodEmoji(plant.mood)}</div>
                  </div>
                  <p className="text-sm text-gray-600">{plant.type} • {plant.mood}</p>
                </div>
                
                <div className="p-4 space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Social Circle</h4>
                    <div className="flex flex-wrap gap-1">
                      {plant.relationships.map((friend) => (
                        <span key={friend} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {friend}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Habitat & Care</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-600">{plant.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Droplets className="w-3 h-3 text-blue-400" />
                        <span className="text-gray-600">{plant.waterNeeds}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sun className="w-3 h-3 text-yellow-400" />
                        <span className="text-gray-600">{plant.sunlight}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Growing Details</h4>
                    <p className="text-sm text-gray-600">{plant.habitat}</p>
                    <p className="text-sm text-gray-600 mt-1">{plant.season}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Special Care</h4>
                    <p className="text-sm text-gray-600">{plant.specialNeeds}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Personality</h4>
                    <p className="text-sm text-gray-600 italic">"{plant.personality}"</p>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Messages: {plant.gossipCount}</span>
                      <span className={`w-2 h-2 rounded-full ${plant.isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedPlant(plant);
                        setActiveTab('garden');
                      }}
                      className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors"
                    >
                      Chat with {plant.name}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Live Chat View */}
        {activeTab === 'chat' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Live Garden Chat</h2>
                    <p className="text-blue-100">Real-time plant conversations and gossip</p>
                  </div>
                  <div className="flex items-center gap-2 text-blue-100">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">{onlineUsers} online</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {/* Typing indicator */}
                {isTyping && (
                  <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span>{isTyping} is typing...</span>
                  </div>
                )}

                <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
                  {gossipMessages.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No messages yet... plants are being quiet!</p>
                      <p className="text-sm text-gray-400 mt-2">Wait a moment for the conversation to start, or go to Garden tab to share something</p>
                    </div>
                  ) : (
                    gossipMessages.map((message) => (
                      <div key={message.id} className={`flex gap-3 p-4 rounded-lg transition-colors ${
                        message.messageType === 'reaction' ? 'bg-blue-50 border-l-4 border-blue-200' :
                        message.isUserMessage ? 'bg-green-50 border-l-4 border-green-200' :
                        message.isAboutOtherPlant ? 'bg-yellow-50 border-l-4 border-yellow-200' :
                        'bg-gray-50'
                      }`}>
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-medium relative">
                            {message.plantName.charAt(0)}
                            {/* Online indicator */}
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">{message.plantName}</span>
                            <span className="text-xs text-gray-500">({message.plantType})</span>
                            <span className="text-sm">{getMessageTypeIcon(message.messageType)}</span>
                            {message.replyTo && (
                              <span className="text-xs text-blue-600">replying to {message.replyTo}</span>
                            )}
                            <span className="text-xs text-gray-400 ml-auto">{message.timestamp}</span>
                          </div>
                          <p className={`text-gray-700 mb-2 ${
                            message.messageType === 'reaction' ? 'font-medium text-blue-700' :
                            message.isAboutOtherPlant ? 'font-medium' : ''
                          }`}>
                            {message.message}
                          </p>
                          <button
                            onClick={() => likeGossip(message.id)}
                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            <Heart className={`w-4 h-4 ${message.likes > 0 ? 'fill-current text-red-500' : ''}`} />
                            {message.likes} {message.likes === 1 ? 'like' : 'likes'}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={chatEndRef} />
                </div>
                
                {/* Chat Stats */}
                <div className="border-t pt-4 mb-4">
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">{plants.filter(p => p.isOnline).length}</div>
                      <div className="text-xs text-gray-600">Online Now</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{gossipMessages.length}</div>
                      <div className="text-xs text-gray-600">Messages</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">
                        {gossipMessages.filter(m => m.isAboutOtherPlant).length}
                      </div>
                      <div className="text-xs text-gray-600">Plant Gossip</div>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="text-lg font-bold text-red-600">
                        {gossipMessages.reduce((sum, msg) => sum + msg.likes, 0)}
                      </div>
                      <div className="text-xs text-gray-600">Total Likes</div>
                    </div>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-700 mb-3">Quick Actions</h3>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => setActiveTab('garden')}
                      className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full hover:bg-green-200 transition-colors"
                    >
                      💬 Join Conversation
                    </button>
                    <button 
                      onClick={() => setActiveTab('plants')}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full hover:bg-blue-200 transition-colors"
                    >
                      🌱 View Plant Profiles
                    </button>
                    <button 
                      onClick={() => setGossipMessages([])}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                    >
                      🗑️ Clear Chat History
                    </button>
                    <button 
                      onClick={() => window.location.reload()}
                      className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full hover:bg-yellow-200 transition-colors"
                    >
                      🔄 Refresh Garden
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantGossipNetwork;