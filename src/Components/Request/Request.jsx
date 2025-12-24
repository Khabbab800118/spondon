import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../Provider/AuthContext";
import axios from "axios";
import { showSuccess } from "../Alert/Alert";

const Request = () => {
  const { user } = useContext(AuthContext);
  const [donors, setDonors] = useState([]);
  const [formData, setFormData] = useState({
    requesterName: "",
    requesterEmail: "",
    recipientName: "",
    recipientDistrict: "",
    recipientArea: "",
    hospitalName: "",
    fullAddress: "",
    bloodGroup: "",
    donorEmail: "", // <-- added field
    donationDate: "",
    donationTime: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [status, setStatus] = useState("");

  // Set requester name & email from logged-in user
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        requesterName: user.name || "",
        requesterEmail: user.email || "",
      }));
    }
  }, [user]);

  // Fetch active donors
  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const res = await axios.get(
          "https://spondon-server.onrender.com/active-donors"
        );
        setDonors(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDonors();
  }, []);

  // Update donor email when blood group changes
  useEffect(() => {
    if (formData.bloodGroup) {
      const matchedDonor = donors.find(
        (d) => d.bloodGroup === formData.bloodGroup
      );
      setFormData((prev) => ({
        ...prev,
        donorEmail: matchedDonor ? matchedDonor.email : "",
      }));
    }
  }, [formData.bloodGroup, donors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("inprogress");
    setSuccessMsg("");
    try {
      const requestData = { ...formData, status: "inprogress" };
      await axios.post(
        "https://spondon-server.onrender.com/requests",
        requestData
      );
      await showSuccess("Request submitted successfully!");
      setFormData((prev) => ({
        ...prev,
        recipientName: "",
        recipientDistrict: "",
        recipientArea: "",
        hospitalName: "",
        fullAddress: "",
        bloodGroup: "",
        donorEmail: "",
        donationDate: "",
        donationTime: "",
        message: "",
        status: status,
      }));
    } catch (err) {
      console.error(err);
      await showSuccess("Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  // Get unique blood groups for the dropdown
  const bloodGroups = [...new Set(donors.map((d) => d.bloodGroup))];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded mt-6">
      <h2 className="text-2xl font-bold mb-4">Blood Donation Request</h2>

      {successMsg && <p className="text-green-600 mb-4">{successMsg}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Requester Name */}
        <div>
          <label className="block font-semibold">Requester Name</label>
          <input
            type="text"
            name="requesterName"
            value={user?.displayName || formData.requesterName}
            readOnly
            className="w-full border p-2 rounded bg-gray-100"
          />
        </div>

        {/* Requester Email */}
        <div>
          <label className="block font-semibold">Requester Email</label>
          <input
            type="email"
            name="requesterEmail"
            value={formData.requesterEmail}
            readOnly
            className="w-full border p-2 rounded bg-gray-100"
          />
        </div>

        {/* Recipient Name */}
        <div>
          <label className="block font-semibold">Recipient Name</label>
          <input
            type="text"
            name="recipientName"
            value={formData.recipientName}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Recipient District */}
        <div>
          <label className="block font-semibold">Recipient District</label>
          <select
            name="recipientDistrict"
            value={formData.recipientDistrict}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Select District</option>
            <option value="Dhaka">Dhaka</option>
            <option value="Chittagong">Chittagong</option>
            <option value="Khulna">Khulna</option>
            <option value="Rajshahi">Rajshahi</option>
            <option value="Sylhet">Sylhet</option>
            <option value="Barishal">Barishal</option>
            <option value="Rangpur">Rangpur</option>
            <option value="Mymensingh">Mymensingh</option>
          </select>
        </div>

        {/* Recipient Area */}
        <div>
          <label className="block font-semibold">Recipient Area</label>
          <input
            type="text"
            name="recipientArea"
            value={formData.recipientArea}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Hospital Name */}
        <div>
          <label className="block font-semibold">Hospital Name</label>
          <input
            type="text"
            name="hospitalName"
            value={formData.hospitalName}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Full Address */}
        <div>
          <label className="block font-semibold">Full Address</label>
          <input
            type="text"
            name="fullAddress"
            value={formData.fullAddress}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Blood Group */}
        <div>
          <label className="block font-semibold">Blood Group</label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Select Blood Group</option>
            {bloodGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        {/* Donation Date */}
        <div>
          <label className="block font-semibold">Donation Date</label>
          <input
            type="date"
            name="donationDate"
            value={formData.donationDate}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Donation Time */}
        <div>
          <label className="block font-semibold">Donation Time</label>
          <input
            type="time"
            name="donationTime"
            value={formData.donationTime}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Request Message */}
        <div>
          <label className="block font-semibold">Request Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            required
            className="w-full border p-2 rounded"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700"
          >
            {loading ? "Submitting..." : "Request"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Request;
