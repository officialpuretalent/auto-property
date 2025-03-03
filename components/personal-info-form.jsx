"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const PersonalInfoForm = ({ formData, updateFormData, onComplete }) => {
  // Local state to manage form inputs
  const [localFormData, setLocalFormData] = useState(formData);

  // State to track validation errors
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    currentAddress: "",
    moveInDate: "",
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

  // Handle date selection
  const handleDateChange = (date) => {
    setLocalFormData((prev) => ({
      ...prev,
      moveInDate: date,
    }));

    // Clear validation error
    if (errors.moveInDate) {
      setErrors((prev) => ({
        ...prev,
        moveInDate: "",
      }));
    }
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};

    // Check for empty required fields
    if (!localFormData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!localFormData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!localFormData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(localFormData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!localFormData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!localFormData.currentAddress.trim()) {
      newErrors.currentAddress = "Current address is required";
    }

    if (!localFormData.moveInDate) {
      newErrors.moveInDate = "Preferred move-in date is required";
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

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              name="firstName"
              value={localFormData.firstName}
              onChange={handleInputChange}
              placeholder="John"
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              name="lastName"
              value={localFormData.lastName}
              onChange={handleInputChange}
              placeholder="Doe"
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={localFormData.email}
            onChange={handleInputChange}
            placeholder="john.doe@example.com"
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            name="phone"
            value={localFormData.phone}
            onChange={handleInputChange}
            placeholder="071 234 5678"
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentAddress">Current Address *</Label>
          <Input
            id="currentAddress"
            name="currentAddress"
            value={localFormData.currentAddress}
            onChange={handleInputChange}
            placeholder="23 Mandela St, Flat 4, Johannesburg, Gauteng, 2000"
            className={errors.currentAddress ? "border-red-500" : ""}
          />
          {errors.currentAddress && (
            <p className="text-red-500 text-sm mt-1">{errors.currentAddress}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="moveInDate">Preferred Move-in Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${
                  errors.moveInDate ? "border-red-500" : ""
                }`}
              >
                {localFormData.moveInDate ? (
                  formatDate(localFormData.moveInDate)
                ) : (
                  <span>Select a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={localFormData.moveInDate}
                onSelect={handleDateChange}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
          {errors.moveInDate && (
            <p className="text-red-500 text-sm mt-1">{errors.moveInDate}</p>
          )}
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full">
            Next: Employment Information
          </Button>
        </div>
      </div>
    </form>
  );
};
