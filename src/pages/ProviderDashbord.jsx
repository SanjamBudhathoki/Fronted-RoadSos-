import React, { useState, useEffect, useCallback } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { sosService } from '../services/sosService';
import { authService } from '../services/authService';
import { MapPin, Navigation, Clock, AlertTriangle, Users, Radio, CheckCircle2, ArrowRight, Phone, Car, Map, Timer, ChevronDown } from 'lucide-react';
import socket from '../services/socket';
import { calculateDistance } from '../services/distanceCalculator';

const severityColors = {
  LOW: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',
  HIGH: 'bg-orange-50 text-orange-700 border-orange-200',
  CRITICAL: 'bg-red-50 text-red-700 border-red-200',
};


const ProviderDashboard = () => {
  const [nearbySos, setNearbySos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [availability, setAvailability] = useState(true);
  const [activeMission, setActiveMission] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [missionStartTime, setMissionStartTime] = useState(null);
  const [missionElapsed, setMissionElapsed] = useState(0);
  const [journeyStartedAt, setJourneyStartedAt] = useState(null);

  console.log("Mission Status:", activeMission?.status);

  const fetchNearbySos = useCallback(async () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          setCurrentLocation({ latitude, longitude });

          const response = await sosService.getNearbySos({ latitude, longitude });
          const sosList = response?.data?.data || [];
          setNearbySos(sosList);
        } catch (err) {
          console.error(err);
          setError('Failed to fetch nearby emergencies.');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Location permission denied.');
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  const handleNewSOS = useCallback((newSos) => {
    setNearbySos((prev) => {
      const exists = prev.some((item) => item._id === newSos._id);
      return exists ? prev : [newSos, ...prev];
    });
  }, []);

  // Initial setup
  useEffect(() => {
    fetchNearbySos();

    const onAccepted = ({ sosId }) => {
      setNearbySos((prev) => prev.filter((item) => item._id !== sosId));
    };

    const onCompleted = ({ sosId }) => {
      setActiveMission((current) => (current?._id === sosId ? null : current));
    };

    const onAutoDispatched = ({ sos, message }) => {
  // Treat it exactly like a manually accepted mission
  const fullMission = {
    ...sos,
    status: "ACCEPTED",
  };
  setActiveMission(fullMission);
  setMissionStartTime(sos.acceptedAt
    ? new Date(sos.acceptedAt).getTime()
    : Date.now()
  );
  // Optional: show a toast/alert so provider knows
  alert(`🚨 Auto-Dispatched: ${message}`);
    };


    socket.on('sos:new', handleNewSOS);
    socket.on('sos:accepted', onAccepted);
    socket.on('sos:completed', onCompleted);
    socket.on("sos:auto-dispatched", onAutoDispatched);

    return () => {
      socket.off('sos:new', handleNewSOS);
      socket.off('sos:accepted', onAccepted);
      socket.off('sos:completed', onCompleted);
      socket.off("sos:auto-dispatched", onAutoDispatched);
    };
  }, [fetchNearbySos, handleNewSOS]);

  // Load provider profile
  useEffect(() => {
    const loadProviderStatus = async () => {
      try {
        const response = await authService.getProfile();
        const profile = response?.data?.data || response?.data || response;
        if (typeof profile?.isAvailable === 'boolean') {
          setAvailability(profile.isAvailable);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadProviderStatus();
  }, []);

  // GPS watch
  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      console.error,
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Auto-refresh nearby SOS
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNearbySos();
    }, 15000);
    return () => clearInterval(interval);
  }, [fetchNearbySos]);

  // Load active mission on mount
  useEffect(() => {
    const loadActiveMission = async () => {
      try {
        const response = await sosService.getActiveMission();
        if (response?.data) {
          setActiveMission(response.data);
          if (response.data.acceptedAt) {
            setMissionStartTime(new Date(response.data.acceptedAt).getTime());
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    loadActiveMission();
  }, []);

  // Mission timer
  useEffect(() => {
    if (!missionStartTime) return;
    const timer = setInterval(() => {
      setMissionElapsed(Math.floor((Date.now() - missionStartTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [missionStartTime]);

  // Send location immediately when mission is active
  useEffect(() => {
    if (!activeMission || !currentLocation) {
      console.log("⏸️ Not sending location - missing:", {
        hasMission: !!activeMission,
        hasLocation: !!currentLocation,
        missionStatus: activeMission?.status
      });
      return;
    }

    const shouldSendLocation = ["ACCEPTED", "ON_THE_WAY", "ARRIVED"].includes(activeMission.status);

    if (!shouldSendLocation) {
      console.log("⏸️ Mission not in active status:", activeMission.status);
      return;
    }

    const payload = {
      sosId: activeMission._id,
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
    };

    console.log("📍 Sending Provider Location:", payload);
    socket.emit("provider:location-update", payload);

  }, [currentLocation, activeMission]);

  // Continuous location updates every 5 seconds when ON_THE_WAY
  useEffect(() => {
    if (!activeMission || !currentLocation) return;
    if (activeMission.status !== "ON_THE_WAY") return;

    console.log("🔄 Starting continuous location updates");
    
    const interval = setInterval(() => {
      const payload = {
        sosId: activeMission._id,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      };
      console.log("📍 Continuous update:", payload);
      socket.emit("provider:location-update", payload);
    }, 5000);

    return () => {
      console.log("🛑 Stopping continuous location updates");
      clearInterval(interval);
    };
  }, [activeMission?.status, currentLocation, activeMission?._id]);

  // Listen for status updates
  useEffect(() => {
    const onStatusUpdated = ({ sosId, status }) => {
      if (activeMission?._id === sosId) {
        setActiveMission((prev) => ({ ...prev, status }));
      }
    };

    socket.on("sos:statusUpdated", onStatusUpdated);
    return () => { socket.off("sos:statusUpdated", onStatusUpdated); };
  }, [activeMission]);

  // Auto-arrival detection
  useEffect(() => {
    if (!activeMission || !currentLocation || activeMission.status !== "ON_THE_WAY" || !journeyStartedAt) {
      return;
    }

    const elapsed = (Date.now() - journeyStartedAt) / 1000;
    if (elapsed < 10) return;

    const distance = calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      activeMission.location.coordinates[1],
      activeMission.location.coordinates[0]
    );

    console.log("📏 Distance to user:", distance.toFixed(3), "km");

    if (distance <= 0.05) {
      updateMissionStatus("ARRIVED");
      socket.emit("provider-arrived", { sosId: activeMission._id });
    }
  }, [currentLocation, activeMission, journeyStartedAt]);

  // Handlers
  const handleToggleAvailability = async () => {
    try {
      const newStatus = !availability;
      await authService.updateProviderAvailability({ isAvailable: newStatus });
      setAvailability(newStatus);
    } catch (err) {
      setError('Failed to update availability.');
    }
  };

const handleAcceptSos = async (id) => {
  try {
    console.log("🔄 Accepting SOS:", id);
    const response = await sosService.acceptSos(id);
    
    // Log the full response to debug
    console.log("✅ Accept SOS response:", response);
    
    // Handle different response structures
    const missionData = response?.data?.data || response?.data || response;
    
    if (!missionData || !missionData._id) {
      throw new Error("Invalid response from server - no mission data");
    }
    
    // Get original SOS details before removing it
    const sos = nearbySos.find((item) => item._id === id);
    
    if (!sos) {
      throw new Error("SOS not found in nearby list");
    }
    
    console.log(" Original SOS data:", sos);
    console.log(" Mission data from server:", missionData);
    
    // Merge missing fields from SOS into mission
    const fullMission = {
      ...missionData,
      location: missionData.location || sos.location,
      driverId: missionData.driverId || sos.driverId,
      emergencyType: missionData.emergencyType || sos.emergencyType,
      aiAnalysis: missionData.aiAnalysis || sos.aiAnalysis, // Preserve AI analysis
    };
    
    console.log(" Full mission data:", fullMission);
    
    setActiveMission(fullMission);
    
    setMissionStartTime(
      fullMission.acceptedAt
        ? new Date(fullMission.acceptedAt).getTime()
        : Date.now()
    );
    
    // Remove from nearby list
    setNearbySos((prev) =>
      prev.filter((item) => item._id !== id)
    );
    
    // Send initial location update
    if (currentLocation) {
      const locationPayload = {
        sosId: fullMission._id,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      };
      console.log("📍 Sending initial location:", locationPayload);
      socket.emit("provider:location-update", locationPayload);
    }
    
    // Clear any existing errors
    setError('');
    
  } catch (err) {
    console.error("❌ Failed to accept SOS:", {
      error: err,
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    });
    
    // Provide more specific error messages
    if (err.response?.status === 400) {
      setError("This SOS has already been accepted by another provider.");
    } else if (err.response?.status === 404) {
      setError("SOS request no longer available.");
    } else if (err.message === "Invalid response from server - no mission data") {
      setError("Server returned unexpected data. Please try again.");
    } else {
      setError("Failed to accept SOS. Please try again.");
    }
  }
};

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleNavigate = () => {
    const coords = activeMission?.location?.coordinates;
    if (!coords || !Array.isArray(coords) || coords.length !== 2) {
      setError("Location not available.");
      return;
    }
    const [lng, lat] = coords;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    console.log("Opening Google Maps URL:", url);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCompleteMission = async () => {
    if (!activeMission) return;
    try {
      await sosService.updateSosStatus(activeMission._id, "RESOLVED");
      setActiveMission(null);
      setMissionStartTime(null);
      setMissionElapsed(0);
      setJourneyStartedAt(null);
      fetchNearbySos();
    } catch (err) {
      console.error(err);
      setError("Failed to resolve mission.");
    }
  };

  const updateMissionStatus = async (status) => {
    if (!activeMission?._id) return;
    try {
      await sosService.updateSosStatus(activeMission._id, status);
      
      setActiveMission((prev) => ({ ...prev, status }));

      if (status === "ON_THE_WAY") {
        setJourneyStartedAt(Date.now());
      }

      socket.emit("sos:statusUpdated", {
        sosId: activeMission._id,
        status,
      });

      if (currentLocation && ["ON_THE_WAY", "ARRIVED"].includes(status)) {
        socket.emit("provider:location-update", {
          sosId: activeMission._id,
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        });
      }
    } catch (error) {
      console.error("Status update failed:", error);
      setError("Failed to update mission status.");
    }
  };

  const filteredSos = filter === 'ALL'
    ? nearbySos
    : nearbySos.filter((sos) => sos.emergencyType === filter);

  const distance = activeMission && currentLocation && activeMission.location?.coordinates
    ? calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        activeMission.location.coordinates[1],
        activeMission.location.coordinates[0]
      )
    : null;

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Provider Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage emergencies and track missions</p>
          </div>
          <Button
            variant={availability ? 'success' : 'secondary'}
            size="lg"
            onClick={handleToggleAvailability}
            className="rounded-xl"
            icon={
              <span className={`relative flex h-3 w-3`}>
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${availability ? 'bg-emerald-400' : 'bg-gray-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${availability ? 'bg-emerald-500' : 'bg-gray-500'}`}></span>
              </span>
            }
          >
            {availability ? 'Available' : 'Unavailable'}
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
            <p className="text-sm font-medium text-red-800">{error}</p>
            <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}


        {activeMission && (
          <details className="mb-6 group">
            <summary className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-medium text-amber-800 cursor-pointer hover:bg-amber-100 transition-colors flex items-center gap-2">
              <Radio className="w-4 h-4" />
              Debug Information
              <ChevronDown className="w-4 h-4 ml-auto group-open:rotate-180 transition-transform" />
            </summary>
            <div className="mt-2 p-3 bg-white border border-amber-200 rounded-xl text-xs text-gray-700 space-y-1">
              <p><strong>Mission ID:</strong> {activeMission._id}</p>
              <p><strong>Status:</strong> {activeMission.status}</p>
              <p><strong>Location:</strong> {currentLocation ? `${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}` : '❌ Not available'}</p>
              <p><strong>Socket:</strong> {socket.connected ? '✅ Connected' : '❌ Disconnected'}</p>
            </div>
          </details>
        )}


        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Nearby Emergencies</p>
                <p className="text-3xl font-bold text-gray-900">{nearbySos.length}</p>
              </div>
            </div>
          </Card>
          
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${availability ? 'bg-emerald-50' : 'bg-gray-100'}`}>
                <Radio className={`h-6 w-6 ${availability ? 'text-emerald-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Your Status</p>
                <p className={`text-2xl font-bold ${availability ? 'text-emerald-600' : 'text-gray-500'}`}>
                  {availability ? 'Available' : 'Offline'}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                <Navigation className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Active Mission</p>
                <p className="text-3xl font-bold text-gray-900">{activeMission ? '1' : '0'}</p>
              </div>
            </div>
          </Card>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900">Nearby Emergencies</h2>
              
              {/* Filter Dropdown - Enhanced */}
              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 cursor-pointer hover:border-gray-300 transition-colors"
                >
                  <option value="ALL">All Emergencies</option>
                  <option value="MEDICAL">🏥 Medical</option>
                  <option value="POLICE">👮 Police</option>
                  <option value="TOWING">🔧 Towing</option>
                  <option value="GENERAL">📋 General</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            {filteredSos.length === 0 ? (
              <Card className="bg-white border border-gray-200 shadow-sm p-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No nearby emergencies at the moment.</p>
                  <p className="text-sm text-gray-400 mt-1">New requests will appear here automatically</p>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredSos.map((sos) => (
                  <Card key={sos._id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-0 overflow-hidden">
                    <div className="border-l-4 border-red-500 p-5">
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-lg text-gray-900">{sos.emergencyType}</h3>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${severityColors[sos.severity] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                              {sos.severity}
                            </span>
                          </div>
                          
                          <div className="space-y-1.5">
                            <p className="flex items-center gap-1.5 text-sm text-gray-500">
                              <MapPin className="h-4 w-4 shrink-0" />
                              {sos.location?.coordinates
                                ? `${sos.location.coordinates[1].toFixed(4)}, ${sos.location.coordinates[0].toFixed(4)}`
                                : "Unknown Location"}
                            </p>
                            
                            {sos.distance && (
                              <p className="flex items-center gap-1.5 text-sm font-medium text-blue-600">
                                <Navigation className="h-4 w-4" />
                                {sos.distance.toFixed(1)} km away
                              </p>
                            )}
                            
                            <p className="flex items-center gap-1.5 text-xs text-gray-400">
                              <Phone className="h-3.5 w-3.5" />
                              {sos.driverId?.phone || 'Unknown'}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-between gap-3">
                          <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-full text-xs font-semibold">
                            {sos.status}
                          </span>
                          
                          {sos.priorityScore && (
                            <p className="text-sm font-bold text-red-600">
                              Priority: {sos.priorityScore}
                            </p>
                          )}
                          
                          {sos.status?.toUpperCase() === 'PENDING' && (
                            <Button 
                              variant="primary"
                              size="sm" 
                              onClick={() => handleAcceptSos(sos._id)}
                              className="rounded-xl font-semibold"
                              icon={<ArrowRight className="w-4 h-4" />}
                            >
                              Accept Request
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Active Mission Panel - Right Side */}
          <div>
            <Card className="bg-white border border-gray-200 shadow-sm sticky top-24 p-0 overflow-hidden">
              {/* Mission Header */}
              <div className="bg-linear-to-r from-red-50 to-red-100/50 p-5 border-b border-red-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <Navigation className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Active Mission</h3>
                    {activeMission && (
                      <p className="text-xs text-gray-500">In progress</p>
                    )}
                  </div>
                  {activeMission && (
                    <div className="ml-auto bg-white rounded-xl px-4 py-2 border border-gray-200">
                      <div className="flex items-center gap-2">
                        <Timer className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Duration</p>
                          <p className="font-bold text-lg text-gray-900 leading-tight">{formatDuration(missionElapsed)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5">
                {activeMission?.aiAnalysis?.recommendation_service && (
                  <div className="mb-5 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-sm text-blue-900">AI Recommendation</h4>
                    </div>
                    <p className="text-sm text-blue-700 leading-relaxed">{activeMission.aiAnalysis.recommendation_service}</p>
                  </div>
                )}

                {/* Emergency Image */}
                {activeMission?.aiAnalysis?.image_url && (
                  <div className="mb-5">
                    <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Emergency Evidence
                    </h4>
                    <div className="relative group cursor-pointer" onClick={() => window.open(activeMission.aiAnalysis.image_url, '_blank')}>
                      <img 
                        src={activeMission.aiAnalysis.image_url} 
                        alt="Emergency scene"
                        className="w-full h-48 object-cover rounded-xl border border-gray-200 group-hover:opacity-90 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-xl flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-medium bg-black/50 px-3 py-1.5 rounded-lg">
                          Click to view full size
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {activeMission ? (
                  <div className="space-y-5">
                    {/* Mission Details */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">{activeMission.emergencyType}</h4>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4 shrink-0" />
                          {activeMission.location?.coordinates
                            ? `${activeMission.location.coordinates[1].toFixed(4)}, ${activeMission.location.coordinates[0].toFixed(4)}`
                            : "Unknown Location"}
                        </p>
                        <p className="flex items-center gap-2 text-gray-600">
                          <Phone className="h-4 w-4 shrink-0" />
                          {activeMission.driverId?.phone || 'Not available'}
                        </p>
                      </div>
                    </div>

                    {/* Distance & ETA */}
                    {distance !== null && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                          <p className="text-xs font-medium text-emerald-600 mb-1">Distance</p>
                          <p className="text-2xl font-bold text-emerald-700">{distance.toFixed(2)}</p>
                          <p className="text-xs text-emerald-600 mt-1">Kilometers</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                          <p className="text-xs font-medium text-blue-600 mb-1">Est. Arrival</p>
                          <p className="text-2xl font-bold text-blue-700">{Math.ceil(distance / 0.6)}</p>
                          <p className="text-xs text-blue-600 mt-1">Minutes</p>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button 
                        variant="info"
                        size="lg"
                        fullWidth
                        className="rounded-xl font-semibold"
                        onClick={handleNavigate}
                        icon={<Map className="w-5 h-5" />}
                      >
                        Navigate to Location
                      </Button>

                      {activeMission?.status === "ACCEPTED" && (
                        <Button 
                          variant="primary"
                          size="lg"
                          fullWidth
                          className="rounded-xl font-semibold"
                          onClick={() => updateMissionStatus("ON_THE_WAY")}
                          icon={<Car className="w-5 h-5" />}
                        >
                          Start Journey
                        </Button>
                      )}

                      {activeMission?.status === "ON_THE_WAY" && (
                        <Button 
                          variant="warning"
                          size="lg"
                          fullWidth
                          className="rounded-xl font-semibold"
                          onClick={() => updateMissionStatus("ARRIVED")}
                          icon={<MapPin className="w-5 h-5" />}
                        >
                          Mark as Arrived
                        </Button>
                      )}

                      {activeMission?.status === "ARRIVED" && (
                        <Button 
                          variant="success"
                          size="lg"
                          fullWidth
                          className="rounded-xl font-semibold"
                          onClick={handleCompleteMission}
                          icon={<CheckCircle2 className="w-5 h-5" />}
                        >
                          Mission Completed
                        </Button>
                      )}
                    </div>

                    {/* Progress Steps */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mission Progress</p>
                      {["ACCEPTED", "ON_THE_WAY", "ARRIVED", "COMPLETED"].map((step, index) => {
                        const isCompleted = ["ACCEPTED", "ON_THE_WAY", "ARRIVED", "COMPLETED"].indexOf(activeMission.status) >= index;
                        const isCurrent = activeMission.status === step;
                        
                        return (
                          <div
                            key={step}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                              isCurrent
                                ? "bg-red-50 border border-red-200 shadow-sm"
                                : isCompleted
                                ? "bg-emerald-50 border border-emerald-100"
                                : "bg-gray-50 border border-gray-100"
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              isCurrent ? "bg-red-500" : isCompleted ? "bg-emerald-500" : "bg-gray-300"
                            }`}>
                              {isCompleted ? (
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              ) : (
                                <span className="text-xs font-bold text-white">{index + 1}</span>
                              )}
                            </div>
                            <span className={`text-sm font-medium ${
                              isCurrent ? "text-red-700" : isCompleted ? "text-emerald-700" : "text-gray-400"
                            }`}>
                              {step.replace("_", " ")}
                            </span>
                            {isCurrent && (
                              <span className="ml-auto w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Radio className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No active mission</p>
                    <p className="text-sm text-gray-400 mt-1">Accept an emergency to start</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;