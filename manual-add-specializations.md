# Manual Instructions to Add Engineering Specializations

Since we don't have Firebase Admin SDK access, here are the manual steps to add the specializations to Firestore.

## Go to Firebase Console
1. Open: https://console.firebase.google.com/project/edu-mate12/firestore/data
2. Navigate to the `specializations` collection

## Add these documents:

### 1. cyber-security
**Document ID**: `cyber-security`

**Fields**:
```json
{
  "id": "cyber-security",
  "name": "Cyber Security",
  "nameAr": "Cyber Security",
  "collegeId": "eng",
  "durationYears": 4,
  "firstBatchStartYear": 2022,
  "isActive": true
}
```

### 2. information-technology
**Document ID**: `information-technology`

**Fields**:
```json
{
  "id": "information-technology",
  "name": "Information Technology",
  "nameAr": "Information Technology",
  "collegeId": "eng",
  "durationYears": 4,
  "firstBatchStartYear": 2022,
  "isActive": true
}
```

### 3. electrical-engineering
**Document ID**: `electrical-engineering`

**Fields**:
```json
{
  "id": "electrical-engineering",
  "name": "Electrical Engineering",
  "nameAr": "Electrical Engineering",
  "collegeId": "eng",
  "durationYears": 4,
  "firstBatchStartYear": 2022,
  "isActive": true
}
```

### 4. civil-engineering
**Document ID**: `civil-engineering`

**Fields**:
```json
{
  "id": "civil-engineering",
  "name": "Civil Engineering",
  "nameAr": "Civil Engineering",
  "collegeId": "eng",
  "durationYears": 4,
  "firstBatchStartYear": 2022,
  "isActive": true
}
```

## Important Notes:
- Make sure `collegeId` is exactly `"eng"` (matches the interface)
- All field types should be:
  - `id`: String
  - `name`: String  
  - `nameAr`: String
  - `collegeId`: String
  - `durationYears`: Number
  - `firstBatchStartYear`: Number
  - `isActive`: Boolean

## After Adding:
1. Test the Academic Data page
2. Select College = Engineering
3. Check if Specialization dropdown shows the 4 new options
4. Try importing a test file
