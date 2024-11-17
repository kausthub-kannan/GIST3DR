# API Docs & Schema

## API Docs

### AUTH

1. POST `/auth/signup`:
    - Request Body:
        ```json
        {
          "email": "user@example.com",
          "password": "string",
          "grade": "junior",
          "first_name": "string",
          "last_name": "string"
        }
        ```
    - Response:
        ```json
        {
          "access_token": "string",
          "token_type": "string",
          "user": {}
        }
        ```
      
2. POST `/auth/signin`:
    - Request Body:
        ```json
        {
            "email": "string",
            "password": "string"
        }
        ```
    - Response:
        ```json
        {
          "access_token": "string",
          "token_type": "string",
          "user": {}
        }
        ```

3. POST `/auth/signout`

### Patients
1. GET `/patients`:
    - Response:
        ```json
        [
          {
            "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "name": "string",
            "age": 0,
            "bone_density_gram_per_centimeter_sq": 127.65234693324953,
            "height_millimeter": 0,
            "width_millimeter": 0,
            "thickness_millimeter": 0,
            "area_millimeter_sq": 0
          }
        ]
        ```
2. GET `/patients/{patient_id}`:
    - Response:
        ```json
        {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "name": "string",
          "age": 0,
          "bone_density_gram_per_centimeter_sq": 127.65234693324953,
          "height_millimeter": 0,
          "width_millimeter": 0,
          "thickness_millimeter": 0,
          "area_millimeter_sq": 0
        }
        ```
      
3. DELETE `/patients/{patient_id}`
    - Response:
        ```json
        {
          "message": "Patient deleted successfully"
        }
        ```
      
4. POST `/patients`:
    - Request Body:
        ```json
        {
          "name": "string",
          "age": 0
        }
        Upload Dicom file
        ```
    - Response:
        ```json
        {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "name": "string",
          "age": 0,
          "bone_density_gram_per_centimeter_sq": 127.65234693324953,
          "height_millimeter": 0,
          "width_millimeter": 0,
          "thickness_millimeter": 0,
          "area_millimeter_sq": 0
        }
        ```
      
5. PUT `/patients/{patient_id}`:
    - Request Body:
        ```json
        {
          "name": "string",
          "age": 0
        }
        Upload Dicom file
        ```
    - Response:
        ```json
        {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "name": "string",
          "age": 0,
          "bone_density_gram_per_centimeter_sq": 127.65234693324953,
          "height_millimeter": 0,
          "width_millimeter": 0,
          "thickness_millimeter": 0,
          "area_millimeter_sq": 0
        }
        ```