import React, { useState, useEffect, useMemo, useRef } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { sosService } from '../services/sosService';
import { aiService } from '../services/aiService';
import { AlertTriangle, Mic, Camera, Upload } from 'lucide-react';
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

  // keeps a handle on the active SpeechRecognition instance so we can stop it on unmount
  const recognitionRef = useRef(null);



const fetchMySos = async () => {
  console.log("Hi")
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
    "ARRIVED"
  ]);

  return (
    mySosList.find((s) => activeStatuses.has(s.status)) || null
  );
}, [mySosList]);

const hasActiveSos = !!activeSos;



  // add ai func
  const analyzeEmergency = async () => {
  try {

    const result =
      await aiService.analyzeEmergency({
        emergencyType: "GENERAL",
        description:
          "Vehicle accident on highway"
      });

    setAnalysis(result.data);

  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  fetchMySos();
}, []);

useEffect(() => {
  const handleUpdate = (updatedSos) => {
    setMySosList((prev) =>
      prev.map((item) =>
        item._id === updatedSos._id ? updatedSos : item
      )
    );
  };

  const handleArrival = () => {
    setSuccess("🚑 Provider has arrived!");
  };

  socket.on("sos-updated", handleUpdate);
  socket.on("provider-arrived", handleArrival);

  return () => {
    socket.off("sos-updated", handleUpdate);
    socket.off("provider-arrived", handleArrival);
  };
}, []);

  const handleTriggerSos = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setActionLoading(true);
    setError('');
    setSuccess('');

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
      const payload = {
  emergencyType: "GENERAL",
  coordinates: [
    position.coords.longitude,
    position.coords.latitude
  ],
  notes: ""
};

await sosService.createSos(payload);
        setSuccess('SOS triggered successfully! Help is on the way.');
        await fetchMySos(); // Refresh list
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

    const result =
      await aiService.analyzeImage(
        selectedImage
      );

    setAnalysis(result.data);

    setSuccess(
      "Image analyzed successfully."
    );
  } catch (err) {
    console.error(err);
    setError(
      "Failed to analyze image."
    );
  } finally {
    setImageLoading(false);
  }
};

const handleVoiceSos = async () => {
  try {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

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
        const transcript =
          event.results[0][0].transcript;

        const result =
          await aiService.voiceSos({
            transcript
          });

        const severity = result.data?.severity;

        if (severity && severity !== "LOW") {
          if (hasActiveSos) {
            // Don't create a second emergency on top of one that's already in progress.
            setSuccess(
              `Voice captured: "${transcript}" — you already have an active emergency, so a new SOS was not created.`
            );
          } else {
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                await sosService.createSos({
                  emergencyType:
                    result.data.recommendedServices?.[0] ||
                    "GENERAL",

                  coordinates: [
                    position.coords.longitude,
                    position.coords.latitude,
                  ],

                  notes: transcript,
                });

                fetchMySos();

                setSuccess(
                  "Emergency detected and SOS created automatically."
                );
              }
            );
          }
        } else {
          setSuccess(`Voice captured: "${transcript}"`);
        }

        setAnalysis(result.data);
      } catch (err) {
        console.error(err);
        setError("Voice analysis failed.");
      } finally {
        recognitionRef.current = null;
      }
    };

    recognition.onerror = () => {
      setError("Voice recognition failed.");
      recognitionRef.current = null;
    };

    recognition.start();
  } catch (err) {
    console.error(err);
    setError("Unable to start voice recognition.");
  }
};

// Stop any in-flight speech recognition if the component unmounts mid-recording.
useEffect(() => {
  return () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };
}, []);

const handleCancelSOS = async (id) => {
  try {
    setError('');
    setSuccess('');

    await sosService.cancelSos(id);

    setSuccess(
      'SOS request cancelled successfully.'
    );

    fetchMySos();
  } catch (err) {
    console.error(err);
    setError('Failed to cancel SOS.');
  }
};


//for live tracking
const [providerLocation, setProviderLocation] = useState(null);
const activeSosId = activeSos?._id;

// Clear any marker/ETA left over from a previous (or now-finished) emergency
// whenever the active SOS changes, so a stale provider position never lingers.
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

  socket.on("provider:location-updated", handleLocationUpdate);

  return () => {
    socket.off("provider:location-updated", handleLocationUpdate);
  };
}, [activeSosId]);


  // console.log(activeSos)
  //offline Banner
const [online, setOnline] =useState(navigator.onLine);

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

  if (loading) return <Loader />;
 
  const steps = [
  "PENDING",
  "ACCEPTED",
  "ON_THE_WAY",
  "ARRIVED",
  "COMPLETED"
];

