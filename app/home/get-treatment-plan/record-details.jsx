// this is where the document will be UPLOADED TO and HANDLED by GOOGLE GEMINI.

import React, { useState } from "react";
import {
  IconChevronRight,
  IconFileUpload,
  IconProgress,
} from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";
import FileUploadModal from "@/app/components/file-upload-modal";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useLocation, useNavigate } from "react-router-dom";

// see this url for youtube sample implementation 
// and add user context and auth accordingly 

// This api key was created within the google cloud project
const geminiApiKey = import.meta.env.GEMINI_API_KEY;

async function RecordDetails() {
    
    const { state } = useLocation();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [processing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(
    state.analysisResult || "",
  );
  const [filename, setFilename] = useState("");
  const [filetype, setFileType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // missing: const { updateRecord } = useStateContext();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);
    setFileType(file.type);
    setFilename(file.name);
    setFile(file);
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Function to handle file upload
  setUploading(true);
    setUploadSuccess(false);

    const genAI = new GoogleGenerativeAI(geminiApiKey);

    try {
      const base64Data = await readFileAsBase64(file);

      const imageParts = [
        {
          inlineData: {
            data: base64Data,
            mimeType: filetype,
          },
        },
      ];

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `You are a specialist in chronic disease diagnosis and treatment planning. Use the uploaded medical prescription document to provide a personalized treatment plan.

      When crafting your response, ensure you:
        - Provide a clear, detailed treatment plan based solely on the information in the document.
        - List the medications mentioned, specifying the timeline and dosage for each. If the dosage is missing, recommend consulting a doctor.
        - Explain the potential side effects of each medication, along with guidance on how to manage them.
        - Suggest lifestyle changes to help manage the condition effectively.
        - Include a brief explanation of how the treatment plan aligns with World Health Organization (WHO) guidelines, with links where relevant.
        - Organize the response into readable, structured paragraphs.
        - Where information is incomplete or unclear, advise the user to consult a healthcare professional, rather than making assumptions or enforcing actions.`;

      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      const text = response.text();
      setAnalysisResult(text);

      const updatedRecord = await updateRecord({ //pending: set the context 
        documentID: state.id,
        analysisResult: text,
        kanbanRecords: "",
      });
      setUploadSuccess(true);
      setIsModalOpen(false); 
      setFilename("");
      setFile(null);
      setFileType("");


    }
    catch (error){
        console.log("Error occurred during file upload", error);
        setUploadSuccess(false);
    } finally {
        setIsLoading(false);
    }
};

// Process the treatment plan
const processTreatmentPlan = async () => {
    setIsProcessing(true);

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = `
    You are an expert medical advisor. Your role is to use this treatment plan ${analysisResult} to create 3 columns:
    - To Do: tasks which need to be started by the patient
    - In Progress: tasks which are currently being worked on by the patient
    - Done: tasks which have been completed by the patient

    Each task should include a brief descriptionn and categorized based on the stage in the treatment process.
    
    Please provide the results in the following stuctured format for the front-end:
                {
                  "columns": [
                    { "id": "todo", "title": "Todo" },
                    { "id": "doing", "title": "Work in progress" },
                    { "id": "done", "title": "Done" }
                  ],
                  "tasks": [
                    { "id": "1", "columnId": "todo", "content": "Example task 1" },
                    { "id": "2", "columnId": "todo", "content": "Example task 2" },
                    { "id": "3", "columnId": "doing", "content": "Example task 3" },
                    { "id": "4", "columnId": "doing", "content": "Example task 4" },
                    { "id": "5", "columnId": "done", "content": "Example task 5" }
                  ]
                }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const parsedResponse = JSON.parse(text);

    const updatedRecord = await updateRecord({
        documentID: state.id,
        kanbanRecords: text,
      });

    // To Do: update the route on which the three catgories (listed above) in the treatment plan are displayed    
    navigate("/home/get-treatment-plan") 
    setIsProcessing(false);

    return (
        <div className="flex flex-wrap gap-[26px]">
        <button
          type="button"
          onClick={handleOpenModal}
          className="mt-6 inline-flex items-center gap-x-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-[#13131a] dark:text-white dark:hover:bg-neutral-800"
        >
          <IconFileUpload />
          Upload Reports
        </button>
        <FileUploadModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onFileChange={handleFileChange}
          onFileUpload={handleFileUpload}
          uploading={uploading}
          uploadSuccess={uploadSuccess}
          filename={filename}
        />
        <RecordDetailsHeader recordName={state.recordName} />
        <div className="w-full">
          <div className="flex flex-col">
            <div className="-m-1.5 overflow-x-auto">
              <div className="inline-block min-w-full p-1.5 align-middle">
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-[#13131a]">
                  <div className="border-b border-gray-200 px-6 py-4 dark:border-neutral-700">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                      Personalized AI-Driven Treatment Plan
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                      A tailored medical strategy leveraging advanced AI insights.
                    </p>
                  </div>
                  <div className="flex w-full flex-col px-6 py-4 text-white">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Analysis Result
                      </h2>
                      <div className="space-y-2">
                        <ReactMarkdown>{analysisResult}</ReactMarkdown>
                      </div>
                    </div>
                    <div className="mt-5 grid gap-2 sm:flex">
                      <button
                        type="button"
                        onClick={processTreatmentPlan}
                        className="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
                      >
                        View Treatment plan
                        <IconChevronRight size={20} />
                        {processing && (
                          <IconProgress
                            size={10}
                            className="mr-3 h-5 w-5 animate-spin"
                          />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-3 border-t border-gray-200 px-6 py-4 md:flex md:items-center md:justify-between dark:border-neutral-700">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-neutral-400">
                        <span className="font-semibold text-gray-800 dark:text-neutral-200"></span>{" "}
                      </p>
                    </div>
                    <div>
                      <div className="inline-flex gap-x-2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default RecordDetails;