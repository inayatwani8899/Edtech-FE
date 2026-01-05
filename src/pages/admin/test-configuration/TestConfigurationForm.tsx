// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useTestStore } from "@/store/testStore";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { useUserStore } from "@/store/userStore";

// type Message = { text: string; type: "success" | "error" | "info" } | null;

// const defaultFormData = {
//   roleId: "",
//   testId: "",
//   price: 0,
//   durationMinutes: 0,
//   questionsPerPage: 5,
//   submitType: "PerPage" as "PerPage" | "OneGo",
//   allowMultiplePurchases: false,
//   canResume: false,
//   testInstructions: "",
// };

// export const TestConfigurationForm: React.FC<{ configId?: string }> = ({ configId }) => {
//   const [formData, setFormData] = useState(defaultFormData);
//   const [message, setMessage] = useState<Message>(null);
//   const [isEditMode, setIsEditMode] = useState(false);

//   const navigate = useNavigate();
//   const { id: paramId } = useParams();
//   const actualConfigId = configId || paramId;

//   const {
//     tests,
//     loading,
//     currentConfiguration,
//     fetchTests,
//     fetchConfigurationById,
//     createConfiguration,
//     updateConfiguration,
//     clearCurrentConfiguration,
//   } = useTestStore();
//   const { roles, fetchRoles } = useUserStore();
//   // Load configuration when editing
//   useEffect(() => {
//     if (actualConfigId) {
//       fetchConfigurationById(actualConfigId);
//       setIsEditMode(true);
//     } else {
//       clearCurrentConfiguration();
//       setIsEditMode(false);
//       setFormData(defaultFormData);
//     }
//   }, [actualConfigId]);

//   // Fetch roles and tests on component mount
//   useEffect(() => {
//     fetchTests();
//     fetchRoles();
//   }, []);

//   // When store updates currentConfiguration, sync to local form
//   useEffect(() => {
//     if (currentConfiguration && isEditMode) {
//       setFormData({
//         roleId: currentConfiguration.roleId,
//         testId: currentConfiguration.testId,
//         price: currentConfiguration.price,
//         durationMinutes: currentConfiguration.durationMinutes,
//         questionsPerPage: currentConfiguration.questionsPerPage,
//         submitType: currentConfiguration.submitType,
//         allowMultiplePurchases: currentConfiguration.allowMultiplePurchases,
//         canResume: currentConfiguration.canResume,
//         testInstructions: currentConfiguration.testInstructions,
//       });
//     }
//   }, [currentConfiguration]);

//   const showMessage = (text: string, type: "success" | "error" | "info") => {
//     setMessage({ text, type });
//     setTimeout(() => setMessage(null), 3000);
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const target = e.target as HTMLInputElement;
//     const value =
//       target.type === "checkbox"
//         ? target.checked
//         : target.type === "number"
//           ? parseFloat(target.value)
//           : target.value;

//     setFormData((prev) => ({ ...prev, [target.name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!formData.roleId || !formData.testId) {
//       showMessage("Role and Test are required.", "error");
//       return;
//     }

//     if (formData.price < 0 || formData.durationMinutes <= 0 || formData.questionsPerPage <= 0) {
//       showMessage("Price, duration, and questions per page must be valid values.", "error");
//       return;
//     }

//     try {
//       if (isEditMode && actualConfigId) {
//         await updateConfiguration(actualConfigId, formData);
//         showMessage(`Configuration updated successfully!`, "success");
//       } else {
//         await createConfiguration(formData);
//         showMessage(`Configuration created successfully!`, "success");
//       }

//       setTimeout(() => navigate("/manage/configurations"), 1000);
//     } catch (err) {
//       showMessage(
//         `Failed to ${isEditMode ? "update" : "create"} configuration. Please try again.`,
//         "error"
//       );
//     }
//   };

//   const messageClasses =
//     message?.type === "success"
//       ? "bg-green-100 text-green-800 border-green-400"
//       : message?.type === "error"
//         ? "bg-red-100 text-red-800 border-red-400"
//         : "bg-blue-100 text-blue-800 border-blue-400";

