// src/components/UserProfile.tsx

import React, { useState } from 'react';

interface UserProfileProps {
  name: string;
  email: string;
  avatarUrl?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ name, email, avatarUrl }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);

  const toggleEdit = () => setIsEditing(!isEditing);

  const handleSave = () => {
    // Giả lập việc lưu thông tin
    console.log('Saved name:', editedName);
    setIsEditing(false);
  };

  return (
    <div className="max-w-sm mx-auto bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center space-x-4">
        <img
          src={avatarUrl || 'https://via.placeholder.com/100'}
          alt="Avatar"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          {isEditing ? (
            <input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="border p-1 rounded"
            />
          ) : (
            <h2 className="text-xl font-semibold">{editedName}</h2>
          )}
          <p className="text-gray-500">{email}</p>
        </div>
      </div>
      <div className="mt-4">
        {isEditing ? (
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-1 rounded mr-2">
            Lưu
          </button>
        ) : (
          <button onClick={toggleEdit} className="bg-gray-200 px-4 py-1 rounded">
            Chỉnh sửa
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
