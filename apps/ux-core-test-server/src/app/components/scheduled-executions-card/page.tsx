'use client'

import React, { useState } from 'react'
import { ScheduledExecutionsCard } from '@teamhub/ux-core'

export default function ScheduledExecutionsCardDemo() {
  const [schedules, setSchedules] = useState([
    {
      id: '1',
      title: 'Daily Schedule',
      description: 'Generate daily cost analysis report for all active projects',
      nextExecution: '2024-01-15 09:00',
      frequency: 'Daily',
      status: 'active' as const,
    },
    {
      id: '2',
      title: 'Weekly Schedule',
      description: 'Check supplier inventory levels and alert if low',
      nextExecution: '2024-01-16 14:00',
      frequency: 'Weekly',
      status: 'inactive' as const,
    },
    {
      id: '3',
      title: 'Monthly Report',
      description: 'Generate comprehensive monthly performance report',
      nextExecution: '2024-02-01 08:00',
      frequency: 'Monthly',
      status: 'paused' as const,
    },
  ])

  const handleAddSchedule = () => {
    const newSchedule = {
      id: Date.now().toString(),
      title: 'New Schedule',
      description: 'Schedule description',
      nextExecution: '2024-01-20 10:00',
      frequency: 'Daily',
      status: 'active' as const,
    }
    setSchedules([...schedules, newSchedule])
  }

  const handleEditSchedule = (id: string) => {
    console.log('Edit schedule:', id)
    // Implement edit modal or navigation
  }

  const handleDeleteSchedule = (id: string) => {
    setSchedules(schedules.filter((schedule) => schedule.id !== id))
  }

  const handleToggleSchedule = (id: string) => {
    setSchedules(
      schedules.map((schedule) =>
        schedule.id === id
          ? {
              ...schedule,
              status: schedule.status === 'active' ? 'inactive' : 'active',
            }
          : schedule
      )
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            ScheduledExecutionsCard Component Demo
          </h1>
          <p className="text-gray-600">
            A card for managing scheduled tasks with add, edit, delete, and toggle functionality.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scheduled Executions Card */}
          <ScheduledExecutionsCard
            schedules={schedules}
            onAddSchedule={handleAddSchedule}
            onEditSchedule={handleEditSchedule}
            onDeleteSchedule={handleDeleteSchedule}
            onToggleSchedule={handleToggleSchedule}
          />

          {/* Empty State */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Empty State Demo
            </h2>
            <ScheduledExecutionsCard
              schedules={[]}
              onAddSchedule={handleAddSchedule}
              onEditSchedule={handleEditSchedule}
              onDeleteSchedule={handleDeleteSchedule}
              onToggleSchedule={handleToggleSchedule}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Schedule Statistics
          </h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium">Total Schedules</p>
              <p className="text-2xl font-bold text-purple-600">{schedules.length}</p>
            </div>
            <div>
              <p className="font-medium">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {schedules.filter(s => s.status === 'active').length}
              </p>
            </div>
            <div>
              <p className="font-medium">Inactive</p>
              <p className="text-2xl font-bold text-gray-600">
                {schedules.filter(s => s.status === 'inactive').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
