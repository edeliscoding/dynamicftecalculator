"use client";
import React, { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const roleConfig = {
  Doctors: {
    billableItems: [
      { id: "outpatient", multiplier: 0, cFTEValue: 0.0022, total: 0 },
      { id: "synchronous", multiplier: 0, cFTEValue: 0.0022, total: 0 },
      { id: "asynchronous", multiplier: 0, cFTEValue: 0.0022, total: 0 },
      { id: "eConsult", multiplier: 0, cFTEValue: 0.0022, total: 0 },
    ],
    nonBillableItems: [
      { id: "outpatientFollowUp", multiplier: 0, cFTEValue: 0.001, total: 0 },
      {
        id: "sectionClinicalService",
        multiplier: 0,
        cFTEValue: 0.005,
        total: 0,
      },
      { id: "reqClinicalMeetings", multiplier: 0, cFTEValue: 0.0005, total: 0 },
      { id: "supervising", multiplier: 0, cFTEValue: 0.003, total: 0 },
    ],
  },
  App: {
    billableItems: [
      { id: "outpatient", multiplier: 0, cFTEValue: 0.0022, total: 0 },
      {
        id: "outPatientProcedureSession",
        multiplier: 0,
        cFTEValue: 0.0022,
        total: 0,
      },
      { id: "eConsult", multiplier: 0, cFTEValue: 0.0022, total: 0 },
    ],
    nonBillableItems: [
      { id: "outpatientFollowUp", multiplier: 0, cFTEValue: 0.001, total: 0 },
      {
        id: "secTionalClinicalService",
        multiplier: 0,
        cFTEValue: 0.0022,
        total: 0,
      },
      { id: "reqClinicalMeetings", multiplier: 0, cFTEValue: 0.0005, total: 0 },
    ],
  },
  PostDocs: {
    billableItems: [
      { id: "outpatient", multiplier: 0, cFTEValue: 0.002, total: 0 },
      { id: "synchronous", multiplier: 0, cFTEValue: 0.002, total: 0 },
      { id: "asynchronous", multiplier: 0, cFTEValue: 0.002, total: 0 },
    ],
    nonBillableItems: [
      { id: "outpatientFollowUp", multiplier: 0, cFTEValue: 0.0009, total: 0 },
      { id: "reqClinicalMeetings", multiplier: 0, cFTEValue: 0.0004, total: 0 },
      { id: "research", multiplier: 0, cFTEValue: 0.002, total: 0 },
    ],
  },
  Fellows: {
    billableItems: [
      { id: "outpatient", multiplier: 0, cFTEValue: 0.0021, total: 0 },
      { id: "synchronous", multiplier: 0, cFTEValue: 0.0021, total: 0 },
      { id: "asynchronous", multiplier: 0, cFTEValue: 0.0021, total: 0 },
    ],
    nonBillableItems: [
      { id: "outpatientFollowUp", multiplier: 0, cFTEValue: 0.0009, total: 0 },
      { id: "reqClinicalMeetings", multiplier: 0, cFTEValue: 0.0004, total: 0 },
      { id: "training", multiplier: 0, cFTEValue: 0.0015, total: 0 },
    ],
  },
};

const DynamicFTECalculator = () => {
  const [selectedRole, setSelectedRole] = useState("Doctors");
  const [billableItems, setBillableItems] = useState(
    roleConfig.Doctors.billableItems
  );
  const [nonBillableItems, setNonBillableItems] = useState(
    roleConfig.Doctors.nonBillableItems
  );
  const [submitMessage, setSubmitMessage] = useState(null);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setBillableItems(roleConfig[role].billableItems);
    setNonBillableItems(roleConfig[role].nonBillableItems);
  };

  const handleInputChange = (itemType, id, value) => {
    const updateItems = (prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, multiplier: value, total: value * item.cFTEValue }
          : item
      );

    if (itemType === "billable") {
      setBillableItems(updateItems);
    } else {
      setNonBillableItems(updateItems);
    }
  };

  const calculateTotal = (items) =>
    items.reduce((sum, item) => sum + item.total, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      role: selectedRole,
      //   billableItems,
      //   nonBillableItems,
      billableTotal: calculateTotal(billableItems),
      nonBillableTotal: calculateTotal(nonBillableItems),
      grandTotal:
        calculateTotal(billableItems) + calculateTotal(nonBillableItems),
    };

    try {
      // Here you would typically send the data to your backend API
      // For this example, we'll just simulate an API call with a timeout
      //   await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Form submitted:", formData);
      const textSuccess = JSON.stringify(formData, null, 2);
      setSubmitMessage({
        type: "success",
        text: `${textSuccess}`,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitMessage({
        type: "error",
        text: "Error submitting form. Please try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h1 className="text-2xl font-bold mb-4">FTE Calculator</h1>
      <Select value={selectedRole} onValueChange={handleRoleChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(roleConfig).map((role) => (
            <SelectItem key={role} value={role}>
              {role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Billable Items</h2>
        {billableItems.map((item) => (
          <div key={item.id} className="mb-2">
            <label className="block">
              {item.id}:
              <input
                type="number"
                value={item.multiplier}
                onChange={(e) =>
                  handleInputChange(
                    "billable",
                    item.id,
                    parseFloat(e.target.value)
                  )
                }
                className="ml-2 border rounded px-2 py-1"
              />
            </label>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Non-Billable Items</h2>
        {nonBillableItems.map((item) => (
          <div key={item.id} className="mb-2">
            <label className="block">
              {item.id}:
              <input
                type="number"
                value={item.multiplier}
                onChange={(e) =>
                  handleInputChange(
                    "nonBillable",
                    item.id,
                    parseFloat(e.target.value)
                  )
                }
                className="ml-2 border rounded px-2 py-1"
              />
            </label>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold">Total FTE</h2>
        <p>Billable Total: {calculateTotal(billableItems).toFixed(4)}</p>
        <p>Non-Billable Total: {calculateTotal(nonBillableItems).toFixed(4)}</p>
        <p className="font-bold">
          Grand Total:{" "}
          {(
            calculateTotal(billableItems) + calculateTotal(nonBillableItems)
          ).toFixed(4)}
        </p>
      </div>

      <Button type="submit" className="mt-4">
        Submit
      </Button>

      {submitMessage && (
        <Alert
          className={`mt-4 ${
            submitMessage.type === "success" ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <AlertTitle>
            {submitMessage.type === "success" ? "Success" : "Error"}
          </AlertTitle>
          <AlertDescription>{submitMessage.text}</AlertDescription>
        </Alert>
      )}
    </form>
  );
};

export default DynamicFTECalculator;
