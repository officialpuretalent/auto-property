"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmploymentInfoForm } from "@/components/employment-info-form";
import { DocumentUploadForm } from "@/components/document-upload-form";
import { PropertySelection } from "@/components/property-selection";
import { PersonalInfoForm } from "@/components/personal-info-form";
import { ReviewSubmission } from "@/components/submission-review";
import { AIReview } from "@/components/ai-review";
import { CheckCircle2 } from "lucide-react";

const RentalApplicationApp = () => {
  // State to track the current step in the application process
  const [activeTab, setActiveTab] = useState("property");

  // State to store all form data across different steps
  const [formData, setFormData] = useState({
    property: {
      selectionMethod: "link",
      propertyLink: "",
      manualAddress: "",
      propertyType: "",
      bedrooms: "",
      bathrooms: "",
      rentAmount: "",
      propertyCode: "",
    },
    personal: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      currentAddress: "",
      moveInDate: null,
    },
    employment: {
      employer: "",
      position: "",
      monthlyIncome: "",
      employmentDuration: "",
      supervisorName: "",
      supervisorContact: "",
    },
    documents: {
      bankStatements: [],
      payslips: [],
      employmentLetter: null,
      idDocument: null,
    },
  });

  // State to track form completion for each step
  const [completedSteps, setCompletedSteps] = useState({
    property: false,
    personal: false,
    employment: false,
    documents: false,
    review: false,
    aiReview: false,
  });

  // Function to update form data for a specific section
  const updateFormData = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      },
    }));
  };

  // Function to mark a step as completed
  const markStepComplete = (step) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [step]: true,
    }));
  };

  // Navigate to the next step
  const goToNextStep = () => {
    if (activeTab === "property") {
      setActiveTab("personal");
    } else if (activeTab === "personal") {
      setActiveTab("employment");
    } else if (activeTab === "employment") {
      setActiveTab("documents");
    } else if (activeTab === "documents") {
      setActiveTab("review");
    } else if (activeTab === "review") {
      setActiveTab("aiReview");
    }
  };

  // Navigate to the previous step
  const goToPreviousStep = () => {
    if (activeTab === "personal") {
      setActiveTab("property");
    } else if (activeTab === "employment") {
      setActiveTab("personal");
    } else if (activeTab === "documents") {
      setActiveTab("employment");
    } else if (activeTab === "review") {
      setActiveTab("documents");
    } else if (activeTab === "aiReview") {
      setActiveTab("review");
    }
  };

  // Submit the entire application
  const submitApplication = () => {
    console.log("Submitting application with data:", formData);
    // Here we would normally send the data to an API endpoint
    alert("Your application has been submitted successfully!");
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Apartment Rental Application
          </CardTitle>
          <CardDescription>
            Please complete all sections of this application to apply for an
            apartment rental.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-8">
              <TabsTrigger value="property" className="relative">
                Property
                {completedSteps.property && (
                  <CheckCircle2 className="h-4 w-4 ml-2 text-green-500" />
                )}
              </TabsTrigger>

              <TabsTrigger
                value="personal"
                className="relative"
                disabled={activeTab !== "personal" && !completedSteps.property}
              >
                Personal Info
                {completedSteps.personal && (
                  <CheckCircle2 className="h-4 w-4 ml-2 text-green-500" />
                )}
              </TabsTrigger>

              <TabsTrigger
                value="employment"
                disabled={
                  activeTab !== "employment" && !completedSteps.personal
                }
              >
                Employment
                {completedSteps.employment && (
                  <CheckCircle2 className="h-4 w-4 ml-2 text-green-500" />
                )}
              </TabsTrigger>

              <TabsTrigger
                value="documents"
                disabled={
                  activeTab !== "documents" && !completedSteps.employment
                }
              >
                Documents
                {completedSteps.documents && (
                  <CheckCircle2 className="h-4 w-4 ml-2 text-green-500" />
                )}
              </TabsTrigger>

              <TabsTrigger
                value="review"
                disabled={activeTab !== "review" && !completedSteps.documents}
              >
                Review
                {completedSteps.review && (
                  <CheckCircle2 className="h-4 w-4 ml-2 text-green-500" />
                )}
              </TabsTrigger>

              <TabsTrigger
                value="aiReview"
                disabled={activeTab !== "aiReview" && !completedSteps.review}
              >
                AI Review
                {completedSteps.aiReview && (
                  <CheckCircle2 className="h-4 w-4 ml-2 text-green-500" />
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="property" className="mt-4">
              <PropertySelection
                formData={formData}
                updateFormData={(data) => updateFormData("property", data)}
                onComplete={() => {
                  markStepComplete("property");
                  goToNextStep();
                }}
                onBack={() => {}}
              />
            </TabsContent>

            <TabsContent value="personal" className="mt-4">
              <PersonalInfoForm
                formData={formData.personal}
                updateFormData={(data) => updateFormData("personal", data)}
                onComplete={() => {
                  markStepComplete("personal");
                  goToNextStep();
                }}
              />
            </TabsContent>

            <TabsContent value="employment" className="mt-4">
              <EmploymentInfoForm
                formData={formData.employment}
                updateFormData={(data) => updateFormData("employment", data)}
                onComplete={() => {
                  markStepComplete("employment");
                  goToNextStep();
                }}
                onBack={goToPreviousStep}
              />
            </TabsContent>

            <TabsContent value="documents" className="mt-4">
              <DocumentUploadForm
                formData={formData.documents}
                updateFormData={(data) => updateFormData("documents", data)}
                onComplete={() => {
                  markStepComplete("documents");
                  goToNextStep();
                }}
                onBack={goToPreviousStep}
              />
            </TabsContent>

            <TabsContent value="review" className="mt-4">
              <ReviewSubmission
                formData={formData}
                onSubmit={() => {
                  markStepComplete("review");
                  goToNextStep();
                }}
                onBack={goToPreviousStep}
              />
            </TabsContent>

            <TabsContent value="aiReview" className="mt-4">
              <AIReview
                formData={formData}
                onComplete={() => {
                  markStepComplete("aiReview");
                  submitApplication();
                }}
                onBack={goToPreviousStep}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RentalApplicationApp;