import React, { useState, useEffect, useCallback } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { sosService } from '../services/sosService';
import { authService } from '../services/authService';
import { MapPin, Navigation } from 'lucide-react';
import socket from '../services/socket';
import { calculateDistance } from '../services/distanceCalculator';

const severityColors = {
  LOW: 'bg-green-100 text-green-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  HIGH: 'bg-orange-100 text-orange-700',
  CRITICAL: 'bg-red-100 text-red-700',
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

    socket.on('sos:new', handleNewSOS);
    socket.on('sos:accepted', onAccepted);
    socket.on('sos:completed', onCompleted);

    return () => {
      socket.off('sos:new', handleNewSOS);
      socket.off('sos:accepted', onAccepted);
      socket.off('sos:completed', onCompleted);
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

  // ==========================================
  // 🔧 FIXED: Send location immediately when mission is active
  // ==========================================
  useEffect(() => {
    if (!activeMission || !currentLocation) {
      console.log("⏸️ Not sending location - missing:", {
        hasMission: !!activeMission,
        hasLocation: !!currentLocation,
        missionStatus: activeMission?.status
      });
      return;
    }

    // Send location for ANY active status (ACCEPTED, ON_THE_WAY, ARRIVED)
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

  // 🔧 FIXED: Continuous location updates every 5 seconds when ON_THE_WAY
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
      const response = await sosService.acceptSos(id);
      const mission = response?.data;
      setActiveMission(mission);
      setMissionStartTime(mission.acceptedAt ? new Date(mission.acceptedAt).getTime() : Date.now());
      setNearbySos((prev) => prev.filter((item) => item._id !== id));
      
      // 🔧 Immediately send location after accepting
      if (currentLocation) {
        socket.emit("provider:location-update", {
          sosId: mission._id,
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        });
      }
    } catch (err) {
      console.error(err);
      setError('Failed to accept SOS.');
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleNavigate = () => {
    if (!activeMission?.location?.coordinates) {
      setError("Location not available.");
      return;
    }
    const [lng, lat] = activeMission.location.coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
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

      // Track when journey started
      if (status === "ON_THE_WAY") {
        setJourneyStartedAt(Date.now());
      }

      socket.emit("sos:statusUpdated", {
        sosId: activeMission._id,
        status,
      });

      // 🔧 Send location immediately on status change
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

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>
        <Button
          variant={availability ? 'outline' : 'secondary'}
          onClick={handleToggleAvailability}
        >
          {availability ? '🟢 Available' : '🔴 Unavailable'}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
      )}

      {/* Debug Info - Remove after testing */}
      {activeMission && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
          <p><strong>Debug:</strong></p>
          <p>Mission ID: {activeMission._id}</p>
          <p>Status: {activeMission.status}</p>
          <p>Location: {currentLocation ? `${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}` : '❌'}</p>
          <p>Socket: {socket.connected ? '✅ Connected' : '❌ Disconnected'}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <h4 className="text-sm text-gray-500">Nearby SOS</h4>
          <p className="text-2xl font-bold">{nearbySos.length}</p>
        </Card>
        <Card>
          <h4 className="text-sm text-gray-500">Status</h4>
          <p className="text-2xl font-bold">{availability ? 'Available' : 'Unavailable'}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Navigation className="h-5 w-5 text-blue-600" />
            <h3 className="font-bold text-lg">Active Mission</h3>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SOS List */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Nearby Emergencies</h2>
          <div className="mb-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="ALL">All Emergencies</option>
              <option value="MEDICAL">Medical</option>
              <option value="POLICE">Police</option>
              <option value="TOWING">Towing</option>
              <option value="GENERAL">General</option>
            </select>
          </div>
          
          {filteredSos.length === 0 ? (
            <Card>
              <p className="text-center text-gray-500 py-8">No nearby emergencies at the moment.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredSos.map((sos) => (
                <Card key={sos._id} className="border-l-4 border-red-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{sos.emergencyType}</h3>
                      <p className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <MapPin className="h-4 w-4" />
                        {sos.location?.coordinates
                          ? `${sos.location.coordinates[1]}, ${sos.location.coordinates[0]}`
                          : "Unknown Location"}
                      </p>
                      {sos.distance && (
                        <p className="text-sm text-blue-600 mt-2">{sos.distance.toFixed(1)} km away</p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        Reported by: {sos.driverId?.phone || 'Unknown'}
                      </p>
                    </div>

                    <div className="text-right space-y-2">
                      <span className="block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        {sos.status}
                      </span>
                      <span className={`block px-3 py-1 rounded-full text-xs ${
                        severityColors[sos.severity] || 'bg-gray-100 text-gray-700'
                      }`}>
                        {sos.severity}
                      </span>
                      {sos.priorityScore && (
                        <p className="text-sm font-medium text-red-600">Priority: {sos.priorityScore}</p>
                      )}
                      {sos.status?.toUpperCase() === 'PENDING' && (
                        <Button size="sm" onClick={() => handleAcceptSos(sos._id)}>
                          Accept Request
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Active Mission */}
        <div>
          <Card className="sticky top-24 bg-blue-50 border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <Navigation className="h-5 w-5 text-blue-600" />
              <h3 className="font-bold text-lg">Active Mission</h3>
              {activeMission && (
                <div className="bg-white rounded-lg p-3 ml-auto">
                  <p className="text-xs text-gray-500">Mission Duration</p>
                  <p className="font-bold text-lg">{formatDuration(missionElapsed)}</p>
                </div>
              )}
            </div>

            {activeMission?.aiAnalysis?.recommendation_service && (
              <Card>
                <h4 className="font-semibold mb-2">AI Recommendation</h4>
                <p className="text-sm text-gray-700">{activeMission.aiAnalysis.recommendation_service}</p>
              </Card>
            )}

            {activeMission ? (
              <div className="space-y-5">
                <div>
                  <h4 className="font-semibold mb-1">{activeMission.emergencyType}</h4>
                  <p className="text-sm text-gray-600">
                    {activeMission.location?.coordinates
                      ? `${activeMission.location.coordinates[1]}, ${activeMission.location.coordinates[0]}`
                      : "Unknown Location"}
                  </p>
                  <p className="text-sm text-gray-600 mb-0.5">
                    Contact: {activeMission.driverId?.phone}
                  </p>
                </div>

                {distance !== null && (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <p className="text-xs text-gray-500 font-semibold">Distance</p>
                      <p className="text-2xl font-bold text-green-600">{distance.toFixed(2)}</p>
                      <p className="text-xs text-gray-500 font-semibold">KM Away</p>
                    </div>
                    <div className="bg-emerald-100 border border-blue-200 rounded-xl p-4">
                      <p className="text-xs text-gray-500 font-bold">ETA</p>
                      <p className="text-2xl font-bold text-blue-600">{Math.ceil(distance / 0.6)}</p>
                      <p className="text-xs text-black font-semibold">Minutes</p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Button className="w-full" onClick={handleNavigate}>
                    🗺️ Navigate
                  </Button>

                  {activeMission?.status === "ACCEPTED" && (
                    <Button className="w-full" onClick={() => updateMissionStatus("ON_THE_WAY")}>
                      🚗 Start Journey
                    </Button>
                  )}

                  {activeMission?.status === "ON_THE_WAY" && (
                    <Button className="w-full" onClick={() => updateMissionStatus("ARRIVED")}>
                      📍 Mark as Arrived
                    </Button>
                  )}

                  {activeMission?.status === "ARRIVED" && (
                    <Button variant="primary" className="w-full" onClick={handleCompleteMission}>
                      ✅ Mission Completed
                    </Button>
                  )}

                  <div className="space-y-2">
                    {["ACCEPTED", "ON_THE_WAY", "ARRIVED", "COMPLETED"].map(step => (
                      <div
                        key={step}
                        className={`p-2 rounded-lg ${
                          activeMission.status === step
                            ? "bg-green-500 text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No active mission.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;