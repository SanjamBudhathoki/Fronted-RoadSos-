import React, { useState, useEffect, useMemo, useRef } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import Loader from "../components/Loader";
import { sosService } from "../services/sosService";
import { aiService } from "../services/aiService";
import {
  AlertTriangle,
  Mic,
  Camera,
  Upload,
  ImageIcon,
  X,
  CheckCircle2,
  MapPin,
  Clock,
  Activity,
} from "lucide-react";
import socket from "../services/socket";
import { calculateDistance } from "../services/distanceCalculator";
import LiveTrackingMaps from "../components/LiveTrackingMaps";

const UserDashboard = () => {
  const [mySosList, setMySosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [providerLocation, setProviderLocation] = useState(null);
  const [online, setOnline] = useState(navigator.onLine);
  const [pendingEmergencyData, setPendingEmergencyData] = useState(null);
  
const [voiceLoading, setVoiceLoading] = useState(false);
const recognitionRef = useRef(null);
  const successTimeoutRef = useRef(null);

  useEffect(() => {
    if (success) {
      successTimeoutRef.current = setTimeout(() => setSuccess(""), 5000);
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
    const activeStatuses = new Set([
      "PENDING",
      "ACCEPTED",
      "ON_THE_WAY",
      "ARRIVED",
    ]);
    return mySosList.find((s) => activeStatuses.has(s.status)) || null;
  }, [mySosList]);

  const hasActiveSos = !!activeSos;
  const activeSosId = activeSos?._id;

  const analyzeEmergency = async (emergencyData = null) => {
    try {
      const data = emergencyData || {
        emergencyType: "GENERAL",
        description: "Emergency assistance needed",
      };
      const result = await aiService.analyzeEmergency(data);
      setAnalysis(result.data);
      return result.data;
    } catch (error) {
      console.error("Emergency analysis failed:", error);
      return null;
    }
  };

  useEffect(() => {
    if (activeSos?.notes) {
      analyzeEmergency({
        emergencyType: activeSos.emergencyType || "GENERAL",
        description:
          activeSos.notes || `Emergency: ${activeSos.emergencyType}`,
      });
    }
  }, [activeSos?._id]);

  useEffect(() => {
    fetchMySos();
  }, []);

  useEffect(() => {
    const handleStatusUpdate = ({ sosId, status }) => {
      setMySosList((prev) =>
        prev.map((item) => (item._id === sosId ? { ...item, status } : item))
      );
    };

    const handleArrival = () => {
      setSuccess("Provider has arrived at your location!");
    };

    socket.on("sos:statusUpdated", handleStatusUpdate);
    socket.on("provider-arrived", handleArrival);

    return () => {
      socket.off("sos:statusUpdated", handleStatusUpdate);
      socket.off("provider-arrived", handleArrival);
    };
  }, []);

  useEffect(() => {
    setProviderLocation(null);
  }, [activeSosId]);

  useEffect(() => {
    const handleLocationUpdate = (data) => {
      if (!activeSosId) return;
      if (String(data.sosId) !== String(activeSosId)) return;

      const lat = Number(data.latitude);
      const lng = Number(data.longitude);

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

      setProviderLocation([lat, lng]);
    };

    socket.on("provider:location-update", handleLocationUpdate);
    socket.on("provider:location-updated", handleLocationUpdate);

    return () => {
      socket.off("provider:location-update", handleLocationUpdate);
      socket.off("provider:location-updated", handleLocationUpdate);
    };
  }, [activeSosId]);

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

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      };
    };
  }, []);

  const handleTriggerSos = async (emergencyData = {}) => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setActionLoading(true);
    setError("");
    setSuccess("");

    const userDescription =
      emergencyData.notes ||
      window.prompt("Briefly describe your emergency (optional):", "") ||
      "Emergency assistance needed";

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const payload = {
            emergencyType:
              emergencyData.emergencyType ||
              pendingEmergencyData?.aiAnalysisResult?.recommendedServices?.[0] ||
              "GENERAL",
            coordinates: [position.coords.longitude, position.coords.latitude],
            notes: userDescription,
            imageUrl:
              emergencyData.imageUrl || pendingEmergencyData?.imageUrl || null,
            imageFilename:
              emergencyData.imageFilename ||
              pendingEmergencyData?.imageFilename ||
              null,
            aiAnalysisResult:
              emergencyData.aiAnalysisResult ||
              pendingEmergencyData?.aiAnalysisResult ||
              null,
          };

          await sosService.createSos(payload);
          setSuccess("SOS triggered successfully! Help is on the way.");

          analyzeEmergency({
            emergencyType: payload.emergencyType,
            description: payload.notes,
          });

          if (payload.aiAnalysisResult) {
            setAnalysis(payload.aiAnalysisResult);
          }

          setPendingEmergencyData(null);
          setSelectedImage(null);
          setImagePreview(null);

          await fetchMySos();
        } catch (err) {
          setError("Failed to trigger SOS. Please try again.");
        } finally {
          setActionLoading(false);
        }
      },
      () => {
        setError(
          "Unable to retrieve your location. Please enable location services."
        );
        setActionLoading(false);
      }
    );
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size should be less than 10MB");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
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
      setError("");
      setSuccess("");

      const result = await aiService.analyzeImage(selectedImage);
      const analysisData = result.data;

      setAnalysis(analysisData);

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

      setSuccess(
        "Image analyzed! Click 'Trigger SOS Now' to create emergency with photo evidence."
      );
    } catch (err) {
      console.error(err);
      setError("Failed to analyze image. Please try again.");
    } finally {
      setImageLoading(false);
    }
  };