return (
  
  
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {
 !online &&
 (
  <div className="bg-red-500 text-white p-3 rounded mb-4">
     ⚠ Offline Mode Active.
     Emergency requests will be stored
     and sent automatically.
  </div>
 )
}
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
  onClick={handleTriggerSos}
  disabled={actionLoading || hasActiveSos}
>
  {actionLoading
    ? "Broadcasting..."
    : hasActiveSos
    ? "Emergency Active"
    : "Trigger SOS Now"}
</Button>

        </Card>

        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <Mic className="h-5 w-5 text-blue-500" /> AI Voice Analysis
            </h3>
            <p className="text-sm text-gray-600 mb-4">Describe your emergency using voice.</p>
            <Button variant="secondary" className="w-full" onClick={handleVoiceSos}>
              Start Recording
            </Button>
          </Card>
          
     <Card className="overflow-hidden">
  <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
    <Camera className="h-5 w-5 text-green-500" />
    AI Image Analysis
  </h3>

  <p className="text-sm text-gray-500 mb-5">
    Upload a vehicle, accident, or roadside issue photo for AI assessment.
  </p>

  {/* Upload Area */}
  <div className="space-y-4">
    <div className="border-2 border-dashed border-gray-300 hover:border-green-500 transition-all duration-300 rounded-2xl bg-gray-50 p-6">
      <div className="flex flex-col items-center text-center">

        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <Camera className="h-8 w-8 text-green-600" />
        </div>

        <h4 className="font-semibold text-gray-800">
          Upload Emergency Photo
        </h4>

        <p className="text-sm text-gray-500 mt-1 mb-5">
          Take a photo instantly or upload from your gallery
        </p>

        <div className="flex flex-wrap justify-center gap-3">

          {/* Gallery Upload */}
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />

            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition">
              <Upload size={18} />
              Gallery
            </div>
          </label>

          {/* Camera Upload */}
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageSelect}
              className="hidden"
            />

            <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-green-600 text-green-600 hover:bg-green-50 transition">
              <Camera size={18} />
              Camera
            </div>
          </label>

        </div>
      </div>
    </div>

    {/* Preview */}
    {imagePreview && (
      <div className="relative">
        <img
          src={imagePreview}
          alt="Emergency Preview"
          className="w-full h-56 object-cover rounded-2xl shadow-md border"
        />

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
          <Loader className="h-4 w-4 animate-spin" />
          Analyzing Emergency...
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
        <h2 className="font-bold text-red-700 text-lg">
          Active Emergency
        </h2>

        <p className="mt-2">
          Status:
          <span className="font-semibold ml-2">
            {activeSos.status}
          </span>
        </p>

        <p className="text-sm text-gray-600">
          {new Date(
            activeSos.createdAt
          ).toLocaleString()}
        </p>
      </div>

{["PENDING", "ACCEPTED", "ON_THE_WAY"].includes(
  activeSos?.status
) && (
  <Button
    variant="secondary"
    onClick={() => handleCancelSOS(activeSos._id)}
  >
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

{/* Maps  */}
{activeSos && (
  <Card className="mb-6">

    <h2 className="font-bold text-lg mb-4">
      Live Rescue Tracking
    </h2>

{activeSos?.location?.coordinates?.length >= 2 && (
  <LiveTrackingMaps
    userLocation={[
      activeSos.location.coordinates[1], // latitude
      activeSos.location.coordinates[0], // longitude
    ]}
    providerLocation={providerLocation}
  />
)}

  </Card>
)}

{/* Live ETA */}
{providerLocation &&  activeSos?.location?.coordinates?.length >= 2 && (
  <Card className="mt-4">
    <p>
      Distance:{" "}
      {calculateDistance(
        providerLocation[0],
        providerLocation[1],
        activeSos.location.coordinates[1],
        activeSos.location.coordinates[0]
      ).toFixed(2)}
      km
    </p>

    <p>
      ETA:{" "}
      {Math.ceil(
        calculateDistance(
          providerLocation[0],
          providerLocation[1],
          activeSos.location.coordinates[1],
          activeSos.location.coordinates[0]
        ) / 0.6
      )}
      mins
    </p>
  </Card>
)}

<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
  <Card>
    <h3 className="text-2xl font-bold">
      {mySosList.length}
    </h3>
    <p className="text-gray-500 text-sm">
      Total Requests
    </p>
  </Card>

  <Card>
    <h3 className="text-2xl font-bold">
      {
        mySosList.filter(
          s =>
            s.status !== "COMPLETED" &&
            s.status !== "CANCELLED"
        ).length
      }
    </h3>

    <p className="text-gray-500 text-sm">
      Active Requests
    </p>
  </Card>

  <Card>
    <h3 className="text-2xl font-bold">
      {
        mySosList.filter(
          s => s.status === "COMPLETED"
        ).length
      }
    </h3>

    <p className="text-gray-500 text-sm">
      Resolved
    </p>
  </Card>
</div>

{analysis && (
  <Card className="mb-6">
    <h3 className="font-bold mb-4">
      AI Emergency Assessment
    </h3>

    <div className="space-y-3">
      <div>
        <strong>Severity:</strong>{" "}
        {analysis.severity}
      </div>

      <div>
        <strong>Priority:</strong>{" "}
        {analysis.priorityScore}
      </div>

      <div>
        <strong>Reason:</strong>{" "}
        {analysis.reason}
      </div>

      {analysis.recommendedServices && (
        <div>
          <strong>
            Recommended Services:
          </strong>

          <ul className="list-disc pl-5 mt-2">
            {analysis.recommendedServices.map(
              (service, index) => (
                <li key={index}>
                  {service}
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  </Card>
)}

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
                <p className="text-sm text-gray-500">Status: <span className="font-medium text-gray-900">{sos.status}</span></p>
                <p className="text-xs text-gray-400">{new Date(sos.createdAt).toLocaleString()}</p>
              </div>
              

              <div>
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                    sos.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : sos.status === "ACCEPTED"
                    ? "bg-blue-100 text-blue-800"
                    : sos.status === "ON_THE_WAY"
                    ? "bg-purple-100 text-purple-800"
                    : sos.status === "ARRIVED"
                    ? "bg-indigo-100 text-indigo-800"
                    : "bg-green-100 text-green-800"
                    }`}
                    >
                    {sos.status}
                </span>
              </div>
            </Card>
          ))
        )}
        {activeSos?.providerId && (
  <Card className="mb-4">
    <h3 className="font-bold mb-3">Assigned Provider</h3>
    <p>
      Name: {activeSos.providerId.firstName} {activeSos.providerId.lastName}
    </p>
    <p>Phone: {activeSos.providerId.phone}</p>
  </Card>
)}
      </div>
    </div>
  );
};

export default UserDashboard;