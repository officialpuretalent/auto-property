"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Clock, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const AIReview = ({ formData, onComplete, onBack }) => {
  // State to manage review process and findings
  const [reviewState, setReviewState] = useState("idle");
  const [findings, setFindings] = useState([]);
  const [overallAssessment, setOverallAssessment] = useState(null);

  // Start the review process
  const startReview = () => {
    setReviewState("loading");

    // Simulate AI review process
    setTimeout(() => {
      performAIReview();
    }, 3000);
  };

  // Perform mock AI review of application data
  const performAIReview = () => {
    const newFindings = [];
    let issueCount = 0;

    // Check property information
    if (formData.property.selectionMethod === "link") {
      if (!formData.property.propertyLink.includes("http")) {
        newFindings.push({
          category: "Property Information",
          field: "Property Link",
          issue: "The property link format appears to be invalid.",
          severity: "medium",
        });
        issueCount++;
      }
    } else {
      // Check rent affordability compared to income
      const rent = parseFloat(formData.property.rentAmount);
      const income = parseFloat(formData.employment.monthlyIncome);

      if (rent > income * 0.4) {
        newFindings.push({
          category: "Property Affordability",
          field: "Rent to Income Ratio",
          issue: `The monthly rent (R${rent.toLocaleString()}) is more than 40% of your stated monthly income (R${income.toLocaleString()}). Most landlords prefer rent to be no more than 30-35% of income.`,
          severity: "high",
        });
        issueCount++;
      } else if (rent > income * 0.3) {
        newFindings.push({
          category: "Property Affordability",
          field: "Rent to Income Ratio",
          issue: `The monthly rent (R${rent.toLocaleString()}) is slightly high relative to your stated monthly income (R${income.toLocaleString()}). This is borderline for many landlords.`,
          severity: "medium",
        });
        issueCount++;
      }
    }

    // Check personal information
    if (
      !formData.personal.email.includes("@") ||
      !formData.personal.email.includes(".")
    ) {
      newFindings.push({
        category: "Personal Information",
        field: "Email Address",
        issue: "The email address format appears to be invalid.",
        severity: "high",
      });
      issueCount++;
    }

    if (formData.personal.phone.length < 10) {
      newFindings.push({
        category: "Personal Information",
        field: "Phone Number",
        issue:
          "The phone number appears to be too short for a South African number.",
        severity: "medium",
      });
      issueCount++;
    }

    // Check employment information
    const income = parseFloat(formData.employment.monthlyIncome);
    if (income < 5000) {
      newFindings.push({
        category: "Employment Information",
        field: "Monthly Income",
        issue:
          "The reported monthly income (R " +
          income.toLocaleString() +
          ") may be below the minimum requirement for this property.",
        severity: "high",
      });
      issueCount++;
    }

    if (formData.employment.employmentDuration === "Less than 6 months") {
      newFindings.push({
        category: "Employment Information",
        field: "Employment Duration",
        issue:
          "Short employment duration may require additional income verification or a co-signer.",
        severity: "medium",
      });
      issueCount++;
    }

    // Check document uploads
    if (formData.documents.bankStatements.length < 3) {
      newFindings.push({
        category: "Documents",
        field: "Bank Statements",
        issue:
          "Fewer than 3 months of bank statements were provided. Most landlords require 3 months of statements.",
        severity: "medium",
      });
      issueCount++;
    }

    if (formData.documents.payslips.length < 2) {
      newFindings.push({
        category: "Documents",
        field: "Pay Slips",
        issue:
          "Fewer than 2 pay slips were provided. Most landlords require at least 2 recent pay slips.",
        severity: "medium",
      });
      issueCount++;
    }

    // If no issues found, add a positive finding
    if (newFindings.length === 0) {
      newFindings.push({
        category: "Overall",
        field: "All Fields",
        issue:
          "No issues detected in your application. All requirements appear to be met.",
        severity: "none",
      });

      setOverallAssessment({
        status: "positive",
        message:
          "Your application looks strong and meets all basic requirements.",
      });
    } else {
      // Set overall assessment based on severity of issues
      const hasHighSeverity = newFindings.some(
        (finding) => finding.severity === "high"
      );

      if (hasHighSeverity) {
        setOverallAssessment({
          status: "negative",
          message:
            "Your application has some critical issues that should be addressed before submission.",
        });
      } else {
        setOverallAssessment({
          status: "warning",
          message:
            "Your application has some minor issues that could be improved, but you may still proceed.",
        });
      }
    }

    setFindings(newFindings);
    setReviewState("complete");
  };

  // Render the severity indicator
  const renderSeverityIndicator = (severity) => {
    switch (severity) {
      case "high":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "medium":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "low":
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case "none":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  // Handle form submission
  const handleComplete = () => {
    onComplete();
  };

  return (
    <div className="space-y-6">
      {reviewState === "idle" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI Application Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Our AI assistant will analyze your application and provide
              feedback on any potential issues before you submit. This helps
              identify problems that might delay your application or result in
              rejection.
            </p>

            <Alert>
              <AlertTitle className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Ready for Review
              </AlertTitle>
              <AlertDescription>
                Click the button below to begin the AI review process. This
                typically takes less than a minute.
              </AlertDescription>
            </Alert>

            <Button onClick={startReview} className="w-full mt-4">
              Begin AI Review
            </Button>
          </CardContent>
        </Card>
      )}

      {reviewState === "loading" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Analyzing Your Application
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-16 w-16 text-blue-500 animate-spin mb-4" />
            <p className="text-center">
              Our AI is reviewing your application documents and information.
              <br />
              This will only take a moment...
            </p>
          </CardContent>
        </Card>
      )}

      {reviewState === "complete" && (
        <>
          <Card
            className={`border-l-4 ${
              overallAssessment?.status === "positive"
                ? "border-l-green-500"
                : overallAssessment?.status === "warning"
                ? "border-l-amber-500"
                : "border-l-red-500"
            }`}
          >
            <CardHeader>
              <CardTitle className="text-lg">AI Review Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                {overallAssessment?.status === "positive" && (
                  <CheckCircle className="h-8 w-8 text-green-500 mt-1 flex-shrink-0" />
                )}
                {overallAssessment?.status === "warning" && (
                  <AlertCircle className="h-8 w-8 text-amber-500 mt-1 flex-shrink-0" />
                )}
                {overallAssessment?.status === "negative" && (
                  <AlertCircle className="h-8 w-8 text-red-500 mt-1 flex-shrink-0" />
                )}

                <div>
                  <h3 className="font-medium text-lg">Overall Assessment</h3>
                  <p className="text-gray-700">{overallAssessment?.message}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detailed Findings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {findings.map((finding, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-md ${
                      finding.severity === "high"
                        ? "bg-red-50"
                        : finding.severity === "medium"
                        ? "bg-amber-50"
                        : finding.severity === "low"
                        ? "bg-blue-50"
                        : "bg-green-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {renderSeverityIndicator(finding.severity)}
                      </div>
                      <div>
                        <h4 className="font-medium">
                          {finding.category}: {finding.field}
                        </h4>
                        <p className="text-sm mt-1">{finding.issue}</p>
                      </div>
                    </div>
                  </div>
                ))}
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
              Back to Review
            </Button>
            <Button
              onClick={handleComplete}
              className={`w-full sm:flex-1 ${
                overallAssessment?.status === "positive"
                  ? "bg-green-600 hover:bg-green-700"
                  : overallAssessment?.status === "warning"
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-gray-600 hover:bg-gray-700"
              }`}
            >
              Submit Application
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
