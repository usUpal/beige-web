import React from 'react'
import 'flatpickr/dist/flatpickr.min.css';
import Flatpickr from 'react-flatpickr'

const ScheduleMeeting = (props: any) => {
  const { meetingBox, setMeetingBox, metingDate, setMetingDate, submitNewMeting } = props;
  return (
    <div className="flex space-x-3">
      <button className="rounded-lg bg-black px-3 py-1 font-sans font-semibold text-white lg:w-44" onClick={() => setMeetingBox(!meetingBox)}>
        Schedule Meeting
      </button>
      {meetingBox && (
        <div className="flex space-x-2">
          <Flatpickr
            id="meeting_time"
            className={`cursor-pointer rounded-sm border border-black px-2 lg:w-[240px]`}
            value={metingDate}
            placeholder="Meeting time ..."
            options={{
              altInput: true,
              altFormat: 'F j, Y h:i K',
              dateFormat: 'Y-m-d H:i',
              enableTime: true,
              time_24hr: false,
              minDate: 'today',
            }}
            onChange={(date) => setMetingDate(date[0])}
          />
          <button
            disabled={false}
            onClick={submitNewMeting}
            className="flex items-center justify-center rounded-lg border border-black bg-black px-1 text-white"
          >
            {/* {isLoading === true ? (
              <Loader />
            ) : (

            )} */}

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

export default ScheduleMeeting
