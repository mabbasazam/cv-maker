
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResumeForm = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Check if user is logged in
  if (!currentUser) {
    navigate("/login");
    return null;
  }

  // Initialize form state with default values or load from localStorage
  const savedResumeData =
    JSON.parse(localStorage.getItem(`resume_${currentUser.email}`)) || {};
  const [resumeData, setResumeData] = useState({
    name: savedResumeData.name || "",
    title: savedResumeData.title || "",
    contact: {
      phone: savedResumeData.contact?.phone || "",
      email: savedResumeData.contact?.email || currentUser.email,
      linkedin: savedResumeData.contact?.linkedin || "",
    },
    summary: savedResumeData.summary || "",
    skills: savedResumeData.skills || [""],
    experience: savedResumeData.experience || [
      {
        role: "",
        company: "",
        location: "",
        duration: "",
        responsibilities: [""],
      },
    ],
    projects: savedResumeData.projects || [
      { name: "", tech: "", description: [""] },
    ],
    education: savedResumeData.education || [
      { degree: "", institution: "", duration: "" },
    ],
  });

  const handleChange = (e, section, index, subField) => {
    const { name, value } = e.target;
    setResumeData((prev) => {
      if (section === "contact") {
        return {
          ...prev,
          contact: { ...prev.contact, [name]: value },
        };
      } else if (section === "skills") {
        const updatedSkills = [...prev.skills];
        updatedSkills[index] = value;
        return { ...prev, skills: updatedSkills };
      } else if (section === "experience") {
        const updatedExperience = [...prev.experience];
        if (subField === "responsibilities") {
          updatedExperience[index].responsibilities = value ? value.split("\n") : [""];
        } else {
          updatedExperience[index][subField] = value;
        }
        return { ...prev, experience: updatedExperience };
      } else if (section === "projects") {
        const updatedProjects = [...prev.projects];
        if (subField === "description") {
          updatedProjects[index].description = value.split("\n");
        } else {
          updatedProjects[index][subField] = value;
        }
        return { ...prev, projects: updatedProjects };
      } else if (section === "education") {
        const updatedEducation = [...prev.education];
        updatedEducation[index][subField] = value;
        return { ...prev, education: updatedEducation };
      }
      return { ...prev, [name]: value };
    });
  };

  const addField = (section) => {
    setResumeData((prev) => {
      if (section === "skills") {
        return { ...prev, skills: [...prev.skills, ""] };
      } else if (section === "experience") {
        return {
          ...prev,
          experience: [
            ...prev.experience,
            {
              role: "",
              company: "",
              location: "",
              duration: "",
              responsibilities: [""],
            },
          ],
        };
      } else if (section === "projects") {
        return {
          ...prev,
          projects: [
            ...prev.projects,
            { name: "", tech: "", description: [""] },
          ],
        };
      } else if (section === "education") {
        return {
          ...prev,
          education: [
            ...prev.education,
            { degree: "", institution: "", duration: "" },
          ],
        };
      }
      return prev;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save resume data to localStorage
    localStorage.setItem(
      `resume_${currentUser.email}`,
      JSON.stringify(resumeData)
    );
    navigate("/resume");
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen mt-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Create Your Resume</h1>
        <button
          onClick={handleLogout}
          className="bg-red-400 px-4 py-2 rounded-xl text-white hover:bg-red-500"
        >
          Logout
        </button>
      </div>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
        {/* Personal Info */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Personal Info
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={resumeData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-gray-700">Job Title</label>
              <input
                type="text"
                name="title"
                value={resumeData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Your job title"
              />
            </div>
            <div>
              <label className="block text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                value={resumeData.contact.phone}
                onChange={(e) => handleChange(e, "contact")}
                className="w-full p-2 border rounded"
                placeholder="Your phone number"
              />
            </div>
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={resumeData.contact.email}
                onChange={(e) => handleChange(e, "contact")}
                className="w-full p-2 border rounded"
                placeholder="Your email"
                disabled
              />
            </div>
            <div>
              <label className="block text-gray-700">LinkedIn</label>
              <input
                type="text"
                name="linkedin"
                value={resumeData.contact.linkedin}
                onChange={(e) => handleChange(e, "contact")}
                className="w-full p-2 border rounded"
                placeholder="Your LinkedIn profile"
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Summary</h2>
          <textarea
            name="summary"
            value={resumeData.summary}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="A brief summary about yourself"
            rows="4"
          />
        </div>

        {/* Skills */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Skills</h2>
          {resumeData.skills.map((skill, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                value={skill}
                onChange={(e) => handleChange(e, "skills", index)}
                className="w-full p-2 border rounded"
                placeholder="Enter a skill (e.g., Frontend: React.js, JavaScript)"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField("skills")}
            className="bg-blue-400 px-4 py-2 rounded-xl text-white hover:bg-blue-500 mt-2"
          >
            Add Skill
          </button>
        </div>

        {/* Experience */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Experience</h2>
          {resumeData.experience.map((exp, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <div className="space-y-2">
                <input
                  type="text"
                  value={exp.role}
                  onChange={(e) => handleChange(e, "experience", index, "role")}
                  className="w-full p-2 border rounded"
                  placeholder="Role (e.g., Software Engineer)"
                />
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) =>
                    handleChange(e, "experience", index, "company")
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Company Name"
                />
                <input
                  type="text"
                  value={exp.location}
                  onChange={(e) =>
                    handleChange(e, "experience", index, "location")
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Location (e.g., City, Country)"
                />
                <input
                  type="text"
                  value={exp.duration}
                  onChange={(e) =>
                    handleChange(e, "experience", index, "duration")
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Duration (e.g., Jan 2023 - Present)"
                />
                <textarea
                  value={exp.responsibilities.join("\n")}
                  onChange={(e) =>
                    handleChange(e, "experience", index, "responsibilities")
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Responsibilities (one per line)"
                  rows="4"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField("experience")}
            className="bg-blue-400 px-4 py-2 rounded-xl text-white hover:bg-blue-500 mt-2"
          >
            Add Experience
          </button>
        </div>

        {/* Projects */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Projects</h2>
          {resumeData.projects.map((project, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <div className="space-y-2">
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => handleChange(e, "projects", index, "name")}
                  className="w-full p-2 border rounded"
                  placeholder="Project Name"
                />
                <input
                  type="text"
                  value={project.tech}
                  onChange={(e) => handleChange(e, "projects", index, "tech")}
                  className="w-full p-2 border rounded"
                  placeholder="Tech Stack (e.g., React.js, Node.js)"
                />
                <textarea
                  value={project.description.join("\n")}
                  onChange={(e) =>
                    handleChange(e, "projects", index, "description")
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Description (one point per line)"
                  rows="4"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField("projects")}
            className="bg-blue-400 px-4 py-2 rounded-xl text-white hover:bg-blue-500 mt-2"
          >
            Add Project
          </button>
        </div>

        {/* Education */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Education</h2>
          {resumeData.education.map((edu, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <div className="space-y-2">
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) =>
                    handleChange(e, "education", index, "degree")
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Degree (e.g., Bachelor of Technology)"
                />
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) =>
                    handleChange(e, "education", index, "institution")
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Institution (e.g., GLA University, Mathura)"
                />
                <input
                  type="text"
                  value={edu.duration}
                  onChange={(e) =>
                    handleChange(e, "education", index, "duration")
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Duration (e.g., Aug 2018 - May 2022)"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField("education")}
            className="bg-blue-400 px-4 py-2 rounded-xl text-white hover:bg-blue-500 mt-2"
          >
            Add Education
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-400 px-4 py-2 rounded-xl text-white hover:bg-blue-500"
        >
          Save and View Resume
        </button>
      </form>
    </div>
  );
};

export default ResumeForm;