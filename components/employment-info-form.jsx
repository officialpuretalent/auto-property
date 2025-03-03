"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const EmploymentInfoForm = ({
  formData,
  updateFormData,
  onComplete,
  onBack,
}) => {
  // Local state to manage form inputs
  const [localFormData, setLocalFormData] = useState(formData);

  // State to track validation errors
  const [errors, setErrors] = useState({
    employer: "",
    position: "",
    monthlyIncome: "",
    employmentDuration: "",
    supervisorName: "",
    supervisorContact: "",
  });

  // Update local state when prop changes
  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when field is updated
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle select input changes
  const handleSelectChange = (name, value) => {
    setLocalFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when field is updated
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};

    // Check for empty required fields
    if (!localFormData.employer.trim()) {
      newErrors.employer = "Employer name is required";
    }

    if (!localFormData.position.trim()) {
      newErrors.position = "Position/Title is required";
    }

    if (!localFormData.monthlyIncome.trim()) {
      newErrors.monthlyIncome = "Monthly income is required";
    } else if (isNaN(parseFloat(localFormData.monthlyIncome))) {
      newErrors.monthlyIncome = "Please enter a valid number";
    }

    if (!localFormData.employmentDuration) {
      newErrors.employmentDuration = "Employment duration is required";
    }

    if (!localFormData.supervisorName.trim()) {
      newErrors.supervisorName = "Supervisor name is required";
    }

    if (!localFormData.supervisorContact.trim()) {
      newErrors.supervisorContact = "Supervisor contact is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (validateForm()) {
      // Update parent component state
      updateFormData(localFormData);

      // Notify parent component that this step is complete
      onComplete();
    }
  };

  // Duration options for the select dropdown
  const durationOptions = [
    "Less than 6 months",
    "6 months - 1 year",
    "1 - 2 years",
    "2 - 5 years",
    "More than 5 years",
  ];

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="employer">Current Employer *</Label>
          <Input
            id="employer"
            name="employer"
            value={localFormData.employer}
            onChange={handleInputChange}
            placeholder="Company Name"
            className={errors.employer ? "border-red-500" : ""}
          />
          {errors.employer && (
            <p className="text-red-500 text-sm mt-1">{errors.employer}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">Position/Title *</Label>
          <Input
            id="position"
            name="position"
            value={localFormData.position}
            onChange={handleInputChange}
            placeholder="Software Engineer"
            className={errors.position ? "border-red-500" : ""}
          />
          {errors.position && (
            <p className="text-red-500 text-sm mt-1">{errors.position}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="monthlyIncome">Monthly Income (ZAR) *</Label>
          <Input
            id="monthlyIncome"
            name="monthlyIncome"
            value={localFormData.monthlyIncome}
            onChange={handleInputChange}
            placeholder="15000"
            type="number"
            min="0"
            step="0.01"
            className={errors.monthlyIncome ? "border-red-500" : ""}
          />
          {errors.monthlyIncome && (
            <p className="text-red-500 text-sm mt-1">{errors.monthlyIncome}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="employmentDuration">Employment Duration *</Label>
          <Select
            value={localFormData.employmentDuration}
            onValueChange={(value) =>
              handleSelectChange("employmentDuration", value)
            }
          >
            <SelectTrigger
              className={errors.employmentDuration ? "border-red-500" : ""}
            >
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {durationOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.employmentDuration && (
            <p className="text-red-500 text-sm mt-1">
              {errors.employmentDuration}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="supervisorName">Supervisor Name *</Label>
            <Input
              id="supervisorName"
              name="supervisorName"
              value={localFormData.supervisorName}
              onChange={handleInputChange}
              placeholder="Jane Smith"
              className={errors.supervisorName ? "border-red-500" : ""}
            />
            {errors.supervisorName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.supervisorName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="supervisorContact">Supervisor Contact *</Label>
            <Input
              id="supervisorContact"
              name="supervisorContact"
              value={localFormData.supervisorContact}
              onChange={handleInputChange}
              placeholder="jane.smith@company.com"
              className={errors.supervisorContact ? "border-red-500" : ""}
            />
            {errors.supervisorContact && (
              <p className="text-red-500 text-sm mt-1">
                {errors.supervisorContact}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between pt-4 gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="w-full mb-2 sm:mb-0 sm:flex-1"
          >
            Back
          </Button>
          <Button type="submit" className="w-full sm:flex-1">
            Next: Document Upload
          </Button>
        </div>
      </div>
    </form>
  );
};
