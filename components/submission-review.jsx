"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export const ReviewSubmission = ({ formData, onSubmit, onBack }) => {
  // State for consent checkbox
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentError, setConsentError] = useState("");

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "Not provided";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get file name for display
  const getFileName = (file) => {
    if (!file) return "No file uploaded";
    return file.name;
  };

  // Display multiple files
  const getMultipleFileNames = (files) => {
    if (!files || files.length === 0) return "No files uploaded";
    return `${files.length} file(s) uploaded`;
  };

  // Handle submit with consent validation
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!consentChecked) {
      setConsentError(
        "You must certify that all information is correct before submitting"
      );
      return;
    }

    onSubmit();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Property Information</CardTitle>
        </CardHeader>
        <CardContent>
          {formData.property.selectionMethod === "link" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Property Link</span>
                <p className="break-all">{formData.property.propertyLink}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Property Code</span>
                <p>{formData.property.propertyCode}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="col-span-2">
                <span className="text-sm text-gray-500">Property Address</span>
                <p>{formData.property.manualAddress}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Property Type</span>
                  <p>{formData.property.propertyType}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Bedrooms</span>
                  <p>{formData.property.bedrooms}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Bathrooms</span>
                  <p>{formData.property.bathrooms}</p>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Monthly Rent</span>
                <p>
                  R {parseFloat(formData.property.rentAmount).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">Full Name</span>
              <p>
                {formData.personal.firstName} {formData.personal.lastName}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Email</span>
              <p>{formData.personal.email}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Phone</span>
              <p>{formData.personal.phone}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">
                Preferred Move-in Date
              </span>
              <p>{formatDate(formData.personal.moveInDate)}</p>
            </div>
            <div className="col-span-2">
              <span className="text-sm text-gray-500">Current Address</span>
              <p>{formData.personal.currentAddress}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Employment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">Employer</span>
              <p>{formData.employment.employer}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Position</span>
              <p>{formData.employment.position}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Monthly Income</span>
              <p>
                R{" "}
                {parseFloat(formData.employment.monthlyIncome).toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Employment Duration</span>
              <p>{formData.employment.employmentDuration}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Supervisor Name</span>
              <p>{formData.employment.supervisorName}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Supervisor Contact</span>
              <p>{formData.employment.supervisorContact}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Supporting Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <span className="text-sm text-gray-500">Bank Statements</span>
              <div className="text-green-600">
                {getMultipleFileNames(formData.documents.bankStatements)}
                {formData.documents.bankStatements &&
                  formData.documents.bankStatements.length > 0 && (
                    <ul className="list-disc pl-5 mt-1 text-sm">
                      {formData.documents.bankStatements.map((file, index) => (
                        <li key={`bank-${index}`}>{file.name}</li>
                      ))}
                    </ul>
                  )}
              </div>
            </div>

            <div>
              <span className="text-sm text-gray-500">Pay Slips</span>
              <div className="text-green-600">
                {getMultipleFileNames(formData.documents.payslips)}
                {formData.documents.payslips &&
                  formData.documents.payslips.length > 0 && (
                    <ul className="list-disc pl-5 mt-1 text-sm">
                      {formData.documents.payslips.map((file, index) => (
                        <li key={`pay-${index}`}>{file.name}</li>
                      ))}
                    </ul>
                  )}
              </div>
            </div>

            <div>
              <span className="text-sm text-gray-500">
                Employment Verification Letter
              </span>
              <p className="text-green-600">
                {getFileName(formData.documents.employmentLetter)}
              </p>
            </div>

            <div>
              <span className="text-sm text-gray-500">ID Document</span>
              <p className="text-green-600">
                {getFileName(formData.documents.idDocument)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="consent"
            checked={consentChecked}
            onCheckedChange={(checked) => {
              setConsentChecked(checked);
              if (checked) setConsentError("");
            }}
            className={consentError ? "border-red-500" : ""}
          />
          <div className="space-y-1 leading-none">
            <Label
              htmlFor="consent"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I certify that all information provided in this application is
              true and correct to the best of my knowledge.
            </Label>
            <p className="text-xs text-gray-500">
              By submitting this application, I consent to background and credit
              checks as part of the approval process.
            </p>
            {consentError && (
              <p className="text-red-500 text-xs mt-1">{consentError}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4 gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          Submit Application
        </Button>
      </div>
    </div>
  );
};
