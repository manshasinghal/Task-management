import  { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import api from '../api';

const CalendarPage = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/tasks');
        setTasks(res.data);
      } catch (err) {
        setError('Failed to fetch tasks for calendar');
      }
    };
    fetchTasks();
  }, []);

  const formatTasksForCalendar = () => {
    return tasks.map(task => ({
      title: task.title,
      start: task.dueDate,
      allDay: true,
      color: getTaskColor(task.status),
    }));
  };

  const getTaskColor = (status) => {
    switch (status) {
      case 'completed': return '#4ade80'; // Green
      case 'in-progress': return '#facc15'; // Yellow
      case 'pending': return '#f87171'; // Red
      default: return '#cbd5e1'; // Gray
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Task Calendar</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="bg-white p-6 rounded shadow-md">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={formatTasksForCalendar()}
          eventContent={(eventInfo) => (
            <div className="p-1 rounded-md text-white overflow-hidden text-sm">
              <p className="font-semibold truncate">{eventInfo.event.title}</p>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default CalendarPage;