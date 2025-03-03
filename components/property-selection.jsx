"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const PropertySelection = ({
  formData,
  updateFormData,
  onComplete,
  onBack,
}) => {
  // Local state to manage form inputs
  const [localFormData, setLocalFormData] = useState(
    formData.property || {
      selectionMethod: "link",
      propertyLink: "",
      manualAddress: "",
      propertyType: "",
      bedrooms: "",
      bathrooms: "",
      rentAmount: "",
      moveInDate: null,
      propertyCode: "",
    }
  );

  // State to track validation errors
  const [errors, setErrors] = useState({
    propertyLink: "",
    manualAddress: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    rentAmount: "",
    propertyCode: "",
  });

  // State to manage the selection method tab
  const [selectionTab, setSelectionTab] = useState(
    localFormData.selectionMethod || "link"
  );

  // Update local state when prop changes
  useEffect(() => {
    if (formData.property) {
      setLocalFormData(formData.property);
      setSelectionTab(formData.property.selectionMethod || "link");
    }
  }, [formData.property]);

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

  // Handle selection method change
  const handleSelectionMethodChange = (value) => {
    setSelectionTab(value);
    setLocalFormData((prev) => ({
      ...prev,
      selectionMethod: value,
    }));
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};

    if (selectionTab === "link") {
      // Validate property link
      if (!localFormData.propertyLink.trim()) {
        newErrors.propertyLink = "Property link is required";
      } else if (!localFormData.propertyLink.includes("http")) {
        newErrors.propertyLink = "Please enter a valid URL";
      }

      // Validate property code
      if (!localFormData.propertyCode.trim()) {
        newErrors.propertyCode = "Property code is required";
      }
    } else {
      // Validate manual property details
      if (!localFormData.manualAddress.trim()) {
        newErrors.manualAddress = "Property address is required";
      }

      if (!localFormData.propertyType) {
        newErrors.propertyType = "Property type is required";
      }

      if (!localFormData.bedrooms) {
        newErrors.bedrooms = "Number of bedrooms is required";
      }

      if (!localFormData.bathrooms) {
        newErrors.bathrooms = "Number of bathrooms is required";
      }

      if (!localFormData.rentAmount.trim()) {
        newErrors.rentAmount = "Monthly rent amount is required";
      } else if (isNaN(parseFloat(localFormData.rentAmount))) {
        newErrors.rentAmount = "Please enter a valid number";
      }
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

  // Property type options
  const propertyTypes = [
    "Apartment",
    "House",
    "Townhouse",
    "Flat",
    "Studio",
    "Duplex",
    "Cottage",
    "Room in Shared House",
  ];

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div className="text-lg font-medium">Property Information</div>
        <p className="text-gray-600">
          Please provide information about the property you're interested in
          renting.
        </p>

        <Tabs value={selectionTab} onValueChange={handleSelectionMethodChange}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="link">Use Property Link</TabsTrigger>
            <TabsTrigger value="manual">Enter Property Details</TabsTrigger>
          </TabsList>

          <TabsContent value="link">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyLink">Property Listing URL *</Label>
                  <Input
                    id="propertyLink"
                    name="propertyLink"
                    value={localFormData.propertyLink}
                    onChange={handleInputChange}
                    placeholder="https://property-site.co.za/listing/123"
                    className={errors.propertyLink ? "border-red-500" : ""}
                  />
                  {errors.propertyLink && (
                    <p className="text-red-500 text-sm">
                      {errors.propertyLink}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Paste the full web address for the property listing you want
                    to apply for.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="propertyCode">
                    Property Code/Reference *
                  </Label>
                  <Input
                    id="propertyCode"
                    name="propertyCode"
                    value={localFormData.propertyCode}
                    onChange={handleInputChange}
                    placeholder="ABC12345"
                    className={errors.propertyCode ? "border-red-500" : ""}
                  />
                  {errors.propertyCode && (
                    <p className="text-red-500 text-sm">
                      {errors.propertyCode}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Enter the reference code found on the property listing.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="manualAddress">Full Property Address *</Label>
                  <Input
                    id="manualAddress"
                    name="manualAddress"
                    value={localFormData.manualAddress}
                    onChange={handleInputChange}
                    placeholder="Unit 5, 123 Nelson Mandela Blvd, Cape Town, 8001"
                    className={errors.manualAddress ? "border-red-500" : ""}
                  />
                  {errors.manualAddress && (
                    <p className="text-red-500 text-sm">
                      {errors.manualAddress}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="propertyType">Property Type *</Label>
                    <Select
                      value={localFormData.propertyType}
                      onValueChange={(value) =>
                        handleSelectChange("propertyType", value)
                      }
                    >
                      <SelectTrigger
                        className={errors.propertyType ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.propertyType && (
                      <p className="text-red-500 text-sm">
                        {errors.propertyType}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rentAmount">Monthly Rent (ZAR) *</Label>
                    <Input
                      id="rentAmount"
                      name="rentAmount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={localFormData.rentAmount}
                      onChange={handleInputChange}
                      placeholder="7500"
                      className={errors.rentAmount ? "border-red-500" : ""}
                    />
                    {errors.rentAmount && (
                      <p className="text-red-500 text-sm">
                        {errors.rentAmount}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms *</Label>
                    <Select
                      value={localFormData.bedrooms}
                      onValueChange={(value) =>
                        handleSelectChange("bedrooms", value)
                      }
                    >
                      <SelectTrigger
                        className={errors.bedrooms ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select bedrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Studio", "1", "2", "3", "4", "5+"].map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.bedrooms && (
                      <p className="text-red-500 text-sm">{errors.bedrooms}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms *</Label>
                    <Select
                      value={localFormData.bathrooms}
                      onValueChange={(value) =>
                        handleSelectChange("bathrooms", value)
                      }
                    >
                      <SelectTrigger
                        className={errors.bathrooms ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select bathrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        {["1", "1.5", "2", "2.5", "3", "3+"].map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.bathrooms && (
                      <p className="text-red-500 text-sm">{errors.bathrooms}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col sm:flex-row justify-between pt-4 gap-4">
          <Button
            type="button"
            variant="outline"
            disabled
            className="w-full mb-2 sm:mb-0 sm:flex-1 opacity-50"
          >
            Back
          </Button>
          <Button type="submit" className="w-full sm:flex-1">
            Next: Personal Information
          </Button>
        </div>
      </div>
    </form>
  );
};
