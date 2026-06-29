import { useEffect, useState } from "react";
import {
  Phone,
  MessageSquare,
  Users,
  ExternalLink,
} from "lucide-react";

import { emergencyContactsService } from "../services/emergencyContactsServices";
import Card from "./Card";

const NotifyEmergencyContacts = ({
  latitude,
  longitude,
  emergencyType = "GENERAL",
}) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);

      const res = await emergencyContactsService.getContacts();

      if (res.success) {
        setContacts(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const mapsUrl = `https://maps.google.com/?q=${latitude},${longitude}`;

  const smsMessage = encodeURIComponent(
    `🚨 RoadSOS Emergency Alert

I have triggered an SOS.

Emergency Type: ${emergencyType}

My Live Location:
${mapsUrl}

Please contact me immediately.`
  );

  const makeCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const sendSMS = (phone) => {
    window.location.href = `sms:${phone}?body=${smsMessage}`;
  };

  if (loading) return null;

  if (contacts.length === 0) return null;

  return (
    <Card className="mb-6 border-orange-200">

      <div className="p-5">

        <div className="flex items-center gap-3 mb-5">

          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
            <Users className="w-5 h-5 text-orange-600" />
          </div>

          <div>
            <h3 className="font-bold text-lg">
              Notify Emergency Contacts
            </h3>

            <p className="text-sm text-gray-500">
              Quickly call or text your saved contacts.
            </p>
          </div>

        </div>

        <div className="space-y-4">

          {contacts.map((contact, index) => (
            <div
              key={index}
              className="border rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>

                <h4 className="font-semibold">
                  {contact.name}
                </h4>

                <p className="text-sm text-gray-500">
                  {contact.relationship || "Emergency Contact"}
                </p>

                <p className="text-sm font-medium text-gray-700 mt-1">
                  {contact.phone}
                </p>

              </div>

              <div className="flex gap-3">

                <button
                  onClick={() => makeCall(contact.phone)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  <Phone size={16} />
                  Call
                </button>

                <button
                  onClick={() => sendSMS(contact.phone)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  <MessageSquare size={16} />
                  Text
                </button>

              </div>

            </div>
          ))}

        </div>

        <div className="mt-5 bg-gray-50 rounded-lg p-4 text-sm text-gray-600 flex items-start gap-2">

          <ExternalLink
            className="mt-0.5 text-gray-500"
            size={16}
          />

          <span>
            The <strong>Text</strong> button opens your phone's default SMS
            application with your emergency message and live location already
            filled in. Press <strong>Send</strong> to notify your contact.
          </span>

        </div>

      </div>

    </Card>
  );
};

export default NotifyEmergencyContacts;