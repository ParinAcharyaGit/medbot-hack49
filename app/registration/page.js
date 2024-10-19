'use client'
import { Button } from "../components/ui/button";
import { useState } from "react";

export default function Registration() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    occupation: "",
    dob: "",
    gender: "",
    emergencyContact: "",
    primaryPhysician: "",
    currentMedications: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    // Redirect to patient dashboard
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Registration Page</h1>
      <form className="flex flex-col w-full max-w-md" onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          required
          value={formData.fullName}
          onChange={handleChange}
          className="mb-2 p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={handleChange}
          className="mb-2 p-2 border rounded"
        />
        <input
          type="text"
          name="occupation"
          placeholder="Occupation"
          required
          value={formData.occupation}
          onChange={handleChange}
          className="mb-2 p-2 border rounded"
        />
        <input
          type="date"
          name="dob"
          required
          value={formData.dob}
          onChange={handleChange}
          className="mb-2 p-2 border rounded"
        />
        <select
          name="gender"
          required
          value={formData.gender}
          onChange={handleChange}
          className="mb-2 p-2 border rounded"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input
          type="text"
          name="emergencyContact"
          placeholder="Emergency Contact"
          required
          value={formData.emergencyContact}
          onChange={handleChange}
          className="mb-2 p-2 border rounded"
        />
        <select
          name="primaryPhysician"
          required
          value={formData.primaryPhysician}
          onChange={handleChange}
          className="mb-2 p-2 border rounded"
        >
          <option value="">Select Primary Physician</option>
          <option value="physician1">Physician 1</option>
          <option value="physician2">Physician 2</option>
          {/* Add more options as needed */}
        </select>
        <textarea
          name="currentMedications"
          placeholder="Current Medications"
          value={formData.currentMedications}
          onChange={handleChange}
          className="mb-2 p-2 border rounded"
        />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
