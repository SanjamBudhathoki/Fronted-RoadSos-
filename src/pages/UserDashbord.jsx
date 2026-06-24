import React, { useState, useEffect, useMemo, useRef } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { sosService } from '../services/sosService';
import { aiService } from '../services/aiService';
import { AlertTriangle, Mic, Camera, Upload, Image as ImageIcon } from 'lucide-react';
import socket from '../services/socket';
import { calculateDistance } from '../services/distanceCalculator';
import LiveTrackingMaps from '../components/LiveTrackingMaps';

const UserDashboard = () => {
  const [mySosList, setMySosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [providerLocation, setProviderLocation] = useState(null);
  const [online, setOnline] = useState(navigator.onLine);
  const [pendingEmergencyData, setPendingEmergencyData] = useState(null);
  
  const recognitionRef = useRef(null);
  const successTimeoutRef = useRef(null);

  // Auto-clear success messages
  useEffect(() => {
    if (success) {
      successTimeoutRef.current = setTimeout(() => setSuccess(''), 5000);
    }
    return () => {
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    };
  }, [success]);

  const fetchMySos = async () => {
    try {
      setLoading(true);
      const data = await sosService.getMySos();
      setMySosList(data.data || []);
    } catch (err) {
      setError("Failed to fetch SOS history.");
    } finally {
      setLoading(false);
    }
  };

  const activeSos = useMemo(() => {
    const activeStatuses = new Set(["PENDING", "ACCEPTED", "ON_THE_WAY", "ARRIVED"]);
    return mySosList.find((s) => activeStatuses.has(s.status)) || null;
  }, [mySosList]);

  const hasActiveSos = !!activeSos;
  const activeSosId = activeSos?._id;

  //  PROBLEM 4 FIXED: AI analysis with real data
  const analyzeEmergency = async (emergencyData = null) => {
    try {
      const data = emergencyData || {
        emergencyType: "GENERAL",
        description: "Emergency assistance needed"
      };
      
      const result = await aiService.analyzeEmergency(data);
      setAnalysis(result.data);
      return result.data;
    } catch (error) {
      console.error('Emergency analysis failed:', error);
      return null;
    }
  };

  //  PROBLEM 4 FIXED: Auto-analyze active emergency with real data
  useEffect(() => {
    if (activeSos?.notes) {
      analyzeEmergency({
        emergencyType: activeSos.emergencyType || "GENERAL",
        description: activeSos.notes || `Emergency: ${activeSos.emergencyType}`
      });
    }
  }, [activeSos?._id]);

  useEffect(() => {
    fetchMySos();
  }, []);

  // Listen for SOS status updates
  useEffect(() => {
    const handleStatusUpdate = ({ sosId, status }) => {
      console.log("📊 Status update received:", { sosId, status });
      setMySosList((prev) =>
        prev.map((item) =>
          item._id === sosId ? { ...item, status } : item
        )
      );
    };

    const handleArrival = () => {
      setSuccess("🚑 Provider has arrived at your location!");
    };

    socket.on("sos:statusUpdated", handleStatusUpdate);
    socket.on("provider-arrived", handleArrival);

    return () => {
      socket.off("sos:statusUpdated", handleStatusUpdate);
      socket.off("provider-arrived", handleArrival);
    };
  }, []);

  // Clear provider location when active SOS changes
  useEffect(() => {
    setProviderLocation(null);
  }, [activeSosId]);

  // Listen for provider location updates
  useEffect(() => {
    const handleLocationUpdate = (data) => {
      console.log("📍 Received provider location:", data);
      
      if (!activeSosId) {
        console.warn(" No active SOS ID, ignoring location update");
        return;
      }
      
      if (String(data.sosId) !== String(activeSosId)) {
        console.warn(" SOS ID mismatch:", {
          received: data.sosId,
          current: activeSosId
        });
        return;
      }

      const lat = Number(data.latitude);
      const lng = Number(data.longitude);

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        console.warn(" Invalid coordinates:", { lat, lng });
        return;
      }

      console.log(" Setting provider location:", [lat, lng]);
      setProviderLocation([lat, lng]);
    };

    console.log(" Listening for provider location updates...");
    socket.on("provider:location-update", handleLocationUpdate);
    socket.on("provider:location-updated", handleLocationUpdate);

    return () => {
      console.log("Stopped listening for provider location updates");
      socket.off("provider:location-update", handleLocationUpdate);
      socket.off("provider:location-updated", handleLocationUpdate);
    };
  }, [activeSosId]);

  // Online/Offline detection
  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  // Cleanup speech recognition
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, []);

  // SOS with real data and image attachment
  const handleTriggerSos = async (emergencyData = {}) => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setActionLoading(true);
    setError('');
    setSuccess('');

    // Get real description from user if not provided
    const userDescription = emergencyData.notes || window.prompt(
      'Briefly describe your emergency (optional):', 
      ''
    ) || 'Emergency assistance needed';

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        //  Merge pending image/AI data with SOS payload
        const payload = {
          emergencyType: emergencyData.emergencyType || pendingEmergencyData?.aiAnalysisResult?.recommendedServices?.[0] || "GENERAL",
          coordinates: [
            position.coords.longitude,
            position.coords.latitude
          ],
          notes: userDescription,
          // Include image and AI analysis
          imageUrl: emergencyData.imageUrl || pendingEmergencyData?.imageUrl || null,
          imageFilename: emergencyData.imageFilename || pendingEmergencyData?.imageFilename || null,
          aiAnalysisResult: emergencyData.aiAnalysisResult || pendingEmergencyData?.aiAnalysisResult || null,
        };

        await sosService.createSos(payload);
        setSuccess('🚨 SOS triggered successfully! Help is on the way.');
        
        //  Analyze with real data
        analyzeEmergency({
          emergencyType: payload.emergencyType,
          description: payload.notes
        });
        
        //  Show analysis if available
        if (payload.aiAnalysisResult) {
          setAnalysis(payload.aiAnalysisResult);
        }
        
        //  Clean up
        setPendingEmergencyData(null);
        setSelectedImage(null);
        setImagePreview(null);
        
        await fetchMySos();
      } catch (err) {
        setError('Failed to trigger SOS. Please try again.');
      } finally {
        setActionLoading(false);
      }
    }, () => {
      setError('Unable to retrieve your location. Please enable location services.');
      setActionLoading(false);
    });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image size should be less than 10MB");
      return;
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a valid image (JPEG, PNG, WebP, or GIF)");
      return;
    }
    
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageAnalysis = async () => {
    if (!selectedImage) {
      setError("Please select an image.");
      return;
    }

    try {
      setImageLoading(true);
      setError('');
      setSuccess('');

      const result = await aiService.analyzeImage(selectedImage);
      const analysisData = result.data;
      
      // Show analysis
      setAnalysis(analysisData);
      
      //  Store for SOS creation
      setPendingEmergencyData({
        imageUrl: analysisData.imageUrl,
        imageFilename: analysisData.imageFilename,
        aiAnalysisResult: {
          severity: analysisData.severity,
          priorityScore: analysisData.priorityScore,
          recommendedServices: analysisData.recommendedServices || [],
          reason: analysisData.reason,
          safetyInstructions: analysisData.safetyInstructions,
          confidence: 0.9,
        },
      });
      
      setSuccess(" Image analyzed! Click 'Trigger SOS Now' to create emergency with photo evidence.");
    } catch (err) {
      console.error(err);
      setError("Failed to analyze image. Please try again.");
    } finally {
      setImageLoading(false);
    }
  };

  const handleVoiceSos = async () => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setError("Speech recognition is not supported in this browser.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = async (event) => {
        recognition.stop();
        try {
          const transcript = event.results[0][0].transcript;
          const result = await aiService.voiceSos({ transcript });
          const voiceData = result.data;

          console.log("🎤 Voice analysis result:", voiceData);

          if (voiceData.severity === "HIGH" || voiceData.severity === "CRITICAL") {
            if (hasActiveSos) {
              setSuccess(`Voice captured: "${transcript}" — you already have an active emergency.`);
            } else {
              navigator.geolocation.getCurrentPosition(async (position) => {
                await sosService.createSos({
                  emergencyType: voiceData.incidentType || "GENERAL",
                  coordinates: [position.coords.longitude, position.coords.latitude],
                  notes: transcript,
                  aiAnalysisResult: {
                    severity: voiceData.severity,
                    priorityScore: voiceData.priorityScore,
                    recommendedServices: voiceData.recommendedServices || [],
                    reason: voiceData.reason,
                    safetyInstructions: voiceData.safetyInstructions,
                    confidence: 0.9,
                  },
                });
                fetchMySos();
                setSuccess("🚨 Emergency detected from voice! SOS created automatically.");
              });
            }
          } else {
            setSuccess(`Voice captured: "${transcript}". Severity: ${voiceData.severity || 'LOW'}`);
          }

          // Show full analysis
          setAnalysis({
            severity: voiceData.severity,
            priorityScore: voiceData.priorityScore,
            reason: voiceData.reason,
            summary: voiceData.summary,
            recommendedServices: voiceData.recommendedServices,
            safetyInstructions: voiceData.safetyInstructions,
            injuredCount: voiceData.injuredCount,
            medicalRequired: voiceData.medicalRequired,
          });
        } catch (err) {
          console.error(err);
          setError("Voice analysis failed.");
        } finally {
          recognitionRef.current = null;
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setError(`Voice recognition failed: ${event.error}`);
        recognitionRef.current = null;
      };

      recognition.onend = () => {
        console.log("Speech recognition ended");
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setError("Unable to start voice recognition.");
    }
  };

  const handleCancelSOS = async (id) => {
    try {
      setError('');
      setSuccess('');
      await sosService.cancelSos(id);
      setSuccess('SOS request cancelled successfully.');
      fetchMySos();
    } catch (err) {
      console.error(err);
      setError('Failed to cancel SOS.');
    }
  };

  if (loading) return <Loader />;

  const steps = ["PENDING", "ACCEPTED", "ON_THE_WAY", "ARRIVED", "COMPLETED"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {activeSos && (
        <div className="mb-4 p-3 bg-gray-50 border border-gray-300 rounded-lg text-xs font-mono">
          <p className="font-bold text-sm mb-2">🔍 Debug:</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-gray-500">SOS ID:</p>
              <p className="font-semibold">{activeSos._id?.slice(-8)}</p>
            </div>
            <div>
              <p className="text-gray-500">Status:</p>
              <p className="font-semibold">{activeSos.status}</p>
            </div>
            <div>
              <p className="text-gray-500">Socket:</p>
              <p className={`font-semibold ${socket.connected ? 'text-green-600' : 'text-red-600'}`}>
                {socket.connected ? ' Connected' : '❌ Disconnected'}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Provider:</p>
              <p className={`font-semibold ${providerLocation ? 'text-green-600' : 'text-red-600'}`}>
                {providerLocation ? ' Received' : '⏳ Waiting'}
              </p>
            </div>
            <div>
              <p className="text-gray-500">User Loc:</p>
              <p className="font-semibold">
                {activeSos?.location?.coordinates 
                  ? `${activeSos.location.coordinates[1]?.toFixed(4)}, ${activeSos.location.coordinates[0]?.toFixed(4)}`
                  : '❌'}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Provider Loc:</p>
              <p className="font-semibold">
                {providerLocation 
                  ? `${providerLocation[0]?.toFixed(4)}, ${providerLocation[1]?.toFixed(4)}`
                  : '❌'}
              </p>
            </div>
          </div>
        </div>
      )}

      {!online && (
        <div className="bg-red-500 text-white p-3 rounded mb-4">
          ⚠ Offline Mode Active. Emergency requests will be stored and sent automatically.
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-900 mb-6">User Dashboard</h1>
      
      {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm">{success}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="flex flex-col items-center justify-center text-center p-8 border-red-200 bg-red-50">
          <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Emergency?</h2>
          <p className="text-gray-600 mb-6 text-sm">Tap the button below to instantly broadcast your location to nearby providers.</p>
          <Button
            variant="danger"
            className="w-full text-lg py-4 uppercase tracking-widest"
            onClick={() => handleTriggerSos(pendingEmergencyData || {})}
            disabled={actionLoading || hasActiveSos}
          >
            {actionLoading ? (
              "Broadcasting..."
            ) : hasActiveSos ? (
              "Emergency Active"
            ) : pendingEmergencyData ? (
              "📸 Send SOS with Photo Evidence"
            ) : (
              "Trigger SOS Now"
            )}
          </Button>
          
          {/*  Show pending evidence indicator */}
          {pendingEmergencyData && (
            <div className="mt-3 flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
              <ImageIcon className="h-3 w-3" />
              Photo evidence ready - will be included with SOS
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <Mic className="h-5 w-5 text-blue-500" /> AI Voice Analysis
            </h3>
            <p className="text-sm text-gray-600 mb-4">Describe your emergency using voice. High/Critical emergencies auto-trigger SOS.</p>
            <Button variant="secondary" className="w-full" onClick={handleVoiceSos}>
              Start Recording
            </Button>
          </Card>
          
          <Card className="overflow-hidden">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
              <Camera className="h-5 w-5 text-green-500" /> AI Image Analysis
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Upload a vehicle, accident, or roadside issue photo for AI assessment.
            </p>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 hover:border-green-500 transition-all duration-300 rounded-2xl bg-gray-50 p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <Camera className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800">Upload Emergency Photo</h4>
                  <p className="text-sm text-gray-500 mt-1 mb-5">
                    Take a photo instantly or upload from your gallery
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <label className="cursor-pointer">
                      <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition">
                        <Upload size={18} /> Gallery
                      </div>
                    </label>
                    <label className="cursor-pointer">
                      <input type="file" accept="image/*" capture="environment" onChange={handleImageSelect} className="hidden" />
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-green-600 text-green-600 hover:bg-green-50 transition">
                        <Camera size={18} /> Camera
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              {imagePreview && (
                <div className="relative">
                  <img src={imagePreview} alt="Emergency Preview" className="w-full h-56 object-cover rounded-2xl shadow-md border" />
                  <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs">
                    Ready for Analysis
                  </div>
                </div>
              )}
              <Button
                variant="secondary"
                className="w-full py-3 text-base font-semibold"
                onClick={handleImageAnalysis}
                disabled={!selectedImage || imageLoading}
              >
                {imageLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader className="h-4 w-4 animate-spin" /> Analyzing Emergency...
                  </div>
                ) : (
                  "Analyze Emergency Image"
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
      
      {activeSos && (
        <Card className="mb-6 border-red-300 bg-red-50 md:col-span-2">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-bold text-red-700 text-lg">Active Emergency</h2>
              <p className="mt-2">
                Status: <span className="font-semibold ml-2">{activeSos.status}</span>
              </p>
              <p className="text-sm text-gray-600">
                {new Date(activeSos.createdAt).toLocaleString()}
              </p>
            </div>
            {["PENDING", "ACCEPTED", "ON_THE_WAY"].includes(activeSos?.status) && (
              <Button variant="secondary" onClick={() => handleCancelSOS(activeSos._id)}>
                Cancel SOS
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-5">
            {steps.map(step => (
              <div
                key={step}
                className={`px-3 py-1 rounded-full text-sm ${
                  activeSos.status === step
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Maps */}
      {activeSos && (
        <Card className="mb-6">
          <h2 className="font-bold text-lg mb-4">Live Rescue Tracking</h2>
          {activeSos?.location?.coordinates?.length >= 2 ? (
            <LiveTrackingMaps
              userLocation={[
                activeSos.location.coordinates[1],
                activeSos.location.coordinates[0],
              ]}
              providerLocation={providerLocation}
            />
          ) : (
            <p className="text-gray-500 text-center py-4">Location data not available</p>
          )}
        </Card>
      )}

      {/* Live ETA */}
      {providerLocation && activeSos?.location?.coordinates?.length >= 2 && (
        <Card className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <p className="text-sm text-gray-500">Distance</p>
              <p className="text-2xl font-bold text-green-600">
                {calculateDistance(
                  providerLocation[0],
                  providerLocation[1],
                  activeSos.location.coordinates[1],
                  activeSos.location.coordinates[0]
                ).toFixed(2)} km
              </p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-gray-500">ETA</p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.ceil(
                  calculateDistance(
                    providerLocation[0],
                    providerLocation[1],
                    activeSos.location.coordinates[1],
                    activeSos.location.coordinates[0]
                  ) / 0.6
                )} mins
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <h3 className="text-2xl font-bold">{mySosList.length}</h3>
          <p className="text-gray-500 text-sm">Total Requests</p>
        </Card>
        <Card>
          <h3 className="text-2xl font-bold">
            {mySosList.filter(s => s.status !== "COMPLETED" && s.status !== "CANCELLED").length}
          </h3>
          <p className="text-gray-500 text-sm">Active Requests</p>
        </Card>
        <Card>
          <h3 className="text-2xl font-bold">
            {mySosList.filter(s => s.status === "COMPLETED").length}
          </h3>
          <p className="text-gray-500 text-sm">Resolved</p>
        </Card>
      </div>

      {/* AI Analysis */}
      {analysis && (
        <Card className="mb-6 border-indigo-200 bg-linear-to-r from-indigo-50 to-white">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-indigo-600" />
            AI Emergency Assessment
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <strong>Severity:</strong>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                analysis.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                analysis.severity === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                analysis.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {analysis.severity}
              </span>
            </div>
            <div><strong>Priority Score:</strong> {analysis.priorityScore}/100</div>
            {analysis.reason && <div><strong>Analysis:</strong> {analysis.reason}</div>}
            {analysis.summary && <div><strong>Summary:</strong> {analysis.summary}</div>}
            {analysis.injuredCount > 0 && <div><strong>Injured:</strong> {analysis.injuredCount} person(s)</div>}
            {analysis.safetyInstructions && (
              <div className="bg-white p-3 rounded-lg border border-indigo-100">
                <strong> Safety Instructions:</strong>
                <p className="text-sm mt-1">{analysis.safetyInstructions}</p>
              </div>
            )}
            {analysis.recommendedServices && analysis.recommendedServices.length > 0 && (
              <div>
                <strong>Recommended Services:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {analysis.recommendedServices.map((service, index) => (
                    <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* SOS History */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">My SOS Requests</h2>
      <div className="space-y-4">
        {mySosList.length === 0 ? (
          <Card>
            <p className="text-gray-500 text-center py-4">No SOS requests found.</p>
          </Card>
        ) : (
          mySosList.map((sos) => (
            <Card key={sos._id} className="flex justify-between items-center-safe">
              <div>
                <p className="font-semibold text-gray-800">{sos.emergencyType}</p>
                <p className="text-sm text-gray-500">
                  Status: <span className="font-medium text-gray-900">{sos.status}</span>
                </p>
                <p className="text-xs text-gray-400">{new Date(sos.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                {/*  Show image indicator if SOS has image */}
                {sos.aiAnalysis?.image_url && (
                  <span title="Has photo evidence">📸</span>
                )}
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  sos.status === "PENDING" ? "bg-yellow-100 text-yellow-800"
                  : sos.status === "ACCEPTED" ? "bg-blue-100 text-blue-800"
                  : sos.status === "ON_THE_WAY" ? "bg-purple-100 text-purple-800"
                  : sos.status === "ARRIVED" ? "bg-indigo-100 text-indigo-800"
                  : "bg-green-100 text-green-800"
                }`}>
                  {sos.status}
                </span>
              </div>
            </Card>
          ))
        )}
        {activeSos?.providerId && (
          <Card className="mb-4">
            <h3 className="font-bold mb-3">Assigned Provider</h3>
            <p>Name: {activeSos.providerId.firstName} {activeSos.providerId.lastName}</p>
            <p>Phone: {activeSos.providerId.phone}</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;