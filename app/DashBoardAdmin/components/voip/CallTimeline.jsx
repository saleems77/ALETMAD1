// CallTimeline.jsx
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { FaPhone, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useVoIPStore } from './VoIPContext';

const CallTimeline = () => {
  const { activeCalls, fetchContacts } = useVoIPStore();

  // تحويل المكالمات النشطة إلى تنسيق الجدول الزمني
  const timelineItems = activeCalls.map(call => ({
    id: call.id,
    date: new Date(call.startTime).toLocaleTimeString(),
    title: `مكالمة مع ${call.contactName}`,
    status: call.status,
    icon: call.status === 'active' ? FaPhone : call.status === 'ended' ? FaTimesCircle : FaCheckCircle,
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">جدول المكالمات</h3>
      <VerticalTimeline>
        {timelineItems.map(item => (
          <VerticalTimelineElement
            key={item.id}
            date={item.date}
            icon={<item.icon className="text-blue-500" />}
            contentStyle={{ boxShadow: 'none' }}
          >
            <h4 className="font-medium">{item.title}</h4>
            <p className={`text-sm ${item.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
              {item.status === 'active' ? 'نشطة' : 'منتهية'}
            </p>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </div>
  );
};

export default CallTimeline;