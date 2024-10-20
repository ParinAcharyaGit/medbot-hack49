// this is where the document will be handled by Google Gemini

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