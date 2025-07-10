'use client';

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useSession } from "next-auth/react";

export default function LostAndFoundForm() {
  const { data: session } = useSession();
  // Assuming societyname is stored in session.user.societyname
  const societyname = session?.user?.society || "";

  const [formdata, setformdata] = useState({
    title: "",
    description: "",
    typeofobject: "",
    location: "",
    date: "",
    category: "",
    urgent: false,
  });

  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const MAX_IMAGES = 5;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setformdata((prev) => ({ ...prev, [name]: val }));
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (images.length + acceptedFiles.length > MAX_IMAGES) {
        alert(`You can only upload up to ${MAX_IMAGES} images.`);
        return;
      }
      setImages((prev) => [...prev, ...acceptedFiles]);
    },
    [images]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formdata.typeofobject) {
      alert("Please select Lost or Found.");
      return;
    }
    if (!societyname) {
      alert("Society name missing from session. Please login properly.");
      return;
    }
    setUploading(true);

    try {
      // Upload images first
      const formData = new FormData();
      images.forEach((img) => formData.append("images", img));

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Image upload failed");

      const uploadData = await uploadRes.json();
      const urls = uploadData.urls;
      setUploadedUrls(urls);

      // Now submit full form data including image URLs and societyname
      const fullData = {
        ...formdata,
        imageurls: urls,
        societyname, // send societyname here
      };

      const saveRes = await fetch("/api/lostandfoundadd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fullData),
      });

      if (!saveRes.ok) {
        const errData = await saveRes.json();
        throw new Error(errData.error || "Failed to submit form data");
      }

      alert("Item submitted successfully!");

      setformdata({
        title: "",
        description: "",
        typeofobject: "",
        location: "",
        date: "",
        category: "",
        urgent: false,
      });
      setImages([]);
      setUploadedUrls([]);
    } catch (err: any) {
      console.error("Error:", err);
      alert(err.message || "Something went wrong.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-cyan-900 via-black to-gray-900 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-black bg-opacity-80 rounded-xl max-w-3xl w-full p-8 shadow-md text-white space-y-8 border-2 border-slate-600 shadow-cyan-500"
        aria-label="Lost and Found submission form"
      >
        {/* Heading */}
        <header className="text-center">
          <h1
            className="text-4xl font-extrabold tracking-wide mb-2 inline-block bg-gradient-to-r from-cyan-400 to-yellow-400 text-transparent bg-clip-text"
            style={{
              animation: "float 3s ease-in-out infinite",
              willChange: "transform",
            }}
          >
            Lost & Found Submission
          </h1>

          <p className="max-w-xl mx-auto text-lg italic text-white">
            Found something lost? Or lost something precious? Drop the details here and let's reunite it with its rightful
            owner.
          </p>

          <style jsx>{`
            @keyframes float {
              0%,
              100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-8px);
              }
            }
          `}</style>
        </header>

        {/* Title and Description */}
        <section className="space-y-4">
          <label htmlFor="title" className="block text-sm font-semibold text-slate-400">
            Title
          </label>
          <input
            id="title"
            name="title"
            placeholder="e.g. Lost Wallet, Found Phone"
            value={formdata.title}
            onChange={handleChange}
            className="w-full p-3 rounded-2xl bg-black border shadow-md shadow-cyan-500 border-slate-600 focus:outline-none focus:border-cyan-400 "
            required
            aria-required="true"
          />

          <label htmlFor="description" className="block text-sm font-semibold text-slate-400">
            Detailed Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Describe the item with details that can help identify it"
            value={formdata.description}
            onChange={handleChange}
            className="w-full p-3 rounded-2xl bg-black border border-slate-600 focus:outline-none focus:border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.7)] resize-y"
            rows={4}
            required
            aria-required="true"
          />
        </section>

        {/* Lost / Found toggle */}
        <section aria-label="Lost or Found selection" className="flex gap-6 justify-center">
          {["lost", "found"].map((type) => (
            <button
              type="button"
              key={type}
              onClick={() => setformdata((prev) => ({ ...prev, typeofobject: type }))}
              className={`px-8 py-3 rounded-full font-semibold uppercase tracking-wide transition transform focus:outline-none focus:ring-4 focus:ring-cyan-400 ${
                formdata.typeofobject === type
                  ? "bg-cyan-600 text-black shadow-lg scale-110"
                  : "bg-transparent border-1 border-slate-600 text-white hover:bg-cyan-700 hover:text-white"
              }`}
              aria-pressed={formdata.typeofobject === type}
              aria-label={`Mark as ${type}`}
            >
              {type === "lost" ? "Lost" : "Found"}
            </button>
          ))}
        </section>

        {/* Location, Date and Category */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="location" className="block mb-1 text-sm font-semibold text-slate-400">
              Location
            </label>
            <input
              id="location"
              name="location"
              placeholder="Where was it lost/found?"
              value={formdata.location}
              onChange={handleChange}
              className="p-3 rounded-2xl bg-black border border-slate-600 focus:outline-none focus:border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.7)]"
              required
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="date" className="block mb-1 text-sm font-semibold text-slate-400">
              Date
            </label>
            <input
              id="date"
              type="date"
              name="date"
              value={formdata.date}
              onChange={handleChange}
              className="p-3 rounded-2xl bg-black border border-slate-600 focus:outline-none focus:border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.7)]"
              required
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="category" className="block mb-1 text-sm font-semibold text-slate-400">
              Category
            </label>
            <input
              id="category"
              name="category"
              placeholder="Electronics, Accessories, etc."
              value={formdata.category}
              onChange={handleChange}
              className="p-3 rounded-2xl bg-black border border-slate-600 focus:outline-none focus:border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.7)]"
            />
          </div>
        </section>

        {/* Urgent Checkbox */}
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            name="urgent"
            checked={formdata.urgent}
            onChange={handleChange}
            className="w-5 h-5 rounded-2xl bg-black border border-slate-600 focus:ring-cyan-400 text-cyan-600 shadow-[0_0_10px_rgba(6,182,212,0.7)]"
          />
          <span className="text-cyan-400 font-semibold select-none">Mark as Urgent</span>
        </label>

        {/* Image Upload Dropzone */}
        <section>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-cyan-400 bg-cyan-900 bg-opacity-20" : "border-cyan-600"
            }`}
            aria-label="Image upload dropzone"
          >
            <input {...getInputProps()} />
            <p className="text-gray-300 select-none">
              {isDragActive
                ? "Drop the images here ..."
                : `Drag & drop images here, or click to select (max ${MAX_IMAGES} images)`}
            </p>
          </div>

          {/* Preview Images with remove option */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-4 justify-center">
              {images.map((file, idx) => (
                <div
                  key={idx}
                  className="relative group w-28 h-28 rounded-md shadow-md border-2 border-cyan-600 overflow-hidden"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-600 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition"
                    aria-label={`Remove image ${idx + 1}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading}
          className="w-full py-3 bg-gray-950 shadow-cyan-500 font-bold rounded-lg shadow-md hover:from-cyan-700 hover:to-indigo-800 transition disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-cyan-400"
        >
          {uploading ? "Uploading..." : "Submit Item"}
        </button>

        {/* Uploaded URLs */}
        {uploadedUrls.length > 0 && (
          <section className="mt-6 text-sm text-emerald-600 max-w-full break-words" aria-live="polite">
            <h4 className="mb-2 font-semibold">Uploaded Image URLs:</h4>
            <ul className="list-disc ml-5">
              {uploadedUrls.map((url, i) => (
                <li key={i}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-emerald-600"
                  >
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </form>
    </div>
  );
}
