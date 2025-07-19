import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ethers } from "ethers";
import { getCVPaymentContract } from "../utils/cvPayment";

const Resume = () => {
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  const componentRef = useRef();

  // Safely parse currentUser and resumeData
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser"));
    } catch (error) {
      return null;
    }
  })();

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  const resumeData = (() => {
    try {
      return JSON.parse(localStorage.getItem(`resume_${currentUser.email}`));
    } catch (error) {
      return null;
    }
  })();

  if (!resumeData) {
    navigate("/resume-form");
    return null;
  }

  // Debug: Log when the component mounts and the ref is set
  useEffect(() => {
    console.log("Component mounted, componentRef:", componentRef.current);
  }, []);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask to proceed.");
        return;
      }
  
      // Step 1: Request wallet connection
      await window.ethereum.request({ method: "eth_requestAccounts" });
  
      // Step 2: Set provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
  
      // Step 3: Connect to contract
      const contract = getCVPaymentContract(signer);
  
      // Step 4: Always charge on every download
      const price = await contract.cvPriceWei();
      const tx = await contract.purchaseCV({ value: price });
      await tx.wait(); // wait for confirmation
      alert("Payment successful! Now downloading resume...");
  
      // Step 5: Generate and download PDF
      const element = componentRef.current;
      if (!element) {
        alert("Resume content missing.");
        return;
      }
  
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/jpeg");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
  
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 2;
      const imgWidth = pageWidth - 2 * margin;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      let heightLeft = imgHeight;
      let position = margin;
  
      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 2 * margin;
  
      while (heightLeft > 0) {
        position = heightLeft - imgHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - 2 * margin;
      }
  
      pdf.save(`${resumeData.name || "Resume"}.pdf`);
    } catch (err) {
      console.error("Error during payment/download:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };
  
  // const handleDownload = async () => {
  //   setIsDownloading(true);
  //   console.log("Initiating PDF generation...");
  //   try {
  //     const element = componentRef.current;
  //     if (!element) {
  //       console.error("No content to print: componentRef is null");
  //       alert("Error: Resume content not found. Please try again.");
  //       return;
  //     }

  //     // Use html2canvas to capture the element
  //     const canvas = await html2canvas(element, {
  //       scale: 2, // Increased scale for better resolution
  //       useCORS: true,
  //       logging: true,
  //       onclone: (doc, element) => {
  //         console.log("Cloned element for rendering:", element);
  //         // Adjust styles for PDF rendering
  //         element.style.fontFamily = "'Times New Roman', Times, serif";
  //         element.style.width = "210mm"; // A4 width
  //         element.style.maxWidth = "none"; // Remove max-width constraint
  //         // Debug: Log styles to check for oklch
  //         const computedStyles = doc.defaultView.getComputedStyle(element);
  //         for (let prop of computedStyles) {
  //           const value = computedStyles.getPropertyValue(prop);
  //           if (value.includes("oklch")) {
  //             console.warn(`Found oklch in ${prop}: ${value}`);
  //           }
  //         }
  //       },
  //     });

  //     console.log("Canvas created:", canvas);

  //     const imgData = canvas.toDataURL("image/jpeg");

  //     const pdf = new jsPDF({
  //       orientation: "portrait",
  //       unit: "mm",
  //       format: "a4",
  //     });

  //     const pageWidth = 210; // A4 width in mm
  //     const pageHeight = 297; // A4 height in mm
  //     const margin = 2; // 10mm margins
  //     const imgWidth = pageWidth - 2 * margin; // Adjusted width to fit A4 with margins
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //     let heightLeft = imgHeight;
  //     let position = margin;

  //     // Add the first page
  //     pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
  //     heightLeft -= pageHeight - 2 * margin;

  //     // Add additional pages if the content is longer than one page
  //     while (heightLeft > 0) {
  //       position = heightLeft - imgHeight + margin;
  //       pdf.addPage();
  //       pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
  //       heightLeft -= pageHeight - 2 * margin;
  //     }

  //     // Save the PDF
  //     pdf.save(`${resumeData.name || "Resume"}.pdf`);
  //   } catch (error) {
  //     console.error("Error generating PDF:", error);
  //     alert("Error generating PDF. Please try again.");
  //   } finally {
  //     setIsDownloading(false);
  //   }
  // };

  const handleLogout = (e) => {
    e.stopPropagation();
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const handleEditResume = (e) => {
    e.stopPropagation();
    navigate("/resume-form");
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between mb-4">
        <button
          onClick={handleEditResume}
          className="bg-blue-400 px-4 py-2 rounded-xl text-white hover:bg-blue-500 pointer-events-auto"
          disabled={isDownloading}
        >
          Edit Resume
        </button>
        <div className="space-x-4">
          <button
            onClick={handleDownload}
            className="bg-blue-400 px-4 py-2 rounded-xl text-white hover:bg-blue-500 pointer-events-auto"
            disabled={isDownloading}
          >
            {isDownloading ? "Processing..." : "Download as PDF"}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-400 px-4 py-2 rounded-xl text-white hover:bg-red-500 pointer-events-auto"
            disabled={isDownloading}
          >
            Logout
          </button>
        </div>
      </div>
      <div ref={componentRef}>
        {/* console.log("qqqqqqqqqqqqq", componentRef);     */}
        <div
          id="resume-content"
          className="max-w-4xl mx-auto bg-white p-4 shadow-lg"
          style={{ fontFamily: "'Times New Roman', Times, serif" }}
        >
          {/* Header */}
          <div className="text-center mb-4 tight-word-spacing">
            <h1 className="text-4xl font-bold text-gray-800 uppercase mb-2">
              {resumeData.name}
            </h1>
            <p className="text-2xl text-gray-600 mb-3">{resumeData.title}</p>
            <div className="flex justify-center space-x-4 text-gray-600 text-lg items-center">
              <p>📞 {resumeData.contact.phone}</p>
              <p className="underline">✉️ {resumeData.contact.email}</p>

              <p>🌐 {resumeData.contact.linkedin}</p>
            </div>
          </div>
          {/* Professional Summary */}
          {resumeData.summary ? (
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-800 uppercase border-b-2 border-gray-300 pb-2">
                Professional Summary
              </h2>
              <p className="text-lg text-gray-700 tight-word-spacing">
                {resumeData.summary}
              </p>
            </div>
          ) : (
            ""
          )}
          {/* Skills */}
          {resumeData.skills && resumeData.skills.length > 0 && (
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-800 uppercase border-b-2 border-gray-300 pb-2">
                Skills
              </h2>
              <ul className="text-lg text-gray-800 list-disc list-inside space-y-1">
                {resumeData.skills
                  .filter((skill) => skill.trim() !== "")
                  .map((skill, index) => {
                    // Split the skill at the colon
                    const [category, details] = skill.split(":");
                    return (
                      <li className="list-none" key={index}>
                        <span className="font-bold text-gray-800">
                          {category}:
                        </span>
                        {details ? ` ${details.trim()}` : ""}
                      </li>
                    );
                  })}
              </ul>
            </div>
          )}
          {/* Experience */}
          {resumeData.experience && resumeData.experience.length > 0 && (
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-800 uppercase border-b-2 border-gray-300 pb-2">
                Experience
              </h2>
              {resumeData.experience
                .filter((exp) => exp.role || exp.company || exp.duration)
                .map((exp, index) => (
                  <div key={index} className="">
                    <div className="flex justify-between">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {exp.role}
                        <p className="text-sm text-gray-500">{exp.company}</p>
                      </h3>
                      <div className="-space-y-2">
                        <p className="text-lg text-gray-600">{exp.duration}</p>
                        <p className="text-lg text-gray-600 italic mb-2">
                          {exp.location}
                        </p>
                      </div>
                    </div>
                    <ul className="text-lg text-gray-700 space-y-1">
                      {exp.responsibilities
                        .filter((resp) => resp.trim() !== "")
                        .map((responsibility, i) => (
                          <li key={i}>{responsibility}</li>
                        ))}
                    </ul>
                  </div>
                ))}
            </div>
          )}
          {/* Projects */}
          {resumeData.projects && resumeData.projects.length > 0 && (
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-800 uppercase border-b-2 border-gray-300 pb-2">
                Projects
              </h2>
              {resumeData.projects
                .filter((proj) => proj.name || proj.tech)
                .map((project, index) => (
                  <div key={index} className="">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {project.name}
                    </h3>
                    <p className="text-lg text-gray-700 font-bold">
                      Using Stack:{" "}
                      <span className="text-sm text-gray-500">
                        {project.tech && `${project.tech}`}
                      </span>
                    </p>
                    <ul className="text-lg text-gray-700 list-disc list-inside">
                      {project.description
                        .filter((desc) => desc.trim() !== "")
                        .map((desc, i) => (
                          <li className="list-none" key={i}>
                            {desc}
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
            </div>
          )}
          {/* Education */}
          {resumeData.education && resumeData.education.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 uppercase border-b-2 border-gray-300 pb-2">
                Education
              </h2>
              {resumeData.education
                .filter((edu) => edu.degree || edu.institution || edu.duration)
                .map((edu, index) => (
                  <div key={index} className="">
                    <div className="flex justify-between">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {edu.institution}
                      </h3>
                      <p className="text-lg text-gray-600">{edu.duration}</p>
                    </div>
                    <p className="text-lg text-gray-600 italic">{edu.degree}</p>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resume;