//   return (
//     <div className="bg-white rounded-xl p-3 sm:p-8 max-w-4xl mx-auto my-4 border border-gray-100">
//       <h2 className="text-2xl font-semibold leading-none tracking-tight mb-3">
//         {isEditMode ? "Edit Configuration" : "Create New Configuration"}
//       </h2>

//       {message && (
//         <div
//           className={`p-3 mb-4 text-center border-l-4 rounded font-medium transition duration-300 ${messageClasses}`}
//         >
//           {message.text}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Role and Test Dropdowns */}
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="font-semibold text-gray-700">Role *</label>
//             <select
//               name="roleId"
//               value={formData.roleId}
//               onChange={handleChange}
//               className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               disabled={loading}
//             >
//               <option value="">Select a role</option>
//               {roles.map(role => (
//                 <option key={role.id} value={role.id}>
//                   {role.name}
//                 </option>
//               ))}
//             </select>
//             {loading && <span className="text-sm text-gray-500">Loading roles...</span>}
//           </div>

//           <div>
//             <label className="font-semibold text-gray-700">Test *</label>
//             <select
//               name="testId"
//               value={formData.testId}
//               onChange={handleChange}
//               className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               disabled={loading}
//             >
//               <option value="">Select a test</option>
//               {tests.map(test => (
//                 <option key={test.id} value={test.id}>
//                   {test.title}
//                 </option>
//               ))}
//             </select>
//             {loading && <span className="text-sm text-gray-500">Loading tests...</span>}
//           </div>
//         </div>

//         {/* Price and Duration */}
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="font-semibold text-gray-700">Price (₹)</label>
//             <Input
//               type="number"
//               name="price"
//               value={formData.price}
//               onChange={handleChange}
//               min={0}
//               step="0.01"
//               placeholder="0.00"
//             />
//           </div>

//           <div>
//             <label className="font-semibold text-gray-700">Duration (minutes) *</label>
//             <Input
//               type="number"
//               name="durationMinutes"
//               value={formData.durationMinutes}
//               onChange={handleChange}
//               min={1}
//               placeholder="60"
//             />
//           </div>
//         </div>

//         {/* Questions Per Page and Submit Type */}
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="font-semibold text-gray-700">Questions Per Page *</label>
//             <Input
//               type="number"
//               name="questionsPerPage"
//               value={formData.questionsPerPage}
//               onChange={handleChange}
//               min={1}
//               max={50}
//               placeholder="5"
//             />
//           </div>

//           <div>
//             <label className="font-semibold text-gray-700">Submit Type</label>
//             <select
//               name="submitType"
//               value={formData.submitType}
//               onChange={handleChange}
//               className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="PerPage">Submit Per Page</option>
//               <option value="OneGo">Submit in One Go</option>
//             </select>
//           </div>
//         </div>

//         {/* Checkbox Options */}
//         <div className="grid grid-cols-2 gap-4">
//           <div className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               name="allowMultiplePurchases"
//               checked={formData.allowMultiplePurchases}
//               onChange={handleChange}
//               className="w-4 h-4"
//             />
//             <label className="text-gray-700 font-medium">Allow Multiple Purchases</label>
//           </div>

//           <div className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               name="canResume"
//               checked={formData.canResume}
//               onChange={handleChange}
//               className="w-4 h-4"
//             />
//             <label className="text-gray-700 font-medium">Can Resume Test</label>
//           </div>
//         </div>

//         {/* Instructions */}
//         <div>
//           <label className="font-semibold text-gray-700">Test Instructions</label>
//           <Textarea
//             name="testInstructions"
//             value={formData.testInstructions}
//             onChange={handleChange}
//             rows={6}
//             placeholder="Enter test instructions for candidates..."
//             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* Submit Button */}
//         <div className="flex justify-end space-x-3">
//           <Button type="button" variant="outline" onClick={() => navigate("/manage/configurations")}>
//             Cancel
//           </Button>
//           <Button type="submit" disabled={loading}>
//             {loading ? "Saving..." : isEditMode ? "Update Configuration" : "Create Configuration"}
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTestStore } from "@/store/testStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUserStore } from "@/store/userStore";
import { Plus, Trash2 } from "lucide-react";
import { useTestConfigurationStore } from "@/store/testConfigurationStore";

