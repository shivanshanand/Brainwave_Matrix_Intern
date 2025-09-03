// src/store/uploadStore.js
import {create} from "zustand";
import API from "../api/axios";

export const useUploads = create((set) => ({
  uploading: false,
  uploadError: null,
  uploadedUrls: [],
  
  // Avatar
  uploadAvatar: async (file) => {
    set({ uploading: true, uploadError: null });
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const { data } = await API.post("/upload/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set({ uploading: false });
      return data.avatar;
    } catch (err) {
      set({
        uploading: false,
        uploadError: err.response?.data?.message || "Avatar upload failed",
      });
      throw err;
    }
  },

  // Cover
  uploadPostCover: async (file) => {
    set({ uploading: true, uploadError: null });
    try {
      const formData = new FormData();
      formData.append("coverImage", file);
      const { data } = await API.post("/upload/post-cover", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set({ uploading: false });
      return data.imageUrl;
    } catch (err) {
      set({
        uploading: false,
        uploadError: err.response?.data?.message || "Cover image upload failed",
      });
      throw err;
    }
  },

  // Images (multiple)
  uploadPostImages: async (files) => {
    set({ uploading: true, uploadError: null });
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));
      const { data } = await API.post("/upload/post-images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        uploading: false,
        uploadedUrls: [
          ...state.uploadedUrls,
          ...data.images.map((img) => img.url),
        ],
      }));
      return data.images;
    } catch (err) {
      set({
        uploading: false,
        uploadError: err.response?.data?.message || "Image upload failed",
      });
      throw err;
    }
  },

  // Delete by publicId
  deleteImage: async (publicId) => {
    await API.delete(`/upload/${publicId}`);
    // Optionally filter out deleted from uploadedUrls
  },

  resetUploads: () =>
    set({ uploadedUrls: [], uploadError: null, uploading: false }),
  
}));
