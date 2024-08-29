# Card-OCR
Fully cloud-native web app which scans an image, extract texts and tag them as entities then store them into DynamoDB table. User can also be able to perform CRUD operation. Authentication and Authorization implemented using AWS Cognito and userpools. 

- A serverless web-based multi-user application to extract information from business card using AWS Machine Learning services like AWS Textract and AWS Medical Comprehend
- A user can upload any business card image and the system retrieves the information such as name, e-mail id, contact numbers, address, website using AI capabilities.
- Users have an option to edit the information if something is not detected correctly by the AI system.
- The information is stored in the database (AWS Dynamo DB) to create a store of contact information.
- Application allows user to search any contact data as well as update the contact information.
