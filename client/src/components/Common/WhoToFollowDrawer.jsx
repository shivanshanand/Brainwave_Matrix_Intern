import { Dialog } from "@headlessui/react";
import { HiUserGroup, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

export default function WhoToFollowDrawer({ open, onClose, children }) {
  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onClose={onClose} className="relative z-50">
          {/* Enhanced backdrop with smooth fade */}
          <motion.div
            className="fixed inset-0 bg-black/75"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={onClose} // Click backdrop to close
          />

          {/* Drawer Container anchored to right */}
          <div className="fixed inset-0 flex justify-end">
            <Dialog.Panel>
              {/* Main drawer panel with spring physics */}
              <motion.div
                className="w-screen max-w-xs sm:max-w-sm md:max-w-md bg-gradient-to-br from-neutral-900 via-black/90 to-neutral-900 border-l border-neutral-800 shadow-2xl h-full min-h-0 flex flex-col"
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{
                  x: "100%",
                  opacity: 0,
                  transition: { type: "spring", stiffness: 400, damping: 40 },
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  mass: 0.8,
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDragEnd={(event, info) => {
                  if (info.offset.x > 100) {
                    onClose();
                  }
                }}
              >
                {/* Enhanced header */}
                <motion.div
                  className="flex items-center justify-between px-6 py-5 border-b border-neutral-800 mb-2"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                >
                  <motion.span
                    className="flex items-center gap-3"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                        ease: "easeInOut",
                      }}
                    >
                      <HiUserGroup className="w-6 h-6 text-teal-400" />
                    </motion.div>
                    <Dialog.Title className="text-xl font-bold text-white">
                      Who to follow
                    </Dialog.Title>
                  </motion.span>

                  {/* Enhanced close button */}
                  <motion.button
                    onClick={onClose}
                    className="rounded-full p-2 transition text-teal-400 hover:text-white hover:bg-neutral-700"
                    whileHover={{
                      scale: 1.1,
                      rotate: 90,
                      backgroundColor: "#404040",
                    }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0, rotate: 180 }}
                  >
                    <HiX className="w-6 h-6" />
                  </motion.button>
                </motion.div>

                {/* Enhanced content area */}
                <motion.div
                  className="flex-1 overflow-y-auto px-4 pb-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  {children}
                </motion.div>

                {/* Optional: Drag indicator */}
                <motion.div
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 w-1 h-12 bg-teal-400/30 rounded-full cursor-grab active:cursor-grabbing"
                  whileHover={{
                    scale: 1.5,
                    backgroundColor: "rgba(56, 178, 172, 0.6)",
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(event, info) => {
                    if (info.offset.x > 50) onClose();
                  }}
                />
              </motion.div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