const handleVoiceSos = () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech recognition not supported in this browser.");
    return;
  }

  // Prevent starting a new recognition if one is already active
  if (recognitionRef.current) {
    recognitionRef.current.abort();
  }

  const recognition = new SpeechRecognition();
  recognitionRef.current = recognition;

  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;       // ← only final transcript
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    setVoiceLoading(true);
    setError("");
  };

  recognition.onresult = async (event) => {
    try {
      const result = event.results[0];
      if (!result.isFinal) return;          // safety guard

      const transcript = result[0].transcript.trim();
      if (!transcript) return;

      console.log("FINAL TRANSCRIPT:", transcript);

      const response = await aiService.voiceSos({ transcript });
      console.log("BACKEND RESPONSE:", response);

      // Optional: handle the response (show analysis, trigger SOS etc.)
      // e.g. if response.data.emergencyDetected then auto‑trigger SOS

    } catch (error) {
      console.error("VOICE API ERROR:", error);
      setError("Voice analysis failed. Please try again.");
    } finally {
      setVoiceLoading(false);
      recognitionRef.current = null;
    }
  };

  recognition.onerror = (event) => {
    console.error("RECOGNITION ERROR:", event.error);
    setError(`Voice error: ${event.error}`);
    setVoiceLoading(false);
    recognitionRef.current = null;
  };

  recognition.onend = () => {
    setVoiceLoading(false);
    recognitionRef.current = null;
  };

  recognition.start();
};

