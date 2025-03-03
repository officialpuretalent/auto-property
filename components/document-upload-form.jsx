"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const DocumentUploadForm = ({
  formData,
  updateFormData,
  onComplete,
  onBack,
}) => {
  // Initialize with multiple files arrays
  const [localFormData, setLocalFormData] = useState({
    bankStatements: formData.bankStatements || [],
    payslips: formData.payslips || [],
    employmentLetter: formData.employmentLetter || null,
    idDocument: formData.idDocument || null,
  });

  // State to track validation errors
  const [errors, setErrors] = useState({
    bankStatements: "",
    payslips: "",
    employmentLetter: "",
    idDocument: "",
  });

  // Update local state when prop changes
  useEffect(() => {
    const initialData = {
      bankStatements: formData.bankStatements || [],
      payslips: formData.payslips || [],
      employmentLetter: formData.employmentLetter || null,
      idDocument: formData.idDocument || null,
    };
    setLocalFormData(initialData);
  }, [formData]);

  // Handle single file input changes
  const handleSingleFileChange = (e) => {
    const { name, files } = e.target;

    if (!files || !files[0]) return;

    // Check file size (limit to 5MB)
    if (files[0].size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        [name]: "File size exceeds 5MB limit",
      }));
      return;
    }

    // Check file type (allow only PDF, JPG, PNG)
    if (
      !["application/pdf", "image/jpeg", "image/png"].includes(files[0].type)
    ) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Only PDF, JPG, and PNG files are allowed",
      }));
      return;
    }

    setLocalFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));

    // Clear validation error when field is updated
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle multiple file input changes
  const handleMultipleFileChange = (e) => {
    const { name, files } = e.target;

    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    let hasError = false;

    // Validate each file
    fileArray.forEach((file) => {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [name]: `File ${file.name} exceeds 5MB limit`,
        }));
        hasError = true;
      }

      // Check file type (allow only PDF, JPG, PNG)
      if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          [name]: `File ${file.name} is not in an acceptable format (PDF, JPG, PNG)`,
        }));
        hasError = true;
      }
    });

    if (hasError) return;

    setLocalFormData((prev) => ({
      ...prev,
      [name]: [...prev[name], ...fileArray],
    }));

    // Clear validation error when field is updated
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear the input so the same file can be selected again if needed
    e.target.value = "";
  };

  // Remove a file from a multi-file collection
  const removeFile = (fieldName, fileIndex) => {
    setLocalFormData((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, index) => index !== fileIndex),
    }));
  };

  // Get file name for display
  const getFileName = (file) => {
    if (!file) return "No file chosen";
    return file.name;
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};

    // Check required files
    if (
      !localFormData.bankStatements ||
      localFormData.bankStatements.length === 0
    ) {
      newErrors.bankStatements = "At least one bank statement is required";
    }

    if (!localFormData.payslips || localFormData.payslips.length === 0) {
      newErrors.payslips = "At least one pay slip is required";
    }

    if (!localFormData.employmentLetter) {
      newErrors.employmentLetter = "Employment verification letter is required";
    }

    if (!localFormData.idDocument) {
      newErrors.idDocument = "ID document is required";
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
        <Alert className="bg-blue-50">
          <AlertTitle>Document Upload Guidelines</AlertTitle>
          <AlertDescription className="text-sm">
            <p>
              Please provide clear, readable documents in PDF, JPG, or PNG
              format (max 5MB each):
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                Bank statements from the last 3 months (multiple files allowed)
              </li>
              <li>Last 2 pay slips (multiple files allowed)</li>
              <li>
                Employment verification letter (dated within last 30 days)
              </li>
              <li>
                South African ID document, passport, or valid visa/permit for
                non-citizens
              </li>
            </ul>
          </AlertDescription>
        </Alert>

        <Card className="border border-gray-200">
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Bank Statements - Multiple Files */}
              <div className="space-y-2">
                <Label htmlFor="bankStatements" className="font-medium">
                  Bank Statements (Last 3 months) *
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="bankStatements"
                    name="bankStatements"
                    type="file"
                    onChange={handleMultipleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className={`${
                      errors.bankStatements ? "border-red-500" : ""
                    }`}
                    multiple
                  />
                </div>
                {localFormData.bankStatements &&
                  localFormData.bankStatements.length > 0 && (
                    <div className="mt-2 space-y-2">
                      <Label className="text-xs text-gray-500">
                        Uploaded Files:
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {localFormData.bankStatements.map((file, index) => (
                          <Badge
                            key={`bank-${index}`}
                            variant="secondary"
                            className="flex items-center gap-1 py-1 px-2"
                          >
                            <span className="text-xs truncate max-w-xs">
                              {file.name}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0"
                              onClick={() =>
                                removeFile("bankStatements", index)
                              }
                            >
                              <Trash2 className="h-3 w-3 text-red-500" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                {errors.bankStatements && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.bankStatements}
                  </p>
                )}
              </div>

              {/* Pay Slips - Multiple Files */}
              <div className="space-y-2">
                <Label htmlFor="payslips" className="font-medium">
                  Pay Slips (Last 2) *
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="payslips"
                    name="payslips"
                    type="file"
                    onChange={handleMultipleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className={`${errors.payslips ? "border-red-500" : ""}`}
                    multiple
                  />
                </div>
                {localFormData.payslips &&
                  localFormData.payslips.length > 0 && (
                    <div className="mt-2 space-y-2">
                      <Label className="text-xs text-gray-500">
                        Uploaded Files:
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {localFormData.payslips.map((file, index) => (
                          <Badge
                            key={`pay-${index}`}
                            variant="secondary"
                            className="flex items-center gap-1 py-1 px-2"
                          >
                            <span className="text-xs truncate max-w-xs">
                              {file.name}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0"
                              onClick={() => removeFile("payslips", index)}
                            >
                              <Trash2 className="h-3 w-3 text-red-500" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                {errors.payslips && (
                  <p className="text-red-500 text-sm mt-1">{errors.payslips}</p>
                )}
              </div>

              {/* Employment Verification Letter - Single File */}
              <div className="space-y-2">
                <Label htmlFor="employmentLetter" className="font-medium">
                  Employment Verification Letter *
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="employmentLetter"
                    name="employmentLetter"
                    type="file"
                    onChange={handleSingleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className={`${
                      errors.employmentLetter ? "border-red-500" : ""
                    }`}
                  />
                  {localFormData.employmentLetter && (
                    <span className="text-sm text-green-600 truncate max-w-xs">
                      {getFileName(localFormData.employmentLetter)}
                    </span>
                  )}
                </div>
                {errors.employmentLetter && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.employmentLetter}
                  </p>
                )}
              </div>

              {/* ID Document - Single File */}
              <div className="space-y-2">
                <Label htmlFor="idDocument" className="font-medium">
                  South African ID Document/Passport *
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="idDocument"
                    name="idDocument"
                    type="file"
                    onChange={handleSingleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className={`${errors.idDocument ? "border-red-500" : ""}`}
                  />
                  {localFormData.idDocument && (
                    <span className="text-sm text-green-600 truncate max-w-xs">
                      {getFileName(localFormData.idDocument)}
                    </span>
                  )}
                </div>
                {errors.idDocument && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.idDocument}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

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
            Next: Review Application
          </Button>
        </div>
      </div>
    </form>
  );
};
