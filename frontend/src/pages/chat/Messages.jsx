import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { messageAPI, userAPI } from "../../services/api";
import {
  setConversations,
  setCurrentMessages,
  addMessage,
  setCurrentConversation,
  setUnreadCount,
} from "../../redux/slices/messageSlice";
import {
  FiSend,
  FiSearch,
  FiX,
  FiPhone,
  FiVideo,
  FiMoreVertical,
} from "react-icons/fi";

function Messages() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { conversations, currentMessages, currentConversation, unreadCount } =
    useSelector((state) => state.messages);
  const [loading, setLoading] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);
  const currentUserId = user?._id || user?.id;

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
    fetchUnreadCount();
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await messageAPI.getConversations();
      dispatch(setConversations(response.data));
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await messageAPI.getUnreadCount();
      dispatch(setUnreadCount(response.data.unreadCount));
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const handleSelectConversation = async (conversation) => {
    dispatch(setCurrentConversation(conversation));
    try {
      const response = await messageAPI.getMessages(conversation.userId);
      dispatch(setCurrentMessages(response.data));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !currentConversation) return;

    try {
      const response = await messageAPI.sendMessage(
        currentConversation.userId,
        {
          message: messageText,
        },
      );

      dispatch(addMessage(response.data.data));
      setMessageText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.user?.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="h-[calc(100vh-120px)] flex bg-gray-50 rounded-lg overflow-hidden shadow-lg">
      {/* Conversations Sidebar */}
      <div className="w-full md:w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Messages</h2>

          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Unread Badge */}
          {unreadCount > 0 && (
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
              {unreadCount} unread message{unreadCount !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              Loading conversations...
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {searchTerm ? "No conversations found" : "No conversations yet"}
            </div>
          ) : (
            <div>
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.userId}
                  onClick={() => handleSelectConversation(conversation)}
                  className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition text-left ${
                    currentConversation?.userId === conversation.userId
                      ? "bg-blue-50 border-l-4 border-l-blue-600"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {/* User Info */}
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            conversation.user?.profilePicture ||
                            "https://via.placeholder.com/40"
                          }
                          alt={conversation.user?.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 truncate">
                            {conversation.user?.name}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Side */}
                    <div className="ml-2 flex items-start gap-2">
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          {formatTime(conversation.lastMessageTime)}
                        </p>
                        {conversation.unread > 0 && (
                          <span className="inline-block mt-1 px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="hidden md:flex flex-1 flex-col bg-white">
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-linear-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-3">
                <img
                  src={
                    currentConversation.user?.profilePicture ||
                    "https://via.placeholder.com/40"
                  }
                  alt={currentConversation.user?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-800">
                    {currentConversation.user?.name}
                  </p>
                  <p className="text-xs text-gray-600">Active now</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <FiPhone className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <FiVideo className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <FiMoreVertical className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {currentMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <p className="mb-2">No messages yet</p>
                    <p className="text-sm">Start a conversation!</p>
                  </div>
                </div>
              ) : (
                <>
                  {currentMessages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`flex ${
                        msg.sender._id === currentUserId
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.sender._id === currentUserId
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-white text-gray-800 rounded-bl-none shadow"
                        }`}
                      >
                        <p className="text-sm wrap-break-word">{msg.message}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.sender._id === currentUserId
                              ? "text-blue-100"
                              : "text-gray-500"
                          }`}
                        >
                          {formatTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-200 bg-white flex gap-3"
            >
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!messageText.trim()}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <FiSend />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg mb-2">Select a conversation</p>
              <p className="text-sm">
                Choose from your conversations to start chatting
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Chat View */}
      {currentConversation && (
        <div className="md:hidden absolute inset-0 bg-white z-50 flex flex-col">
          {/* Mobile Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-linear-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <button
                onClick={() => dispatch(setCurrentConversation(null))}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <FiX />
              </button>
              <div>
                <p className="font-semibold text-gray-800">
                  {currentConversation.user?.name}
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {currentMessages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${
                  msg.sender._id === currentUserId
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender._id === currentUserId
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none shadow"
                  }`}
                >
                  <p className="text-sm warp-break-word">{msg.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.sender._id === currentUserId
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-gray-200 bg-white flex gap-3"
          >
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!messageText.trim()}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              <FiSend />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

// Helper function to format time
function formatTime(date) {
  const now = new Date();
  const msgDate = new Date(date);
  const diffMs = now - msgDate;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;

  return msgDate.toLocaleDateString();
}

export default Messages;
