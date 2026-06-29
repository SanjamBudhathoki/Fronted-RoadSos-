// src/components/EmergencyContacts.jsx

import { useEffect, useState } from "react";
import { emergencyContactsService } from "../services/emergencyContactsServices";

const emptyContact = {
  name: "",
  phone: "",
  relationship: "",
};

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
      alert("Failed to load emergency contacts.");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (index, field, value) => {
    const updated = [...contacts];
    updated[index][field] = value;
    setContacts(updated);
  };

  const addContact = () => {
    if (contacts.length >= 5) {
      return alert("Maximum 5 emergency contacts allowed.");
    }

    setContacts([...contacts, { ...emptyContact }]);
  };

  const removeContact = (index) => {
    const updated = contacts.filter((_, i) => i !== index);
    setContacts(updated);
  };

  const validate = () => {
    for (const contact of contacts) {
      if (!contact.name.trim()) {
        alert("Contact name is required.");
        return false;
      }

      if (!contact.phone.trim()) {
        alert("Phone number is required.");
        return false;
      }
    }

    return true;
  };

  const saveContacts = async () => {
    if (!validate()) return;

    try {
      setSaving(true);

      const res = await emergencyContactsService.updateContacts(contacts);

      if (res.success) {
        alert("Emergency contacts updated successfully.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save emergency contacts.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        Loading emergency contacts...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-6">

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">
            Emergency Contacts
          </h2>
          <p className="text-sm text-gray-500">
            These contacts can be notified during an emergency.
          </p>
        </div>

        <button
          onClick={addContact}
          disabled={contacts.length >= 5}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          + Add Contact
        </button>
      </div>

      {contacts.length === 0 && (
        <div className="text-center text-gray-500 py-6 border rounded-lg">
          No emergency contacts added yet.
        </div>
      )}

      <div className="space-y-4">

        {contacts.map((contact, index) => (
          <div
            key={index}
            className="border rounded-xl p-4 grid md:grid-cols-4 gap-4"
          >

            <input
              type="text"
              placeholder="Full Name"
              value={contact.name}
              onChange={(e) =>
                updateField(index, "name", e.target.value)
              }
              className="border rounded-lg px-3 py-2"
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={contact.phone}
              onChange={(e) =>
                updateField(index, "phone", e.target.value)
              }
              className="border rounded-lg px-3 py-2"
            />

            <input
              type="text"
              placeholder="Relationship"
              value={contact.relationship}
              onChange={(e) =>
                updateField(index, "relationship", e.target.value)
              }
              className="border rounded-lg px-3 py-2"
            />

            <button
              onClick={() => removeContact(index)}
              className="bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Remove
            </button>

          </div>
        ))}

      </div>

      <div className="flex justify-end">

        <button
          onClick={saveContacts}
          disabled={saving}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Contacts"}
        </button>

      </div>

    </div>
  );
};

export default EmergencyContacts;