// Cleanup on unmount
useEffect(() => {
  return () => {
    recognitionRef.current?.abort();
  };
}, []);


  const handleCancelSOS = async (id) => {
    try {
      setError("");
      setSuccess("");
      await sosService.cancelSos(id);
      setSuccess("SOS request cancelled successfully.");
      fetchMySos();
    } catch (err) {
      console.error(err);
      setError("Failed to cancel SOS.");
    }
  };

  if (loading) return <Loader />;

  const steps = ["PENDING", "ACCEPTED", "ON_THE_WAY", "ARRIVED", "COMPLETED"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {activeSos && (
        <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono">
          <div className="flex items-center justify-between mb-3">
            <p className="font-bold text-sm text-gray-700">Debug Info</p>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                socket.connected
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {socket.connected ? "Connected" : "Disconnected"}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white p-2 rounded-lg">
              <p className="text-gray-400">SOS ID</p>
              <p className="font-semibold text-gray-900">
                {activeSos._id?.slice(-8)}
              </p>
            </div>
            <div className="bg-white p-2 rounded-lg">
              <p className="text-gray-400">Status</p>
              <p className="font-semibold text-gray-900">{activeSos.status}</p>
            </div>
            <div className="bg-white p-2 rounded-lg">
              <p className="text-gray-400">Provider Loc</p>
              <p
                className={`font-semibold ${providerLocation ? "text-emerald-600" : "text-red-500"}`}
              >
                {providerLocation ? "Received" : "Waiting"}
              </p>
            </div>
            <div className="bg-white p-2 rounded-lg">
              <p className="text-gray-400">User Loc</p>
              <p className="font-semibold text-gray-900">
                {activeSos?.location?.coordinates
                  ? `${activeSos.location.coordinates[1]?.toFixed(4)}, ${activeSos.location.coordinates[0]?.toFixed(4)}`
                  : "N/A"}
              </p>
            </div>
            <div className="bg-white p-2 rounded-lg">
              <p className="text-gray-400">Provider Coords</p>
              <p className="font-semibold text-gray-900">
                {providerLocation
                  ? `${providerLocation[0]?.toFixed(4)}, ${providerLocation[1]?.toFixed(4)}`
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}

      {!online && (
        <div className="mb-4 p-4 bg-red-500 text-white rounded-xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">
            Offline Mode Active. Emergency requests will be stored and sent
            automatically.
          </p>
        </div>
      )}

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
        User Dashboard
      </h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
          <button
            onClick={() => setError("")}
            className="text-red-400 hover:text-red-600 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-emerald-800">Success</p>
            <p className="text-sm text-emerald-600">{success}</p>
          </div>
          <button
            onClick={() => setSuccess("")}
            className="text-emerald-400 hover:text-emerald-600 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-red-200 bg-red-50/50 overflow-hidden">
          <div className="p-6 sm:p-8 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mb-5">
              <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Emergency?
            </h2>
            <p className="text-gray-600 mb-6 text-sm max-w-xs">
              Tap the button below to instantly broadcast your location to
              nearby providers.
            </p>
            <Button
              variant="danger"
              className="w-full text-lg py-4 uppercase tracking-widest rounded-xl font-bold"
              onClick={() =>
                handleTriggerSos(pendingEmergencyData || {})
              }
              disabled={actionLoading || hasActiveSos}
            >
              {actionLoading
                ? "Broadcasting..."
                : hasActiveSos
                  ? "Emergency Active"
                  : pendingEmergencyData
                    ? "Send SOS with Photo Evidence"
                    : "Trigger SOS Now"}
            </Button>

            {pendingEmergencyData && (
              <div className="mt-4 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200">
                <ImageIcon className="h-3.5 w-3.5" />
                Photo evidence ready - will be included with SOS
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Mic className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    AI Voice Analysis
                  </h3>
                  <p className="text-xs text-gray-500">
                    High/Critical emergencies auto-trigger SOS
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Describe your emergency using voice for instant AI assessment.
              </p>
<Button
  variant="secondary"
  className="w-full rounded-xl"
  onClick={handleVoiceSos}
  disabled={voiceLoading}
>
  {voiceLoading ? (
    <Loader className="h-4 w-4 animate-spin mr-2" />
  ) : (
    <Mic className="w-4 h-4 mr-2" />
  )}
  {voiceLoading ? "Listening…" : "Start Recording"}
</Button>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Camera className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    AI Image Analysis
                  </h3>
                  <p className="text-xs text-gray-500">
                    Upload accident or roadside photos
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-200 hover:border-emerald-400 transition-all duration-300 rounded-2xl bg-gray-50 p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                      <Camera className="h-7 w-7 text-emerald-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800 text-sm">
                      Upload Emergency Photo
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 mb-4">
                      Take a photo or upload from gallery
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition text-sm font-medium">
                          <Upload size={16} /> Gallery
                        </div>
                      </label>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-600 text-emerald-600 hover:bg-emerald-50 transition text-sm font-medium">
                          <Camera size={16} /> Camera
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {imagePreview && (
                  <div className="relative rounded-xl overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Emergency Preview"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Ready for Analysis
                    </div>
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-3 left-3 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <Button
                  variant="secondary"
                  className="w-full py-3 text-sm font-semibold rounded-xl"
                  onClick={handleImageAnalysis}
                  disabled={!selectedImage || imageLoading}
                >
                  {imageLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader className="h-4 w-4 animate-spin" />
                      Analyzing Emergency...
                    </div>
                  ) : (
                    "Analyze Emergency Image"
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {activeSos && (
        <Card className="mb-6 border-red-200 bg-red-50/50">
          <div className="p-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="font-bold text-red-700 text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Active Emergency
                </h2>
                <p className="mt-1 text-gray-600">
                  Status:{" "}
                  <span className="font-semibold text-gray-900 ml-1">
                    {activeSos.status}
                  </span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(activeSos.createdAt).toLocaleString()}
                </p>
              </div>
              {["PENDING", "ACCEPTED", "ON_THE_WAY"].includes(
                activeSos?.status
              ) && (
                <Button
                  variant="secondary"
                  onClick={() => handleCancelSOS(activeSos._id)}
                  className="rounded-xl"
                >
                  Cancel SOS
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-5">
              {steps.map((step) => (
                <div
                  key={step}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    activeSos.status === step
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {step.replace("_", " ")}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {activeSos && (
        <Card className="mb-6 overflow-hidden">
          <div className="p-5">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" />
              Live Rescue Tracking
            </h2>
            {activeSos?.location?.coordinates?.length >= 2 ? (
              <div className="rounded-xl overflow-hidden -mx-5 -mb-5">
                <LiveTrackingMaps
                  userLocation={[
                    activeSos.location.coordinates[1],
                    activeSos.location.coordinates[0],
                  ]}
                  providerLocation={providerLocation}
                />
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Location data not available
              </p>
            )}
          </div>
        </Card>
      )}

      {providerLocation && activeSos?.location?.coordinates?.length >= 2 && (
        <Card className="mb-6">
          <div className="p-5">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Estimated Arrival
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-emerald-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Distance</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {calculateDistance(
                    providerLocation[0],
                    providerLocation[1],
                    activeSos.location.coordinates[1],
                    activeSos.location.coordinates[0]
                  ).toFixed(2)}{" "}
                  <span className="text-sm font-normal">km</span>
                </p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">ETA</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.ceil(
                    calculateDistance(
                      providerLocation[0],
                      providerLocation[1],
                      activeSos.location.coordinates[1],
                      activeSos.location.coordinates[0]
                    ) / 0.6
                  )}{" "}
                  <span className="text-sm font-normal">mins</span>
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="text-center">
          <div className="p-5">
            <h3 className="text-3xl font-bold text-gray-900">
              {mySosList.length}
            </h3>
            <p className="text-sm text-gray-500 mt-1">Total Requests</p>
          </div>
        </Card>
        <Card className="text-center">
          <div className="p-5">
            <h3 className="text-3xl font-bold text-blue-600">
              {
                mySosList.filter(
                  (s) => s.status !== "COMPLETED" && s.status !== "CANCELLED"
                ).length
              }
            </h3>
            <p className="text-sm text-gray-500 mt-1">Active Requests</p>
          </div>
        </Card>
        <Card className="text-center">
          <div className="p-5">
            <h3 className="text-3xl font-bold text-emerald-600">
              {mySosList.filter((s) => s.status === "COMPLETED").length}
            </h3>
            <p className="text-sm text-gray-500 mt-1">Resolved</p>
          </div>
        </Card>
      </div>

      {analysis && (
        <Card className="mb-6 border-indigo-200 bg-indigo-50/50">
          <div className="p-5">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-indigo-900">
              <AlertTriangle className="h-5 w-5 text-indigo-600" />
              AI Emergency Assessment
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">
                  Severity:
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    analysis.severity === "CRITICAL"
                      ? "bg-red-100 text-red-700"
                      : analysis.severity === "HIGH"
                        ? "bg-orange-100 text-orange-700"
                        : analysis.severity === "MEDIUM"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                  }`}
                >
                  {analysis.severity}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Priority Score:</span>{" "}
                {analysis.priorityScore}/100
              </div>
              {analysis.reason && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Analysis:</span>{" "}
                  {analysis.reason}
                </div>
              )}
              {analysis.summary && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Summary:</span>{" "}
                  {analysis.summary}
                </div>
              )}
              {analysis.injuredCount > 0 && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Injured:</span>{" "}
                  {analysis.injuredCount} person(s)
                </div>
              )}
              {analysis.safetyInstructions && (
                <div className="bg-white p-4 rounded-xl border border-indigo-100">
                  <span className="text-sm font-medium text-indigo-700">
                    Safety Instructions:
                  </span>
                  <p className="text-sm mt-1 text-gray-600">
                    {analysis.safetyInstructions}
                  </p>
                </div>
              )}
              {analysis.recommendedServices &&
                analysis.recommendedServices.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Recommended Services:
                    </span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {analysis.recommendedServices.map((service, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </Card>
      )}

      {activeSos?.providerId && (
        <Card className="mb-6">
          <div className="p-5">
            <h3 className="font-bold text-gray-900 mb-3">
              Assigned Provider
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-blue-600">
                  {activeSos.providerId.firstName?.[0]}
                  {activeSos.providerId.lastName?.[0]}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {activeSos.providerId.firstName}{" "}
                  {activeSos.providerId.lastName}
                </p>
                <p className="text-sm text-gray-500">
                  {activeSos.providerId.phone}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      <h2 className="text-xl font-bold text-gray-900 mb-4">
        My SOS Requests
      </h2>
      <div className="space-y-3">
        {mySosList.length === 0 ? (
          <Card>
            <p className="text-gray-500 text-center py-8">
              No SOS requests found.
            </p>
          </Card>
        ) : (
          mySosList.map((sos) => (
            <Card
              key={sos._id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-800">
                    {sos.emergencyType}
                  </p>
                  {sos.aiAnalysis?.image_url && (
                    <span title="Has photo evidence">📸</span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  Status:{" "}
                  <span className="font-medium text-gray-900">
                    {sos.status}
                  </span>
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(sos.createdAt).toLocaleString()}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${
                  sos.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : sos.status === "ACCEPTED"
                      ? "bg-blue-100 text-blue-800"
                      : sos.status === "ON_THE_WAY"
                        ? "bg-purple-100 text-purple-800"
                        : sos.status === "ARRIVED"
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {sos.status.replace("_", " ")}
              </span>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default UserDashboard;