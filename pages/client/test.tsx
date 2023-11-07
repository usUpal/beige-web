import { useEffect, useState } from 'react';

const Test = () => {

  const [fields, setFields] = useState([
    { hour: null, rate: null },
  ]);
  const handleFieldChange = (e:any, index:any, fieldKey:Number) => {
    const { value } = e.target;
    setFields((prevFields) => {
      const updatedFields = [...prevFields];
      updatedFields[index][fieldKey] = value;
      return updatedFields;
    });
  };

  return (
    <div>
      {fields.map((field, index) => (
        <div key={index}>
          <input type="number" value={field.hour} onChange={(e) => handleFieldChange(e, index, 'hour')} placeholder={field.hour} className="form-input w-3/6"/>
          <input type="number" value={field.rate} onChange={(e) => handleFieldChange(e, index, 'rate')} className="form-input w-3/6"/>
          <input type="text" value={field.hour * field.rate} readOnly className="form-input w-3/6"/>
        </div>
      ))}
    </div>
  );

};

[
  {
      "content_type": [
          "wedding",
          "portrait"
      ],
      "content_verticals": [
          "indian",
          "asian"
      ],
      "vst": [
          "indian wedding",
          "asian wedding"
      ],
      "shoot_availability": [
          "weekends",
          "evenings"
      ],
      "successful_beige_shoots": 10,
      "trust_score": 4.5,
      "average_rating": 4.8,
      "avg_response_time": 2.5,
      "equipment": [
          "camera",
          "lens",
          "tripod"
      ],
      "equipment_specific": [
          "Canon 5D Mark IV",
          "Canon 70-200mm f/2.8L IS II USM"
      ],
      "portfolio": [
          "https://example.com/portfolio1",
          "https://example.com/portfolio2"
      ],
      "total_earnings": 5000,
      "backup_footage": [
          "https://example.com/backup1",
          "https://example.com/backup2"
      ],
      "travel_to_distant_shoots": true,
      "experience_with_post_production_edit": true,
      "customer_service_skills_experience": true,
      "team_player": true,
      "avg_response_time_to_new_shoot_inquiry": 1.5,
      "num_declined_shoots": 2,
      "num_accepted_shoots": 8,
      "num_no_shows": 0,
      "review_status": "pending",
      "userId": {
          "role": "cp",
          "isEmailVerified": false,
          "name": "Test CP",
          "email": "cp@example.com",
          "createdAt": "2023-10-12T10:02:52.188Z",
          "updatedAt": "2023-10-12T10:03:07.990Z",
          "id": "6527c44c92e911feecc30b22"
      },
      "city": "New York",
      "neighborhood": "Manhattan",
      "zip_code": "10001",
      "last_beige_shoot": "61d8f4b4c8d9e6a4a8c3f7d2",
      "timezone": "EST",
      "own_transportation_method": true,
      "reference": "John Doe",
      "created_at": "2023-10-12T10:03:08.260Z",
      "createdAt": "2023-10-12T10:03:08.262Z",
      "updatedAt": "2023-10-12T10:03:08.262Z",
      "id": "6527c45c92e911feecc30b2a"
  },
  {
      "geo_location": {
          "type": "Point",
          "coordinates": [
              -118.3295,
              34.0928
          ]
      },
      "content_type": [
          "fashion",
          "portrait"
      ],
      "content_verticals": [
          "beauty",
          "lifestyle"
      ],
      "vst": [
          "beauty shoot",
          "lifestyle shoot"
      ],
      "shoot_availability": [
          "weekdays",
          "mornings"
      ],
      "successful_beige_shoots": 5,
      "trust_score": 4.2,
      "average_rating": 4.5,
      "avg_response_time": 3,
      "equipment": [
          "camera",
          "lens",
          "lighting"
      ],
      "equipment_specific": [
          "Nikon D850",
          "Sigma 35mm f/1.4 DG HSM Art"
      ],
      "portfolio": [
          "https://example.com/portfolio3",
          "https://example.com/portfolio4"
      ],
      "total_earnings": 3000,
      "backup_footage": [
          "https://example.com/backup3",
          "https://example.com/backup4"
      ],
      "travel_to_distant_shoots": false,
      "experience_with_post_production_edit": true,
      "customer_service_skills_experience": true,
      "team_player": true,
      "avg_response_time_to_new_shoot_inquiry": 2,
      "num_declined_shoots": 1,
      "num_accepted_shoots": 4,
      "num_no_shows": 0,
      "review_status": "accepted",
      "userId": {
          "role": "cp",
          "isEmailVerified": false,
          "name": "Alice Lee",
          "email": "cp2@example.com",
          "createdAt": "2023-10-12T10:00:04.997Z",
          "updatedAt": "2023-10-12T10:11:35.497Z",
          "id": "6527c3a492e911feecc30b1d"
      },
      "city": "Los Angeles",
      "neighborhood": "Hollywood",
      "zip_code": "90028",
      "last_beige_shoot": "61d8f4b4c8d9e6a4a8c3f7d3",
      "timezone": "PST",
      "own_transportation_method": true,
      "reference": "Jane Smith",
      "created_at": "2023-10-12T10:11:35.774Z",
      "createdAt": "2023-10-12T10:11:35.779Z",
      "updatedAt": "2023-10-12T10:11:35.779Z",
      "id": "6527c657756ec2096cac7aaa"
  },
  {
      "geo_location": {
          "type": "Point",
          "coordinates": [
              -122.4194,
              37.7599
          ]
      },
      "content_type": [
          "wedding",
          "portrait"
      ],
      "content_verticals": [
          "modern",
          "romantic"
      ],
      "vst": [
          "modern wedding",
          "romantic wedding"
      ],
      "shoot_availability": [
          "weekends",
          "afternoons"
      ],
      "successful_beige_shoots": 8,
      "trust_score": 4.7,
      "average_rating": 4.9,
      "avg_response_time": 1.5,
      "equipment": [
          "camera",
          "lens",
          "tripod"
      ],
      "equipment_specific": [
          "Sony a7 III",
          "Sony FE 85mm f/1.8"
      ],
      "portfolio": [
          "https://example.com/portfolio5",
          "https://example.com/portfolio6"
      ],
      "total_earnings": 8000,
      "backup_footage": [
          "https://example.com/backup5",
          "https://example.com/backup6"
      ],
      "travel_to_distant_shoots": true,
      "experience_with_post_production_edit": true,
      "customer_service_skills_experience": true,
      "team_player": true,
      "avg_response_time_to_new_shoot_inquiry": 1,
      "num_declined_shoots": 0,
      "num_accepted_shoots": 8,
      "num_no_shows": 1,
      "review_status": "rejected",
      "userId": {
          "role": "cp",
          "isEmailVerified": false,
          "name": "Bob Johnson",
          "email": "cp1@example.com",
          "createdAt": "2023-10-12T09:59:53.832Z",
          "updatedAt": "2023-10-12T10:12:23.347Z",
          "id": "6527c39992e911feecc30b18"
      },
      "city": "San Francisco",
      "neighborhood": "Mission District",
      "zip_code": "94110",
      "last_beige_shoot": "61d8f4b4c8d9e6a4a8c3f7d5",
      "timezone": "PST",
      "own_transportation_method": true,
      "reference": "Bob Johnson",
      "created_at": "2023-10-12T10:12:23.602Z",
      "createdAt": "2023-10-12T10:12:23.605Z",
      "updatedAt": "2023-10-12T10:12:23.605Z",
      "id": "6527c687756ec2096cac7ab2"
  }
]

export default Test;
