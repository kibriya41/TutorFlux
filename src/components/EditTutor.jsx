// src/components/EditTutor.jsx
'use client';

import { Edit3 } from 'lucide-react';
import { Button, Input } from '@heroui/react';
import { useState } from 'react';

import { toast } from 'react-hot-toast';

export function EditTutor({ tutor, onUpdate }) {
  const {
    _id,
    tutorName,
    photo,
    subject,
    teachingMode,
    location,
    institutionExperience,
    availableDays,
    availableTime,
    hourlyFee,
    totalSlot,
    sessionStartDate,
    description,
  } = tutor;

  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const formData = new FormData(e.currentTarget);
      const updatedTutor = Object.fromEntries(formData.entries());

      const token = localStorage.getItem("token");
      const res = await fetch(`https://tutorflux-serve-2.onrender.com/tutor/${_id}`, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedTutor),
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        toast.success("Tutor profile updated successfully!");
        setIsOpen(false);
        onUpdate?.();
      } else {
        toast.error(data.message || "Failed to update tutor profile");
      }

    } catch (error) {
      console.error('Failed to update tutor:', error);
      toast.error("An error occurred while updating.");
    } finally {
      setIsPending(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) setIsOpen(false);
  };

  return (
    <>
      <Button
        onPress={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all"
        size="sm"
      >
        <Edit3 className="w-4 h-4" />
        Edit Profile
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={handleBackdropClick}
        >
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            
            <div className="flex items-center gap-3 p-5 border-b border-gray-200 dark:border-zinc-700">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Edit3 className="w-5 h-5" />
              </div>
              <span className="text-lg font-semibold">Edit Tutor Profile</span>
              <button
                onClick={() => setIsOpen(false)}
                className="ml-auto p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto">
              <form id="edit-form" onSubmit={onSubmit} className="flex flex-col gap-4">
                
                <div className="flex items-center gap-4">
                  <img
                    src={photo}
                    alt={tutorName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                  />
                  <div className="flex-1">
                    <Input
                      name="photo"
                      label="Photo URL"
                      defaultValue={photo}
                      size="sm"
                      required
                    />
                  </div>
                </div>

                <hr className="border-gray-200 dark:border-zinc-700" />

                <Input
                  name="tutorName"
                  label="Tutor Full Name"
                  defaultValue={tutorName}
                  size="sm"
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    name="subject"
                    label="Subject"
                    defaultValue={subject}
                    size="sm"
                    required
                  />
                  <Input
                    name="teachingMode"
                    label="Teaching Mode"
                    defaultValue={teachingMode}
                    size="sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    name="location"
                    label="Location"
                    defaultValue={location}
                    size="sm"
                    required
                  />
                  <Input
                    name="institutionExperience"
                    label="Institution & Experience"
                    defaultValue={institutionExperience}
                    size="sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    name="availableDays"
                    label="Available Days"
                    defaultValue={availableDays}
                    size="sm"
                    required
                  />
                  <Input
                    name="availableTime"
                    label="Available Time"
                    defaultValue={availableTime}
                    size="sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    name="hourlyFee"
                    label="Hourly Fee ($)"
                    type="number"
                    defaultValue={hourlyFee}
                    size="sm"
                    required
                  />
                  <Input
                    name="totalSlot"
                    label="Total Slots"
                    type="number"
                    defaultValue={totalSlot}
                    size="sm"
                    required
                  />
                </div>

                <Input
                  name="sessionStartDate"
                  label="Session Start Date"
                  type="date"
                  defaultValue={sessionStartDate}
                  size="sm"
                  required
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    defaultValue={description}
                    required
                    rows={4}
                    className="w-full px-3 py-2 text-sm border rounded-lg border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </form>
            </div>

            <div className="flex gap-3 justify-end p-5 border-t border-gray-200 dark:border-zinc-700">
              <Button
                variant="light"
                onPress={() => setIsOpen(false)}
                size="sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="edit-form"
                color="primary"
                isLoading={isPending}
                size="sm"
              >
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}