type Message = { text: string; type: "success" | "error" | "info" } | null;

type RolePrice = {
  roleId: string;
  price: number;
};

const defaultFormData = {
  rolePrices: [{ roleId: "", price: 0 }] as RolePrice[], // Default one row
  testId: "",
  questionsPerPage: 5,
  submitType: "PerPage" as "PerPage" | "OneGo",
  allowMultiplePurchases: false,
  canResume: false,
  testInstructions: "",
};

export const TestConfigurationForm: React.FC<{ configId?: string }> = ({ configId }) => {
  const [formData, setFormData] = useState(defaultFormData);
  const [message, setMessage] = useState<Message>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const actualConfigId = configId || paramId;

  const {
    tests,

    fetchTests,

  } = useTestStore();
  const {

    loading,
    currentConfiguration,

    fetchConfigurationById,
    createConfiguration,
    updateConfiguration,
    clearCurrentConfiguration,
  } = useTestConfigurationStore();
  const { roles, fetchRoles } = useUserStore();

  // Load configuration when editing
  useEffect(() => {
    if (actualConfigId) {
      fetchConfigurationById(actualConfigId);
      setIsEditMode(true);
    } else {
      clearCurrentConfiguration();
      setIsEditMode(false);
      setFormData(defaultFormData);
    }
  }, [actualConfigId]);

  // Fetch roles and tests on component mount
  useEffect(() => {
    fetchTests();
    fetchRoles();
  }, []);

  // When store updates currentConfiguration, sync to local form
  useEffect(() => {
    if (currentConfiguration && isEditMode) {
      setFormData({
        rolePrices: currentConfiguration.rolePrices?.length > 0
          ? currentConfiguration.rolePrices
          : [{ roleId: "", price: 0 }], // Ensure at least one row
        testId: currentConfiguration.testId,
        questionsPerPage: currentConfiguration.questionsPerPage,
        submitType: currentConfiguration.submitType,
        allowMultiplePurchases: currentConfiguration.allowMultiplePurchases,
        canResume: currentConfiguration.canResume,
        testInstructions: currentConfiguration.testInstructions,
      });
    }
  }, [currentConfiguration]);

  const showMessage = (text: string, type: "success" | "error" | "info") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const value =
      target.type === "checkbox"
        ? target.checked
        : target.type === "number"
          ? parseFloat(target.value)
          : target.value;

    setFormData((prev) => ({ ...prev, [target.name]: value }));
  };

  const handleRolePriceChange = (index: number, field: keyof RolePrice, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      rolePrices: prev.rolePrices.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addRolePrice = () => {
    setFormData(prev => ({
      ...prev,
      rolePrices: [...prev.rolePrices, { roleId: "", price: 0 }]
    }));
  };

  const removeRolePrice = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rolePrices: prev.rolePrices.filter((_, i) => i !== index)
    }));
  };

  const getAvailableRoles = (currentIndex: number) => {
    return roles.filter(role => {
      return !formData.rolePrices.some((rp, index) =>
        index !== currentIndex && rp.roleId === String(role.id)
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.rolePrices.length === 0) {
      showMessage("At least one role and price is required.", "error");
      return;
    }

    if (!formData.testId) {
      showMessage("Test is required.", "error");
      return;
    }

    if (formData.questionsPerPage <= 0) {
      showMessage("Duration and questions per page must be valid values.", "error");
      return;
    }

    // Validate all role prices
    const invalidRolePrice = formData.rolePrices.find(rp =>
      !rp.roleId || rp.price < 0
    );

    if (invalidRolePrice) {
      showMessage("All roles must be selected and prices must be non-negative.", "error");
      return;
    }

    try {
      if (isEditMode && actualConfigId) {
        await updateConfiguration(actualConfigId, formData);
        showMessage(`Configuration updated successfully!`, "success");
      } else {
        await createConfiguration(formData);
        showMessage(`Configuration created successfully!`, "success");
      }

      setTimeout(() => navigate("/manage/configurations"), 1000);
    } catch (err) {
      showMessage(
        `Failed to ${isEditMode ? "update" : "create"} configuration. Please try again.`,
        "error"
      );
    }
  };

  const messageClasses =
    message?.type === "success"
      ? "bg-green-50 text-green-800 border border-green-200 rounded-lg p-4"
      : message?.type === "error"
        ? "bg-red-50 text-red-800 border border-red-200 rounded-lg p-4"
        : "bg-blue-50 text-blue-800 border border-blue-200 rounded-lg p-4";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-2">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          {/* Header */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              {isEditMode ? "Edit Configuration" : "Create New Configuration"}
            </h3>
          </div>

          {message && (
            <div className={`mb-6 ${messageClasses}`}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {message.type === "success" && (
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {message.type === "error" && (
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  {message.type === "info" && (
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{message.text}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Test Selection */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Test *
                </label>
                <select
                  name="testId"
                  value={formData.testId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  disabled={loading}
                >
                  <option value="">Select a test</option>
                  {tests.map(test => (
                    <option key={test?.id} value={test?.id}>
                      {test.title}
                    </option>
                  ))}
                </select>
                {loading && (
                  <p className="text-sm text-gray-500 mt-2">Loading tests...</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Questions Per Page *
                </label>
                <Input
                  type="number"
                  name="questionsPerPage"
                  value={formData.questionsPerPage}
                  onChange={handleChange}
                  min={1}
                  max={50}
                  placeholder="5"
                  className="w-full"
                />
              </div>
            </div>

            {/* Submit Type */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Submit Type
                </label>
                <select
                  name="submitType"
                  value={formData.submitType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="PerPage">Submit Per Page</option>
                  <option value="OneGo">Submit in One Go</option>
                </select>
              </div>
            </div>
            {/* Checkbox Options */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  name="allowMultiplePurchases"
                  checked={formData.allowMultiplePurchases}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <span className="text-gray-900 font-medium">Allow Multiple Purchases</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  name="canResume"
                  checked={formData.canResume}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <span className="text-gray-900 font-medium">Can Resume Test</span>
                </div>
              </label>
            </div>
            {/* Instructions */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Test Instructions
              </label>
              <Textarea
                name="testInstructions"
                value={formData.testInstructions}
                onChange={handleChange}
                rows={6}
                placeholder="Enter detailed test instructions for candidates. Include information about time limits, question types, navigation rules, and any other important guidelines..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
              />
            </div>
            <div className="rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Pricing</h3>
                </div>
                <Button
                  type="button"
                  onClick={addRolePrice}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Role
                </Button>
              </div>

              <div className=" p-6">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 mb-4 pb-3 border-b border-gray-200">
                  <div className="md:col-span-5">
                    <label className="block text-sm font-semibold text-gray-700">
                      Role
                    </label>
                  </div>
                  <div className="md:col-span-4">
                    <label className="block text-sm font-semibold text-gray-700">
                      Price (₹)
                    </label>
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      Actions
                    </label>
                  </div>
                </div>

                {/* Role Price Rows */}
                <div className="space-y-3">
                  {formData.rolePrices.map((rolePrice, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 items-center">
                      {/* Role Select */}
                      <div className="md:col-span-5">
                        <select
                          value={rolePrice.roleId}
                          onChange={(e) => handleRolePriceChange(index, 'roleId', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          disabled={loading}
                        >
                          <option value="">Select a role</option>
                          {getAvailableRoles(index).map(role => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Price Input */}
                      <div className="md:col-span-4">
                        <Input
                          type="number"
                          value={rolePrice.price}
                          onChange={(e) => handleRolePriceChange(index, 'price', e.target.value === "" ? "" : parseFloat(e.target.value))}
                          min={0}
                          step="0.01"
                          placeholder="0.00"
                          className="w-full"
                        />
                      </div>

                      {/* Actions */}
                      <div className="md:col-span-3 flex items-center gap-2">
                        {/* Delete Button - Show only if more than one row exists */}
                        {formData.rolePrices.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeRolePrice(index)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 hover:border-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/manage/configurations")}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </div>
                ) : isEditMode ? (
                  "Update Configuration"
                ) : (
                  "Create Configuration"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};