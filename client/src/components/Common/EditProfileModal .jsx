import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiUser, HiPhotograph, HiPencil } from "react-icons/hi";
import { useAuth } from "../../store/authStore";
import API from "../../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EditProfileModal = ({ open, onClose, userProfile, setUserProfile }) => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: userProfile?.username || "",
    bio: userProfile?.bio || "",
    avatar: userProfile?.avatar || "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (userProfile) {
      setForm({
        username: userProfile.username || "",
        bio: userProfile.bio || "",
        avatar: userProfile.avatar || "",
      });
    }
  }, [userProfile]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const payload = { ...form };

      if (!form.avatar) {
        delete payload.avatar;
      }

      const { data } = await API.put("/users/me", payload);

      setUser(data);
      setUserProfile(data);

      toast.success("Profile updated successfully!");
      onClose();

      if (data.username !== userProfile.username) {
        navigate(`/users/${data.username}`, { replace: true });
      }

      setSelectedFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-md max-h-[90vh] bg-gradient-to-br from-neutral-900/95 to-neutral-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-neutral-700/50 overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - Fixed */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-700/50 flex-shrink-0">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <HiPencil className="w-5 h-5 text-teal-400" />
                Edit Profile
              </h2>
              <motion.button
                onClick={onClose}
                className="text-neutral-400 hover:text-white transition-colors p-1 hover:bg-neutral-800 rounded-full"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <HiX className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1">
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Avatar Upload Section */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative group cursor-pointer">
                    <motion.img
                      src={
                        selectedFile
                          ? URL.createObjectURL(selectedFile)
                          : form.avatar || "/default-avatar.png"
                      }
                      alt="Avatar Preview"
                      className="w-24 h-24 rounded-full border-3 border-teal-400 object-cover shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                    <input
                      type="file"
                      id="avatarUpload"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <label
                      htmlFor="avatarUpload"
                      className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <HiPhotograph className="w-7 h-7 text-white" />
                    </label>
                  </div>
                  <p className="text-xs text-neutral-400 text-center">
                    Click avatar to upload new photo
                    <br />
                    <span className="text-neutral-500">
                      Max 5MB • JPG, PNG, WebP
                    </span>
                  </p>
                </div>

                {/* Username Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                    <HiUser className="w-4 h-4" />
                    Username
                  </label>
                  <motion.input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all"
                    placeholder="Enter your username"
                    required
                    maxLength={30}
                    whileFocus={{ scale: 1.01 }}
                  />
                  <p className="text-xs text-neutral-500">
                    {form.username.length}/30 characters
                  </p>
                </div>

                {/* Bio Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300">
                    Bio
                  </label>
                  <motion.textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all resize-none"
                    placeholder="Tell us about yourself..."
                    rows={3}
                    maxLength={500}
                    whileFocus={{ scale: 1.01 }}
                  />
                  <p className="text-xs text-neutral-500">
                    {form.bio.length}/500 characters
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mb-[1rem] p-2">
                  <motion.button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 bg-neutral-700 text-white rounded-xl font-medium hover:bg-neutral-600 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    whileHover={!loading ? { scale: 1.02 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Save Changes"
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;
