import { useChatStore } from "@/zustand/useChatStore";
import { useSendFileMessage } from "@/zustand/sendFileMessage";

export default function ChatWindow() {
  const messages = useChatStore((state) => state.messages);
  const sendFileMessage = useSendFileMessage((state) => state.sendFileMessage);

  const handleFileUpload = (file: File) => {
    if (!file) return;
    sendFileMessage(file);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="text-white">
            {msg.type === "file" ? (
              <div className="bg-indigo-500/20 p-3 rounded-xl border border-white/10">
                <p className="text-sm font-medium">{msg.fileName}</p>
                <p className="text-xs opacity-70">
                  {(msg.fileSize / 1024).toFixed(1)} KB — {msg.fileType}
                </p>
              </div>
            ) : (
              <p>{msg.text}</p>
            )}
          </div>
        ))}
      </div>

      {/* File Input */}
      <input
        type="file"
        className="hidden"
        id="fileUpload"
        onChange={(e) => handleFileUpload(e.target.files?.[0] as File)}
      />

      <label
        htmlFor="fileUpload"
        className="p-3 bg-indigo-600 rounded-xl cursor-pointer text-white"
      >
        Upload File
      </label>
    </div>
  );
}
